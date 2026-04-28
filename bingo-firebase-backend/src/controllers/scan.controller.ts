import { Response } from 'express';

import { awardScanPoints, createOrUpdateUserProfile } from '../repositories/user.repository';
import { analyzeWasteImage } from '../services/gemini.service';
import { readStorageImage, uploadScanImage } from '../services/storage.service';
import { AuthRequest } from '../types/express';
import { calculatePoints } from '../utils/points';

const parseLocation = (body: Record<string, unknown>) => {
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return { lat, lng };
};

export const scanWaste = async (req: AuthRequest, res: Response) => {
  try {
    const storagePathFromBody = typeof req.body.storagePath === 'string' ? req.body.storagePath : undefined;
    let image: { buffer: Buffer; mimeType: string; storagePath: string; imageUrl: string };

    if (req.file) {
      const uploaded = await uploadScanImage({
        uid: req.user?.uid,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
      });
      image = {
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        storagePath: uploaded.storagePath,
        imageUrl: uploaded.imageUrl,
      };
    } else if (storagePathFromBody) {
      const stored = await readStorageImage(storagePathFromBody);
      image = {
        buffer: stored.buffer,
        mimeType: stored.mimeType,
        storagePath: storagePathFromBody,
        imageUrl: stored.imageUrl,
      };
    } else {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const classification = await analyzeWasteImage(image.buffer, image.mimeType);
    let pointsToAward = req.user ? calculatePoints(classification) : 0;
    let scanId: string | null = null;
    let newTotalPoints: number | null = null;

    if (req.user) {
      await createOrUpdateUserProfile({
        uid: req.user.uid,
        email: req.user.email,
        username: req.user.name,
        photoUrl: req.user.picture,
      });

      const awardResult = await awardScanPoints({
        uid: req.user.uid,
        classification,
        points: pointsToAward,
        scan: {
          storagePath: image.storagePath,
          imageUrl: image.imageUrl,
          classificationResult: classification,
          pointsEarned: pointsToAward,
          location: parseLocation(req.body),
        },
      });

      scanId = awardResult.scanId;
      newTotalPoints = awardResult.user?.points ?? null;
    } else {
      pointsToAward = 0;
    }

    return res.status(200).json({
      success: true,
      data: {
        classification,
        pointsEarned: pointsToAward,
        scanId,
        newTotalPoints,
      },
    });
  } catch (error: any) {
    console.error('Scan Controller Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};
