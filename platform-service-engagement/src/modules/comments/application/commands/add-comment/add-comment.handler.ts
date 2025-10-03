import {
  CommandHandler,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ICommentsRepository } from '../../../domain/i-comments.repository';
import { Comment } from '../../../domain/comment.entity';
import { CommentAddedEvent } from '../../../domain/events/comment-added.event';
import { AddCommentDto } from '../../dtos/add-comment.dto';

// This would typically be in a shared kernel or a dedicated infrastructure module for external service integrations.
// For this file, we define the interface here to satisfy dependency injection.
export const POSTS_VALIDATOR_TOKEN = 'POSTS_VALIDATOR_TOKEN';
export interface IPostsValidator {
  validatePostExists(postId: string): Promise<{ exists: boolean; authorId: string }>;
}

export class AddCommentCommand {
  constructor(
    public readonly dto: AddCommentDto,
    public readonly authorId: string,
  ) {}
}

@CommandHandler(AddCommentCommand)
export class AddCommentHandler
  implements ICommandHandler<AddCommentCommand, Comment>
{
  private readonly logger = new Logger(AddCommentHandler.name);

  constructor(
    @Inject('ICommentsRepository')
    private readonly commentsRepository: ICommentsRepository,
    @Inject(POSTS_VALIDATOR_TOKEN)
    private readonly postsValidator: IPostsValidator,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddCommentCommand): Promise<Comment> {
    this.logger.log(
      `Executing AddCommentCommand for post ${command.dto.postId} by author ${command.authorId}`,
    );

    const { postId, content } = command.dto;
    const { authorId } = command;

    try {
      const validationResult = await this.postsValidator.validatePostExists(
        postId,
      );
      if (!validationResult.exists) {
        throw new RpcException('Post not found.');
      }

      const newCommentEntity = Comment.create({
        postId,
        authorId,
        content,
      });

      const savedComment = await this.commentsRepository.create(
        newCommentEntity,
      );

      // Publish event for downstream services (e.g., Notifications)
      this.eventBus.publish(
        new CommentAddedEvent(
          savedComment.id,
          savedComment.postId,
          validationResult.authorId, // postAuthorId
          savedComment.authorId,     // commentAuthorId
        ),
      );
      
      this.logger.log(`Successfully added comment ${savedComment.id} to post ${postId}`);
      return savedComment;
    } catch (error) {
      this.logger.error(
        `Failed to execute AddCommentCommand for post ${command.dto.postId}. Error: ${error.message}`,
        error.stack,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException('An unexpected error occurred while adding the comment.');
    }
  }
}