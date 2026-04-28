import { toast as sonnerToast } from 'sonner-native';
import { haptics } from './haptics';

/**
 * App-wide toast helper. Same API as `sonner-native`'s `toast`, but the
 * common `success` / `error` / `warning` calls also trigger matching
 * haptic feedback so callers don't have to remember to do both.
 *
 * @example
 *   toast.success('Code sent. Check your inbox.');
 *   toast.error('That code didn\'t match. Try again.');
 *   toast.warning('You\'ll need to enable location to continue.');
 *   toast('Plain message');                 // no haptic
 *   toast.promise(savePromise, { loading: 'Saving...', success: 'Saved!' });
 */
export const toast = Object.assign(
  // Default invocation: toast("hello") — no haptic, mirrors sonner-native.
  ((message, opts) =>
    sonnerToast(message, opts)) as typeof sonnerToast,
  // Inherit all of sonner-native's static methods (loading, promise, dismiss, custom, info, etc.)
  sonnerToast,
  // Override the three feedback variants to fire haptics first.
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
