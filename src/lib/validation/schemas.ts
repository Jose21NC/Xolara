import { z } from 'zod';

export const bookingSchema = z.object({
  experienceId: z.string().min(1, 'Selecciona una experiencia'),
  date: z.string().min(1, 'Selecciona una fecha'),
  time: z.string().min(1, 'Selecciona un horario'),
  adultsCount: z.number().int().min(1, 'Al menos 1 adulto requerido').max(20, 'Máximo 20 adultos'),
  childrenCount: z.number().int().min(0).max(15, 'Máximo 15 niños'),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const experienceSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100, 'Máximo 100 caracteres'),
  category: z.enum(['Crafts', 'Culinary', 'Agriculture', 'Nature', 'Music'], {
    error: 'Selecciona una categoría válida',
  }),
  location: z.string().min(2, 'La ubicación es requerida').max(100, 'Máximo 100 caracteres'),
  duration: z.string().min(1, 'La duración es requerida'),
  pricePerPerson: z.number().min(1, 'El precio debe ser al menos $1').max(1000, 'Máximo $1,000 USD'),
  aboutCommunity: z.string().min(10, 'Describe el impacto (mínimo 10 caracteres)').max(500, 'Máximo 500 caracteres'),
  image: z.string().url('Debe ser una URL válida').refine(
    (s) => /\.(jpg|jpeg|png|webp|gif|svg)/i.test(s) || s.startsWith('https://images.unsplash.com'),
    'Debe ser una imagen válida'
  ),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const configSchema = z.object({
  greetingTone: z.enum(['traditional', 'formal', 'slang']),
  language: z.enum(['es', 'en', 'bilingual']),
  tipFocus: z.array(z.string()).min(1, 'Selecciona al menos una categoría'),
  enableNicaSound: z.boolean(),
  showCo2InLbs: z.boolean(),
});

export type ConfigInput = z.infer<typeof configSchema>;

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: result.error.issues.map((i) => i.message) };
}
