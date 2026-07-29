import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { experienceSchema } from '../validators/schemas.js';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT id, title, location, country, category, duration, duration_hours,
            group_size, rating, reviews_count, price_per_person, image,
            about_community, authenticity_score, tags, gallery_images, lat, lng,
            host_name, created_at
     FROM public.experiences
     ORDER BY created_at DESC`
  );
  res.json(result.rows);
});

router.get('/:id', async (req: Request, res: Response) => {
  const result = await query(
    `SELECT * FROM public.experiences WHERE id = $1`,
    [req.params.id]
  );
  if (result.rows.length === 0) throw new AppError(404, 'Experiencia no encontrada');
  res.json(result.rows[0]);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  if (req.user!.userRole !== 'guide' && req.user!.userRole !== 'admin') {
    throw new AppError(403, 'Solo guías y administradores pueden crear experiencias');
  }

  const parsed = experienceSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, parsed.error.issues.map(i => i.message).join(', '));

  const { title, category, location, duration, durationHours, groupSize, pricePerPerson, aboutCommunity, tags } = parsed.data;

  const result = await query(
    `INSERT INTO public.experiences (title, category, location, country, duration, duration_hours, group_size, price_per_person, about_community, tags, created_by)
     VALUES ($1, $2, $3, 'Nicaragua', $4, $5, $6, $7, $8, $9::text[], $10)
     RETURNING *`,
    [title, category, location, duration, durationHours, groupSize, pricePerPerson, aboutCommunity, tags, req.user!.userId]
  );

  res.status(201).json(result.rows[0]);
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  if (req.user!.userRole !== 'guide' && req.user!.userRole !== 'admin') {
    throw new AppError(403, 'Solo guías y administradores pueden editar experiencias');
  }

  const existing = await query('SELECT created_by FROM public.experiences WHERE id = $1', [req.params.id]);
  if (existing.rows.length === 0) throw new AppError(404, 'Experiencia no encontrada');

  if (req.user!.userRole !== 'admin' && existing.rows[0].created_by !== req.user!.userId) {
    throw new AppError(403, 'No puedes editar una experiencia que no te pertenece');
  }

  const parsed = experienceSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new AppError(400, parsed.error.issues.map(i => i.message).join(', '));

  const fields = parsed.data;
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    const col = key.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
    setClauses.push(`${col} = $${idx++}`);
    values.push(value);
  }

  if (setClauses.length === 0) throw new AppError(400, 'No hay campos para actualizar');

  values.push(req.params.id);
  const result = await query(
    `UPDATE public.experiences SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  res.json(result.rows[0]);
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  if (req.user!.userRole !== 'admin') throw new AppError(403, 'Solo administradores pueden eliminar experiencias');

  const result = await query('DELETE FROM public.experiences WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) throw new AppError(404, 'Experiencia no encontrada');

  res.json({ deleted: true });
});

export default router;
