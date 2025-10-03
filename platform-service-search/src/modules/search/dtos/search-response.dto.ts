import { UserProfileIndexDto } from './user-profile-index.dto';

/**
 * Data Transfer Object (DTO) representing a single user in the search results.
 * It's a subset of the full `UserProfileIndexDto`, tailored for the search response.
 */
class UserSearchResultDto extends UserProfileIndexDto {}

/**
 * Data Transfer Object (DTO) for the gRPC response of a user search query.
 * Contains the paginated list of user results and metadata.
 *
 * @see SEQ-256 - User Search Query sequence diagram.
 */
export class SearchResponseDto {
  /**
   * An array of user profiles matching the search criteria.
   */
  results: UserSearchResultDto[];

  /**
   * The total number of matching results found.
   */
  total: number;

  /**
   * The current page number.
   */
  page: number;

  /**
   * The number of results per page.
   */
  limit: number;
}