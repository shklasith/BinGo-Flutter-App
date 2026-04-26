import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // Get user from the token
            const user = await User.findById(decoded.id).select('-passwordHash');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const optionalProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return next();
    }

    if (!authorization.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
