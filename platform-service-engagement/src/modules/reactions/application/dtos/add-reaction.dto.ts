import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { REACTION_TYPES } from '../../../../shared/constants/reaction-types.constants';
import {
  ADD_REACTION_REQUEST_MESSAGES,
  REACTION_VALIDATION_MESSAGES,
} from '../../../../shared/constants/validation-messages.constants';

/**
 * Data Transfer Object for adding or updating a reaction on a post.
 * It carries all necessary data for the 'add reaction' use case and includes
 * validation to ensure data integrity and adherence to business rules.
 */
export class AddReactionDto {
  /**
   * The unique identifier of the post being reacted to.
   * Must be a valid UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @ApiProperty({
    description: 'The unique identifier of the post being reacted to.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: REACTION_VALIDATION_MESSAGES.POST_ID_UUID })
  @IsNotEmpty({ message: ADD_REACTION_REQUEST_MESSAGES.POST_ID_REQUIRED })
  readonly postId: string;

  /**
   * The unique identifier of the user adding the reaction.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @ApiProperty({
    description: 'The unique identifier of the user adding the reaction.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID('4', { message: REACTION_VALIDATION_MESSAGES.USER_ID_UUID })
  @IsNotEmpty({ message: ADD_REACTION_REQUEST_MESSAGES.USER_ID_REQUIRED })
  readonly userId: string;

  /**
   * The type of reaction being added.
   * Must be one of the predefined valid reaction types.
   * As per REQ-1-021, the initial implementation is limited to 'LIKE'.
   * @example 'LIKE'
   */
  @ApiProperty({
    description: 'The type of reaction being added.',
    example: 'LIKE',
    enum: REACTION_TYPES,
  })
  @IsIn(REACTION_TYPES, {
    message: REACTION_VALIDATION_MESSAGES.REACTION_TYPE_INVALID,
  })
  @IsString({ message: REACTION_VALIDATION_MESSAGES.REACTION_TYPE_STRING })
  @IsNotEmpty({ message: ADD_REACTION_REQUEST_MESSAGES.REACTION_TYPE_REQUIRED })
  readonly reactionType: string;
}