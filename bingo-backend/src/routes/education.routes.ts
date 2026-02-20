import { Router } from 'express';
import { getDailyTip, searchDatabase } from '../controllers/education.controller';

const router = Router();

router.get('/daily-tip', getDailyTip as any);
router.get('/search', searchDatabase as any);

export default router;
