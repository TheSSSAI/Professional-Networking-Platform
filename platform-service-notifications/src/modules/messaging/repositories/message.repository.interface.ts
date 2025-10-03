import { Message } from '@prisma/client';
import { MessageStatus } from '../enums/message-status.enum';

/**
 * @file Defines the contract for the message repository.
 * @description This interface specifies the methods for data persistence
 * operations related to the Message entity, abstracting the data access layer
 * from the core business logic.
 * @namespace Platform.Services.Messaging
 */

/**
 * Represents the data required to create a new message.
 */
export interface CreateMessageData {
  content: string;
  authorId: string;
  conversationId: string;
}

/**
 * Represents the options for paginated queries.
 */
export interface PaginationOptions {
  /**
   * The cursor (ID of the last item from the previous page) to start fetching from.
   */
  cursor?: string;
  /**
   * The maximum number of items to return.
   */
  limit: number;
}

/**
 * Injection token for the message repository.
 * Used for dependency injection in the NestJS framework.
 */
export const MESSAGE_REPOSITORY = 'IMessageRepository';

/**
 * Interface for the message repository, defining data access methods for messages.
 */
export interface IMessageRepository {
  /**
   * Persists a new message to the database.
   * @param data - The data required to create the message.
   * @returns A promise that resolves to the newly created Message entity.
   * @throws Throws a database-level error if the creation fails.
   */
  create(data: CreateMessageData): Promise<Message>;

  /**
   * Retrieves a paginated list of messages for a specific conversation,
   * ordered from newest to oldest.
   * @param conversationId - The ID of the conversation to fetch messages for.
   * @param pagination - The pagination options, including cursor and limit.
   * @returns A promise that resolves to an array of Message entities.
   * @throws Throws a database-level error if the query fails.
   */
  findPaginatedByConversationId(
    conversationId: string,
    pagination: PaginationOptions,
  ): Promise<Message[]>;

  /**
   * Updates the status of one or more messages in a single operation.
   * @param messageIds - An array of message IDs to update.
   * @param status - The new status to apply to the messages.
   * @returns A promise that resolves when the update is complete.
   * @throws Throws a database-level error if the update fails.
   */
  updateStatus(messageIds: string[], status: MessageStatus): Promise<void>;

  /**
   * Finds a message by its unique identifier.
   * @param id - The ID of the message to find.
   * @returns A promise that resolves to the Message entity or null if not found.
   */
  findById(id: string): Promise<Message | null>;
}