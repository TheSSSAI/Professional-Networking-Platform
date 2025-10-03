import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

/**
 * Data Transfer Object for fetching message history.
 * This is used for validating the parameters of the gRPC GetMessageHistory call.
 * Fulfills data contract for REQ-1-028.
 */
export class GetHistoryDto {
  /**
   * The unique identifier of the conversation for which to fetch history.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
  
  /**
   * The ID of the user requesting the history, used for authorization.
   */
  @IsString()
  @IsNotEmpty()
  requestingUserId: string;

  /**
   * Optional cursor for pagination. This is typically the ID of the last message retrieved.
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @IsString()
  @IsOptional()
  cursor?: string;

  /**
   * The number of messages to retrieve per page.
   * Defaults to 20 if not provided.
   * @example 50
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}