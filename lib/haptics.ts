import * as Haptics from 'expo-haptics';

/**
 * Thin wrapper over expo-haptics so callers don't have to remember the
 * impact-style/notification-type enum names. All methods are fire-and-forget
 * (Promises are swallowed) — haptics are advisory and never block UI.
 *
 * Convention:
 *   tap()       — minor tap, secondary buttons, toggles
 *   press()     — primary action button
 *   thump()     — significant action (post created, joined activity)
 *   selection() — picker/segmented-control change
 *   success()   — operation succeeded (verify-code accepted, profile saved)
 *   warning()   — soft warning (validation error, pre-confirmation)
 *   error()     — operation failed
 */
export const haptics = {
  tap: () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  press: () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  thump: () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  selection: () => {
    void Haptics.selectionAsync();
  },
  success: () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning: () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  error: () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
