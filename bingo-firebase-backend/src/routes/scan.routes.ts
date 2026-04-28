import { Router } from 'express';

import { scanWaste } from '../controllers/scan.controller';
import { optionalProtect } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';

const router = Router();

router.post('/', optionalProtect, uploadImage.single('image'), scanWaste as any);

export default router;
