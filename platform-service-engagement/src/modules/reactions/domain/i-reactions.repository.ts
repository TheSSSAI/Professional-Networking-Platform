import { PostReaction } from './post-reaction.entity';

/**
 * An injection token for the reactions repository interface.
 * This allows for dependency injection of the repository without coupling to a specific implementation.
 */
export const IReactionsRepository = Symbol('IReactionsRepository');

/**
 * Interface for the post reactions repository.
 * Defines the contract for data access operations related to post reactions.
 * This is the Port in a Ports and Adapters architecture.
 */
export interface IReactionsRepository {
  /**
   * Creates a new reaction or updates an existing one for a specific user and post.
   * This implements the business rule that a user can only have one reaction per post.
   * @param reaction The PostReaction entity to create or update.
   * @returns A promise that resolves to the created or updated PostReaction entity.
   */
  upsert(reaction: PostReaction): Promise<PostReaction>;

  /**
   * Finds an existing reaction by the user and post it is associated with.
   * @param userId The unique identifier of the user.
   * @param postId The unique identifier of the post.
   * @returns A promise that resolves to the PostReaction entity if it exists, otherwise null.
   */
  findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostReaction | null>;

  /**
   * Deletes a reaction for a specific user and post.
   * This is used when a user "un-reacts" to a post.
   * @param userId The unique identifier of the user whose reaction is to be deleted.
   * @param postId The unique identifier of the post from which the reaction is to be removed.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(userId: string, postId: string): Promise<void>;
}