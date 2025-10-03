import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ICommentsRepository } from '../../../domain/i-comments.repository';
import { EditCommentDto } from '../../dtos/edit-comment.dto';

export class EditCommentCommand {
  constructor(
    public readonly dto: EditCommentDto,
    public readonly userId: string, // ID of the user attempting the edit
  ) {}
}

@CommandHandler(EditCommentCommand)
export class EditCommentHandler implements ICommandHandler<EditCommentCommand, void> {
  private readonly logger = new Logger(EditCommentHandler.name);

  constructor(
    @Inject('ICommentsRepository')
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(command: EditCommentCommand): Promise<void> {
    this.logger.log(
      `Executing EditCommentCommand for comment ${command.dto.commentId} by user ${command.userId}`,
    );

    const { commentId, content } = command.dto;
    const { userId } = command;

    try {
      const existingComment = await this.commentsRepository.findById(commentId);

      if (!existingComment) {
        this.logger.warn(`Comment with ID ${commentId} not found.`);
        throw new NotFoundException('Comment not found.');
      }

      // Authorization check: only the author can edit their comment.
      if (existingComment.authorId !== userId) {
        this.logger.error(
          `User ${userId} attempted to edit comment ${commentId} owned by ${existingComment.authorId}.`,
        );
        throw new ForbiddenException(
          'You are not authorized to edit this comment.',
        );
      }

      // Use domain entity method to perform the update
      existingComment.updateContent(content);

      await this.commentsRepository.update(commentId, {
        content: existingComment.content,
        // The repository implementation should handle updating the `updatedAt` field
      });
      
      this.logger.log(`Successfully edited comment ${commentId}`);

    } catch (error) {
        this.logger.error(
            `Failed to execute EditCommentCommand for comment ${commentId}. Error: ${error.message}`,
            error.stack,
        );
        if (error instanceof ForbiddenException || error instanceof NotFoundException) {
            throw new RpcException(error.getResponse());
        }
        throw new RpcException('An unexpected error occurred while editing the comment.');
    }
  }
}