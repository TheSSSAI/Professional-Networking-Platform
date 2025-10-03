import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for the optional filters within a search request.
 * This is nested within the `SearchRequestDto`.
 *
 * @see REQ-1-035 - Requirement for filtering by Location, Company, and Connection Degree.
 */
export class SearchFiltersDto {
  /**
   * Filter results to users from a specific location.
   * @example 'San Francisco, CA'
   */
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * Filter results to users currently at a specific company.
   * @example 'Innovate Corp'
   */
  @IsOptional()
  @IsString()
  company?: string;

  /**
   * Filter results by connection degree relative to the searching user.
   * @example [1, 2]
   */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  connectionDegree?: number[];
}