import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Message } from '@prisma/client';
import { ConnectionsClientService } from '../../../shared/grpc-clients/connections/connections-client.service';
import { GetHistoryDto } from '../dtos/get-history.dto';
import { SendMessageDto } from '../dtos/send-message.dto';
import { MessagingGateway } from '../gateways/messaging.gateway';
import { IMessageRepository } from '../interfaces/message.repository.interface';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject(forwardRef(() => MessagingGateway))
    private readonly messagingGateway: MessagingGateway,
    private readonly connectionsClientService: ConnectionsClientService,
  ) {}

  /**
   * Persists a message and broadcasts it to the recipient.
   * Enforces business rule that only first-degree connections can communicate.
   * @param senderId - The ID of the user sending the message.
   * @param sendMessageDto - The DTO containing message details.
   * @returns The created message entity.
   * @throws ForbiddenException if users are not connected or sender is not in conversation.
   * @throws NotFoundException if the conversation does not exist.
   */
  async sendMessage(
    senderId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    const { conversationId, content } = sendMessageDto;

    this.logger.log(
      `Attempting to send message from user ${senderId} to conversation ${conversationId}`,
    );

    const participants = await this.messageRepository.findConversationParticipants(
      conversationId,
    );
    if (!participants || participants.length === 0) {
      this.logger.warn(
        `Conversation with ID ${conversationId} not found during sendMessage.`,
      );
      throw new NotFoundException('Conversation not found.');
    }

    if (!participants.includes(senderId)) {
      this.logger.error(
        `Authorization failed: User ${senderId} is not a participant in conversation ${conversationId}.`,
      );
      throw new ForbiddenException(
        'You are not a participant of this conversation.',
      );
    }

    const recipientId = participants.find((id) => id !== senderId);
    if (!recipientId) {
      // This case might happen in a group chat, but for 1-on-1 it's an anomaly.
      this.logger.warn(
        `Could not determine recipient for message in conversation ${conversationId}.`,
      );
      throw new InternalServerErrorException('Could not determine recipient.');
    }

    // REQ-1-029: Enforce access control on the messaging feature
    try {
      const areConnected = await this.connectionsClientService.areConnected(
        senderId,
        recipientId,
      );
      if (!areConnected) {
        this.logger.error(
          `Authorization failed: User ${senderId} and ${recipientId} are not connected.`,
        );
        throw new ForbiddenException('You can only message your connections.');
      }
    } catch (error) {
      this.logger.error(
        `gRPC call to Connections service failed for users ${senderId} and ${recipientId}.`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to verify connection status.',
      );
    }

    try {
      const message = await this.messageRepository.create({
        content,
        authorId: senderId,
        conversationId,
      });

      this.logger.log(
        `Message ${message.id} created successfully. Broadcasting to user ${recipientId}.`,
      );

      // REQ-1-027: Deliver messages in near real-time using WebSockets
      this.messagingGateway.broadcastNewMessage(recipientId, message);

      return message;
    } catch (error) {
      this.logger.error(
        `Failed to persist message for conversation ${conversationId}.`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to send message.');
    }
  }

  /**
   * Retrieves the message history for a given conversation with pagination.
   * Enforces business rule that the requester must be a participant.
   * @param requesterId - The ID of the user requesting the history.
   * @param getHistoryDto - The DTO containing conversation ID and pagination details.
   * @returns A paginated list of messages and the next cursor.
   * @throws ForbiddenException if the requester is not a participant.
   * @throws NotFoundException if the conversation does not exist.
   */
  async getMessageHistory(
    requesterId: string,
    getHistoryDto: GetHistoryDto,
  ): Promise<{ messages: Message[]; nextCursor: string | null }> {
    const { conversationId, cursor, take = 50 } = getHistoryDto;

    this.logger.log(
      `User ${requesterId} requesting message history for conversation ${conversationId}.`,
    );

    const participants = await this.messageRepository.findConversationParticipants(
      conversationId,
    );
    if (!participants || participants.length === 0) {
      this.logger.warn(
        `Conversation with ID ${conversationId} not found during getMessageHistory.`,
      );
      throw new NotFoundException('Conversation not found.');
    }

    if (!participants.includes(requesterId)) {
      this.logger.error(
        `Authorization failed: User ${requesterId} is not a participant in conversation ${conversationId}.`,
      );
      throw new ForbiddenException(
        'You are not authorized to view this conversation.',
      );
    }

    try {
      // REQ-1-028: The system must persist all messages
      const messages = await this.messageRepository.findManyByConversation(
        conversationId,
        {
          cursor: cursor ? { id: cursor } : undefined,
          take,
        },
      );

      let nextCursor: string | null = null;
      if (messages.length === take) {
        nextCursor = messages[messages.length - 1].id;
      }

      this.logger.log(
        `Successfully retrieved ${messages.length} messages for conversation ${conversationId}.`,
      );
      return { messages, nextCursor };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve message history for conversation ${conversationId}.`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve message history.',
      );
    }
  }

  /**
   * Updates the status of messages to 'read' and notifies the sender.
   * @param readerId - The ID of the user who has read the messages.
   * @param conversationId - The ID of the conversation.
   * @param messageIds - An array of message IDs that have been read.
   */
  async markMessagesAsRead(
    readerId: string,
    conversationId: string,
    messageIds: string[],
  ): Promise<void> {
    this.logger.log(
      `User ${readerId} marked ${messageIds.length} messages as read in conversation ${conversationId}.`,
    );

    try {
      const updatedMessages = await this.messageRepository.updateMessageStatus(
        messageIds,
        'read',
        readerId,
      );

      if (updatedMessages.length > 0) {
        const authorId = updatedMessages[0].authorId; // Assuming all messages are from the same author in this batch
        if (authorId !== readerId) {
          // REQ-1-027: provide visual indicators for message status, including 'read'
          this.messagingGateway.broadcastStatusUpdate(
            authorId,
            conversationId,
            updatedMessages.map((msg) => msg.id),
            'read',
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to mark messages as read for conversation ${conversationId}.`,
        error.stack,
      );
      // We don't throw an exception here as it's a non-critical background update.
    }
  }
}