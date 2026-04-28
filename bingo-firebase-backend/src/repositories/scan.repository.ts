import { db, serverTimestamp } from '../config/firebase';
import { ClassificationResult, ScanHistory } from '../types/domain';

const scanHistory = db.collection('scanHistory');

export const createScanHistory = async (input: {
  userId: string;
  storagePath: string;
  imageUrl: string;
  classificationResult: ClassificationResult;
  pointsEarned: number;
  location?: { lat: number; lng: number };
}): Promise<ScanHistory> => {
  const ref = scanHistory.doc();
  const payload = {
    userId: input.userId,
    storagePath: input.storagePath,
    imageUrl: input.imageUrl,
    classificationResult: input.classificationResult,
    pointsEarned: input.pointsEarned,
    location: input.location,
    createdAt: serverTimestamp(),
  };

  await ref.set(payload);

  return {
    _id: ref.id,
    ...payload,
  };
};
