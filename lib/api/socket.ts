import { env } from '@/lib/config/env';
import { Sentry } from '@/lib/sentry';
import { io, type Socket } from 'socket.io-client';

let appSocket: Socket | null = null;

interface ConnectArgs {
  accessToken: string;
}

const log = (...args: unknown[]) => console.log('[socket]', ...args);

/** Lifecycle listeners so connection failures are observable, not silent. */
function attachLifecycleListeners(socket: Socket): void {
  socket.on('connect', () => log('connected'));
  socket.on('disconnect', (reason) => log('disconnected:', reason));
  socket.on('connect_error', (err: Error) => {
    log('connect error:', err.message);
    Sentry.addBreadcrumb({
      category: 'socket',
      level: 'warning',
      message: `socket connect_error: ${err.message}`,
    });
  });
}

export function getAppSocket({ accessToken }: ConnectArgs): Socket {
  if (appSocket && appSocket.connected) return appSocket;
  if (appSocket) {
    appSocket.auth = { token: accessToken };
    appSocket.connect();
    return appSocket;
  }
  appSocket = io(env.apiUrl, {
    auth: { token: accessToken },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 5_000,
  });
  attachLifecycleListeners(appSocket);
  return appSocket;
}

export function disconnectAppSocket(): void {
  if (appSocket) {
    appSocket.removeAllListeners();
    appSocket.disconnect();
    appSocket = null;
  }
}

export function refreshAppSocketAuth(accessToken: string): void {
  if (!appSocket) return;
  appSocket.auth = { token: accessToken };
  if (appSocket.connected) {
    appSocket.disconnect().connect();
  } else {
    appSocket.connect();
  }
}
