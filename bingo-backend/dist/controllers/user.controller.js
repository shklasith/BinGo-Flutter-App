"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getProfile = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// Dummy register for testing
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Skipping hash for simplicity in this prototype
        const user = new User_1.default({ username, email, passwordHash: password });
        await user.save();
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User_1.default.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProfile = getProfile;
const getLeaderboard = async (req, res) => {
    try {
        // Simple leaderboard sorted by points descending
        const users = await User_1.default.find()
            .select('username points badges impactStats')
            .sort({ points: -1 })
            .limit(10);
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLeaderboard = getLeaderboard;
