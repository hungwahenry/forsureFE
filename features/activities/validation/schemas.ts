import { z } from 'zod';

// Client-side mirror of the backend CreateActivityDto for fast form feedback.
export const ACTIVITY_TITLE_MAX = 100;
export const ACTIVITY_CAPACITY_MIN = 1;
export const ACTIVITY_CAPACITY_MAX = 25;

export const DEFAULT_MIN_LEAD_TIME_MINUTES = 30;

export const emojiSchema = z
  .string()
  .min(1, 'pick an emoji')
  .max(10, 'too long for an emoji');

export const titleSchema = z
  .string()
  .trim()
  .min(1, 'what do you want to do?')
  .max(ACTIVITY_TITLE_MAX, 'too long');

export function makeStartsAtSchema(minLeadTimeMinutes: number) {
  const leadMs = minLeadTimeMinutes * 60_000;
  return z
    .date({ message: 'pick a date and time' })
    .refine((d) => d.getTime() >= Date.now() + leadMs, {
      message: `must be at least ${minLeadTimeMinutes} minutes from now`,
    });
}

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

export function sanitizeCapacityInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 2);
}

export function clampCapacity(value: number): number {
  return Math.max(ACTIVITY_CAPACITY_MIN, Math.min(ACTIVITY_CAPACITY_MAX, value));
}
