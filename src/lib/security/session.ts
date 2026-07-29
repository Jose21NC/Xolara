const SESSION_KEY = 'xolara_session';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface Session {
  userId: string;
  role: 'visitor' | 'traveler' | 'guide' | 'admin';
  displayName: string;
  createdAt: number;
  lastActivity: number;
}

export function createSession(role: Session['role'] = 'traveler', displayName = 'Elena Santos'): Session {
  const now = Date.now();
  const session: Session = {
    userId: `user-${crypto.randomUUID().slice(0, 8)}`,
    role,
    displayName,
    createdAt: now,
    lastActivity: now,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session: Session = JSON.parse(raw);
    if (Date.now() - session.lastActivity > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    session.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function destroySession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(): boolean {
  return getSession() !== null;
}
