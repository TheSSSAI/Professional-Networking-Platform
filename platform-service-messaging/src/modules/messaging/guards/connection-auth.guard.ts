import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { IConnectionsClient } from '../../../shared/grpc-clients/connections/connections-client.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface AuthenticatedSocket extends Socket {
  user: {
    id: string;
  };
}

/**
 * @class ConnectionAuthGuard
 * @description A WebSocket guard that enforces the business rule that messaging actions are only allowed
 * between users who are first-degree connections. It protects WebSocket event handlers.
 * @requires REQ-1-029
 */
@Injectable()
export class ConnectionAuthGuard implements CanActivate {
  private readonly logger = new Logger(ConnectionAuthGuard.name);

  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    @Inject('IConnectionsClient')
    private readonly connectionsClient: IConnectionsClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * @method canActivate
   * @description Determines if the current user is authorized to perform an action within a conversation.
   * Authorization is granted if the user is a participant and is a first-degree connection with the other participant.
   * Connection status is cached in Redis to mitigate performance impact from frequent gRPC calls.
   * @param {ExecutionContext} context - The execution context of the incoming request.
   * @returns {Promise<boolean>} - True if authorized, otherwise throws a WsException.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    const userId = socket.user?.id;
    const conversationId = data?.conversationId;

    if (!userId || !conversationId) {
      this.logger.warn(
        `Missing userId or conversationId in WebSocket context for guard.`,
      );
      throw new WsException(
        'Unauthorized: Missing authentication or conversation context.',
      );
    }

    try {
      const participants = await this.conversationRepository.findParticipants(
        conversationId,
      );

      if (participants.length === 0) {
        throw new WsException('Not Found: Conversation does not exist.');
      }

      const isParticipant = participants.some((p) => p.userId === userId);
      if (!isParticipant) {
        this.logger.warn(
          `User ${userId} attempted action on conversation ${conversationId} without being a participant.`,
        );
        throw new WsException('Forbidden: You are not a participant.');
      }

      const otherParticipant = participants.find((p) => p.userId !== userId);
      if (!otherParticipant) {
        // This case should ideally not happen in a 1-on-1 chat
        this.logger.error(
          `Could not find the other participant in conversation ${conversationId}.`,
        );
        throw new WsException('Internal Server Error: Invalid conversation state.');
      }

      const userA = userId < otherParticipant.userId ? userId : otherParticipant.userId;
      const userB = userId < otherParticipant.userId ? otherParticipant.userId : userId;
      const cacheKey = `connection-status:${userA}:${userB}`;

      const cachedStatus = await this.cacheManager.get<boolean>(cacheKey);

      if (cachedStatus !== undefined && cachedStatus !== null) {
        if (!cachedStatus) {
          throw new WsException('Forbidden: Not connected to the user.');
        }
        return true;
      }

      this.logger.debug(`Cache miss for connection status: ${cacheKey}. Querying gRPC service.`);
      const { areConnected } = await this.connectionsClient.areConnected({
        userAId: userId,
        userBId: otherParticipant.userId,
      });

      // Cache the result for 60 seconds
      await this.cacheManager.set(cacheKey, areConnected, 60 * 1000);

      if (!areConnected) {
        this.logger.log(
          `Authorization denied for user ${userId} in conversation ${conversationId}. Not connected.`,
        );
        throw new WsException('Forbidden: Not connected to the user.');
      }

      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      this.logger.error(
        `Error during ConnectionAuthGuard execution for user ${userId} on conversation ${conversationId}: ${error.message}`,
        error.stack,
      );
      throw new WsException('Internal Server Error');
    }
  }
}