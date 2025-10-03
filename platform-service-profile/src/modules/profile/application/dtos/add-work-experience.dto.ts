import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: string, args: ValidationArguments) {
    const object = args.object as AddWorkExperienceDto;
    const startDate = object.startDate;
    if (!endDate || !startDate) {
      // Let other validators handle missing dates
      return true;
    }
    return new Date(endDate) >= new Date(startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'End date cannot be before the start date.';
  }
}

export class AddWorkExperienceDto {
  /**
   * The name of the company.
   * @example 'Innovate Corp'
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  company: string;

  /**
   * The job title.
   * @example 'Software Engineer'
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  /**
   * The start date of employment in ISO 8601 format.
   * @example '2022-06-01T00:00:00.000Z'
   */
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  /**
   * The end date of employment in ISO 8601 format. Null if currently employed.
   * @example '2024-05-31T00:00:00.000Z'
   */
  @IsOptional()
  @IsDateString()
  @Validate(IsEndDateAfterStartDateConstraint)
  endDate?: string;

  /**
   * A description of responsibilities and achievements in the role.
   * @example 'Developed and maintained scalable microservices.'
   */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}