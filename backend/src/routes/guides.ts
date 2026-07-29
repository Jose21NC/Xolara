import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';

const router = Router();

router.get('/:experienceId', async (req: Request, res: Response) => {
  const result = await query(
    `SELECT g.id, g.welcome_msg, g.faq::text,
            p.display_name, p.avatar_url
     FROM public.guides g
     JOIN public.profiles p ON p.id = g.profile_id
     WHERE g.experience_id = $1`,
    [req.params.experienceId]
  );

  if (result.rows.length === 0) {
    res.json(null);
    return;
  }

  res.json({
    id: result.rows[0].id,
    name: result.rows[0].display_name,
    avatar: result.rows[0].avatar_url,
    welcome: result.rows[0].welcome_msg,
    faq: typeof result.rows[0].faq === 'string' ? JSON.parse(result.rows[0].faq) : result.rows[0].faq,
  });
});

export default router;
