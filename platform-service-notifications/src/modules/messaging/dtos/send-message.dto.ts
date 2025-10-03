import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * Data Transfer Object for the 'sendMessage' WebSocket event.
 * This class defines the structure and validation rules for the payload
 * when a client sends a message.
 *
 * Corresponds to requirements:
 * - REQ-1-026: Enables sending text messages.
 *
 * Validation is handled by NestJS's global ValidationPipe.
 */
export class SendMessageDto {
  /**
   * The unique identifier (UUID) of the conversation to which the message is being sent.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID()
  conversationId: string;

  /**
   * The text content of the message.
   * It must be a non-empty string and cannot exceed 2000 characters.
   * @example 'Hello! This is a test message.'
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}