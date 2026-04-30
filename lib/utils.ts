import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tints a theme `hsl(...)` for inline styles (where className opacity isn't ergonomic).
export function withAlpha(hsl: string, alpha: number): string {
  const inner = hsl.match(/hsl\(([^)]+)\)/)?.[1];
  return inner ? `hsla(${inner} / ${alpha})` : hsl;
}
