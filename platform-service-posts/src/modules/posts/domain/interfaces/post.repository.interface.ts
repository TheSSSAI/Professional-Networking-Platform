import { PostAggregate } from '../post.aggregate';

/**
 * Interface (Port) for the Post Repository.
 * This defines the contract for data persistence operations related to the Post aggregate.
 * It abstracts the database technology from the domain and application layers, allowing for
 * different persistence strategies (e.g., Prisma, TypeORM, in-memory for testing).
 */
export abstract class IPostRepository {
  /**
   * Persists a Post aggregate to the data store.
   * This method handles both creation of new posts and updates to existing ones.
   * The implementation must ensure that the entire aggregate, including its
   * child entities (media, link preview), is saved atomically.
   *
   * @param post The PostAggregate instance to be saved.
   * @returns A Promise that resolves when the operation is complete.
   */
  abstract save(post: PostAggregate): Promise<void>;

  /**
   * Retrieves a Post aggregate from the data store by its unique identifier.
   * The implementation should eagerly load all parts of the aggregate (e.g., media items)
   * to return a fully constituted aggregate root.
   *
   * @param id The unique ID of the post to retrieve.
   * @returns A Promise that resolves to the PostAggregate instance if found, otherwise `null`.
   */
  abstract findById(id: string): Promise<PostAggregate | null>;

  /**
   * Retrieves a paginated list of Post aggregates for a specific author.
   * This is used for displaying posts on a user's profile page.
   *
   * @param authorId The ID of the author whose posts are to be retrieved.
   * @param page The page number for pagination.
   * @param limit The number of items per page.
   * @returns A Promise that resolves to an array of PostAggregate instances.
   */
  abstract findByAuthorId(
    authorId: string,
    page: number,
    limit: number,
  ): Promise<PostAggregate[]>;

  /**
   * Permanently deletes a Post from the data store by its unique identifier.
   * The implementation should ensure that this operation is authorized, typically
   * by checking ownership within the use case before calling this method.
   *
   * @param id The unique ID of the post to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  abstract delete(id: string): Promise<void>;
}