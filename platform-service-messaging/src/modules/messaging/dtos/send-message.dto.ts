import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for sending a new message via WebSocket.
 * Validates the payload for the 'sendMessage' event.
 * Fulfills data contract for REQ-1-026 and REQ-1-027.
 */
export class SendMessageDto {
  /**
   * The unique identifier of the conversation to which the message is being sent.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  /**
   * The text content of the message. Must not be empty and has a maximum length.
   * @example 'Hello, how are you doing?'
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}