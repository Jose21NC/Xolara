import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { configSchema } from '../validators/schemas.js';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const result = await query(
    'SELECT * FROM public.app_configs WHERE user_id = $1',
    [req.user!.userId]
  );

  if (result.rows.length === 0) {
    res.json({
      greetingTone: 'traditional',
      language: 'bilingual',
      tipFocus: ['gastronomy', 'nature', 'crafts'],
      enableNicaSound: true,
      showCo2InLbs: false,
    });
    return;
  }

  res.json(result.rows[0]);
});

router.put('/', authMiddleware, async (req: Request, res: Response) => {
  const parsed = configSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, parsed.error.issues.map(i => i.message).join(', '));

  const existing = await query('SELECT 1 FROM public.app_configs WHERE user_id = $1', [req.user!.userId]);

  if (existing.rows.length > 0) {
    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(parsed.data)) {
      if (value === undefined) continue;
      const col = key.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
      setClauses.push(`${col} = $${idx++}`);
      values.push(value);
    }

    if (setClauses.length > 0) {
      setClauses.push('updated_at = now()');
      values.push(req.user!.userId);
      await query(
        `UPDATE public.app_configs SET ${setClauses.join(', ')} WHERE user_id = $${idx}`,
        values
      );
    }
  } else {
    await query(
      `INSERT INTO public.app_configs (user_id, greeting_tone, language, tip_focus, enable_nica_sound, show_co2_in_lbs)
       VALUES ($1, $2, $3, $4::text[], $5, $6)`,
      [
        req.user!.userId,
        parsed.data.greetingTone || 'traditional',
        parsed.data.language || 'bilingual',
        parsed.data.tipFocus || ['gastronomy', 'nature', 'crafts'],
        parsed.data.enableNicaSound ?? true,
        parsed.data.showCo2InLbs ?? false,
      ]
    );
  }

  const updated = await query('SELECT * FROM public.app_configs WHERE user_id = $1', [req.user!.userId]);
  res.json(updated.rows[0]);
});

export default router;
