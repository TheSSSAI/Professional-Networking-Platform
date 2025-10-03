import { Visibility } from '../value-objects/visibility.enum';

// Placeholder types to avoid direct dependency on higher-level entity files,
// ensuring the domain layer remains at level 0. The concrete entity classes
// at higher levels will be structurally compatible with these types.

export type WorkExperience = {
  id: string;
  profileId: string;
  company: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
};

export type Education = {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
};

export type Skill = {
  id: string;
  name: string;
};

export type UserProfileSkill = {
  skill: Skill;
  endorsementCount: number;
};

export type Profile = {
  userId: string;
  name?: string | null;
  headline?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
  bannerImageUrl?: string | null;
  customUrlSlug?: string | null;
  visibility: Visibility;
  contactDetails?: any; // JSONB field
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: UserProfileSkill[];
};

/**
 * @interface IProfileRepository
 * @description Defines the contract for persistence operations related to the Profile aggregate.
 * This is the Port in a Ports and Adapters (Hexagonal) architecture, abstracting the
 * data access technology from the domain logic.
 */
export interface IProfileRepository {
  /**
   * Finds a single Profile aggregate root by its user ID.
   * @param {string} userId The unique identifier of the user.
   * @returns {Promise<Profile | null>} The complete profile aggregate or null if not found.
   * The implementation should eagerly load all related entities (work experience, education, skills).
   */
  findByUserId(userId: string): Promise<Profile | null>;

  /**
   * Finds multiple Profile aggregate roots by a list of user IDs.
   * This is crucial for preventing N+1 problems in services that need to enrich data for multiple users.
   * @param {string[]} userIds An array of user identifiers.
   * @returns {Promise<Profile[]>} A list of complete profile aggregates.
   */
  findManyByUserIds(userIds: string[]): Promise<Profile[]>;

  /**
   * Persists the state of a Profile aggregate.
   * This method should handle creation, updates, and deletion of the aggregate root and its child entities
   * (WorkExperience, Education, Skills) within a single atomic transaction.
   * @param {Profile} profile The Profile aggregate to save.
   * @returns {Promise<void>}
   */
  save(profile: Profile): Promise<void>;

  /**
   * Creates a new, empty profile for a newly registered user.
   * @param {string} userId The ID of the new user.
   * @param {string} name The initial name for the user, often from the registration event.
   * @returns {Promise<Profile>} The newly created profile aggregate.
   */
  create(userId: string, name: string): Promise<Profile>;

  /**
   * Checks if a custom URL slug is already in use, performing a case-insensitive check.
   * Required for REQ-1-013.
   * @param {string} slug The URL slug to check.
   * @param {string} excludeUserId The user ID to exclude from the check (used when a user is updating their own slug).
   * @returns {Promise<boolean>} True if the slug is taken, false otherwise.
   */
  isSlugTaken(slug: string, excludeUserId?: string): Promise<boolean>;
}

export const IProfileRepository = Symbol('IProfileRepository');