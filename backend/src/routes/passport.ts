import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const result = await query(
    `SELECT id, title, category, date, icon_type, color, created_at
     FROM public.passport_stamps
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [req.user!.userId]
  );
  res.json(result.rows);
});

export default router;
