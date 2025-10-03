import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { IMessageRepository } from '../repositories/message.repository.interface';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { ConnectionManagerService } from './connection-manager.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { Message, MessageStatus } from '@prisma/client';
import { MessagingGateway } from '../gateways/messaging.gateway';
import { GetHistoryDto } from '../dtos/get-history.dto';

/**
 * @class MessagingService
 * @description Service containing the core business logic for creating and retrieving
 * conversations and messages, and for orchestrating real-time events.
 * @requires REQ-1-026, REQ-1-027, REQ-1-028
 */
@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    private readonly connectionManager: ConnectionManagerService,
    @Inject(forwardRef(() => MessagingGateway))
    private readonly messagingGateway: MessagingGateway,
  ) {}

  /**
   * Finds an existing conversation between two users or creates a new one.
   * @param userOneId - The ID of the first user.
   * @param userTwoId - The ID of the second user.
   * @returns The existing or newly created conversation.
   */
  async findOrCreateConversation(userOneId: string, userTwoId: string) {
    let conversation = await this.conversationRepository.findByParticipants(
      userOneId,
      userTwoId,
    );

    if (!conversation) {
      this.logger.log(`Creating new conversation between ${userOneId} and ${userTwoId}`);
      conversation = await this.conversationRepository.create([
        userOneId,
        userTwoId,
      ]);
    }

    return conversation;
  }

  /**
   * Creates a new message, persists it, and broadcasts it to the recipient in real-time.
   * @param senderId - The ID of the user sending the message.
   * @param data - The message data transfer object.
   * @returns The created message entity.
   */
  async createMessage(
    senderId: string,
    data: SendMessageDto,
  ): Promise<Message> {
    const { conversationId, content } = data;

    // The guard has already authorized this, but an extra check is good practice.
    const participants = await this.conversationRepository.findParticipants(
      conversationId,
    );
    const isParticipant = participants.some((p) => p.userId === senderId);

    if (!isParticipant) {
      this.logger.error(`User ${senderId} attempted to send message to conversation ${conversationId} without being a participant.`);
      throw new ForbiddenException('You are not a participant of this conversation.');
    }
    
    const recipient = participants.find((p) => p.userId !== senderId);
    if (!recipient) {
        this.logger.error(`Could not find recipient in conversation ${conversationId}.`);
        throw new NotFoundException('Recipient not found in conversation.');
    }

    const createdMessage = await this.messageRepository.create({
      authorId: senderId,
      conversationId,
      content,
    });

    this.logger.log(`Message ${createdMessage.id} created by ${senderId} in conversation ${conversationId}`);

    // Broadcast to recipient
    const recipientSocketIds = await this.connectionManager.getSocketIdsForUser(
      recipient.userId,
    );
    if (recipientSocketIds.length > 0) {
      this.logger.debug(`Broadcasting 'newMessage' to recipient ${recipient.userId} on sockets: ${recipientSocketIds.join(', ')}`);
      this.messagingGateway.server
        .to(recipientSocketIds)
        .emit('newMessage', createdMessage);
    } else {
        this.logger.log(`Recipient ${recipient.userId} is offline. Message will be delivered on next connection.`);
    }

    return createdMessage;
  }

  /**
   * Retrieves a paginated history of messages for a given conversation.
   * @param userId - The ID of the user requesting the history (for authorization).
   * @param getHistoryDto - DTO containing conversationId and pagination options.
   * @returns A list of message entities.
   */
  async getMessageHistory(
    userId: string,
    getHistoryDto: GetHistoryDto,
  ): Promise<Message[]> {
    const { conversationId, cursor, limit } = getHistoryDto;
    
    const isParticipant = await this.conversationRepository.isUserParticipant(
        userId,
        conversationId,
      );
  
    if (!isParticipant) {
      this.logger.warn(`User ${userId} attempted to access message history for conversation ${conversationId} without authorization.`);
      throw new ForbiddenException('Access to this conversation is denied.');
    }

    this.logger.debug(`Fetching message history for conversation ${conversationId} for user ${userId}`);
    return this.messageRepository.findManyByConversation(conversationId, {
      cursor,
      limit,
    });
  }

  /**
   * Broadcasts a 'typing' event to the other participant in a conversation.
   * @param userId - The ID of the user who is typing.
   * @param conversationId - The ID of the conversation.
   * @param isTyping - Boolean indicating if the user is starting or stopping typing.
   */
  async broadcastTypingEvent(
    userId: string,
    conversationId: string,
    isTyping: boolean,
  ): Promise<void> {
    const participants = await this.conversationRepository.findParticipants(conversationId);
    const recipient = participants.find((p) => p.userId !== userId);
  
    if (!recipient) return;
  
    const recipientSocketIds = await this.connectionManager.getSocketIdsForUser(recipient.userId);
  
    if (recipientSocketIds.length > 0) {
      this.messagingGateway.server.to(recipientSocketIds).emit('typing', {
        conversationId,
        userId,
        isTyping,
      });
    }
  }

  /**
   * Updates the status of one or more messages to 'READ' and notifies the sender.
   * @param readerId - The ID of the user who read the messages.
   * @param conversationId - The ID of the conversation.
   * @param messageIds - An array of message IDs to mark as read.
   */
  async markMessagesAsRead(
    readerId: string,
    conversationId: string,
    messageIds: string[],
  ): Promise<void> {
    const isParticipant = await this.conversationRepository.isUserParticipant(readerId, conversationId);
    if (!isParticipant) {
      this.logger.warn(`User ${readerId} attempted to mark messages as read in conversation ${conversationId} without being a participant.`);
      throw new WsException('Forbidden: You are not a participant of this conversation.');
    }
  
    const updatedMessages = await this.messageRepository.updateStatus(messageIds, MessageStatus.READ, readerId);
    if (updatedMessages.count === 0) return;
  
    // Assuming messages in a conversation have one other participant to notify
    const participants = await this.conversationRepository.findParticipants(conversationId);
    const sender = participants.find((p) => p.userId !== readerId);
  
    if (sender) {
      const senderSocketIds = await this.connectionManager.getSocketIdsForUser(sender.userId);
      if (senderSocketIds.length > 0) {
        this.logger.debug(`Notifying sender ${sender.userId} that messages have been read.`);
        this.messagingGateway.server.to(senderSocketIds).emit('messagesRead', {
          conversationId,
          messageIds,
        });
      }
    }
  }

  /**
   * Updates message statuses to 'DELIVERED' when a user connects.
   * This would typically be called from the gateway's onConnect handler.
   * @param userId The ID of the user who has just connected.
   */
  async deliverPendingMessages(userId: string): Promise<void> {
      const undeliveredMessages = await this.messageRepository.findUndeliveredForUser(userId);
      if (undeliveredMessages.length === 0) {
          return;
      }

      const messageIds = undeliveredMessages.map(m => m.id);
      await this.messageRepository.updateStatus(messageIds, MessageStatus.DELIVERED);

      this.logger.log(`Marked ${messageIds.length} messages as DELIVERED for user ${userId}`);

      // Notify the senders that their messages were delivered
      const notifications = new Map<string, { conversationId: string, messageIds: string[] }>();
      for (const message of undeliveredMessages) {
          if (!notifications.has(message.authorId)) {
              notifications.set(message.authorId, { conversationId: message.conversationId, messageIds: [] });
          }
          notifications.get(message.authorId).messageIds.push(message.id);
      }

      for (const [senderId, data] of notifications.entries()) {
          const senderSocketIds = await this.connectionManager.getSocketIdsForUser(senderId);
          if (senderSocketIds.length > 0) {
              this.messagingGateway.server.to(senderSocketIds).emit('messagesDelivered', data);
          }
      }
  }
}