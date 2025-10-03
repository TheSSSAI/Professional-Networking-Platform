/**
 * Interface (Port) for the Connection Service.
 * This defines the contract that the Posts service's domain layer uses to interact
 * with the Connections microservice, abstracting away the gRPC implementation details.
 * It is essential for enforcing visibility rules on posts from private profiles.
 */
export abstract class IConnectionServicePort {
  /**
   * Checks if a bidirectional, first-degree connection exists between two users.
   * This method is critical for determining if a viewer has permission to see a
   * post from an author with a private profile.
   *
   * @param viewerId The ID of the user attempting to view the content.
   * @param authorId The ID of the content's author.
   * @returns A Promise that resolves to `true` if a connection exists, `false` otherwise.
   */
  abstract isConnected(viewerId: string, authorId: string): Promise<boolean>;
}