import { Controller, Logger, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import { MessagingService } from '../services/messaging.service';
import { GrpcAuthGuard } from '../guards/grpc-auth.guard'; // Assuming a gRPC auth guard exists
import { IGetHistoryRequest, IGetHistoryResponse, IMessage } from '../../../shared/grpc-clients/messaging/messaging.types';

@Controller()
export class ConversationsController {
  private readonly logger = new Logger(ConversationsController.name);

  constructor(private readonly messagingService: MessagingService) {}

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('MessagingService', 'GetMessageHistory')
  async getMessageHistory(
    request: IGetHistoryRequest,
  ): Promise<IGetHistoryResponse> {
    const { userId, conversationId, pagination } = request;

    if (!userId) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User ID not found in metadata.',
      });
    }

    this.logger.log(
      `Fetching message history for conversation ${conversationId} for user ${userId}`,
    );

    try {
      const messages = await this.messagingService.getMessageHistory(
        userId,
        conversationId,
        {
          cursor: pagination?.cursor,
          limit: pagination?.limit || 50,
        },
      );

      let nextCursor: string | null = null;
      if (messages.length === (pagination?.limit || 50)) {
        nextCursor = messages[messages.length - 1].id;
      }
      
      const responseMessages: IMessage[] = messages.map(message => ({
        id: message.id,
        content: message.content,
        authorId: message.authorId,
        conversationId: message.conversationId,
        status: message.status as any, // Assuming enum values match
        createdAt: message.createdAt.toISOString(),
      }));

      return {
        messages: responseMessages,
        nextCursor,
      };

    } catch (error) {
      this.logger.error(
        `Failed to get message history for conversation ${conversationId}: ${error.message}`,
        error.stack,
      );

      if (error.name === 'ForbiddenException') {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'User is not a participant of this conversation.',
        });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'An internal error occurred while fetching message history.',
      });
    }
  }
    
  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('MessagingService', 'GetConversations')
  async getConversations(request: { userId: string, pagination: { cursor?: string, limit: number } }): Promise<any> {
    const { userId, pagination } = request;

    if (!userId) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User ID not found in metadata.',
      });
    }

    this.logger.log(`Fetching conversations for user ${userId}`);

    try {
      const { conversations, nextCursor } = await this.messagingService.getConversationsForUser(
        userId,
        {
          cursor: pagination?.cursor,
          limit: pagination?.limit || 20,
        },
      );

      return { conversations, nextCursor };

    } catch(error) {
        this.logger.error(
            `Failed to get conversations for user ${userId}: ${error.message}`,
            error.stack,
        );

        throw new RpcException({
            code: status.INTERNAL,
            message: 'An internal error occurred while fetching conversations.',
        });
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('MessagingService', 'FindOrCreateConversation')
  async findOrCreateConversation(request: { userId: string, participantId: string }): Promise<any> {
      const { userId, participantId } = request;
  
      if (!userId) {
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'User ID not found in metadata.',
        });
      }
  
      this.logger.log(`Finding or creating conversation between ${userId} and ${participantId}`);
  
      try {
        const conversation = await this.messagingService.findOrCreateConversation(userId, participantId);
        return conversation;
      } catch (error) {
        this.logger.error(
          `Failed to find or create conversation between ${userId} and ${participantId}: ${error.message}`,
          error.stack,
        );
  
        if (error.name === 'ForbiddenException') {
          throw new RpcException({
            code: status.PERMISSION_DENIED,
            message: error.message,
          });
        }
  
        throw new RpcException({
          code: status.INTERNAL,
          message: 'An internal error occurred.',
        });
      }
    }
}