import {
  Conversation as PrismaConversation,
  Message as PrismaMessage,
  User as PrismaUser,
} from '@prisma/client';

// Re-exporting Prisma types for convenience or defining custom application-level entities.
// For now, we can use Prisma's generated types.
export type Message = PrismaMessage;
export type Conversation = PrismaConversation;
export type User = PrismaUser;

export interface CreateMessageData {
  content: string;
  authorId: string;
  conversationId: string;
}

export interface FindManyByConversationParams {
  conversationId: string;
  take: number;
  cursor?: string;
}

export interface UpdateMessageStatusData {
  messageIds: string[];
  status: 'delivered' | 'read';
}

export const IMessageRepository = 'IMessageRepository';

/**
 * Defines the contract for the message repository.
 * This interface decouples the application's business logic from the
 * specific data access implementation (e.g., Prisma).
 */
export interface IMessageRepository {
  /**
   * Creates a new message in the data store.
   * @param data - The data required to create a message.
   * @returns A Promise that resolves to the newly created message.
   */
  create(data: CreateMessageData): Promise<Message>;

  /**
   * Finds a paginated list of messages for a given conversation, ordered
   * from newest to oldest.
   * @param params - Parameters for finding messages, including pagination.
   * @returns A Promise that resolves to an array of messages.
   */
  findManyByConversation(params: FindManyByConversationParams): Promise<Message[]>;

  /**
   * Updates the status of one or more messages.
   * @param data - The IDs of the messages to update and the new status.
   * @returns A Promise that resolves to the number of updated records.
   */
  updateStatuses(data: UpdateMessageStatusData): Promise<{ count: number }>;
}