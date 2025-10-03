import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/app-services/auth/utils/token-storage';

const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

class SocketClient {
  private static instance: SocketClient;
  public socket: Socket;

  private constructor() {
    this.socket = io(URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      transports: ['websocket'],
      auth: (cb) => {
        // This function is called before each connection attempt
        const token = getAccessToken();
        cb({ token: token ? `Bearer ${token}` : '' });
      },
    });

    this.initializeListeners();
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  private initializeListeners(): void {
    this.socket.on('connect', () => {
      console.log('Socket.IO: Connected with id:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO: Disconnected. Reason:', reason);
      if (reason === 'io server disconnect') {
        // The server has forcefully disconnected the socket.
        // This might happen if the token is invalid or expired.
        // We can listen for this and perhaps trigger a logout or token refresh.
      }
      // The socket will automatically try to reconnect if reconnection is enabled.
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket.IO: Connection Error.', err.message);
      // This could be due to an invalid token during the handshake
      // Here you might want to force a logout or token refresh
    });

    this.socket.on('reconnect_attempt', (attempt) => {
        console.log(`Socket.IO: Reconnect attempt #${attempt}`);
    });

    this.socket.on('reconnect_failed', () => {
        console.error('Socket.IO: Could not reconnect after maximum attempts.');
    });
  }

  public connect(): void {
    if (this.socket.disconnected) {
        // The 'auth' function will be called automatically to get the latest token
        this.socket.connect();
    }
  }

  public disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public emit<T>(event: string, data: T, ack?: (response: any) => void): void {
    if (this.socket.connected) {
      this.socket.emit(event, data, ack);
    } else {
      console.error(`Socket.IO: Cannot emit event "${event}". Socket is not connected.`);
    }
  }

  public on<T>(event: string, listener: (data: T) => void): void {
    this.socket.on(event, listener);
  }

  public off(event: string, listener?: (...args: any[]) => void): void {
    this.socket.off(event, listener);
  }
}

export const socketClient = SocketClient.getInstance();