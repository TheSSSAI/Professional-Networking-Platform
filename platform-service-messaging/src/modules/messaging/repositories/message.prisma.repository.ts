import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { IMessageRepository } from './message.repository.interface';
import { Message, MessageStatus, Prisma } from '@prisma/client';

@Injectable()
export class MessagePrismaRepository implements IMessageRepository {
  private readonly logger = new Logger(MessagePrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    content: string;
    authorId: string;
    conversationId: string;
  }): Promise<Message> {
    try {
      // In a real-world scenario, updating conversation's updatedAt
      // should be part of the same transaction.
      const [, message] = await this.prisma.$transaction([
        this.prisma.conversation.update({
          where: { id: data.conversationId },
          data: { updatedAt: new Date() },
        }),
        this.prisma.message.create({
          data: {
            content: data.content,
            authorId: data.authorId,
            conversationId: data.conversationId,
            status: MessageStatus.SENT,
          },
        }),
      ]);
      return message;
    } catch (error) {
      this.logger.error(`Failed to create message for conversation ${data.conversationId}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors if needed
      }
      throw error;
    }
  }

  async findManyByConversation(
    conversationId: string,
    pagination: { cursor?: string; limit: number },
  ): Promise<Message[]> {
    const { cursor, limit } = pagination;
    try {
      const messages = await this.prisma.message.findMany({
        where: { conversationId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return messages;
    } catch (error) {
      this.logger.error(`Failed to find messages for conversation ${conversationId}`, error.stack);
      throw error;
    }
  }

  async updateStatus(
    messageIds: string[],
    status: MessageStatus,
  ): Promise<number> {
    if (messageIds.length === 0) {
      return 0;
    }
    try {
      const result = await this.prisma.message.updateMany({
        where: {
          id: { in: messageIds },
          // Ensure we don't 'downgrade' a status
          status:
            status === MessageStatus.READ
              ? { in: [MessageStatus.SENT, MessageStatus.DELIVERED] }
              : status === MessageStatus.DELIVERED
              ? { equals: MessageStatus.SENT }
              : undefined,
        },
        data: {
          status,
        },
      });
      return result.count;
    } catch (error) {
      this.logger.error(`Failed to update status for message IDs: ${messageIds.join(', ')}`, error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<Message | null> {
    try {
      return await this.prisma.message.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Failed to find message by id ${id}`, error.stack);
      throw error;
    }
  }
}