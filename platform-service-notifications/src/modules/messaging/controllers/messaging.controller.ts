import { Controller, Logger, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MessagingService } from '../services/messaging.service';
import { status as GrpcStatus } from '@grpc/grpc-js';

// This guard would be a gRPC equivalent of the WsJwtGuard,
// responsible for authenticating gRPC requests.
// Assuming it's provided at a global or higher level.
// import { GrpcAuthGuard } from 'src/shared/guards/grpc-auth.guard';

// @UseGuards(GrpcAuthGuard)
@Controller()
export class MessagingController {
  private readonly logger = new Logger(MessagingController.name);

  constructor(private readonly messagingService: MessagingService) {}

  /**
   * gRPC method to fetch the message history for a given conversation.
   * Implements REQ-1-028.
   * @param request - Contains conversationId and pagination parameters.
   * @param metadata - gRPC metadata, expected to contain user information after authentication.
   * @returns A promise that resolves to the list of messages and next cursor.
   */
  @GrpcMethod('MessagingService', 'GetMessageHistory')
  async getMessageHistory(
    request: {
      conversationId: string;
      cursor?: string;
      limit?: number;
    },
    metadata: any, // In a real app, this would be a strongly-typed object
  ): Promise<{ messages: any[]; nextCursor: string | null }> {
    const userId = metadata?.user?.userId;
    if (!userId) {
      this.logger.error('GetMessageHistory called without authenticated user');
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'User authentication failed.',
      });
    }

    this.logger.log(
      `Fetching message history for conversation ${request.conversationId} for user ${userId}`,
    );

    try {
      const limit = request.limit || 50;
      const paginatedResult = await this.messagingService.getMessageHistory(
        userId,
        request.conversationId,
        {
          cursor: request.cursor,
          limit,
        },
      );

      const messages = paginatedResult.map((msg) => ({
        id: msg.id,
        content: msg.content,
        authorId: msg.authorId,
        status: msg.status,
        createdAt: msg.createdAt.toISOString(),
      }));

      // Determine the next cursor. If we got back as many items as we requested,
      // the last item's ID is the next cursor.
      const nextCursor =
        messages.length === limit ? messages[messages.length - 1].id : null;

      return {
        messages,
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching message history for user ${userId}: ${error.message}`,
        error.stack,
      );
      // Translate common service exceptions to gRPC status codes
      if (error.name === 'ForbiddenException') {
        throw new RpcException({
          code: GrpcStatus.PERMISSION_DENIED,
          message: error.message,
        });
      }
      if (error.name === 'NotFoundException') {
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND,
          message: error.message,
        });
      }
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: 'An internal error occurred while fetching message history.',
      });
    }
  }

  /**
   * gRPC method to fetch the list of conversations for a user.
   * Implements a part of REQ-1-026.
   * @param request - Contains pagination parameters.
   * @param metadata - gRPC metadata containing authenticated user info.
   * @returns A promise that resolves to the list of conversations.
   */
  @GrpcMethod('MessagingService', 'GetConversations')
  async getConversations(
    request: {
      cursor?: string;
      limit?: number;
    },
    metadata: any,
  ): Promise<{ conversations: any[]; nextCursor: string | null }> {
    const userId = metadata?.user?.userId;
    if (!userId) {
      this.logger.error('GetConversations called without authenticated user');
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'User authentication failed.',
      });
    }

    this.logger.log(`Fetching conversations for user ${userId}`);

    try {
      const limit = request.limit || 20;
      const paginatedResult = await this.messagingService.getConversations(
        userId,
        {
          cursor: request.cursor,
          limit,
        },
      );

      const conversations = paginatedResult.map((convo) => ({
        id: convo.id,
        participants: convo.participants.map((p) => ({
          id: p.id,
          // In a real system, you'd fetch profile details like name/avatar here
          // or have them denormalized. For now, we only return IDs.
        })),
        lastMessage: convo.messages[0]
          ? {
              id: convo.messages[0].id,
              content: convo.messages[0].content,
              authorId: convo.messages[0].authorId,
              createdAt: convo.messages[0].createdAt.toISOString(),
            }
          : null,
        updatedAt: convo.updatedAt.toISOString(),
      }));

      const nextCursor =
        conversations.length === limit
          ? conversations[conversations.length - 1].id
          : null;

      return {
        conversations,
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching conversations for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: 'An internal error occurred while fetching conversations.',
      });
    }
  }
}