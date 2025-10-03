import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostByIdQuery } from './get-post-by-id.query';
import { IPostRepository } from '../../../domain/interfaces/post.repository.interface';
import { PostMapper } from '../../mappers/post.mapper';
import { IProfileServicePort } from '../../../domain/interfaces/profile.service.port.interface';
import { IConnectionServicePort } from '../../../domain/interfaces/connection.service.port.interface';
import { PostResponseDto } from '../../dtos/post.response.dto';

@Injectable()
@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  private readonly logger = new Logger(GetPostByIdHandler.name);

  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IProfileServicePort')
    private readonly profileService: IProfileServicePort,
    @Inject('IConnectionServicePort')
    private readonly connectionService: IConnectionServicePort,
    private readonly postMapper: PostMapper,
  ) {}

  async execute(query: GetPostByIdQuery): Promise<PostResponseDto> {
    this.logger.log(
      `Processing GetPostByIdQuery for post ID: ${query.postId} by viewer: ${query.viewerId}`,
    );

    try {
      const postAggregate = await this.postRepository.findById(query.postId);

      if (!postAggregate) {
        throw new NotFoundException(`Post with ID ${query.postId} not found.`);
      }

      const postProps = postAggregate.getProps();

      // Rule: Owner can always view their own post.
      if (postProps.authorId === query.viewerId) {
        this.logger.log(`Viewer is owner. Access granted.`);
        return this.postMapper.toResponse(postAggregate);
      }

      // Fetch author's profile visibility
      const authorProfile = await this.profileService.getProfileVisibility(postProps.authorId);

      // Rule: Anyone can view a post if the author's profile is public.
      if (authorProfile.visibility === 'PUBLIC') {
        this.logger.log(`Author profile is public. Access granted.`);
        return this.postMapper.toResponse(postAggregate);
      }

      // Rule: If profile is private, only first-degree connections can view.
      if (authorProfile.visibility === 'PRIVATE') {
        this.logger.log(`Author profile is private. Checking connection status.`);
        const areConnected = await this.connectionService.isConnected({
          userIdA: query.viewerId,
          userIdB: postProps.authorId,
        });

        if (areConnected) {
          this.logger.log(`Viewer is a first-degree connection. Access granted.`);
          return this.postMapper.toResponse(postAggregate);
        }
      }

      // Default deny
      this.logger.warn(
        `Access denied for viewer ${query.viewerId} on post ${query.postId}.`,
      );
      throw new ForbiddenException('You do not have permission to view this post.');
    } catch (error) {
      this.logger.error(
        `Failed to execute GetPostByIdQuery for post ${query.postId}: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      // This could wrap gRPC communication errors.
      throw new InternalServerErrorException('Failed to retrieve post.');
    }
  }
}