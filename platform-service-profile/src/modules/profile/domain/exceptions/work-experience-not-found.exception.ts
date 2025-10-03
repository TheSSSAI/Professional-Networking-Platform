import { NotFoundException } from '@nestjs/common';

/**
 * @class WorkExperienceNotFoundException
 * @description Custom exception thrown when a specific work experience entry cannot be found for a given user.
 * This provides a granular error for CRUD operations on child entities of the Profile aggregate.
 * It helps in providing specific feedback for operations like updating or deleting a work experience.
 * Extends NestJS's built-in NotFoundException for framework compatibility.
 */
export class WorkExperienceNotFoundException extends NotFoundException {
  /**
   * @constructor
   * @param {string} workExperienceId - The identifier of the work experience entry.
   * @param {string} userId - The identifier of the user profile the entry belongs to.
   */
  constructor(workExperienceId: string, userId: string) {
    super(
      `Work experience with ID '${workExperienceId}' was not found for user with ID '${userId}'.`,
    );
    this.name = 'WorkExperienceNotFoundException';
  }
}