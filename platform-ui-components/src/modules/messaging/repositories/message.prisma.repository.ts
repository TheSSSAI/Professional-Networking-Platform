import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { IMessageRepository } from '../interfaces/message.repository.interface';
import { GetHistoryDto } from '../dtos/get-history.dto';
import { DataAccessException } from '../../../shared/errors/data-access.exception';
import { SendMessageDto } from '../dtos/send-message.dto';

/**
 * @class MessagePrismaRepository
 * @description Prisma-based implementation of the IMessageRepository.
 * Handles all data access logic for Message entities using Prisma ORM.
 */
@Injectable()
export class MessagePrismaRepository implements IMessageRepository {
  private readonly logger = new Logger(MessagePrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description Creates a new message in the database.
   * @param data The data required to create a message.
   * @param authorId The ID of the user authoring the message.
   * @returns The newly created Message entity.
   * @throws DataAccessException if the database operation fails.
   */
  async create(data: SendMessageDto, authorId: string): Promise<Message> {
    try {
      return await this.prisma.message.create({
        data: {
          content: data.content,
          authorId,
          conversationId: data.conversationId,
          status: 'sent', // Initial status
        },
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                  profilePictureUrl: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create message for conversation ${data.conversationId}`,
        error.stack,
      );
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DataAccessException(
          `Database error creating message: ${error.message}`,
          { code: error.code, meta: error.meta },
        );
      }
      throw new DataAccessException('An unexpected error occurred while creating the message.');
    }
  }

  /**
   * @description Finds messages in a conversation using cursor-based pagination.
   * @param conversationId The ID of the conversation to fetch messages from.
   * @param getHistoryDto DTO containing pagination parameters (cursor, pageSize).
   * @returns An object containing the list of messages and the next cursor.
   * @throws DataAccessException if the database operation fails.
   */
  async findManyByConversation(
    conversationId: string,
    getHistoryDto: GetHistoryDto,
  ): Promise<{ messages: Message[]; nextCursor: string | null }> {
    const { cursor, pageSize } = getHistoryDto;
    const take = pageSize + 1; // Fetch one extra to determine if there's a next page

    try {
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId,
        },
        take,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                  profilePictureUrl: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: string | null = null;
      if (messages.length > pageSize) {
        const nextItem = messages.pop(); // Remove the extra item
        nextCursor = nextItem.id;
      }

      return { messages, nextCursor };
    } catch (error) {
      this.logger.error(
        `Failed to find messages for conversation ${conversationId}`,
        error.stack,
      );
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DataAccessException(
          `Database error finding messages: ${error.message}`,
          { code: error.code, meta: error.meta },
        );
      }
      throw new DataAccessException('An unexpected error occurred while fetching messages.');
    }
  }

  /**
   * @description Updates the status of multiple messages within a conversation.
   * Typically used to mark messages as 'delivered' or 'read'.
   * @param messageIds An array of message IDs to update.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user whose action is triggering the status change.
   * @param status The new status to set ('delivered' or 'read').
   * @returns The number of messages updated.
   * @throws DataAccessException if the database operation fails.
   */
  async updateMessagesStatus(
    messageIds: string[],
    conversationId: string,
    userId: string,
    status: 'delivered' | 'read',
  ): Promise<{ count: number }> {
    try {
      const result = await this.prisma.message.updateMany({
        where: {
          id: { in: messageIds },
          conversationId: conversationId,
          // Do not update the status of messages sent by the user themselves
          authorId: { not: userId },
          // Only update if the new status is a progression (e.g., don't revert 'read' to 'delivered')
          status: {
            not: status === 'delivered' ? 'read' : undefined, // Can't go from read to delivered
            in: status === 'read' ? ['sent', 'delivered'] : ['sent'],
          },
        },
        data: {
          status: status,
        },
      });
      return { count: result.count };
    } catch (error) {
      this.logger.error(
        `Failed to update status for messages in conversation ${conversationId}`,
        error.stack,
      );
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DataAccessException(
          `Database error updating messages status: ${error.message}`,
          { code: error.code, meta: error.meta },
        );
      }
      throw new DataAccessException('An unexpected error occurred while updating message statuses.');
    }
  }

  /**
   * @description Finds the participants of a conversation, excluding the current user.
   * @param conversationId The ID of the conversation.
   * @param currentUserId The ID of the user making the request.
   * @returns An array of participant user IDs.
   * @throws DataAccessException if the conversation is not found or a database error occurs.
   */
  async findConversationParticipants(
    conversationId: string,
    currentUserId: string,
  ): Promise<string[]> {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
          participants: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!conversation) {
        throw new DataAccessException(`Conversation with ID ${conversationId} not found.`);
      }

      return conversation.participants
        .map((p) => p.id)
        .filter((id) => id !== currentUserId);
    } catch (error) {
      this.logger.error(
        `Failed to find participants for conversation ${conversationId}`,
        error.stack,
      );
      if (error instanceof DataAccessException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DataAccessException(
          `Database error finding participants: ${error.message}`,
          { code: error.code, meta: error.meta },
        );
      }
      throw new DataAccessException('An unexpected error occurred while finding conversation participants.');
    }
  }
}