import { Controller, Inject, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MessagingService } from '../services/messaging.service';
import { GetHistoryDto } from '../dtos/get-history.dto';
import { status } from '@grpc/grpc-js';
import { GetHistoryResponse, Message } from 'src/shared/grpc-clients/grpc-client.interface';
import { GrpcLoggingInterceptor } from 'src/shared/interceptors/grpc-logging.interceptor';
import { GrpcExceptionFilter } from 'src/shared/filters/grpc-exception.filter';
import { Metadata } from '@grpc/grpc-js';
import { IMessageRepository } from '../interfaces/message.repository.interface';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(GrpcExceptionFilter)
export class MessagingGrpcController {
  constructor(
    @Inject(MessagingService)
    private readonly messagingService: MessagingService,
  ) {}

  /**
   * gRPC method to fetch the message history for a given conversation.
   * It requires the requesting user's ID to be present in the gRPC metadata for authorization.
   *
   * @param {GetHistoryDto} data - The DTO containing conversationId, cursor, and pageSize.
   * @param {Metadata} metadata - The gRPC metadata containing the user ID.
   * @returns {Promise<GetHistoryResponse>} A paginated response of messages.
   * @throws {RpcException} If the user is not authenticated or not part of the conversation.
   */
  @GrpcMethod('MessagingService', 'GetMessageHistory')
  async getMessageHistory(
    data: GetHistoryDto,
    metadata: Metadata,
  ): Promise<GetHistoryResponse> {
    const userId = metadata.get('x-user-id')[0]?.toString();
    if (!userId) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User not authenticated',
      });
    }

    try {
      const { messages, nextCursor } = await this.messagingService.getMessageHistory(
        userId,
        data.conversationId,
        {
          take: data.pageSize,
          cursor: data.cursor,
        },
      );
      
      const responseMessages: Message[] = messages.map(message => ({
        id: message.id,
        content: message.content,
        authorId: message.authorId,
        createdAt: message.createdAt.toISOString(),
        conversationId: message.conversationId,
        status: message.status as IMessageRepository.MessageStatus,
      }));

      return {
        messages: responseMessages,
        nextCursor: nextCursor || undefined,
      };
    } catch (error) {
        // The GrpcExceptionFilter will handle mapping this to an appropriate gRPC status code.
        // For example, a NotFoundException from the service will be mapped to NOT_FOUND.
        // A ForbiddenException will be mapped to PERMISSION_DENIED.
        throw error;
    }
  }
}