import { env } from '@/lib/config/env';
import { io, type Socket } from 'socket.io-client';

let appSocket: Socket | null = null;

interface ConnectArgs {
  accessToken: string;
}

/**
 * Singleton Socket.IO client for the whole app. Connects on sign-in (or app
 * boot if already signed in), survives screen navigation, disconnects on
 * sign-out. Features tap in by registering listeners; they don't manage the
 * connection itself.
 */
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
  if (appSocket) {
    appSocket.auth = { token: accessToken };
    if (!appSocket.connected) appSocket.connect();
  }
}
