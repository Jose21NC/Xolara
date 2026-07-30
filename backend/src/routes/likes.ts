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

  const result = await query(
    `WITH deleted AS (
       DELETE FROM public.likes
       WHERE user_id = $1 AND experience_id = $2
       RETURNING 1
     )
     INSERT INTO public.likes (user_id, experience_id)
     SELECT $1, $2
     WHERE NOT EXISTS (SELECT 1 FROM deleted)
     ON CONFLICT (user_id, experience_id) DO NOTHING
     RETURNING 1`,
    [req.user!.userId, experienceId]
  );

  res.json({ liked: result.rowCount !== null && result.rowCount > 0 });
});

export default router;
