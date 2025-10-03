import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for sending a message via WebSocket.
 * Used for validation of incoming message payloads.
 */
export class SendMessageDto {
  /**
   * The UUID of the conversation to which the message is being sent.
   */
  @IsUUID()
  conversationId: string;

  /**
   * The text content of the message.
   * Must not be empty and has a maximum length of 5000 characters.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  /**
   * The UUID of the recipient user.
   * This is used by the ConnectionGuard to authorize the send operation.
   */
  @IsUUID()
  recipientId: string;
}