import { User } from '../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

/**
 * Defines the contract (port) for data persistence operations related to the User aggregate.
 * This allows the domain layer to be independent of the data storage technology (e.g., Prisma).
 */
export interface IUserRepository {
  /**
   * Finds a single user by their unique identifier.
   * @param id The unique ID of the user.
   * @returns A promise that resolves to the User entity or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a single user by their email address.
   * @param email The unique email of the user.
   * @returns A promise that resolves to the User entity or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Adds a new user to the repository.
   * @param user The User domain entity to add.
   * @returns A promise that resolves when the operation is complete.
   */
  add(user: User): Promise<void>;

  /**
   * Updates an existing user in the repository.
   * @param user The User domain entity with updated state to persist.
   * @returns A promise that resolves when the operation is complete.
   */
  update(user: User): Promise<void>;
}