import { Controller, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GrpcMethod,
  GrpcService,
  RpcException,
  GrpcMetadata,
} from '@nestjs/microservices';
import { status as RpcStatus } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';

import {
  PostsServiceController,
  PostsServiceControllerMethods,
  CreatePostRequest,
  PostResponse,
  PostIdRequest,
  UpdatePostRequest,
  EmptyResponse,
  AdminDeletePostRequest,
  ReportPostRequest,
  GetPostsByAuthorIdRequest,
  PostsListResponse,
} from '../../../../proto/posts/posts';
import { CreatePostCommand } from '../application/commands/create-post/create-post.command';
import { DeletePostCommand } from '../application/commands/delete-post/delete-post.command';
import { UpdatePostCommand } from '../application/commands/update-post/update-post.command';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id/get-post-by-id.query';
import { PostResponseDto } from '../application/dtos/post.response.dto';
import { GrpcAuthGuard } from '../../../core/auth/grpc-auth.guard'; // Assuming a core auth guard exists

// This is a placeholder for actual query commands which would be defined in level 2
// For now, we assume they exist to make the controller complete.
class GetPostsByAuthorIdQuery {
  constructor(
    public readonly authorId: string,
    public readonly viewerId: string | null,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

class ReportPostCommand {
  constructor(
    public readonly postId: string,
    public readonly reporterId: string,
    public readonly reason: string,
  ) {}
}
class AdminDeletePostCommand {
  constructor(
    public readonly postId: string,
    public readonly adminId: string,
  ) {}
}

@Controller()
@GrpcService()
@UseGuards(GrpcAuthGuard)
export class PostsGrpcController
  implements PostsServiceController
{
  private readonly logger = new Logger(PostsGrpcController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  private getUserIdFromMetadata(metadata: Metadata): string {
    const userId = metadata.get('user-id')[0];
    if (!userId || typeof userId !== 'string') {
      this.logger.error('User ID not found in gRPC metadata');
      throw new RpcException({
        code: RpcStatus.UNAUTHENTICATED,
        message: 'User ID is missing or invalid.',
      });
    }
    return userId;
  }

  private handleError(error: any): never {
    this.logger.error(`Error in PostsGrpcController: ${error.message}`, error.stack);
    const code =
      error?.code || error?.status || RpcStatus.INTERNAL;
    const message = error?.message || 'An internal error occurred.';
    throw new RpcException({ code, message });
  }

  @GrpcMethod('PostsService', 'CreatePost')
  async createPost(
    request: CreatePostRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<PostResponse> {
    try {
      const userId = this.getUserIdFromMetadata(metadata);
      const command = new CreatePostCommand(userId, request.textContent, request.mediaKeys);
      const result: PostResponseDto = await this.commandBus.execute(command);
      return result as PostResponse; // Assuming DTO is compatible
    } catch (error) {
      this.handleError(error);
    }
  }

  @GrpcMethod('PostsService', 'GetPostById')
  async getPostById(
    request: PostIdRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<PostResponse> {
    try {
      const userId = this.getUserIdFromMetadata(metadata);
      const query = new GetPostByIdQuery(request.id, userId);
      const result: PostResponseDto = await this.queryBus.execute(query);
      return result as PostResponse; // Assuming DTO is compatible
    } catch (error) {
      this.handleError(error);
    }
  }

  @GrpcMethod('PostsService', 'UpdatePost')
  async updatePost(
    request: UpdatePostRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<PostResponse> {
    try {
      const userId = this.getUserIdFromMetadata(metadata);
      const command = new UpdatePostCommand(
        userId,
        request.id,
        request.textContent,
        request.mediaKeys,
      );
      const result: PostResponseDto = await this.commandBus.execute(command);
      return result as PostResponse; // Assuming DTO is compatible
    } catch (error) {
      this.handleError(error);
    }
  }

  @GrpcMethod('PostsService', 'DeletePost')
  async deletePost(
    request: PostIdRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<EmptyResponse> {
    try {
      const userId = this.getUserIdFromMetadata(metadata);
      const command = new DeletePostCommand(userId, request.id);
      await this.commandBus.execute(command);
      return {};
    } catch (error) {
      this.handleError(error);
    }
  }

  @GrpcMethod('PostsService', 'GetPostsByAuthorId')
  async getPostsByAuthorId(
    request: GetPostsByAuthorIdRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<PostsListResponse> {
    try {
      const viewerId = this.getUserIdFromMetadata(metadata);
      const query = new GetPostsByAuthorIdQuery(
        request.authorId,
        viewerId,
        request.page,
        request.limit,
      );
      const results: PostResponseDto[] = await this.queryBus.execute(query);
      return { posts: results as PostResponse[] };
    } catch (error) {
      this.handleError(error);
    }
  }

  @GrpcMethod('PostsService', 'ReportPost')
  async reportPost(
    request: ReportPostRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<EmptyResponse> {
    try {
      const reporterId = this.getUserIdFromMetadata(metadata);
      const command = new ReportPostCommand(request.postId, reporterId, request.reason);
      await this.commandBus.execute(command);
      return {};
    } catch (error) {
      this.handleError(error);
    }
  }
  
  // Admin-specific method, authorization guard should check for admin role
  @GrpcMethod('PostsService', 'DeletePostAsAdmin')
  async deletePostAsAdmin(
    request: AdminDeletePostRequest,
    @GrpcMetadata() metadata: Metadata,
  ): Promise<EmptyResponse> {
    try {
      const adminId = this.getUserIdFromMetadata(metadata); // Guard should verify this user is an admin
      const command = new AdminDeletePostCommand(request.postId, adminId);
      await this.commandBus.execute(command);
      return {};
    } catch (error) {
      this.handleError(error);
    }
  }
}