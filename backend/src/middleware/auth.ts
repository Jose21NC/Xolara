import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AuthPayload {
  sub: string;
  role: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
    role?: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload & { userId: string; userRole: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    }) as AuthPayload & { aud?: string };

    req.user = {
      ...payload,
      userId: payload.sub,
      userRole: payload.user_metadata?.role || payload.role || 'visitor',
    };

    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    }) as AuthPayload & { aud?: string };

    req.user = {
      ...payload,
      userId: payload.sub,
      userRole: payload.user_metadata?.role || payload.role || 'visitor',
    };
  } catch {
    // Token invalid, continue without user
  }

  next();
}
