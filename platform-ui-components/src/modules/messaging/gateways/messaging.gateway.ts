import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Inject,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';
import { ConnectionManagerService } from '../services/connection-manager.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ConnectionGuard } from '../guards/connection.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Define a custom interface for our socket to include the userId
interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  namespace: '/messaging',
  cors: {
    origin: '*', // In production, restrict this to the frontend URL from ConfigService
  },
})
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    @Inject(MessagingService)
    private readonly messagingService: MessagingService,
    @Inject(ConnectionManagerService)
    private readonly connectionManager: ConnectionManagerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
    // Pass the server instance to the service so it can call back to broadcast
    this.messagingService.setGateway(this);
  }

  /**
   * Handles a new client connection.
   * Authenticates the user via JWT from the handshake.
   * If successful, registers the connection and joins the user to a private room.
   * @param client The connecting socket client.
   */
  async handleConnection(client: AuthenticatedSocket) {
    const token =
      client.handshake.headers.authorization?.split(' ')[1] ||
      client.handshake.auth.token;

    if (!token) {
      this.logger.warn(`Connection attempt without token from ${client.id}. Disconnecting.`);
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = payload.sub;
      if (!userId) {
        throw new WsException('Invalid token payload.');
      }

      client.userId = userId;
      await this.connectionManager.registerConnection(userId, client.id);
      client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${client.id}, User ID: ${userId}`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect(true);
    }
  }

  /**
   * Handles a client disconnection.
   * Unregisters the connection from the connection manager.
   * @param client The disconnecting socket client.
   */
  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      await this.connectionManager.unregisterConnection(client.userId, client.id);
      this.logger.log(`Client disconnected: ${client.id}, User ID: ${client.userId}`);
    } else {
      this.logger.log(`Unauthenticated client disconnected: ${client.id}`);
    }
  }

  /**
   * Handles incoming 'sendMessage' events from clients.
   * Protected by a guard to ensure users are connected.
   * @param data The message payload.
   * @param client The sending socket client.
   * @returns An acknowledgment of receipt.
   */
  @UseGuards(ConnectionGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const sentMessage = await this.messagingService.sendMessage(
        client.userId,
        data.conversationId,
        data.content,
      );

      // Acknowledge to the sender with the persisted message details
      return {
        event: 'messageSentAck',
        data: {
          tempId: data.tempId, // Echo back a temporary ID for client-side correlation
          message: sentMessage,
        },
      };
    } catch (error) {
      this.logger.error(`Error sending message for user ${client.userId}: ${error.message}`, error.stack);
      throw new WsException(error.message || 'Failed to send message.');
    }
  }

  /**
   * Handles 'typing' events to show real-time indicators.
   * @param data The payload containing the conversation ID.
   * @param client The typing socket client.
   */
  @UseGuards(ConnectionGuard)
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await this.messagingService.handleTypingEvent(client.userId, data.conversationId);
    // No acknowledgment needed for typing events
  }

  /**
   * Handles 'markAsRead' events to update message statuses.
   * @param data The payload containing conversation and message IDs.
   * @param client The reading socket client.
   */
  @UseGuards(ConnectionGuard)
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { conversationId: string; messageId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await this.messagingService.handleMarkAsRead(
      client.userId,
      data.conversationId,
      data.messageId,
    );
     // No acknowledgment needed
  }


  /**
   * Public method for other services (like MessagingService) to broadcast an event
   * to all connected sockets of a specific user.
   * @param userId The ID of the target user.
   * @param event The name of the event to emit.
   * @param payload The data to send with the event.
   */
  public broadcastToUser(userId: string, event: string, payload: any) {
    this.logger.log(`Broadcasting event '${event}' to user room 'user:${userId}'`);
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}