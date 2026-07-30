import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

const PG_ERROR_CODES: Record<string, number> = {
  '23505': 409,
  '23503': 400,
  '23502': 400,
  '23514': 400,
  '22P02': 400,
};

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Datos inválidos', details: (err as any).issues });
  }

  const pgCode = (err as any).code;
  if (pgCode && PG_ERROR_CODES[pgCode]) {
    const message = pgCode === '23505' ? 'El recurso ya existe' : 'Datos inválidos';
    return res.status(PG_ERROR_CODES[pgCode]).json({ error: message });
  }

  return res.status(500).json({ error: 'Error interno del servidor' });
}
