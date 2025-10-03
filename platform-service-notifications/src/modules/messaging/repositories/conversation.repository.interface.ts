import { Conversation } from '@prisma/client';

/**
 * @file Defines the contract for the conversation repository.
 * @description This interface specifies the methods for data persistence
 * operations related to the Conversation entity, abstracting the data access layer
 * from the core business logic.
 * @namespace Platform.Services.Messaging
 */

/**
 * Injection token for the conversation repository.
 * Used for dependency injection in the NestJS framework.
 */
export const CONVERSATION_REPOSITORY = 'IConversationRepository';

/**
 * Interface for the conversation repository, defining data access methods for conversations.
 */
export interface IConversationRepository {
  /**
   * Finds a conversation by its unique identifier, including its participants.
   * @param id - The ID of the conversation to find.
   * @returns A promise that resolves to the Conversation entity with participants, or null if not found.
   */
  findById(id: string): Promise<(Conversation & { participants: { id: string }[] }) | null>;

  /**
   * Finds an existing one-on-one conversation between two specific users.
   * @param participantIds - An array containing the two user IDs of the participants.
   * @returns A promise that resolves to the Conversation entity or null if no such conversation exists.
   */
  findByParticipants(participantIds: [string, string]): Promise<Conversation | null>;

  /**
   * Finds an existing one-on-one conversation between two participants, or creates a new one if it doesn't exist.
   * This operation should be atomic.
   * @param participantIds - An array containing the two user IDs of the participants.
   * @returns A promise that resolves to the existing or newly created Conversation entity.
   */
  findOrCreate(participantIds: [string, string]): Promise<Conversation>;

  /**
   * Retrieves a paginated list of conversations for a specific user.
   * @param userId - The ID of the user whose conversations are to be fetched.
   * @param pagination - The pagination options, including cursor and limit.
   * @returns A promise that resolves to an array of Conversation entities.
   */
  findConversationsByUserId(
    userId: string,
    pagination: { cursor?: string; limit: number },
  ): Promise<Conversation[]>;
}