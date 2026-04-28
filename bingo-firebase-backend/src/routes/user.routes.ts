import { Router } from 'express';

import {
  firebaseLoginNotice,
  getLeaderboardController,
  getProfile,
  getUserById,
  getUserSettings,
  patchUserSettings,
  syncUserProfile,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', protect, syncUserProfile as any);
router.post('/login', firebaseLoginNotice as any);
router.get('/leaderboard', getLeaderboardController as any);
router.get('/profile', protect, getProfile as any);
router.get('/settings', protect, getUserSettings as any);
router.patch('/settings', protect, patchUserSettings as any);
router.get('/:userId', protect, getUserById as any);

export default router;
