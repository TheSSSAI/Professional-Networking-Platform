import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostRepository } from '../../domain/interfaces/post.repository.interface';
import { PostAggregate } from '../../domain/post.aggregate';
import { PostMapper } from '../../application/mappers/post.mapper';

@Injectable()
export class PostPrismaRepository implements IPostRepository {
  private readonly logger = new Logger(PostPrismaRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly postMapper: PostMapper,
  ) {}

  async save(post: PostAggregate): Promise<void> {
    this.logger.log(`Persisting post with ID: ${post.id}`);
    const postData = this.postMapper.toPersistence(post);

    const postUpsertArgs: Prisma.PostUpsertArgs = {
      where: { id: post.id },
      create: {
        id: post.id,
        authorId: postData.authorId,
        text: postData.text,
        linkPreview: postData.linkPreview
          ? (postData.linkPreview as Prisma.JsonObject)
          : Prisma.DbNull,
        media: {
          create: postData.media.map((mediaItem) => ({
            id: mediaItem.id,
            s3ObjectKey: mediaItem.s3ObjectKey,
            mediaType: mediaItem.mediaType,
            order: mediaItem.order,
          })),
        },
      },
      update: {
        text: postData.text,
        linkPreview: postData.linkPreview
          ? (postData.linkPreview as Prisma.JsonObject)
          : Prisma.DbNull,
        media: {
          deleteMany: {}, // Clear existing media
          create: postData.media.map((mediaItem) => ({
            id: mediaItem.id,
            s3ObjectKey: mediaItem.s3ObjectKey,
            mediaType: mediaItem.mediaType,
            order: mediaItem.order,
          })),
        },
        updatedAt: new Date(),
      },
    };

    try {
      await this.prisma.post.upsert(postUpsertArgs);
      this.logger.log(`Successfully persisted post with ID: ${post.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to persist post with ID: ${post.id}`,
        error.stack,
      );
      // In a real application, map this to a domain-specific DataAccessException
      throw error;
    }
  }

  async findById(id: string): Promise<PostAggregate | null> {
    this.logger.log(`Finding post by ID: ${id}`);
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          media: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      if (!post) {
        this.logger.warn(`Post with ID: ${id} not found.`);
        return null;
      }

      return this.postMapper.toDomain(post);
    } catch (error) {
      this.logger.error(`Error finding post by ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByAuthorId(
    authorId: string,
    pagination: { skip: number; take: number },
  ): Promise<PostAggregate[]> {
    this.logger.log(
      `Finding posts for author ID: ${authorId} with pagination skip: ${pagination.skip}, take: ${pagination.take}`,
    );
    try {
      const posts = await this.prisma.post.findMany({
        where: { authorId },
        include: {
          media: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      return posts.map((post) => this.postMapper.toDomain(post));
    } catch (error) {
      this.logger.error(
        `Error finding posts by author ID: ${authorId}`,
        error.stack,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting post with ID: ${id}`);
    try {
      // With 'onDelete: Cascade' in schema.prisma, deleting a post
      // will automatically delete its associated media records.
      await this.prisma.post.delete({
        where: { id },
      });
      this.logger.log(`Successfully deleted post with ID: ${id}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: An operation failed because it depends on one or more records that were required but not found.
        if (error.code === 'P2025') {
          this.logger.warn(`Attempted to delete a non-existent post: ${id}`);
          // We can consider this a success from the caller's perspective (idempotency)
          return;
        }
      }
      this.logger.error(`Error deleting post with ID: ${id}`, error.stack);
      throw error;
    }
  }
}