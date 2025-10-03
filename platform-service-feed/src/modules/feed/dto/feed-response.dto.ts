import { IsArray, IsUUID } from 'class-validator';

/**
 * @class FeedResponseDto
 * @description Data Transfer Object for the gRPC `getFeed` response.
 * It defines the structure of the data returned to the client, which is a list of post IDs.
 */
export class FeedResponseDto {
  /**
   * An array of post IDs representing the user's feed for the requested page.
   * The IDs are ordered in reverse chronological order.
   * @type {string[]}
   * @example ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6']
   */
  @IsArray()
  @IsUUID('4', { each: true })
  postIds: string[];
}