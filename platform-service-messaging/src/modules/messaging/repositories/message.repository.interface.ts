import { Message, MessageStatus } from '@prisma/client';

export { Message, MessageStatus };

export interface CreateMessageData {
  content: string;
  authorId: string;
  conversationId: string;
}

export interface PaginationOptions {
  cursor?: string;
  limit: number;
}

/**
 * Interface for the Message Repository, defining the contract for data access operations
 * related to messages. This abstracts the persistence layer from the business logic.
 * Fulfills data access contract for REQ-1-028.
 */
export interface IMessageRepository {
  /**
   * Creates and persists a new message.
   * @param data - The data for the new message.
   * @returns The newly created message entity.
   */
  create(data: CreateMessageData): Promise<Message>;

  /**
   * Finds a message by its unique identifier.
   * @param id - The ID of the message.
   * @returns The message entity or null if not found.
   */
  findById(id: string): Promise<Message | null>;

  /**
   * Retrieves a paginated list of messages for a specific conversation,
   * sorted in reverse chronological order.
   * @param conversationId - The ID of the conversation.
   * @param options - Pagination options (cursor and limit).
   * @returns A list of message entities.
   */
  findManyByConversationId(
    conversationId: string,
    options: PaginationOptions,
  ): Promise<Message[]>;

  /**
   * Updates the status of one or more messages.
   * @param messageIds - An array of message IDs to update.
   * @param status - The new status to set for the messages.
   * @returns A count of the updated messages.
   */
  updateStatus(messageIds: string[], status: MessageStatus): Promise<{ count: number }>;
}

export const MESSAGE_REPOSITORY = 'IMessageRepository';