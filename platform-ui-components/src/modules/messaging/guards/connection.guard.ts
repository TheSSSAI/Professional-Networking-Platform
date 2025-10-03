import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ConnectionsClientService } from '@/shared/grpc-clients/connections/connections-client.service';
import { PrismaService } from '@/shared/prisma/prisma.service';

/**
 * A NestJS Guard for WebSockets that authorizes messaging actions.
 * It ensures that the sender and receiver of a message are first-degree connections.
 * This guard directly fulfills requirement REQ-1-029.
 */
@Injectable()
export class ConnectionGuard implements CanActivate {
  private readonly logger = new Logger(ConnectionGuard.name);

  constructor(
    private readonly connectionsClientService: ConnectionsClientService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Determines if the current user is authorized to send a message in the given conversation.
   * This is done by verifying that the sender and recipient are still first-degree connections.
   * @param context The execution context of the incoming WebSocket event.
   * @returns A boolean indicating if the request is authorized.
   * @throws {WsException} If the user is not authenticated, not a participant, or not connected to the recipient.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket & { data: { user: { id: string } } } = context
      .switchToWs()
      .getClient();
    const payload: SendMessageDto = context.switchToWs().getData();

    const senderId = client.data.user?.id;
    if (!senderId) {
      this.logger.warn('Unauthorized access attempt: No user ID on socket.');
      throw new WsException('Unauthorized');
    }

    const { conversationId } = payload;

    try {
      // 1. Find the conversation and its participants from the database.
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
          participants: {
            select: { id: true },
          },
        },
      });

      if (!conversation) {
        throw new WsException('Conversation not found.');
      }

      // 2. Verify the sender is a participant and identify the recipient.
      const isSenderParticipant = conversation.participants.some(
        (p) => p.id === senderId,
      );
      if (!isSenderParticipant) {
        this.logger.warn(
          `Authorization failed: User ${senderId} is not a participant of conversation ${conversationId}.`,
        );
        throw new WsException('You are not a participant of this conversation.');
      }

      // For one-on-one conversations, find the other participant.
      const recipient = conversation.participants.find((p) => p.id !== senderId);

      // If there's no other participant, something is wrong with the conversation data, or it's a solo chat.
      if (!recipient) {
        this.logger.error(
          `Could not find a recipient in conversation ${conversationId} for sender ${senderId}.`,
        );
        throw new WsException('Invalid conversation participants.');
      }
      const recipientId = recipient.id;

      // 3. Make a gRPC call to the Connections service to check the connection status.
      this.logger.debug(
        `Verifying connection between sender ${senderId} and recipient ${recipientId}.`,
      );
      const { areConnected } =
        await this.connectionsClientService.areConnected({
          userIdA: senderId,
          userIdB: recipientId,
        });

      if (!areConnected) {
        this.logger.log(
          `Message blocked: User ${senderId} is no longer connected with ${recipientId}.`,
        );
        throw new WsException('You are no longer connected with this user.');
      }

      // 4. If all checks pass, allow the action.
      this.logger.debug(
        `Connection verified for sender ${senderId} in conversation ${conversationId}.`,
      );
      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error; // Re-throw exceptions that are already formatted for the client.
      }

      // Log any other unexpected errors (e.g., database or gRPC service down).
      this.logger.error(
        `Error in ConnectionGuard for user ${senderId} and conversation ${conversationId}: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        'Could not verify connection status. Please try again later.',
      );
    }
  }
}