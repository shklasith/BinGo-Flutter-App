import { Response } from 'express';

import { createOrUpdateUserProfile, getLeaderboard, getUserByUid, updateUserSettings } from '../repositories/user.repository';
import { AuthRequest } from '../types/express';
import { allowedSettingsKeys, normalizeSettings } from '../utils/defaults';

export const syncUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await createOrUpdateUserProfile({
      uid: req.user.uid,
      email: req.user.email,
      username: req.body.username,
      photoUrl: req.body.photoUrl ?? req.user.picture,
    });

    return res.status(201).json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const firebaseLoginNotice = async (_req: AuthRequest, res: Response) => {
  return res.status(410).json({
    success: false,
    message: 'Login is handled by Firebase Authentication in the mobile app. Send a Firebase ID token to protected backend routes.',
  });
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile =
      req.user.profile ??
      (await createOrUpdateUserProfile({
        uid: req.user.uid,
        email: req.user.email,
        username: req.user.name,
        photoUrl: req.user.picture,
      }));

    return res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = String(req.params.userId);
    const user = await getUserByUid(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboardController = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const users = await getLeaderboard(Number.isFinite(limit) ? limit : 10);
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = req.user.profile ?? (await getUserByUid(req.user.uid));
    return res.status(200).json({ success: true, data: normalizeSettings(profile?.settings) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const patchUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updates = req.body as Record<string, unknown>;
    const keys = Object.keys(updates);
    const unknownKeys = keys.filter((key) => !allowedSettingsKeys.includes(key as any));

    if (unknownKeys.length > 0) {
      return res.status(400).json({ success: false, message: `Unknown settings fields: ${unknownKeys.join(', ')}` });
    }

    for (const key of keys) {
      if (typeof updates[key] !== 'boolean') {
        return res.status(400).json({ success: false, message: `${key} must be a boolean` });
      }
    }

    const profile =
      req.user.profile ??
      (await createOrUpdateUserProfile({
        uid: req.user.uid,
        email: req.user.email,
        username: req.user.name,
        photoUrl: req.user.picture,
      }));
    const settings = normalizeSettings({ ...profile.settings, ...updates });
    const saved = await updateUserSettings(req.user.uid, settings);

    return res.status(200).json({ success: true, data: saved });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
