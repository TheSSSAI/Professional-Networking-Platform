import { ConnectionAggregate } from '../connection.aggregate';
import { ConnectionStatus } from '../connection-status.enum';

export interface FindAcceptedForUserOptions {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
}

/**
 * Defines the contract (port) for persistence operations related to the Connection aggregate.
 * This interface abstracts the database, allowing the domain and application layers
 * to remain ignorant of the specific persistence technology (e.g., Prisma, TypeORM).
 */
export interface IConnectionRepository {
  /**
   * Persists a Connection aggregate to the data store.
   * This can be used for both creating new connections and updating existing ones.
   * @param connection The ConnectionAggregate instance to save.
   * @returns A Promise that resolves when the operation is complete.
   */
  save(connection: ConnectionAggregate): Promise<void>;

  /**
   * Finds a Connection aggregate by its unique identifier.
   * @param id The UUID of the connection.
   * @returns A Promise that resolves to the ConnectionAggregate instance or null if not found.
   */
  findById(id: string): Promise<ConnectionAggregate | null>;

  /**
   * Finds an existing connection between two users, regardless of direction or status.
   * @param userIdA The ID of the first user.
   * @param userIdB The ID of the second user.
   * @returns A Promise that resolves to the ConnectionAggregate instance or null if no connection exists.
   */
  findByUsers(
    userIdA: string,
    userIdB: string,
  ): Promise<ConnectionAggregate | null>;

  /**
   * Finds a pending connection request between two users, regardless of direction.
   * Used to prevent duplicate requests as per REQ-1-090.
   * @param userIdA The ID of the first user.
   * @param userIdB The ID of the second user.
   * @returns A Promise that resolves to the ConnectionAggregate instance or null if no pending request exists.
   */
  findPendingByUsers(
    userIdA: string,
    userIdB: string,
  ): Promise<ConnectionAggregate | null>;

  /**
   * Retrieves all pending incoming connection requests for a specific user.
   * Fulfills REQ-1-016.
   * @param addresseeId The ID of the user who received the requests.
   * @returns A Promise that resolves to an array of ConnectionAggregate instances.
   */
  findPendingForUser(addresseeId: string): Promise<ConnectionAggregate[]>;

  /**
   * Retrieves a paginated and sorted list of accepted connections for a specific user.
   * Fulfills REQ-1-017.
   * @param userId The ID of the user whose connections are being retrieved.
   * @param options Pagination and sorting options.
   * @returns A Promise that resolves to an array of ConnectionAggregate instances.
   */
  findAcceptedForUser(
    userId: string,
    options: FindAcceptedForUserOptions,
  ): Promise<{ connections: ConnectionAggregate[]; total: number }>;

  /**
   * Permanently deletes a connection by its unique identifier.
   * Fulfills REQ-1-018.
   * @param id The UUID of the connection to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;

  /**
   * Finds a specific pending request by requester and addressee.
   * @param requesterId The user who sent the request.
   * @param addresseeId The user who should receive the request.
   * @returns A Promise resolving to the ConnectionAggregate or null.
   */
  findPendingRequest(
    requesterId: string,
    addresseeId: string,
  ): Promise<ConnectionAggregate | null>;

  /**
   * Retrieves all accepted connection IDs for a user.
   * Used for populating the cache on a cache miss.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to an array of connection user IDs.
   */
  getAcceptedConnectionIds(userId: string): Promise<string[]>;
}