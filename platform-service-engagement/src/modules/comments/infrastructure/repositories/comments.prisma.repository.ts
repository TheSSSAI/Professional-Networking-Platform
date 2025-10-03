import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Comment as PrismaComment } from '@prisma/client';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { Comment } from '../../domain/comment.entity';
import { ICommentsRepository } from '../../domain/i-comments.repository';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';

@Injectable()
export class CommentsPrismaRepository implements ICommentsRepository {
  private readonly logger = new Logger(CommentsPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps a Prisma Comment model to a domain Comment entity.
   * @param prismaComment The comment object from Prisma.
   * @returns A Comment domain entity.
   */
  private static toDomain(prismaComment: PrismaComment): Comment {
    if (!prismaComment) {
      return null;
    }
    return new Comment(
      prismaComment.id,
      prismaComment.content,
      prismaComment.authorId,
      prismaComment.postId,
      prismaComment.createdAt,
      prismaComment.updatedAt,
    );
  }

  /**
   * Creates a new comment record in the database.
   * @param comment The Comment domain entity to persist.
   * @returns The persisted Comment domain entity.
   */
  async create(comment: Comment): Promise<Comment> {
    try {
      const createdComment = await this.prisma.comment.create({
        data: {
          id: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          postId: comment.postId,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        },
      });
      return CommentsPrismaRepository.toDomain(createdComment);
    } catch (error) {
      this.logger.error(
        `Error creating comment: ${error.message}`,
        error.stack,
      );
      // Prisma errors for foreign key constraints etc. will be caught by a global exception filter.
      throw error;
    }
  }

  /**
   * Finds a comment by its unique ID.
   * @param commentId The ID of the comment to find.
   * @returns The Comment domain entity if found, otherwise null.
   */
  async findById(commentId: string): Promise<Comment | null> {
    const prismaComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    return CommentsPrismaRepository.toDomain(prismaComment);
  }

  /**
   * Updates an existing comment. This operation requires the author's ID for authorization.
   * @param commentId The ID of the comment to update.
   * @param authorId The ID of the user attempting the update, for authorization.
   * @param data A partial Comment domain entity with fields to update.
   * @returns The updated Comment domain entity.
   * @throws {CommentNotFoundException} if the comment does not exist or the user is not the author.
   */
  async update(
    commentId: string,
    authorId: string,
    data: Partial<Comment>,
  ): Promise<Comment> {
    try {
      const updatedPrismaComment = await this.prisma.comment.update({
        where: { id: commentId, authorId: authorId },
        data: {
          content: data.content,
          updatedAt: new Date(),
        },
      });
      return CommentsPrismaRepository.toDomain(updatedPrismaComment);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(
          `Update failed: Comment with ID ${commentId} not found or author ID mismatch for user ${authorId}.`,
        );
        throw new CommentNotFoundException(commentId);
      }
      this.logger.error(
        `Error updating comment ${commentId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes a comment. This operation requires the author's ID for authorization.
   * @param commentId The ID of the comment to delete.
   * @param authorId The ID of the user attempting the deletion, for authorization.
   * @returns A promise that resolves when the operation is complete.
   * @throws {CommentNotFoundException} if the comment does not exist or the user is not the author.
   */
  async delete(commentId: string, authorId: string): Promise<void> {
    const result = await this.prisma.comment.deleteMany({
      where: {
        id: commentId,
        authorId: authorId,
      },
    });

    if (result.count === 0) {
      this.logger.warn(
        `Delete failed: Comment with ID ${commentId} not found or author ID mismatch for user ${authorId}.`,
      );
      throw new CommentNotFoundException(commentId);
    }

    this.logger.log(
      `Successfully deleted comment with ID ${commentId} by author ${authorId}.`,
    );
  }

  /**
   * Finds all comments associated with a specific post, ordered by creation date.
   * @param postId The ID of the post.
   * @returns An array of Comment domain entities.
   */
  async findByPostId(postId: string): Promise<Comment[]> {
    const prismaComments = await this.prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: 'asc' },
    });

    return prismaComments.map(CommentsPrismaRepository.toDomain);
  }
}