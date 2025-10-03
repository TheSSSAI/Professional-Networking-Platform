import { Comment } from './comment.entity';

/**
 * An injection token for the comments repository interface.
 * This allows for dependency injection of the repository without coupling to a specific implementation.
 */
export const ICommentsRepository = Symbol('ICommentsRepository');

/**
 * Interface for the comments repository.
 * Defines the contract for data access operations related to comments.
 * This is the Port in a Ports and Adapters architecture.
 */
export interface ICommentsRepository {
  /**
   * Creates a new comment in the data store.
   * @param comment The Comment entity to create.
   * @returns A promise that resolves to the newly created Comment entity.
   */
  create(comment: Comment): Promise<Comment>;

  /**
   * Finds a comment by its unique identifier.
   * @param commentId The unique identifier of the comment.
   * @returns A promise that resolves to the Comment entity if found, otherwise null.
   */
  findById(commentId: string): Promise<Comment | null>;

  /**
   * Updates the content of an existing comment.
   * This operation must be authorized by checking if the provided authorId matches the comment's author.
   * @param commentId The unique identifier of the comment to update.
   * @param authorId The unique identifier of the user attempting the update, for authorization.
   * @param content The new content for the comment.
   * @returns A promise that resolves to the updated Comment entity.
   * @throws {CommentNotFoundException} If the comment does not exist.
   * @throws {UnauthorizedException} If the authorId does not match the comment's author.
   */
  update(commentId: string, authorId: string, content: string): Promise<Comment>;

  /**
   * Deletes a comment from the data store.
   * This operation must be authorized by checking if the provided authorId matches the comment's author.
   * @param commentId The unique identifier of the comment to delete.
   * @param authorId The unique identifier of the user attempting the deletion, for authorization.
   * @returns A promise that resolves when the operation is complete.
   * @throws {CommentNotFoundException} If the comment does not exist.
   * @throws {UnauthorizedException} If the authorId does not match the comment's author.
   */
  delete(commentId: string, authorId: string): Promise<void>;
}