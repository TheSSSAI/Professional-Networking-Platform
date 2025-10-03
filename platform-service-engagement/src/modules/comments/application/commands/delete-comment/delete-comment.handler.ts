import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ICommentsRepository } from '../../../domain/i-comments.repository';
import { DeleteCommentDto } from '../../dtos/delete-comment.dto';

export class DeleteCommentCommand {
  constructor(
    public readonly dto: DeleteCommentDto,
    public readonly userId: string, // ID of the user attempting the deletion
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand, void> {
  private readonly logger = new Logger(DeleteCommentHandler.name);

  constructor(
    @Inject('ICommentsRepository')
    private readonly commentsRepository: ICommentsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    this.logger.log(
      `Executing DeleteCommentCommand for comment ${command.dto.commentId} by user ${command.userId}`,
    );
    const { commentId } = command.dto;
    const { userId } = command;

    try {
      const existingComment = await this.commentsRepository.findById(commentId);

      if (!existingComment) {
        this.logger.warn(`Comment with ID ${commentId} not found for deletion.`);
        throw new NotFoundException('Comment not found.');
      }

      // Authorization check: only the author can delete their comment.
      if (existingComment.authorId !== userId) {
        this.logger.error(
          `User ${userId} attempted to delete comment ${commentId} owned by ${existingComment.authorId}.`,
        );
        throw new ForbiddenException(
          'You are not authorized to delete this comment.',
        );
      }

      await this.commentsRepository.delete(commentId);
      
      this.logger.log(`Successfully deleted comment ${commentId}`);
      
      // Optionally, publish a CommentDeletedEvent if other services need to react
      // this.eventBus.publish(new CommentDeletedEvent(commentId, existingComment.postId, existingComment.authorId));

    } catch (error) {
        this.logger.error(
            `Failed to execute DeleteCommentCommand for comment ${commentId}. Error: ${error.message}`,
            error.stack,
        );
        if (error instanceof ForbiddenException || error instanceof NotFoundException) {
            throw new RpcException(error.getResponse());
        }
        throw new RpcException('An unexpected error occurred while deleting the comment.');
    }
  }
}