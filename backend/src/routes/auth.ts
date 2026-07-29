import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/pool.js';
import { config } from '../config.js';
import { signUpSchema, signInSchema } from '../validators/schemas.js';
import { AppError } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return computed === hash;
}

router.post('/signup', async (req: Request, res: Response) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map(i => i.message).join(', ') });
    return;
  }

  const { email, password, displayName, role } = parsed.data;
  const userId = uuidv4();

  const existing = await query('SELECT id FROM auth.users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'El email ya está registrado' });
    return;
  }

  const hashed = hashPassword(password);

  try {
    await query(
      `INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
       VALUES ($1, '00000000-0000-0000-0000-000000000000', $2, $3, now(), 'authenticated', '{"provider":"email"}', $4::jsonb, now(), now())`,
      [userId, email, hashed, JSON.stringify({ display_name: displayName, role })]
    );

    await query(
      `INSERT INTO public.profiles (id, display_name, role, avatar_url, created_at)
       VALUES ($1, $2, $3, NULL, now())`,
      [userId, displayName, role]
    );
  } catch (err: any) {
    res.status(409).json({ error: 'Error al crear usuario' });
    return;
  }

  const token = jwt.sign(
    {
      sub: userId,
      email,
      role: 'authenticated',
      aud: 'authenticated',
      user_metadata: { display_name: displayName, role },
    },
    config.jwtSecret,
    { algorithm: 'HS256', expiresIn: '1h' }
  );

  res.status(201).json({
    token,
    user: { id: userId, email, displayName, role },
  });
});

router.post('/signin', async (req: Request, res: Response) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map(i => i.message).join(', ') });
    return;
  }

  const { email, password } = parsed.data;

  const result = await query(
    `SELECT u.id, u.email, u.encrypted_password,
            p.display_name, p.role as user_role
     FROM auth.users u
     LEFT JOIN public.profiles p ON p.id = u.id
     WHERE u.email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ error: 'Email o contraseña incorrectos' });
    return;
  }

  const user = result.rows[0];
  if (!verifyPassword(password, user.encrypted_password)) {
    res.status(401).json({ error: 'Email o contraseña incorrectos' });
    return;
  }

  const displayName = user.display_name || email.split('@')[0];
  const userRole = user.user_role || 'traveler';

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: 'authenticated',
      aud: 'authenticated',
      user_metadata: { display_name: displayName, role: userRole },
    },
    config.jwtSecret,
    { algorithm: 'HS256', expiresIn: '1h' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, displayName, role: userRole },
  });
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const result = await query(
    `SELECT id, display_name, role, avatar_url, created_at
     FROM public.profiles WHERE id = $1`,
    [req.user!.userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  res.json(result.rows[0]);
});

export default router;
