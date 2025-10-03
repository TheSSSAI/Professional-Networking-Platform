export const IHashingService = Symbol('IHashingService');

/**
 * Defines the contract for a password hashing and comparison service.
 * This abstracts the underlying hashing algorithm (e.g., bcrypt).
 */
export interface IHashingService {
  /**
   * Hashes a plaintext string.
   * @param data The plaintext string to hash.
   * @returns A promise that resolves to the hashed string.
   */
  hash(data: string): Promise<string>;

  /**
   * Compares a plaintext string against a hash.
   * @param data The plaintext string to compare.
   * @param encrypted The hash to compare against.
   * @returns A promise that resolves to true if they match, false otherwise.
   */
  compare(data: string, encrypted: string): Promise<boolean>;
}