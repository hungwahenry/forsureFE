import { z } from 'zod';

export const MESSAGE_MAX_LENGTH = 2000;
export const MESSAGE_IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export const messageBodySchema = z
  .string()
  .trim()
  .min(1, 'message cannot be empty')
  .max(MESSAGE_MAX_LENGTH, `must be ${MESSAGE_MAX_LENGTH} characters or fewer`);
