import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/pool.js';
import { bookingSchema } from '../validators/schemas.js';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const result = await query(
    `SELECT b.id, b.experience_id, b.date, b.time, b.adults_count, b.children_count,
            b.total_price, b.booking_ref, b.status, b.confirmed_at,
            e.title as experience_title, e.image as experience_image
     FROM public.bookings b
     JOIN public.experiences e ON e.id = b.experience_id
     WHERE b.user_id = $1
     ORDER BY b.confirmed_at DESC`,
    [req.user!.userId]
  );
  res.json(result.rows);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  if (req.user!.userRole === 'visitor') {
    throw new AppError(403, 'Debes ser viajero para reservar');
  }

  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, parsed.error.issues.map(i => i.message).join(', '));

  const { experienceId, date, time, adultsCount, childrenCount } = parsed.data;

  const exp = await query('SELECT id, title, image, price_per_person, category FROM public.experiences WHERE id = $1', [experienceId]);
  if (exp.rows.length === 0) throw new AppError(404, 'Experiencia no encontrada');

  const experience = exp.rows[0];
  const totalPeople = adultsCount + childrenCount;
  const totalPrice = totalPeople * parseFloat(experience.price_per_person);
  const bookingId = uuidv4();
  const refNum = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `XLR-${refNum}`;

  await query('BEGIN');
  try {
    await query(
      `INSERT INTO public.bookings (id, user_id, experience_id, date, time, adults_count, children_count, total_price, booking_ref, status, confirmed_at)
       VALUES ($1, $2, $3, $4::date, $5::time, $6, $7, $8, $9, 'Confirmed', now())`,
      [bookingId, req.user!.userId, experienceId, date, time, adultsCount, childrenCount, totalPrice, bookingRef]
    );

    // Auto-generate passport stamp for completed booking
    await query(
      `INSERT INTO public.passport_stamps (id, user_id, title, category, date, icon_type, color, booking_id)
       VALUES ($1, $2, $3, $4, $5,
         CASE $4
           WHEN 'Crafts' THEN 'palette'
           WHEN 'Culinary' THEN 'utensils'
           WHEN 'Agriculture' THEN 'coffee'
           WHEN 'Nature' THEN 'mountain'
           ELSE 'mountain'
         END,
         CASE $4
           WHEN 'Crafts' THEN '#a03f28'
           WHEN 'Culinary' THEN '#805600'
           WHEN 'Agriculture' THEN '#3a674f'
           WHEN 'Nature' THEN '#1a4e7a'
           ELSE '#3a674f'
         END, $6)`,
      [uuidv4(), req.user!.userId, experience.title, experience.category, 'Reciente', bookingId]
    );

    await query('COMMIT');

    const booking = await query('SELECT * FROM public.bookings WHERE id = $1', [bookingId]);
    res.status(201).json(booking.rows[0]);
  } catch (err) {
    await query('ROLLBACK');
    throw err;
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { date, time } = req.body;
  if (!date && !time) throw new AppError(400, 'Debes proporcionar fecha o hora');

  const existing = await query(
    'SELECT id, user_id FROM public.bookings WHERE id = $1',
    [req.params.id]
  );
  if (existing.rows.length === 0) throw new AppError(404, 'Reserva no encontrada');
  if (existing.rows[0].user_id !== req.user!.userId) throw new AppError(403, 'No puedes modificar esta reserva');

  const updates: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (date) { updates.push(`date = $${idx++}`); values.push(date); }
  if (time) { updates.push(`time = $${idx++}`); values.push(time); }

  values.push(req.params.id);
  const result = await query(
    `UPDATE public.bookings SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  res.json(result.rows[0]);
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const existing = await query(
    'SELECT id, user_id, status FROM public.bookings WHERE id = $1',
    [req.params.id]
  );
  if (existing.rows.length === 0) throw new AppError(404, 'Reserva no encontrada');
  if (existing.rows[0].user_id !== req.user!.userId) throw new AppError(403, 'No puedes cancelar esta reserva');
  if (existing.rows[0].status === 'Cancelled') throw new AppError(400, 'La reserva ya está cancelada');

  await query(
    `UPDATE public.bookings SET status = 'Cancelled' WHERE id = $1`,
    [req.params.id]
  );

  res.json({ cancelled: true });
});

export default router;
