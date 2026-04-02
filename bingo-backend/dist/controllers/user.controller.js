"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getUserById = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = await User_1.default.create({
            username,
            email,
            passwordHash: password
        });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid user data' });
        }
        return res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                points: user.points,
                token: (0, generateToken_1.default)(String(user._id))
            }
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            return res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    points: user.points,
                    token: (0, generateToken_1.default)(String(user._id))
                }
            });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.loginUser = loginUser;
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProfile = getProfile;
const getUserById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { userId } = req.params;
        const user = await User_1.default.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserById = getUserById;
const getLeaderboard = async (_req, res) => {
    try {
        const users = await User_1.default.find()
            .select('username points badges impactStats')
            .sort({ points: -1 })
            .limit(10);
        return res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLeaderboard = getLeaderboard;
