import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import * as React from 'react';

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? false);
  }),
);

export function useIsOnline(): boolean {
  return React.useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
    () => true,
  );
}
