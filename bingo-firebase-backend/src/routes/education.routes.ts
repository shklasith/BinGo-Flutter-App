import { Router } from 'express';

import { getDailyTipController, searchDatabase } from '../controllers/education.controller';

const router = Router();

router.get('/daily-tip', getDailyTipController as any);
router.get('/search', searchDatabase as any);

export default router;
