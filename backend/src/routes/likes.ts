import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const result = await query(
    'SELECT experience_id FROM public.likes WHERE user_id = $1',
    [req.user!.userId]
  );
  res.json(result.rows.map(r => r.experience_id));
});

router.post('/:experienceId', authMiddleware, async (req: Request, res: Response) => {
  const { experienceId } = req.params;

  const existing = await query(
    'SELECT 1 FROM public.likes WHERE user_id = $1 AND experience_id = $2',
    [req.user!.userId, experienceId]
  );

  if (existing.rows.length > 0) {
    await query(
      'DELETE FROM public.likes WHERE user_id = $1 AND experience_id = $2',
      [req.user!.userId, experienceId]
    );
    res.json({ liked: false });
  } else {
    await query(
      'INSERT INTO public.likes (user_id, experience_id) VALUES ($1, $2)',
      [req.user!.userId, experienceId]
    );
    res.json({ liked: true });
  }
});

export default router;
