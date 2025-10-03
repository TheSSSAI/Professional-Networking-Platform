import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  DELETE_COMMENT_REQUEST_MESSAGES,
  COMMENT_VALIDATION_MESSAGES,
} from '../../../../shared/constants/validation-messages.constants';

/**
 * Data Transfer Object for deleting an existing comment.
 * This DTO provides the necessary identifiers for the 'delete comment' use case,
 * including the target comment and the user performing the action for authorization.
 */
export class DeleteCommentDto {
  /**
   * The unique identifier of the comment to be deleted.
   * Must be a valid UUID.
   * @example 'b1b2b3b4-b5b6-b7b8-b9ba-bcbdbebf0000'
   */
  @ApiProperty({
    description: 'The unique identifier of the comment to be deleted.',
    example: 'b1b2b3b4-b5b6-b7b8-b9ba-bcbdbebf0000',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.COMMENT_ID_UUID })
  @IsNotEmpty({ message: DELETE_COMMENT_REQUEST_MESSAGES.COMMENT_ID_REQUIRED })
  readonly commentId: string;

  /**
   * The unique identifier of the user attempting to delete the comment.
   * This is crucial for server-side authorization to ensure the user is the original author.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @ApiProperty({
    description: 'The unique identifier of the user deleting the comment.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID('4', { message: COMMENT_VALIDATION_MESSAGES.USER_ID_UUID })
  @IsNotEmpty({ message: DELETE_COMMENT_REQUEST_MESSAGES.USER_ID_REQUIRED })
  readonly userId: string;
}