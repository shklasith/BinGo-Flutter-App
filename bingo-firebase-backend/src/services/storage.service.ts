import { randomUUID } from 'crypto';
import path from 'path';

import { bucket } from '../config/firebase';

const extensionForMimeType = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/heic':
      return '.heic';
    case 'image/heif':
      return '.heif';
    default:
      return '.jpg';
  }
};

export const buildScanImagePath = (uid: string | undefined, mimeType: string): string => {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const owner = uid ?? 'guest';
  return path.posix.join('scan-images', owner, year, month, `${randomUUID()}${extensionForMimeType(mimeType)}`);
};

export const uploadScanImage = async (input: {
  uid?: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<{ storagePath: string; imageUrl: string }> => {
  const storagePath = buildScanImagePath(input.uid, input.mimeType);
  const file = bucket.file(storagePath);

  await file.save(input.buffer, {
    contentType: input.mimeType,
    resumable: false,
    metadata: {
      cacheControl: 'private, max-age=3600',
    },
  });

  return {
    storagePath,
    imageUrl: `gs://${bucket.name}/${storagePath}`,
  };
};

export const readStorageImage = async (storagePath: string): Promise<{ buffer: Buffer; mimeType: string; imageUrl: string }> => {
  const file = bucket.file(storagePath);
  const [metadata] = await file.getMetadata();
  const [buffer] = await file.download();

  return {
    buffer,
    mimeType: metadata.contentType ?? 'image/jpeg',
    imageUrl: `gs://${bucket.name}/${storagePath}`,
  };
};
