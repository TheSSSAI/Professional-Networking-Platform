import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { IMessageRepository } from './message.repository.interface';
import { Message, MessageStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagePrismaRepository implements IMessageRepository {
  private readonly logger = new Logger(MessagePrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    content: string;
    authorId: string;
    conversationId: string;
  }): Promise<Message> {
    this.logger.log(
      `Creating message in conversation ${data.conversationId} by author ${data.authorId}`,
    );
    return this.prisma.message.create({
      data,
    });
  }

  async findPaginatedByConversationId(
    conversationId: string,
    pagination: { cursor?: string; limit: number },
  ): Promise<Message[]> {
    this.logger.log(
      `Finding messages for conversation ${conversationId} with limit ${pagination.limit}`,
    );

    const { cursor, limit } = pagination;
    const queryOptions: Prisma.MessageFindManyArgs = {
      take: limit,
      where: {
        conversationId,
      },
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
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; // Skip the cursor itself
    }

    return this.prisma.message.findMany(queryOptions);
  }

  async updateStatus(
    messageIds: string[],
    status: MessageStatus,
  ): Promise<void> {
    if (messageIds.length === 0) {
      return;
    }
    this.logger.log(
      `Updating status of ${messageIds.length} messages to ${status}`,
    );
    await this.prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: {
        status,
      },
    });
  }
}