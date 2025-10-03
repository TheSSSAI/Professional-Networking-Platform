import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class UpdateBasicInfoDto {
  /**
   * The user's full name. Must be between 1 and 100 characters.
   * @example 'Jane Doe'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  /**
   * The user's professional headline. Must be less than 220 characters.
   * @example 'Senior Software Engineer at Innovate Corp'
   */
  @IsOptional()
  @IsString()
  @MaxLength(220)
  headline?: string;

  /**
   * The user's current location.
   * @example 'San Francisco, CA'
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  /**
   * The user's custom URL slug. Must contain only alphanumeric characters and dashes.
   * @example 'jane-doe-dev'
   */
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'URL slug can only contain alphanumeric characters and dashes.',
  })
  @MaxLength(50)
  customUrlSlug?: string;
}