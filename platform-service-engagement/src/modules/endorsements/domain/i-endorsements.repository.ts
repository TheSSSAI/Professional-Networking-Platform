import { SkillEndorsement } from './skill-endorsement.entity';

/**
 * An injection token for the skill endorsements repository interface.
 * This allows for dependency injection of the repository without coupling to a specific implementation.
 */
export const IEndorsementsRepository = Symbol('IEndorsementsRepository');

/**
 * Interface for the skill endorsements repository.
 * Defines the contract for data access operations related to skill endorsements.
 * This is the Port in a Ports and Adapters architecture.
 */
export interface IEndorsementsRepository {
  /**
   * Creates a new skill endorsement in the data store.
   * @param endorsement The SkillEndorsement entity to create.
   * @returns A promise that resolves to the newly created SkillEndorsement entity.
   * @throws {DuplicateEndorsementException} If an endorsement from this user for this skill already exists.
   */
  create(endorsement: SkillEndorsement): Promise<SkillEndorsement>;

  /**
   * Finds an existing endorsement by its unique composite key.
   * @param endorserId The ID of the user giving the endorsement.
   * @param endorsedUserId The ID of the user whose skill is being endorsed.
   * @param skillId The ID of the skill being endorsed.
   * @returns A promise that resolves to the SkillEndorsement entity if it exists, otherwise null.
   */
  findByUnique(
    endorserId: string,
    endorsedUserId: string,
    skillId: string,
  ): Promise<SkillEndorsement | null>;

  /**
   * Deletes an endorsement by its unique composite key.
   * This is used when a user retracts their endorsement.
   * @param endorserId The ID of the user retracting the endorsement.
   * @param endorsedUserId The ID of the user whose skill was endorsed.
   * @param skillId The ID of the skill that was endorsed.
   * @returns A promise that resolves when the operation is complete.
   */
  deleteByUnique(
    endorserId: string,
    endorsedUserId: string,
    skillId: string,
  ): Promise<void>;
}