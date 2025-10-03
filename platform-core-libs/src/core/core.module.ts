import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';

/**
 * CoreModule provides essential, application-wide utilities.
 *
 * It registers the HttpExceptionFilter globally to ensure all HTTP exceptions
 * are caught and formatted into a standardized JSON error response.
 *
 * It also registers the ValidationPipe globally to enforce validation rules on all
 * incoming DTOs, leveraging class-validator decorators.
 *
 * This module should be imported into the root AppModule of any consuming service
 * to enforce consistent error handling and request validation.
 */
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class CoreModule {}