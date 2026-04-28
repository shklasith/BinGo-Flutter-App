import { DocumentData } from 'firebase-admin/firestore';

import { db, increment, serverTimestamp } from '../config/firebase';
import { AppSettings, ClassificationResult, UserProfile } from '../types/domain';
import { defaultImpactStats, defaultSettings, normalizeImpactStats, normalizeSettings } from '../utils/defaults';
import { impactIncrementsFor } from '../utils/points';

const users = db.collection('users');

const toUserProfile = (id: string, data: DocumentData): UserProfile => ({
  _id: id,
  uid: data.uid ?? id,
  username: data.username ?? data.email?.split('@')[0] ?? 'BinGo User',
  email: data.email ?? '',
  photoUrl: data.photoUrl,
  points: data.points ?? 0,
  badges: data.badges ?? [],
  settings: normalizeSettings(data.settings),
  impactStats: normalizeImpactStats(data.impactStats),
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const getUserByUid = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await users.doc(uid).get();
  return snapshot.exists ? toUserProfile(snapshot.id, snapshot.data() ?? {}) : null;
};

export const createOrUpdateUserProfile = async (input: {
  uid: string;
  email?: string;
  username?: string;
  photoUrl?: string;
}): Promise<UserProfile> => {
  const ref = users.doc(input.uid);
  const current = await ref.get();
  const fallbackUsername = input.username || input.email?.split('@')[0] || 'BinGo User';

  if (!current.exists) {
    await ref.set({
      uid: input.uid,
      username: fallbackUsername,
      email: input.email ?? '',
      photoUrl: input.photoUrl,
      points: 0,
      badges: [],
      settings: defaultSettings,
      impactStats: defaultImpactStats,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await ref.set(
      {
        username: input.username ?? current.data()?.username ?? fallbackUsername,
        email: input.email ?? current.data()?.email ?? '',
        photoUrl: input.photoUrl ?? current.data()?.photoUrl,
        settings: normalizeSettings(current.data()?.settings),
        impactStats: normalizeImpactStats(current.data()?.impactStats),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  const saved = await ref.get();
  return toUserProfile(saved.id, saved.data() ?? {});
};

export const getLeaderboard = async (limit: number): Promise<UserProfile[]> => {
  const cappedLimit = Math.min(Math.max(limit, 1), 50);
  const snapshot = await users.orderBy('points', 'desc').limit(cappedLimit).get();
  return snapshot.docs.map((doc) => toUserProfile(doc.id, doc.data()));
};

export const updateUserSettings = async (uid: string, settings: AppSettings): Promise<AppSettings> => {
  await users.doc(uid).set(
    {
      settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return settings;
};

export const awardScanPoints = async (input: {
  uid: string;
  classification: ClassificationResult;
  points: number;
  scan: {
    storagePath: string;
    imageUrl: string;
    classificationResult: ClassificationResult;
    pointsEarned: number;
    location?: { lat: number; lng: number };
  };
}) => {
  const increments = impactIncrementsFor(input.classification);
  const userRef = users.doc(input.uid);
  const scanRef = db.collection('scanHistory').doc();

  await db.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists) {
      transaction.set(userRef, {
        uid: input.uid,
        username: 'BinGo User',
        email: '',
        points: 0,
        badges: [],
        settings: defaultSettings,
        impactStats: defaultImpactStats,
        createdAt: serverTimestamp(),
      });
    }

    transaction.set(
      userRef,
      {
        points: increment(input.points),
        'impactStats.plasticDiverted': increment(increments.plasticDiverted),
        'impactStats.co2Reduced': increment(increments.co2Reduced),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(scanRef, {
      userId: input.uid,
      storagePath: input.scan.storagePath,
      imageUrl: input.scan.imageUrl,
      classificationResult: input.scan.classificationResult,
      pointsEarned: input.scan.pointsEarned,
      location: input.scan.location,
      createdAt: serverTimestamp(),
    });
  });

  return {
    scanId: scanRef.id,
    user: await getUserByUid(input.uid),
  };
};
