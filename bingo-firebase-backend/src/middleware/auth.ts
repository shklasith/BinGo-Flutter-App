import { NextFunction, Response } from 'express';

import { auth } from '../config/firebase';
import { getUserByUid } from '../repositories/user.repository';
import { AuthRequest } from '../types/express';

const getBearerToken = (authorization?: string): string | null => {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

const attachUser = async (req: AuthRequest, token: string) => {
  const decoded = await auth.verifyIdToken(token);
  const profile = await getUserByUid(decoded.uid);

  req.user = {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
    token: decoded,
    profile: profile ?? undefined,
  };
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no Firebase ID token' });
  }

  try {
    await attachUser(req, token);
    return next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const optionalProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return next();
  }

  try {
    await attachUser(req, token);
    return next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
