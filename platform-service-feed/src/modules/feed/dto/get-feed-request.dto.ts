import {
  IsUUID,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class GetFeedRequestDto
 * @description Data Transfer Object for incoming gRPC `getFeed` requests.
 * It defines the expected parameters and applies validation rules.
 * This is used by the FeedController to ensure type safety and data integrity for feed retrieval requests.
 */
export class GetFeedRequestDto {
  /**
   * The unique identifier of the user whose feed is being requested.
   * @type {string}
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  /**
   * The page number for pagination. Defaults to 1 if not provided.
   * @type {number}
   * @default 1
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  /**
   * The number of items per page. Defaults to 20, with a maximum of 100.
   * @type {number}
   * @default 20
   * @example 20
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}