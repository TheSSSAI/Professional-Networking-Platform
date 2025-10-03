import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import {
  EDIT_COMMENT_REQUEST_MESSAGES,
  COMMENT_VALIDATION_MESSAGES,
} from '../../../../shared/constants/validation-messages.constants';

/**
 * Data Transfer Object for editing an existing comment.
 * This DTO carries the necessary data for the 'edit comment' use case,
 * including authorization and content update information.
 * It includes validation rules to ensure data integrity.
 */
export class EditCommentDto {
  /**
   * The unique identifier of the comment to be edited.
   * Must be a valid UUID.
   * @example 'b1b2b3b4-b5b6-b7b8-b9ba-bcbdbebf0000'
   */
  @ApiProperty({
    description: 'The unique identifier of the comment to be edited.',
    example: 'b1b2b3b4-b5b6-b7b8-b9ba-bcbdbebf0000',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.COMMENT_ID_UUID })
  @IsNotEmpty({ message: EDIT_COMMENT_REQUEST_MESSAGES.COMMENT_ID_REQUIRED })
  readonly commentId: string;

  /**
   * The unique identifier of the user attempting to edit the comment.
   * Used for authorization to ensure the user is the original author.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @ApiProperty({
    description: 'The unique identifier of the user editing the comment.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.USER_ID_UUID })
  @IsNotEmpty({ message: EDIT_COMMENT_REQUEST_MESSAGES.USER_ID_REQUIRED })
  readonly userId: string;

  /**
   * The new text content for the comment.
   * Cannot be empty and must not exceed 1500 characters, as per REQ-1-022.
   * @example 'I meant to say, this is a truly great insight!'
   */
  @ApiProperty({
    description: 'The new text content for the comment.',
    example: 'I meant to say, this is a truly great insight!',
    maxLength: 1500,
  })
  @MaxLength(1500, {
    message: COMMENT_VALIDATION_MESSAGES.CONTENT_MAX_LENGTH,
  })
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_STRING })
  @IsNotEmpty({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_NOT_EMPTY })
  readonly newContent: string;
}