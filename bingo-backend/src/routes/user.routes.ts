import { Router } from 'express';
import { registerUser, getProfile, getLeaderboard } from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser as any);
router.get('/leaderboard', getLeaderboard as any);
router.get('/:id', getProfile as any);

export default router;
