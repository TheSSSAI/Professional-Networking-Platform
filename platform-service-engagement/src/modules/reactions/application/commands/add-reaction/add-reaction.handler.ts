import {
    CommandHandler,
    ICommandHandler,
    EventBus,
  } from '@nestjs/cqrs';
  import { Inject, Logger } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  import { IReactionsRepository } from '../../../domain/i-reactions.repository';
  import { PostReactedEvent } from '../../../domain/events/post-reacted.event';
  import { AddReactionDto } from '../../dtos/add-reaction.dto';
  
  // This would typically be in a shared kernel or a dedicated infrastructure module for external service integrations.
  // For this file, we define the interface here to satisfy dependency injection.
  export const POSTS_VALIDATOR_TOKEN = 'POSTS_VALIDATOR_TOKEN';
  export interface IPostsValidator {
    validatePostExists(postId: string): Promise<{ exists: boolean; authorId: string }>;
  }
  
  export class AddReactionCommand {
    constructor(
      public readonly dto: AddReactionDto,
      public readonly reactorId: string,
    ) {}
  }
  
  @CommandHandler(AddReactionCommand)
  export class AddReactionHandler
    implements ICommandHandler<AddReactionCommand, void>
  {
    private readonly logger = new Logger(AddReactionHandler.name);
  
    constructor(
      @Inject('IReactionsRepository')
      private readonly reactionsRepository: IReactionsRepository,
      @Inject(POSTS_VALIDATOR_TOKEN)
      private readonly postsValidator: IPostsValidator,
      private readonly eventBus: EventBus,
    ) {}
  
    async execute(command: AddReactionCommand): Promise<void> {
      this.logger.log(
        `Executing AddReactionCommand for post ${command.dto.postId} by user ${command.reactorId}`,
      );
  
      const { postId, reactionType } = command.dto;
      const { reactorId } = command;
  
      try {
        const validationResult = await this.postsValidator.validatePostExists(
          postId,
        );
        if (!validationResult.exists) {
          throw new RpcException('Post not found.');
        }

        // The business rule "one reaction per user per post" is handled by the repository's upsert logic,
        // which is backed by a unique constraint in the database.
        await this.reactionsRepository.upsert({
            userId: reactorId,
            postId,
            reactionType
        });
  
        // Publish event for downstream services (e.g., Notifications)
        this.eventBus.publish(
          new PostReactedEvent(
            postId,
            validationResult.authorId, // postAuthorId
            reactorId,
            reactionType
          ),
        );
        
        this.logger.log(`Successfully processed reaction for post ${postId} by user ${reactorId}`);

      } catch (error) {
        this.logger.error(
          `Failed to execute AddReactionCommand for post ${command.dto.postId}. Error: ${error.message}`,
          error.stack,
        );
        if (error instanceof RpcException) {
          throw error;
        }
        throw new RpcException('An unexpected error occurred while adding the reaction.');
      }
    }
  }