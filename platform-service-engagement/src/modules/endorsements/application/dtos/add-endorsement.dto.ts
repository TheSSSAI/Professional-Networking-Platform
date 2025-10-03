import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';
import {
  ADD_ENDORSEMENT_REQUEST_MESSAGES,
  ENDORSEMENT_VALIDATION_MESSAGES,
} from '../../../../shared/constants/validation-messages.constants';

/**
 * Data Transfer Object for adding a skill endorsement.
 * This DTO contains the identifiers for the endorser, the endorsed user's profile,
 * and the specific skill being endorsed. It includes validation rules.
 * Business rule REQ-1-011 (only first-degree connections can endorse) is handled
 * at the application service (command handler) layer.
 */
export class AddEndorsementDto {
  /**
   * The unique identifier of the user whose skill is being endorsed.
   * Must be a valid UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @ApiProperty({
    description: 'The unique identifier of the user being endorsed.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: ENDORSEMENT_VALIDATION_MESSAGES.ENDORSED_USER_ID_UUID })
  @IsNotEmpty({
    message: ADD_ENDORSEMENT_REQUEST_MESSAGES.ENDORSED_USER_ID_REQUIRED,
  })
  readonly endorsedUserId: string;

  /**
   * The unique identifier of the user who is giving the endorsement.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @ApiProperty({
    description: 'The unique identifier of the user giving the endorsement.',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  @IsUUID('4', { message: ENDORSEMENT_VALIDATION_MESSAGES.ENDORSER_ID_UUID })
  @IsNotEmpty({
    message: ADD_ENDORSEMENT_REQUEST_MESSAGES.ENDORSER_ID_REQUIRED,
  })
  readonly endorserId: string;

  /**
   * The unique identifier of the skill being endorsed.
   * Must be a valid UUID.
   * @example 'c1c2c3c4-c5c6-c7c8-c9ca-cbcdcecf0000'
   */
  @ApiProperty({
    description: 'The unique identifier of the skill being endorsed.',
    example: 'c1c2c3c4-c5c6-c7c8-c9ca-cbcdcecf0000',
  })
  @IsUUID('4', { message: ENDORSEMENT_VALIDATION_MESSAGES.SKILL_ID_UUID })
  @IsNotEmpty({ message: ADD_ENDORSEMENT_REQUEST_MESSAGES.SKILL_ID_REQUIRED })
  readonly skillId: string;
}