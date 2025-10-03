import { Injectable, Logger } from '@nestjs/common';
import { PostReaction as PrismaPostReaction } from '@prisma/client';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { IReactionsRepository } from '../../domain/i-reactions.repository';
import { PostReaction } from '../../domain/post-reaction.entity';

@Injectable()
export class ReactionsPrismaRepository implements IReactionsRepository {
  private readonly logger = new Logger(ReactionsPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps a Prisma PostReaction model to a domain PostReaction entity.
   * @param prismaReaction The reaction object from Prisma.
   * @returns A PostReaction domain entity.
   */
  private static toDomain(prismaReaction: PrismaPostReaction): PostReaction {
    if (!prismaReaction) {
      return null;
    }
    return new PostReaction(
      prismaReaction.id,
      prismaReaction.userId,
      prismaReaction.postId,
      prismaReaction.reactionType,
      prismaReaction.createdAt,
    );
  }

  /**
   * Creates a new reaction or updates an existing one for a user on a post.
   * This implements the "one reaction per user per post" rule.
   * @param reaction The PostReaction domain entity to create or update.
   * @returns The created or updated PostReaction domain entity.
   */
  async upsert(reaction: PostReaction): Promise<PostReaction> {
    try {
      const upsertedReaction = await this.prisma.postReaction.upsert({
        where: {
          userId_postId: {
            userId: reaction.userId,
            postId: reaction.postId,
          },
        },
        update: {
          reactionType: reaction.reactionType,
          createdAt: new Date(), // Update timestamp on reaction change
        },
        create: {
          id: reaction.id,
          userId: reaction.userId,
          postId: reaction.postId,
          reactionType: reaction.reactionType,
          createdAt: reaction.createdAt,
        },
      });
      return ReactionsPrismaRepository.toDomain(upsertedReaction);
    } catch (error) {
      this.logger.error(
        `Error during upsert reaction for user ${reaction.userId} on post ${reaction.postId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes a user's reaction from a post. This operation is idempotent.
   * @param userId The ID of the user whose reaction is to be removed.
   * @param postId The ID of the post from which to remove the reaction.
   * @returns A promise that resolves when the operation is complete.
   */
  async delete(userId: string, postId: string): Promise<void> {
    try {
      await this.prisma.postReaction.deleteMany({
        where: {
          userId: userId,
          postId: postId,
        },
      });
      this.logger.log(
        `Attempted deletion of reaction for user ${userId} on post ${postId}.`,
      );
    } catch (error) {
      this.logger.error(
        `Error deleting reaction for user ${userId} on post ${postId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a specific reaction by a user on a post.
   * @param userId The ID of the user.
   * @param postId The ID of the post.
   * @returns The PostReaction domain entity if found, otherwise null.
   */
  async findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostReaction | null> {
    const prismaReaction = await this.prisma.postReaction.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return ReactionsPrismaRepository.toDomain(prismaReaction);
  }
}