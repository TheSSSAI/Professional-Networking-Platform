import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * Data Transfer Object (DTO) for the payload of a `UserProfileUpdated` or `UserDeleted` event.
 * This defines the expected structure of messages consumed from the SQS queue.
 *
 * @see REQ-1-031 - Requirement for indexing based on user profile updates.
 * @see SEQ-246 - CQRS Profile Sync sequence diagram.
 */
export class UserProfileUpdatedEventDto {
  /**
   * The unique identifier of the user whose profile has been updated or deleted.
   *
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  userId: string;
}