import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command';
import { IPostRepository } from '../../../domain/interfaces/post.repository.interface';
import { IEventPublisherPort } from '../../../domain/interfaces/event-publisher.port.interface';

@Injectable()
@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  private readonly logger = new Logger(DeletePostHandler.name);

  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IEventPublisherPort')
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    this.logger.log(
      `Processing DeletePostCommand for post ID: ${command.postId} by user: ${command.userId}`,
    );

    try {
      const postAggregate = await this.postRepository.findById(command.postId);

      if (!postAggregate) {
        throw new NotFoundException(`Post with ID ${command.postId} not found.`);
      }

      // Authorization check
      if (!postAggregate.isOwnedBy(command.userId)) {
        throw new ForbiddenException('User is not authorized to delete this post.');
      }

      // The aggregate can prepare for deletion, like adding a domain event
      postAggregate.delete();

      await this.postRepository.delete(postAggregate.id);

      // Publish domain events for downstream cleanup (e.g., S3, Search, Engagement)
      const events = postAggregate.getUncommittedEvents();
      await Promise.all(
        events.map((event) => this.eventPublisher.publish(event)),
      );
      postAggregate.commit();

      this.logger.log(`Successfully deleted post with ID: ${command.postId}`);
    } catch (error) {
      this.logger.error(
        `Failed to execute DeletePostCommand for post ${command.postId}: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete post.');
    }
  }
}