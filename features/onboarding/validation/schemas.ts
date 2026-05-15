import { z } from 'zod';

export const USERNAME_PATTERN = /^[a-z][a-z0-9_]{2,19}$/;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'must be at least 3 characters')
  .max(20, 'must be 20 characters or fewer')
  .regex(
    USERNAME_PATTERN,
    'use lowercase letters, digits, or underscores; start with a letter'
  );

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, 'required')
  .max(50, 'must be 50 characters or fewer');

export const DEFAULT_MIN_AGE_YEARS = 18;

export function makeDateOfBirthSchema(minAgeYears: number) {
  return z
    .date({ message: 'pick your date of birth' })
    .refine((d) => calculateAge(d) >= minAgeYears, {
      message: `you must be ${minAgeYears} or older to use forsure`,
    });
}

export const genderSchema = z.enum([
  'MALE',
  'FEMALE',
  'NON_BINARY',
  'PREFER_NOT_TO_SAY',
]);

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeName: z.string().trim().min(1).max(200),
});

export function calculateAge(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}
