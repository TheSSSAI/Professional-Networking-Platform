import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for broadcasting a typing status via WebSocket.
 * Validates the payload for the 'typing' event.
 * Fulfills data contract for REQ-1-027.
 */
export class TypingDto {
  /**
   * The unique identifier of the conversation where typing is occurring.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  /**
   * Boolean indicating if the user is currently typing.
   * `true` for starting to type, `false` for stopping.
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isTyping: boolean;
}