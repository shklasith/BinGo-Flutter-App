import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getProfile,
    getLeaderboard,
    getUserById,
    getUserSettings,
    updateUserSettings,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);
router.get('/profile', protect, getProfile as any);
router.get('/settings', protect, getUserSettings as any);
router.patch('/settings', protect, updateUserSettings as any);
router.get('/:userId', protect, getUserById as any);

export default router;
