import { NotFoundException } from '@nestjs/common';

/**
 * @class ProfileNotFoundException
 * @description Custom exception thrown when a user profile cannot be found.
 * This provides a specific, domain-related error that can be caught and handled
 * appropriately in the application or presentation layers (e.g., mapped to a
 * gRPC NOT_FOUND status).
 * Extends NestJS's built-in NotFoundException for framework compatibility.
 */
export class ProfileNotFoundException extends NotFoundException {
  /**
   * @constructor
   * @param {string} userId - The identifier of the user whose profile was not found.
   */
  constructor(userId: string) {
    super(`Profile for user with ID '${userId}' was not found.`);
    this.name = 'ProfileNotFoundException';
  }
}