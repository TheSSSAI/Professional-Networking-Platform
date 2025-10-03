import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

interface AuthPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    
    try {
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        throw new WsException('Unauthorized: No token provided.');
      }

      const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      // Attach the user payload to the socket object for use in subsequent handlers/guards
      client.data.user = { id: payload.userId, email: payload.email };

      return true;
    } catch (error) {
      this.logger.warn(`Authentication failed for socket ${client.id}: ${error.message}`);
      client.disconnect(true); // Force disconnect the unauthorized client
      return false; // Although disconnect is called, returning false ensures the handler is not executed.
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Standard approach: 'Authorization': 'Bearer <token>' in handshake headers
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // Alternative: token in handshake.auth object (recommended for Socket.IO clients)
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      return authToken;
    }

    // Fallback for query parameter (less secure, generally not recommended)
    const tokenFromQuery = client.handshake.query?.token;
    if (typeof tokenFromQuery === 'string' && tokenFromQuery) {
        return tokenFromQuery;
    }

    return undefined;
  }
}