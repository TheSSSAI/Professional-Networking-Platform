import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SearchFiltersDto } from './search-filters.dto';

/**
 * Data Transfer Object (DTO) for an incoming user search request via gRPC.
 * This class defines the shape and validation rules for search parameters.
 *
 * @see REQ-1-030 - Requirement for user search.
 * @see SEQ-256 - User Search Query sequence diagram.
 */
export class SearchRequestDto {
  /**
   * The text query to search for, which will be matched against multiple fields
   * like name, headline, company, and skills.
   * @example 'Software Engineer'
   */
  @IsString()
  @IsNotEmpty()
  query: string;

  /**
   * The UUID of the user performing the search. This is crucial for applying
   * privacy rules and relevance boosting based on connections.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID('4')
  @IsNotEmpty()
  searchingUserId: string;

  /**
   * Optional filters to refine the search results.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => SearchFiltersDto)
  filters?: SearchFiltersDto;

  /**
   * The page number for pagination. Defaults to 1.
   * @example 1
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  /**
   * The number of results per page. Defaults to 10.
   * @example 10
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}