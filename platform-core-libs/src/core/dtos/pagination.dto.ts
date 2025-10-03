import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * A reusable DTO for standardizing pagination query parameters in API endpoints.
 * It provides validated and transformed 'page' and 'limit' properties.
 */
export class PaginationQueryDto {
  /**
   * The page number to retrieve. Must be a positive integer.
   * @default 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * The number of items to retrieve per page. Must be between 1 and 100.
   * @default 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}