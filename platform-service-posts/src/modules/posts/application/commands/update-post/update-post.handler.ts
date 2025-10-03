import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './update-post.command';
import { IPostRepository } from '../../../domain/interfaces/post.repository.interface';
import { IEventPublisherPort } from '../../../domain/interfaces/event-publisher.port.interface';
import { PostMapper } from '../../mappers/post.mapper';
import { PostResponseDto } from '../../dtos/post.response.dto';
import { LinkPreviewFetcherService } from '../../../domain/services/link-preview-fetcher.service';
import { LinkPreview } from '../../../domain/link-preview.value-object';

@Injectable()
@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  private readonly logger = new Logger(UpdatePostHandler.name);

  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IEventPublisherPort')
    private readonly eventPublisher: IEventPublisherPort,
    private readonly linkPreviewFetcher: LinkPreviewFetcherService,
    private readonly postMapper: PostMapper,
  ) {}

  async execute(command: UpdatePostCommand): Promise<PostResponseDto> {
    this.logger.log(
      `Processing UpdatePostCommand for post ID: ${command.postId} by user: ${command.userId}`,
    );

    try {
      const postAggregate = await this.postRepository.findById(command.postId);

      if (!postAggregate) {
        throw new NotFoundException(`Post with ID ${command.postId} not found.`);
      }

      // Authorization check
      if (!postAggregate.isOwnedBy(command.userId)) {
        throw new ForbiddenException('User is not authorized to update this post.');
      }
      
      const originalText = postAggregate.getProps().text;
      const newText = command.textContent;

      if(newText !== undefined && newText !== originalText) {
          postAggregate.updateText(newText);
          const newUrlInText = this.extractUrl(newText);
          const oldUrlInText = this.extractUrl(originalText);

          if (newUrlInText !== oldUrlInText) {
             this.logger.log(`URL changed in post ${command.postId}, updating link preview.`);
             let newLinkPreview: LinkPreview | null = null;
             if (newUrlInText) {
                 const previewData = await this.linkPreviewFetcher.fetchPreview(newUrlInText);
                 if (previewData) {
                    newLinkPreview = new LinkPreview(previewData);
                 }
             }
             postAggregate.updateLinkPreview(newLinkPreview);
          }
      }
      
      // Note: Media update logic is complex and could be its own command.
      // For this implementation, we assume only text content can be updated as per REQ-1-024.
      // A full implementation would handle `mediaKeysToAdd` and `mediaIdsToRemove`.
      
      postAggregate.markAsUpdated();

      await this.postRepository.save(postAggregate);

      // Publish domain events if any were added
      const events = postAggregate.getUncommittedEvents();
      await Promise.all(
        events.map((event) => this.eventPublisher.publish(event)),
      );
      postAggregate.commit();

      this.logger.log(`Successfully updated post with ID: ${command.postId}`);
      return this.postMapper.toResponse(postAggregate);
    } catch (error) {
      this.logger.error(
        `Failed to execute UpdatePostCommand for post ${command.postId}: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update post.');
    }
  }

  private extractUrl(text: string): string | null {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  }
}