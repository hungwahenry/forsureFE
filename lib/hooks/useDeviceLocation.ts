import {
  checkLocationPermission,
  getCurrentLocation,
  requestLocationPermission,
  type PermissionStatus,
  type ResolvedLocation,
} from '@/lib/permissions/location';
import * as React from 'react';

interface UseDeviceLocationOptions {
  autoFetchIfGranted?: boolean;
}

interface UseDeviceLocationResult {
  permission: PermissionStatus | null;
  location: ResolvedLocation | null;
  isFetching: boolean;
  fetch: () => Promise<ResolvedLocation | null>;
}

export function useDeviceLocation(
  options: UseDeviceLocationOptions = {},
): UseDeviceLocationResult {
  const { autoFetchIfGranted = false } = options;
  const [permission, setPermission] = React.useState<PermissionStatus | null>(
    null,
  );
  const [location, setLocation] = React.useState<ResolvedLocation | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetch = React.useCallback(
    async (): Promise<ResolvedLocation | null> => {
      setIsFetching(true);
      try {
        let status = await checkLocationPermission();
        if (status === 'undetermined') {
          status = await requestLocationPermission();
        }
        setPermission(status);
        if (status !== 'granted') return null;
        const loc = await getCurrentLocation();
        setLocation(loc);
        return loc;
      } catch {
        return null;
      } finally {
        setIsFetching(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const status = await checkLocationPermission();
      if (cancelled) return;
      setPermission(status);
      if (status === 'granted' && autoFetchIfGranted) {
        try {
          const loc = await getCurrentLocation();
          if (!cancelled) setLocation(loc);
        } catch {
          // Best-effort — caller can retry via `fetch()`.
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoFetchIfGranted]);

  return { permission, location, isFetching, fetch };
}
