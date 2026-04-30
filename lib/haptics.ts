import * as Haptics from 'expo-haptics';

// Fire-and-forget — haptics are advisory.
// tap: minor / press: primary action / thump: significant / selection: picker change /
// success/warning/error: operation outcome.
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
