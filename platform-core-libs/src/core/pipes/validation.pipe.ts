import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/validation.exception';

/**
 * A custom NestJS ValidationPipe that standardizes DTO validation error responses.
 *
 * This pipe leverages the `class-validator` and `class-transformer` libraries
 * to automatically validate and transform incoming request payloads (body, query, params)
 * against their DTO class definitions.
 *
 * When validation fails, instead of throwing the default `BadRequestException` with a
 * deeply nested error structure, this pipe throws a custom `ValidationException`.
 * This custom exception carries a flattened, more client-friendly array of error messages,
 * ensuring consistent error responses across all microservices that use this library.
 *
 * This pipe is intended to be registered globally using the `APP_PIPE` provider token.
 */
@Injectable()
export class PlatformValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new ValidationException(formattedErrors);
    }

    return object;
  }

  /**
   * Determines if the given metatype should be validated.
   * Validation is skipped for native JavaScript types.
   * @param metatype - The metatype of the argument.
   * @returns {boolean} - True if validation should proceed, false otherwise.
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Flattens the nested error structure from `class-validator` into a
   * simple array of objects, each containing the field and its error messages.
   * This method recursively handles nested validation errors.
   *
   * @param {ValidationError[]} errors - The array of validation errors from `class-validator`.
   * @returns {{ field: string; messages: string[] }[]} - A formatted array of errors.
   */
  private formatErrors(
    errors: ValidationError[],
    parentProperty?: string,
  ): { field: string; messages: string[] }[] {
    let formattedErrors: { field: string; messages: string[] }[] = [];

    for (const error of errors) {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        formattedErrors.push({
          field: propertyPath,
          messages: Object.values(error.constraints),
        });
      }

      if (error.children && error.children.length > 0) {
        formattedErrors = formattedErrors.concat(
          this.formatErrors(error.children, propertyPath),
        );
      }
    }

    return formattedErrors;
  }
}