import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { IConversationRepository } from './conversation.repository.interface';
import { Conversation, Prisma } from '@prisma/client';

@Injectable()
export class ConversationPrismaRepository implements IConversationRepository {
  private readonly logger = new Logger(ConversationPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(participantIds: string[]): Promise<Conversation> {
    if (participantIds.length !== 2) {
      throw new Error('One-on-one conversations must have exactly two participants.');
    }

    try {
      return await this.prisma.conversation.create({
        data: {
          participants: {
            create: participantIds.map((userId) => ({
              userId,
            })),
          },
        },
        include: {
          participants: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create conversation for participants: ${participantIds.join(', ')}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific unique constraint violations if they occur
      }
      throw error;
    }
  }

  async findByParticipants(
    participantIds: string[],
  ): Promise<Conversation | null> {
    if (participantIds.length !== 2) {
      return null;
    }

    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          AND: [
            { participants: { some: { userId: participantIds[0] } } },
            { participants: { some: { userId: participantIds[1] } } },
          ],
          participants: {
            every: {
              userId: { in: participantIds },
            },
          },
        },
        include: {
          _count: {
            select: { participants: true },
          },
        },
      });

      // Filter to find conversations with exactly these two participants
      const exactMatch = conversations.find(
        (c) => c._count.participants === participantIds.length,
      );

      return exactMatch || null;
    } catch (error) {
      this.logger.error(`Failed to find conversation by participants: ${participantIds.join(', ')}`, error.stack);
      throw error;
    }
  }

  async findById(conversationId: string): Promise<Conversation | null> {
    try {
      return await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to find conversation by ID: ${conversationId}`, error.stack);
      throw error;
    }
  }

  async findUserConversations(
    userId: string,
    pagination: { limit: number; offset: number },
  ): Promise<Conversation[]> {
    try {
      return await this.prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1, // Include only the latest message for previews
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: pagination.limit,
        skip: pagination.offset,
      });
    } catch (error) {
      this.logger.error(`Failed to find conversations for user: ${userId}`, error.stack);
      throw error;
    }
  }
}