import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import {
  ADD_COMMENT_REQUEST_MESSAGES,
  COMMENT_VALIDATION_MESSAGES,
} from '../../../../shared/constants/validation-messages.constants';

/**
 * Data Transfer Object for adding a new comment.
 * This DTO is used to transfer data from the presentation layer (e.g., gRPC controller)
 * to the application layer for the 'add comment' use case.
 * It includes validation rules to ensure data integrity.
 */
export class AddCommentDto {
  /**
   * The unique identifier of the post to which the comment is being added.
   * Must be a valid UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @ApiProperty({
    description: 'The unique identifier of the post.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.POST_ID_UUID })
  @IsNotEmpty({ message: ADD_COMMENT_REQUEST_MESSAGES.POST_ID_REQUIRED })
  readonly postId: string;

  /**
   * The unique identifier of the user authoring the comment.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @ApiProperty({
    description: 'The unique identifier of the comment author.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.AUTHOR_ID_UUID })
  @IsNotEmpty({ message: ADD_COMMENT_REQUEST_MESSAGES.AUTHOR_ID_REQUIRED })
  readonly authorId: string;

  /**
   * The text content of the comment.
   * Cannot be empty and must not exceed 1500 characters, as per REQ-1-022.
   * @example 'This is a great insight, thank you for sharing!'
   */
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a great insight, thank you for sharing!',
    maxLength: 1500,
  })
  @MaxLength(1500, {
    message: COMMENT_VALIDATION_MESSAGES.CONTENT_MAX_LENGTH,
  })
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_STRING })
  @IsNotEmpty({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_NOT_EMPTY })
  readonly content: string;
}