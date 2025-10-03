/**
 * A nested DTO representing a work experience entry within the denormalized search index.
 */
export class WorkExperienceIndexDto {
  title: string;
  companyName: string;
}

/**
 * A nested DTO representing an education entry within the denormalized search index.
 */
export class EducationIndexDto {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
}

/**
 * Data Transfer Object (DTO) representing the denormalized user profile document
 * stored in the OpenSearch index. This is the schema for the service's read model.
 *
 * @see REQ-1-031 - Requirement for OpenSearch indexing.
 * @see DB-49 - Professional Networking Platform - Search Database design.
 */
export class UserProfileIndexDto {
  /**
   * The user's unique identifier (UUID).
   */
  userId: string;

  /**
   * The user's full name.
   */
  fullName: string;

  /**
   * The user's professional headline.
   */
  headline: string;

  /**
   * The user's current location.
   */
  location: string;

  /**
   * The URL of the user's profile picture. This is not indexed for search.
   */
  profilePictureUrl: string;

  /**
   * The user's custom URL slug.
   */
  customUrlSlug: string;

  /**
   * The user's profile visibility setting ('Public' or 'Private').
   * @see REQ-1-032
   */
  visibility: 'Public' | 'Private';

  /**
   * A list of the user's professional skills.
   */
  skills: string[];

  /**
   * A list of the user's work experiences. This is a nested object in OpenSearch.
   */
  workExperience: WorkExperienceIndexDto[];

  /**
   * A list of the user's education entries. This is a nested object in OpenSearch.
   */
  education: EducationIndexDto[];

  /**
   * The timestamp of the last update to the profile.
   */
  updatedAt: Date;
}