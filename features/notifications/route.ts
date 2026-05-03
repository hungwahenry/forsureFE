export interface NotificationRoutePayload {
  type?: 'chat' | 'activity' | 'memory';
  activityId?: string;
}

export function routeForNotification(
  data: NotificationRoutePayload,
): string | null {
  if (!data.activityId) return null;
  switch (data.type) {
    case 'chat':
      return `/chat/${data.activityId}`;
    case 'activity':
    case 'memory':
      return `/chat/${data.activityId}/details`;
    default:
      return null;
  }
}
