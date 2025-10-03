import {
  IsUUID,
  IsNotEmpty,
  IsISO8601,
  IsDate,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class PostCreatedEventDto
 * @description Data Transfer Object for the payload of a "PostCreated" event consumed from the SQS queue.
 * It includes validation rules to ensure the integrity of the event data before processing.
 * This DTO is a direct representation of the contract defined in REQ-1-020 and SEQ-247.
 */
export class PostCreatedEventDto {
  /**
   * The unique identifier of the post that was created.
   * @type {string}
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID('4')
  @IsNotEmpty()
  postId: string;

  /**
   * The unique identifier of the user who authored the post.
   * @type {string}
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @IsUUID('4')
  @IsNotEmpty()
  authorId: string;

  /**
   * The ISO 8601 timestamp of when the post was created.
   * This is used as the score in the Redis Sorted Set to maintain near-chronological order.
   * @type {Date}
   * @example '2023-10-27T10:00:00.000Z'
   */
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  createdAt: Date;
}