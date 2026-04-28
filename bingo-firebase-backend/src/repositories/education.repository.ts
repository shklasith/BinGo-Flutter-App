import { db, serverTimestamp } from '../config/firebase';
import { EducationTip } from '../types/domain';

const fallbackTips: EducationTip[] = [
  {
    _id: 'fallback-rinse',
    title: 'Rinse before recycling',
    content: 'Always rinse your plastic containers. Food residue can contaminate an entire batch of recyclables.',
    keywords: ['rinse', 'plastic', 'recycling'],
    active: true,
  },
  {
    _id: 'fallback-wish-cycle',
    title: "Don't wish-cycle",
    content: "If you aren't sure if an item is recyclable, it is often better to throw it in the trash than risk contamination.",
    keywords: ['wish-cycle', 'recycling', 'contamination'],
    active: true,
  },
  {
    _id: 'fallback-batteries',
    title: 'Batteries are E-Waste',
    content: 'Never put batteries in standard recycling or trash. They can cause fires in processing facilities.',
    keywords: ['batteries', 'e-waste', 'safety'],
    active: true,
  },
];

const tips = db.collection('educationTips');

const toTip = (id: string, data: FirebaseFirestore.DocumentData): EducationTip => ({
  _id: id,
  title: data.title,
  content: data.content,
  keywords: data.keywords ?? [],
  active: data.active ?? true,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const getActiveTips = async (): Promise<EducationTip[]> => {
  const snapshot = await tips.where('active', '==', true).limit(50).get();
  return snapshot.empty ? fallbackTips : snapshot.docs.map((doc) => toTip(doc.id, doc.data()));
};

export const getDailyTip = async (): Promise<EducationTip> => {
  const activeTips = await getActiveTips();
  const day = Math.floor(Date.now() / 86400000);
  return activeTips[day % activeTips.length];
};

export const searchTips = async (query: string): Promise<EducationTip[]> => {
  const lowerQuery = query.toLowerCase();
  const activeTips = await getActiveTips();
  return activeTips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(lowerQuery) ||
      tip.content.toLowerCase().includes(lowerQuery) ||
      tip.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)),
  );
};

export const seedFallbackTips = async (): Promise<void> => {
  const batch = db.batch();
  fallbackTips.forEach((tip) => {
    batch.set(
      tips.doc(tip._id),
      {
        title: tip.title,
        content: tip.content,
        keywords: tip.keywords,
        active: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
};
