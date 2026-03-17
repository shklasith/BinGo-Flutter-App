export interface UserSession {
  userId: string;
  token: string;
}

const SESSION_KEY = 'bingo_web_session';

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (!parsed.userId || !parsed.token) {
      return null;
    }
    return { userId: parsed.userId, token: parsed.token };
  } catch {
    return null;
  }
}

export function setSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function hasSession(): boolean {
  return getSession() !== null;
}
