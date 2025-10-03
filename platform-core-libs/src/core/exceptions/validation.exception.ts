import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Custom exception for handling validation errors in a standardized format.
 * This exception is designed to be thrown by a custom ValidationPipe
 * and caught by the HttpExceptionFilter, providing a consistent error structure.
 */
export class ValidationException extends UnprocessableEntityException {
  /**
   * Constructs a new ValidationException.
   * @param validationErrors An array of `ValidationError` objects from `class-validator`.
   */
  constructor(public validationErrors: ValidationError[]) {
    super({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Input validation failed',
      details: ValidationException.formatErrors(validationErrors),
    });
  }

  /**
   * A static helper method to transform `class-validator`'s `ValidationError` array
   * into a more user-friendly, flat object structure.
   * @param errors The array of `ValidationError` objects.
   * @returns An object where keys are the invalid property names and values are arrays of error messages.
   * @example
   * // Transforms:
   * // [ { property: 'email', constraints: { isEmail: 'email must be an email' } } ]
   * // Into:
   * // { "email": ["email must be an email"] }
   */
  private static formatErrors(
    errors: ValidationError[],
  ): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};
    errors.forEach((err) => {
      if (err.constraints) {
        formattedErrors[err.property] = Object.values(err.constraints);
      }
      // Recursively format nested validation errors if they exist
      if (err.children && err.children.length > 0) {
        const nestedErrors = this.formatErrors(err.children);
        for (const key in nestedErrors) {
          formattedErrors[`${err.property}.${key}`] = nestedErrors[key];
        }
      }
    });
    return formattedErrors;
  }
}