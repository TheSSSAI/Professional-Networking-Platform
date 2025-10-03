import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { IPostRepository } from '../../../domain/interfaces/post.repository.interface';
import { IEventPublisherPort } from '../../../domain/interfaces/event-publisher.port.interface';
import { PostMapper } from '../../mappers/post.mapper';
import { PostAggregate } from '../../../domain/post.aggregate';
import { PostResponseDto } from '../../dtos/post.response.dto';
import { LinkPreviewFetcherService } from '../../../domain/services/link-preview-fetcher.service';
import { PostMedia } from '../../../domain/post-media.entity';
import { LinkPreview } from '../../../domain/link-preview.value-object';
import { randomUUID } from 'crypto';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  private readonly logger = new Logger(CreatePostHandler.name);

  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IEventPublisherPort')
    private readonly eventPublisher: IEventPublisherPort,
    private readonly linkPreviewFetcher: LinkPreviewFetcherService,
    private readonly postMapper: PostMapper,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostResponseDto> {
    this.logger.log(`Processing CreatePostCommand for author: ${command.authorId}`);

    const { authorId, textContent, mediaKeys } = command;

    try {
      const urlInText = this.extractUrl(textContent);
      let linkPreview: LinkPreview | null = null;

      if (urlInText) {
        this.logger.log(`Found URL in post, fetching preview for: ${urlInText}`);
        const previewData = await this.linkPreviewFetcher.fetchPreview(urlInText);
        if (previewData) {
          linkPreview = new LinkPreview(previewData);
        }
      }

      const mediaEntities = (mediaKeys || []).map(
        (key, index) =>
          new PostMedia({
            id: randomUUID(),
            s3ObjectKey: key.key,
            mediaType: key.type,
            order: index,
          }),
      );

      const postAggregate = PostAggregate.create({
        authorId,
        text: textContent,
        media: mediaEntities,
        linkPreview: linkPreview ?? undefined,
      });

      await this.postRepository.save(postAggregate);

      // Publish domain events
      const events = postAggregate.getUncommittedEvents();
      await Promise.all(
        events.map((event) => this.eventPublisher.publish(event)),
      );
      postAggregate.commit();

      this.logger.log(`Successfully created post with ID: ${postAggregate.id}`);
      return this.postMapper.toResponse(postAggregate);
    } catch (error) {
      this.logger.error(`Failed to execute CreatePostCommand for author ${authorId}: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create post.');
    }
  }

  private extractUrl(text: string): string | null {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  }
}