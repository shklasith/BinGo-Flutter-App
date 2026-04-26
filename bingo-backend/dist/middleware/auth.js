"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalProtect = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            // Get user from the token
            const user = await User_1.default.findById(decoded.id).select('-passwordHash');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
const optionalProtect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next();
    }
    if (!authorization.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
    try {
        const token = authorization.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User_1.default.findById(decoded.id).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
exports.optionalProtect = optionalProtect;
