import { useFeatureFlagsQuery } from '../api/getFeatureFlags';
import type { FeatureFlagKey } from '../types';

export function useFeatureFlag(
  key: FeatureFlagKey,
  defaultValue = true,
): boolean {
  const { data } = useFeatureFlagsQuery();
  const value = data?.flags[key];
  return value === undefined ? defaultValue : value;
}
