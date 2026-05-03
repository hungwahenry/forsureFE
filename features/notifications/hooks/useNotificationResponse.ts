import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import * as React from 'react';
import {
  routeForNotification,
  type NotificationRoutePayload,
} from '../route';

function navigate(data: NotificationRoutePayload): void {
  const target = routeForNotification(data);
  if (target) router.push(target as never);
}

export function useNotificationResponse(authenticated: boolean): void {
  const handledRef = React.useRef<Set<string>>(new Set());
  const lastResponse = Notifications.useLastNotificationResponse();

  React.useEffect(() => {
    if (!authenticated) return;
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const reqId = response.notification.request.identifier;
        if (handledRef.current.has(reqId)) return;
        handledRef.current.add(reqId);
        navigate(
          response.notification.request.content.data as NotificationRoutePayload,
        );
      },
    );
    return () => sub.remove();
  }, [authenticated]);

  React.useEffect(() => {
    if (!authenticated || !lastResponse) return;
    const reqId = lastResponse.notification.request.identifier;
    if (handledRef.current.has(reqId)) return;
    handledRef.current.add(reqId);
    navigate(
      lastResponse.notification.request.content.data as NotificationRoutePayload,
    );
  }, [authenticated, lastResponse]);
}
