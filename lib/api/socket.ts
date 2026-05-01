import { env } from '@/lib/config/env';
import { io, type Socket } from 'socket.io-client';

let chatsSocket: Socket | null = null;

interface ConnectArgs {
  accessToken: string;
}

/**
 * Singleton Socket.IO client for /chats. Reused across screens — opening the
 * tab joins a room, leaving the tab leaves it, but the underlying connection
 * persists until logout.
 */
export function getChatsSocket({ accessToken }: ConnectArgs): Socket {
  if (chatsSocket && chatsSocket.connected) {
    return chatsSocket;
  }
  if (chatsSocket) {
    chatsSocket.auth = { token: accessToken };
    chatsSocket.connect();
    return chatsSocket;
  }
  chatsSocket = io(`${env.apiUrl}/chats`, {
    auth: { token: accessToken },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 5_000,
  });
  return chatsSocket;
}

export function disconnectChatsSocket(): void {
  if (chatsSocket) {
    chatsSocket.removeAllListeners();
    chatsSocket.disconnect();
    chatsSocket = null;
  }
}

export function refreshChatsSocketAuth(accessToken: string): void {
  if (chatsSocket) {
    chatsSocket.auth = { token: accessToken };
    if (!chatsSocket.connected) chatsSocket.connect();
  }
}
