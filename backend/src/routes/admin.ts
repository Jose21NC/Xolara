import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

function requireAdmin(req: Request) {
  if (req.user!.userRole !== 'admin') {
    throw new AppError(403, 'Solo administradores');
  }
}

router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  const role = req.user!.userRole;
  if (role !== 'admin' && role !== 'guide') {
    throw new AppError(403, 'Solo guías y administradores');
  }

  let experienceFilter = '';
  const params: any[] = [];

  if (role === 'guide') {
    experienceFilter = ` WHERE e.created_by = $1`;
    params.push(req.user!.userId);
  }

  const expResult = await query(
    `SELECT COUNT(*)::int AS total FROM public.experiences e${experienceFilter}`,
    params
  );

  const bookingResult = await query(
    `SELECT COUNT(*)::int AS total,
            COALESCE(SUM(b.total_price), 0)::int AS revenue,
            COUNT(DISTINCT b.user_id)::int AS travelers
     FROM public.bookings b
     JOIN public.experiences e ON e.id = b.experience_id${experienceFilter}`,
    role === 'guide' ? [req.user!.userId] : []
  );

  res.json({
    experiences: expResult.rows[0].total,
    bookings: bookingResult.rows[0].total,
    travelers: bookingResult.rows[0].travelers,
    revenue: bookingResult.rows[0].revenue,
  });
});

router.get('/pending-guides', authMiddleware, async (req: Request, res: Response) => {
  requireAdmin(req);

  const result = await query(
    `SELECT p.id, p.display_name, p.subtitle, p.location, p.created_at, u.email
     FROM public.profiles p
     JOIN auth.users u ON u.id = p.id
     WHERE p.role = 'guide' AND p.is_approved_guide = false
     ORDER BY p.created_at DESC`
  );

  res.json(result.rows);
});

router.post('/approve-guide', authMiddleware, async (req: Request, res: Response) => {
  requireAdmin(req);

  const { userId, approve } = req.body;

  if (!userId || typeof userId !== 'string') {
    throw new AppError(400, 'userId requerido');
  }
  if (typeof approve !== 'boolean') {
    throw new AppError(400, 'approve debe ser booleano');
  }

  const target = await query(
    `SELECT role FROM public.profiles WHERE id = $1`,
    [userId]
  );
  if (target.rows.length === 0 || target.rows[0].role !== 'guide') {
    throw new AppError(404, 'Guía no encontrado');
  }

  await query(
    `UPDATE public.profiles SET is_approved_guide = $1 WHERE id = $2`,
    [approve, userId]
  );

  res.json({ success: true });
});

export default router;
