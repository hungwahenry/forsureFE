import { z } from 'zod';

// Client-side mirror of backend RequestCodeDto/VerifyCodeDto for fast UX feedback.
export const emailSchema = z
  .email('please enter a valid email')
  .max(254, 'email is too long');

export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, 'code must be 6 digits');

export type Email = z.infer<typeof emailSchema>;
export type Code = z.infer<typeof codeSchema>;
