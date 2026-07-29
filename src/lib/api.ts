const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('supabase.auth.token');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.currentSession?.access_token || null;
  } catch {
    return null;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!options?.skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Error de conexión' }));
    throw new ApiError(res.status, body.error || 'Error desconocido', body.details);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────

export const authApi = {
  signUp: (data: { email: string; password: string; displayName: string; role?: string }) =>
    apiFetch<{ token: string; user: { id: string; email: string; displayName: string; role: string } }>(
      '/api/auth/signup',
      { method: 'POST', body: JSON.stringify(data), skipAuth: true }
    ),

  signIn: (data: { email: string; password: string }) =>
    apiFetch<{ token: string; user: { id: string; email: string; displayName: string; role: string } }>(
      '/api/auth/signin',
      { method: 'POST', body: JSON.stringify(data), skipAuth: true }
    ),

  me: () =>
    apiFetch<{ id: string; display_name: string; role: string; avatar_url: string | null }>(
      '/api/auth/me'
    ),
};

// ─── Experiences ─────────────────────────────

export const experiencesApi = {
  list: () => apiFetch<any[]>('/api/experiences'),

  get: (id: string) => apiFetch<any>(`/api/experiences/${id}`),

  create: (data: any) =>
    apiFetch<any>('/api/experiences', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/api/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ deleted: boolean }>(`/api/experiences/${id}`, { method: 'DELETE' }),
};

// ─── Bookings ────────────────────────────────

export const bookingsApi = {
  list: () => apiFetch<any[]>('/api/bookings'),

  create: (data: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
  }) => apiFetch<any>('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { date?: string; time?: string }) =>
    apiFetch<any>(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  cancel: (id: string) =>
    apiFetch<{ cancelled: boolean }>(`/api/bookings/${id}`, { method: 'DELETE' }),
};

// ─── Likes ───────────────────────────────────

export const likesApi = {
  list: () => apiFetch<string[]>('/api/likes'),

  toggle: (experienceId: string) =>
    apiFetch<{ liked: boolean }>(`/api/likes/${experienceId}`, { method: 'POST' }),
};

// ─── Passport ────────────────────────────────

export const passportApi = {
  list: () => apiFetch<any[]>('/api/passport'),
};

// ─── Guides ──────────────────────────────────

export const guidesApi = {
  getByExperience: (experienceId: string) =>
    apiFetch<any | null>(`/api/guides/${experienceId}`),
};

// ─── Config ──────────────────────────────────

export const configApi = {
  get: () => apiFetch<any>('/api/config'),

  update: (data: any) =>
    apiFetch<any>('/api/config', { method: 'PUT', body: JSON.stringify(data) }),
};
