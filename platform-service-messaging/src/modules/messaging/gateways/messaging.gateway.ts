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
import { Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MessagingService } from '../services/messaging.service';
import { ConnectionManagerService } from '../services/connection-manager.service';
import { ConnectionAuthGuard } from '../guards/connection-auth.guard';

import { SendMessageDto } from '../dtos/send-message.dto';
import { TypingDto } from '../dtos/typing.dto';
import { MarkAsReadDto } from '../dtos/mark-as-read.dto';

interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*', // Should be configured properly in a production environment
  },
  namespace: 'messaging',
})
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly messagingService: MessagingService,
    private readonly connectionManagerService: ConnectionManagerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Messaging Gateway Initialized');
    this.messagingService.setServer(server);
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new WsException('Authentication token not found.');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = payload.sub;
      if (!userId) {
        throw new WsException('Invalid token payload.');
      }

      socket.user = { userId };

      await this.connectionManagerService.registerConnection(userId, socket.id);
      socket.join(userId); // Join a room named after the user's ID for direct messaging

      this.logger.log(`Client connected: ${socket.id}, UserID: ${userId}`);
    } catch (error) {
      this.logger.error(`Authentication failed for socket ${socket.id}: ${error.message}`);
      socket.disconnect(true);
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
    if (socket.user && socket.user.userId) {
      const userId = socket.user.userId;
      await this.connectionManagerService.unregisterConnection(
        userId,
        socket.id,
      );
      this.logger.log(`Client disconnected: ${socket.id}, UserID: ${userId}`);
    } else {
      this.logger.log(`Unauthenticated client disconnected: ${socket.id}`);
    }
  }

  @UseGuards(ConnectionAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody(new ValidationPipe()) data: SendMessageDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    try {
      const senderId = socket.user.userId;
      this.logger.log(`User ${senderId} sending message to conversation ${data.conversationId}`);

      const createdMessage = await this.messagingService.createMessage(
        senderId,
        data,
      );
      
      // Acknowledge the sender that the message was sent successfully
      return {
        event: 'messageSent',
        data: {
          tempId: data.tempId, // Include tempId for client-side reconciliation
          message: createdMessage,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error sending message for user ${socket.user.userId}: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        error.message || 'An error occurred while sending the message.',
      );
    }
  }

  @UseGuards(ConnectionAuthGuard)
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody(new ValidationPipe()) data: TypingDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const senderId = socket.user.userId;
      await this.messagingService.handleTypingEvent(
        senderId,
        data.conversationId,
        data.isTyping,
      );
    } catch (error) {
      this.logger.error(
        `Error handling typing event for user ${socket.user.userId}: ${error.message}`,
      );
      // We don't throw an exception here as it's a non-critical event
    }
  }

  @UseGuards(ConnectionAuthGuard)
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody(new ValidationPipe()) data: MarkAsReadDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const readerId = socket.user.userId;
      this.logger.log(
        `User ${readerId} marking message ${data.messageId} as read in conversation ${data.conversationId}`,
      );
      await this.messagingService.markMessagesAsRead(
        readerId,
        data.conversationId,
        data.messageId,
      );
    } catch (error) {
      this.logger.error(
        `Error marking message as read for user ${socket.user.userId}: ${error.message}`,
      );
    }
  }
}