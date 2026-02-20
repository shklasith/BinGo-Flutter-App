import { Request, Response } from 'express';
import User from '../models/User';

// Dummy register for testing
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        // Skipping hash for simplicity in this prototype
        const user = new User({ username, email, passwordHash: password });
        await user.save();
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        // Simple leaderboard sorted by points descending
        const users = await User.find()
            .select('username points badges impactStats')
            .sort({ points: -1 })
            .limit(10);

        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
