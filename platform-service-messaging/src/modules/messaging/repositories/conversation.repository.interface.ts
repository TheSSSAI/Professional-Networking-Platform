import { Conversation, Participant } from '@prisma/client';

export { Conversation, Participant };

/**
 * Interface for the Conversation Repository, defining the contract for data access
 * operations related to conversations.
 * Fulfills data access contract for REQ-1-026 and REQ-1-029.
 */
export interface IConversationRepository {
  /**
   * Creates a new conversation with a set of participants.
   * @param participantUserIds - An array of user IDs to include in the conversation.
   * @returns The newly created conversation entity.
   */
  create(participantUserIds: string[]): Promise<Conversation>;

  /**
   * Finds a conversation by its unique identifier.
   * @param id - The ID of the conversation.
   * @returns The conversation entity including its participants, or null if not found.
   */
  findById(id: string): Promise<(Conversation & { participants: Participant[] }) | null>;

  /**
   * Finds an existing one-on-one conversation between two specific users.
   * @param userAId - The ID of the first user.
   * @param userBId - The ID of the second user.
   * @returns The conversation entity or null if no such conversation exists.
   */
  findConversationByParticipants(
    userAId: string,
    userBId: string,
  ): Promise<Conversation | null>;
  
  /**
   * Retrieves all conversations for a given user.
   * @param userId - The ID of the user.
   * @returns A list of conversation entities that the user is a part of.
   */
  findAllByUserId(userId: string): Promise<Conversation[]>;

   /**
   * Checks if a user is a participant in a specific conversation.
   * @param userId - The ID of the user.
   * @param conversationId - The ID of the conversation.
   * @returns True if the user is a participant, false otherwise.
   */
  isUserParticipant(userId: string, conversationId: string): Promise<boolean>;
}

export const CONVERSATION_REPOSITORY = 'IConversationRepository';