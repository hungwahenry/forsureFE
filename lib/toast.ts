import { toast as sonnerToast } from 'sonner-native';
import { haptics } from './haptics';

// Same API as sonner-native's `toast`, with haptic feedback paired to success/error/warning.
export const toast = Object.assign(
  ((message, opts) =>
    sonnerToast(message, opts)) as typeof sonnerToast,
  sonnerToast,
  {
    success: ((message, opts) => {
      haptics.success();
      return sonnerToast.success(message, opts);
    }) as typeof sonnerToast.success,
    error: ((message, opts) => {
      haptics.error();
      return sonnerToast.error(message, opts);
    }) as typeof sonnerToast.error,
    warning: ((message, opts) => {
      haptics.warning();
      return sonnerToast.warning(message, opts);
    }) as typeof sonnerToast.warning,
  },
);
