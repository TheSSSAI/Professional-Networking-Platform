import { Controller, UseFilters } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import {
  AddCommentRequest,
  CommentResponse,
  DeleteCommentRequest,
  EditCommentRequest,
  EngagementServiceController,
  EngagementServiceControllerMethods,
  StatusResponse,
} from '../../../../proto/engagement.pb';
import { AddCommentCommand } from '../application/commands/add-comment/add-comment.command';
import { EditCommentCommand } from '../application/commands/edit-comment/edit-comment.command';
import { DeleteCommentCommand } from '../application/commands/delete-comment/delete-comment.command';
import { Comment } from '../domain/comment.entity';
import { GrpcExceptionFilter } from '../../../shared/infrastructure/filters/grpc-exception.filter';

/**
 * gRPC Controller for managing comment-related operations.
 * This controller acts as the presentation layer entry point for the Comments bounded context.
 * It translates incoming gRPC requests into application-layer commands and dispatches them
 * via the CommandBus. It is responsible for protocol adaptation and not for business logic.
 *
 * @UseFilters(GrpcExceptionFilter) - Applies a custom filter to catch application/domain
 * exceptions and translate them into appropriate gRPC status codes.
 */
@Controller()
@UseFilters(new GrpcExceptionFilter())
@EngagementServiceControllerMethods()
export class CommentsController implements EngagementServiceController {
  /**
   * Injects the CommandBus to delegate command execution to the application layer.
   * @param {CommandBus} commandBus - The CQRS command bus provided by NestJS.
   */
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handles the 'AddComment' gRPC method.
   * Creates an AddCommentCommand from the request and executes it.
   * Maps the resulting Comment domain entity to a gRPC CommentResponse.
   *
   * @param {AddCommentRequest} request - The gRPC request object containing post ID, author ID, and content.
   * @returns {Promise<CommentResponse>} The newly created comment data.
   * @throws {RpcException} Throws RpcException if the command execution fails, handled by the GrpcExceptionFilter.
   */
  @GrpcMethod('EngagementService', 'AddComment')
  async addComment(request: AddCommentRequest): Promise<CommentResponse> {
    const { postId, authorId, content } = request;

    if (!postId || !authorId || !content) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Post ID, author ID, and content are required.',
      });
    }

    const command = new AddCommentCommand(authorId, postId, content);

    const result: Comment = await this.commandBus.execute<
      AddCommentCommand,
      Comment
    >(command);

    return {
      id: result.id,
      content: result.content,
      authorId: result.authorId,
      postId: result.postId,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  /**
   * Handles the 'EditComment' gRPC method.
   * Creates an EditCommentCommand from the request and executes it.
   *
   * @param {EditCommentRequest} request - The gRPC request object containing comment ID, user ID for authorization, and new content.
   * @returns {Promise<StatusResponse>} A response indicating the success of the operation.
   * @throws {RpcException} Throws RpcException if the command execution fails, handled by the GrpcExceptionFilter.
   */
  @GrpcMethod('EngagementService', 'EditComment')
  async editComment(request: EditCommentRequest): Promise<StatusResponse> {
    const { commentId, userId, newContent } = request;

    if (!commentId || !userId || newContent === undefined) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Comment ID, user ID, and new content are required.',
      });
    }

    const command = new EditCommentCommand(commentId, userId, newContent);
    await this.commandBus.execute(command);

    return { success: true, message: 'Comment updated successfully.' };
  }

  /**
   * Handles the 'DeleteComment' gRPC method.
   * Creates a DeleteCommentCommand from the request and executes it.
   *
   * @param {DeleteCommentRequest} request - The gRPC request object containing comment ID and user ID for authorization.
   * @returns {Promise<StatusResponse>} A response indicating the success of the operation.
   * @throws {RpcException} Throws RpcException if the command execution fails, handled by the GrpcExceptionFilter.
   */
  @GrpcMethod('EngagementService', 'DeleteComment')
  async deleteComment(request: DeleteCommentRequest): Promise<StatusResponse> {
    const { commentId, userId } = request;

    if (!commentId || !userId) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Comment ID and user ID are required.',
      });
    }

    const command = new DeleteCommentCommand(commentId, userId);
    await this.commandBus.execute(command);

    return { success: true, message: 'Comment deleted successfully.' };
  }

  // The following methods are part of the EngagementService but are not implemented in this controller.
  // They will be implemented in their respective controllers (e.g., ReactionsController, EndorsementsController).
  // This is a requirement of implementing a service interface with NestJS gRPC.
  // We throw UNIMPLEMENTED to signal that these RPCs are not handled here.

  addReaction() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'addReaction is not implemented in CommentsController.',
    });
  }

  addSkillEndorsement() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'addSkillEndorsement is not implemented in CommentsController.',
    });
  }
}