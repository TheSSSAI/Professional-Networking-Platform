import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { ConnectionManagerService } from '../services/connection-manager.service';
import { ConnectionGuard } from '../guards/connection.guard';

interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    email: string;
  };
}

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: '/messaging',
  cors: {
    origin: '*', // TODO: Restrict to frontend URL in production
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly messagingService: MessagingService,
    private readonly connectionManager: ConnectionManagerService,
  ) {}

  /**
   * Handles a new client connection.
   * Authenticates the user via WsJwtGuard, registers their socket,
   * and joins them to a user-specific room for private notifications.
   * @param client The connecting socket client.
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const user = client.user;
      if (!user || !user.userId) {
        this.logger.warn(
          `Unauthenticated connection attempt denied for socket ${client.id}.`,
        );
        client.disconnect();
        return;
      }

      await this.connectionManager.register(user.userId, client.id);
      client.join(user.userId);

      this.logger.log(
        `Client connected: ${client.id}, User ID: ${user.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error during handleConnection for socket ${client.id}:`,
        error,
      );
      client.disconnect();
    }
  }

  /**
   * Handles a client disconnection.
   * Unregisters the socket from the connection manager to clean up state.
   * @param client The disconnecting socket client.
   */
  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    try {
      if (client.user && client.user.userId) {
        await this.connectionManager.unregister(client.user.userId, client.id);
        this.logger.log(
          `Client disconnected: ${client.id}, User ID: ${client.user.userId}`,
        );
      } else {
        this.logger.log(`Unauthenticated client disconnected: ${client.id}`);
      }
    } catch (error) {
      this.logger.error(
        `Error during handleDisconnect for socket ${client.id}:`,
        error,
      );
    }
  }

  /**
   * Handles incoming 'sendMessage' events from clients.
   * Protected by ConnectionGuard to ensure users are first-degree connections.
   * Delegates to MessagingService to persist and broadcast the message.
   * @param client The sending socket client.
   * @param payload The message data.
   * @returns An acknowledgment with the created message data.
   */
  @UseGuards(ConnectionGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody(new ValidationPipe()) payload: SendMessageDto,
  ) {
    try {
      const senderId = client.user.userId;
      const message = await this.messagingService.sendMessage(senderId, payload);

      // Acknowledge to the sender
      return {
        event: 'messageSent',
        data: message,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send message for user ${client.user.userId}: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        error.message || 'An error occurred while sending the message.',
      );
    }
  }

  /**
   * Handles 'markAsRead' events from clients.
   * @param client The client marking messages as read.
   * @param payload The data indicating which conversation and messages are read.
   */
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string; messageId: string },
  ) {
    try {
      const userId = client.user.userId;
      await this.messagingService.markMessagesAsRead(
        userId,
        payload.conversationId,
        payload.messageId,
      );

      return {
        event: 'messagesMarkedAsRead',
        data: { success: true, conversationId: payload.conversationId },
      };
    } catch (error) {
      this.logger.error(
        `Failed to mark messages as read for user ${client.user.userId}: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        error.message || 'Failed to mark messages as read.',
      );
    }
  }

  /**
   * Handles 'startTyping' events to show a typing indicator to the other user.
   * @param client The client who is typing.
   * @param payload The conversation ID where typing is occurring.
   */
  @UseGuards(ConnectionGuard)
  @SubscribeMessage('startTyping')
  async handleStartTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string },
  ) {
    try {
      const userId = client.user.userId;
      await this.messagingService.handleTypingEvent(
        userId,
        payload.conversationId,
        true,
      );
    } catch (error) {
      this.logger.warn(
        `Could not handle startTyping event for user ${client.user.userId}: ${error.message}`,
      );
      // We don't throw an exception here as it's a non-critical feature.
    }
  }

  /**
   * Handles 'stopTyping' events to hide the typing indicator.
   * @param client The client who stopped typing.
   * @param payload The conversation ID where typing stopped.
   */
  @UseGuards(ConnectionGuard)
  @SubscribeMessage('stopTyping')
  async handleStopTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string },
  ) {
    try {
      const userId = client.user.userId;
      await this.messagingService.handleTypingEvent(
        userId,
        payload.conversationId,
        false,
      );
    } catch (error) {
      this.logger.warn(
        `Could not handle stopTyping event for user ${client.user.userId}: ${error.message}`,
      );
    }
  }
}