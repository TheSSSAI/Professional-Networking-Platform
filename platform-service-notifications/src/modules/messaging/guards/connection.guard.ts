import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { Socket } from 'socket.io';
import { ConnectionsClientService } from 'src/shared/grpc-clients/connections-client.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

/**
 * A WebSocket Guard that protects message-related events.
 * It ensures that the sender of a message is a first-degree connection
 * with the other participant(s) in the conversation.
 * This directly implements the access control requirement from REQ-1-029.
 */
@Injectable()
export class ConnectionGuard implements CanActivate {
  private readonly logger = new Logger(ConnectionGuard.name);

  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    private readonly connectionsClientService: ConnectionsClientService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient();
    const data = wsContext.getData();

    const senderId = client.data.user?.id;
    if (!senderId) {
      this.logger.warn('ConnectionGuard blocked request due to missing senderId on socket.');
      throw new WsException('Unauthorized: Missing user authentication data.');
    }

    const conversationId = data.conversationId;
    if (!conversationId) {
      this.logger.warn('ConnectionGuard blocked request due to missing conversationId in payload.');
      throw new WsException('Bad Request: conversationId is missing.');
    }
    
    const conversation = await this.conversationRepository.findById(
      conversationId,
    );
    if (!conversation) {
      throw new WsException(`Conversation with ID ${conversationId} not found.`);
    }

    if (!conversation.participants.some(p => p.id === senderId)) {
      throw new WsException('Forbidden: You are not a participant in this conversation.');
    }

    // This guard is for 1-on-1 conversations as per REQ-1-026
    if (conversation.participants.length !== 2) {
       this.logger.warn(`ConnectionGuard is intended for 1-on-1 chats, but conversation ${conversationId} has ${conversation.participants.length} participants.`);
       // Allow for now, but could be restricted in future
    }
    
    const recipient = conversation.participants.find(p => p.id !== senderId);
    if (!recipient) {
       // This can happen in a group chat context, or if the conversation only has one participant
       this.logger.log(`No direct recipient found in conversation ${conversationId} for sender ${senderId}. Assuming valid for now.`);
       return true;
    }
    const recipientId = recipient.id;

    // Use a canonical cache key by sorting IDs
    const sortedUserIds = [senderId, recipientId].sort();
    const cacheKey = `connection-status:${sortedUserIds[0]}:${sortedUserIds[1]}`;

    const cachedStatus = await this.cacheManager.get<boolean>(cacheKey);
    if (cachedStatus !== undefined && cachedStatus !== null) {
      if (!cachedStatus) {
        throw new WsException('Forbidden: Users are not connected.');
      }
      return true;
    }

    try {
      const isConnectedResponse = await firstValueFrom(
        this.connectionsClientService.isConnected({
          userIdA: senderId,
          userIdB: recipientId,
        }).pipe(
            catchError((err: RpcException) => {
                this.logger.error(`gRPC call to ConnectionsService failed: ${err.message}`, err.stack);
                // Fail closed for security if the connection service is down
                return of({ areConnected: false });
            })
        )
      );

      const areConnected = isConnectedResponse.areConnected;
      
      // Cache the result for 60 seconds to reduce gRPC load
      await this.cacheManager.set(cacheKey, areConnected, 60 * 1000);

      if (!areConnected) {
        throw new WsException('Forbidden: Users are not connected.');
      }
      
      return true;

    } catch (error) {
        if (error instanceof WsException) {
            throw error;
        }
        this.logger.error(`Unexpected error in ConnectionGuard: ${error.message}`, error.stack);
        // Fail closed for security
        throw new WsException('An internal error occurred while verifying connection status.');
    }
  }
}