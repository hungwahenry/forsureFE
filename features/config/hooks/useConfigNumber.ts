import { useConfigQuery } from '../api/getConfig';
import type { ClientConfigKey } from '../types';

/** Reads a numeric client-exposed config value, falling back to `defaultValue`
 *  until the query resolves (or if the key is absent). */
export function useConfigNumber(
  key: ClientConfigKey,
  defaultValue: number,
): number {
  const { data } = useConfigQuery();
  const value = data?.config[key];
  return typeof value === 'number' ? value : defaultValue;
}
