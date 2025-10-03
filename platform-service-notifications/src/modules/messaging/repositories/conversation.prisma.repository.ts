import { Injectable, Logger } from '@nestjs/common';
import { IConversationRepository } from './conversation.repository.interface';
import { PrismaService } from '../../../shared/database/prisma.service';
import { Conversation, Prisma } from '@prisma/client';

@Injectable()
export class ConversationPrismaRepository implements IConversationRepository {
  private readonly logger = new Logger(ConversationPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Conversation | null> {
    this.logger.log(`Finding conversation by ID: ${id}`);
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { participants: true },
    });
  }

  async findByParticipantIds(
    participantIds: string[],
  ): Promise<Conversation | null> {
    this.logger.log(
      `Finding conversation by participant IDs: ${participantIds.join(', ')}`,
    );

    if (participantIds.length !== 2) {
      this.logger.warn(
        'findByParticipantIds currently only supports 1-on-1 conversations.',
      );
      return null;
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        AND: [
          { participants: { some: { id: participantIds[0] } } },
          { participants: { some: { id: participantIds[1] } } },
        ],
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    // Filter for conversations with exactly two participants
    const directConversation = conversations.find(
      (c) => c._count.participants === 2,
    );

    return directConversation || null;
  }

  async create(participantIds: string[]): Promise<Conversation> {
    this.logger.log(
      `Creating conversation for participants: ${participantIds.join(', ')}`,
    );
    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
    });
  }

  async addUserToConversation(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    this.logger.log(
      `Adding user ${userId} to conversation ${conversationId}`,
    );
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
    });
  }

  async findConversationsByUserId(
    userId: string,
    pagination: { limit: number; offset: number },
  ): Promise<Conversation[]> {
    this.logger.log(
      `Finding conversations for user ${userId} with limit ${pagination.limit} and offset ${pagination.offset}`,
    );
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          where: {
            id: {
              not: userId,
            },
          },
          select: {
            id: true,
            profile: {
              select: { name: true, profilePictureUrl: true },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: pagination.limit,
      skip: pagination.offset,
    });
  }
}