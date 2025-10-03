import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IMessageRepository } from '../repositories/message.repository.interface';
import { IConversationRepository } from '../repositories/conversation.repository.interface';
import { ConnectionManagerService } from './connection-manager.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { Server } from 'socket.io';
import { MessageStatus } from '../enums/message-status.enum';
import { Message, User } from '@prisma/client';

@Injectable()
export class MessagingService {
  private server: Server;
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    private readonly connectionManager: ConnectionManagerService,
  ) {}

  /**
   * Sets the Socket.IO server instance.
   * This is called by the MessagingGateway after it initializes,
   * breaking the circular dependency while allowing the service to emit events.
   * @param server The Socket.IO server instance.
   */
  setServer(server: Server) {
    this.server = server;
    this.logger.log('Socket.IO Server instance has been set.');
  }

  /**
   * Persists a new message and broadcasts it to the recipient(s).
   * Implements core logic for REQ-1-026 and REQ-1-027.
   * @param sender The authenticated user sending the message.
   * @param data The message payload.
   * @returns The newly created message entity.
   */
  async sendMessage(sender: User, data: SendMessageDto): Promise<Message> {
    const { conversationId, content } = data;

    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    if (!conversation.participants.some((p) => p.id === sender.id)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation.',
      );
    }

    const createdMessage = await this.messageRepository.create({
      content,
      authorId: sender.id,
      conversationId,
    });

    const recipients = conversation.participants.filter(
      (p) => p.id !== sender.id,
    );

    for (const recipient of recipients) {
      // Emitting to a room named after the user ID ensures all their connected clients get the message.
      this.server.to(recipient.id).emit('newMessage', createdMessage);
      this.logger.log(
        `Emitted 'newMessage' (ID: ${createdMessage.id}) to user ${recipient.id}`,
      );
    }

    return createdMessage;
  }

  /**
   * Retrieves a paginated history of messages for a given conversation.
   * Implements core logic for REQ-1-028.
   * @param userId The ID of the user requesting the history.
   * @param conversationId The ID of the conversation.
   * @param pagination Pagination options (cursor, limit).
   * @returns A paginated list of messages.
   */
  async getMessageHistory(
    userId: string,
    conversationId: string,
    pagination: { cursor?: string; limit: number },
  ): Promise<Message[]> {
    const isParticipant = await this.conversationRepository.isUserParticipant(
      userId,
      conversationId,
    );

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to view this conversation.',
      );
    }

    return this.messageRepository.findPaginatedByConversationId(
      conversationId,
      pagination,
    );
  }

  /**
   * Handles the 'typing' event from a user.
   * Broadcasts the event to other participants in the conversation.
   * Implements a part of REQ-1-027.
   * @param typingUser The user who is typing.
   * @param conversationId The ID of the conversation.
   */
  async handleTypingEvent(typingUser: User, conversationId: string) {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      this.logger.warn(
        `Received typing event for non-existent conversation: ${conversationId}`,
      );
      return;
    }

    const recipients = conversation.participants.filter(
      (p) => p.id !== typingUser.id,
    );

    const payload = {
      conversationId,
      userId: typingUser.id,
      userName: typingUser.name, // Assuming name is on the user object
    };

    for (const recipient of recipients) {
      this.server.to(recipient.id).emit('typing', payload);
    }
  }

  /**
   * Updates the status of messages (e.g., to 'delivered' or 'read').
   * Broadcasts the status update to the message sender.
   * Implements a part of REQ-1-027.
   * @param readerId The ID of the user who read the message.
   * @param conversationId The ID of the conversation.
   * @param messageIds The IDs of the messages to update.
   */
  async handleMarkAsRead(
    readerId: string,
    conversationId: string,
    messageIds: string[],
  ) {
    if (!messageIds || messageIds.length === 0) return;
    
    const messages = await this.messageRepository.findManyByIds(messageIds);
    if (messages.length === 0) return;

    // Filter to only update messages not authored by the reader and belonging to the conversation
    const messagesToUpdate = messages.filter(
      (m) => m.authorId !== readerId && m.conversationId === conversationId,
    );
    if (messagesToUpdate.length === 0) return;
    
    const idsToUpdate = messagesToUpdate.map(m => m.id);

    await this.messageRepository.updateStatus(idsToUpdate, MessageStatus.READ);
    this.logger.log(`Marked ${idsToUpdate.length} message(s) as READ for conversation ${conversationId}`);

    // Group messages by original author to send notifications
    const notifications = new Map<string, string[]>();
    for(const message of messagesToUpdate) {
        if (!notifications.has(message.authorId)) {
            notifications.set(message.authorId, []);
        }
        notifications.get(message.authorId).push(message.id);
    }

    // Broadcast status updates to each original author
    for(const [authorId, updatedIds] of notifications.entries()){
        const payload = {
            conversationId,
            messageIds: updatedIds,
            status: MessageStatus.READ,
            readBy: readerId
        };
        this.server.to(authorId).emit('messageStatusUpdate', payload);
        this.logger.log(`Emitted 'messageStatusUpdate' to author ${authorId} for ${updatedIds.length} message(s)`);
    }
  }
}