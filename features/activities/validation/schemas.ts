import { z } from 'zod';

/**
 * Mirrored from backend CreateActivityDto. Server is the source of truth —
 * these schemas just give the form fast UX feedback.
 */

export const ACTIVITY_TITLE_MAX = 100;
export const ACTIVITY_CAPACITY_MIN = 1;
export const ACTIVITY_CAPACITY_MAX = 25;
export const MIN_LEAD_TIME_MS = 30 * 60_000;

export const emojiSchema = z
  .string()
  .min(1, 'pick an emoji')
  .max(10, 'too long for an emoji');

export const titleSchema = z
  .string()
  .trim()
  .min(1, 'what do you want to do?')
  .max(ACTIVITY_TITLE_MAX, 'too long');

export const startsAtSchema = z
  .date({ message: 'pick a date and time' })
  .refine((d) => d.getTime() >= Date.now() + MIN_LEAD_TIME_MS, {
    message: 'must be at least 30 minutes from now',
  });

export const placeSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const capacitySchema = z
  .number()
  .int()
  .min(ACTIVITY_CAPACITY_MIN, 'at least 1 person')
  .max(ACTIVITY_CAPACITY_MAX, `at most ${ACTIVITY_CAPACITY_MAX} people`);

export const genderPreferenceSchema = z.enum(['ALL', 'MALE', 'FEMALE']);
