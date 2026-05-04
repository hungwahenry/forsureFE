import { useHapticsStore } from '@/features/settings/stores/hapticsStore';
import * as Haptics from 'expo-haptics';

// Fire-and-forget — haptics are advisory.
// tap: minor / press: primary action / thump: significant / selection: picker change /
// success/warning/error: operation outcome.
const enabled = () => useHapticsStore.getState().enabled;

export const haptics = {
  tap: () => {
    if (!enabled()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  press: () => {
    if (!enabled()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  thump: () => {
    if (!enabled()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  selection: () => {
    if (!enabled()) return;
    void Haptics.selectionAsync();
  },
  success: () => {
    if (!enabled()) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning: () => {
    if (!enabled()) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  error: () => {
    if (!enabled()) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
