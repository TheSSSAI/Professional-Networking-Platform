import { IUserRepository } from './user.repository.interface';

export const IUnitOfWork = Symbol('IUnitOfWork');

/**
 * Defines the contract for the Unit of Work pattern.
 * This ensures that a series of operations are executed in a single atomic transaction.
 */
export interface IUnitOfWork {
  /**
   * Provides access to the user repository within the transaction's context.
   */
  readonly userRepository: IUserRepository;

  /**
   * Begins a new database transaction.
   */
  startTransaction(): Promise<void>;

  /**
   * Commits the current active transaction.
   */
  commitTransaction(): Promise<void>;

  /**
   * Rolls back the current active transaction.
   */
  rollbackTransaction(): Promise<void>;

  /**
   * Executes a block of code within a transaction.
   * Automatically commits on success or rolls back on failure.
   * @param work The function to execute within the transaction.
   */
  execute<T>(work: () => Promise<T>): Promise<T>;
}