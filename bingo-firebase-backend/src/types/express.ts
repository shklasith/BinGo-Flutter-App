import { DecodedIdToken } from 'firebase-admin/auth';
import { Request } from 'express';

import { UserProfile } from './domain';

export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  token: DecodedIdToken;
  profile?: UserProfile;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
