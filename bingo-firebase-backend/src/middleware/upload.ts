import multer from 'multer';

const maxImageSizeMb = Number(process.env.MAX_IMAGE_SIZE_MB ?? 5);
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxImageSizeMb * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported image type'));
    }
    return cb(null, true);
  },
});
