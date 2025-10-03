/**
 * @fileoverview Data Transfer Object for sending a new connection request.
 *
 * This DTO defines the shape and validation rules for the data required to
 * create a connection request. It is used at the application boundary (e.g., in
 * a gRPC controller) to validate incoming requests before they are processed by
 * the application's use cases.
 *
 * The validation rules are implemented using decorators from the `class-validator`
 * library, which integrates with NestJS's ValidationPipe.
 *
 * Fulfills REQ-1-015 by defining the contract for sending a request with an
 * optional message limited to 300 characters.
 */

import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendRequestDto {
  /**
   * The unique identifier of the user sending the connection request.
   * Must be a valid UUID. This is typically sourced from the authenticated user's context.
   * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
   */
  @IsUUID()
  senderId: string;

  /**
   * The unique identifier of the user who will receive the connection request.
   * Must be a valid UUID.
   * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12"
   */
  @IsUUID()
  recipientId: string;

  /**
   * An optional personalized message to include with the connection request.
   * If provided, it must be a string and cannot exceed 300 characters.
   * @example "Hi Jane, we met at the conference last week. I'd love to connect!"
   */
  @IsOptional()
  @IsString()
  @MaxLength(300, {
    message: 'The personalized message cannot exceed 300 characters.',
  })
  message?: string;
}