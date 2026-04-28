import { z } from 'zod';

/**
 * Hand-mirrored from backend DTOs:
 *   - RequestCodeDto / VerifyCodeDto in /modules/auth/dto/
 *
 * Server is the source of truth — schema here is for fast UX feedback only.
 * Backend DTOs already trim/lowercase the email server-side.
 */

export const emailSchema = z
  .email('please enter a valid email')
  .max(254, 'email is too long');

export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, 'code must be 6 digits');

export type Email = z.infer<typeof emailSchema>;
export type Code = z.infer<typeof codeSchema>;
