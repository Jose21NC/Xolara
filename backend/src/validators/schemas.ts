import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100),
  displayName: z.string().min(2, 'Nombre requerido').max(50),
  role: z.enum(['traveler', 'guide']).default('traveler'),
});

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const bookingSchema = z.object({
  experienceId: z.string().uuid('Experiencia inválida'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:MM)'),
  adultsCount: z.number().int().min(1, 'Al menos 1 adulto').max(20),
  childrenCount: z.number().int().min(0).max(15).default(0),
});

export const experienceSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.enum(['Crafts', 'Culinary', 'Agriculture', 'Nature', 'Music']),
  location: z.string().min(2).max(100),
  duration: z.string().min(1),
  durationHours: z.number().positive(),
  groupSize: z.string().min(1),
  pricePerPerson: z.number().min(1).max(1000),
  aboutCommunity: z.string().min(10).max(2000),
  tags: z.array(z.string()).default([]),
});

export const configSchema = z.object({
  greetingTone: z.enum(['traditional', 'formal', 'slang']).optional(),
  language: z.enum(['es', 'en', 'bilingual']).optional(),
  tipFocus: z.array(z.string()).min(1).optional(),
  enableNicaSound: z.boolean().optional(),
  showCo2InLbs: z.boolean().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ConfigInput = z.infer<typeof configSchema>;
