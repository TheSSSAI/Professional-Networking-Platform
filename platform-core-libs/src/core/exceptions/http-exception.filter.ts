import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from './validation.exception';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

/**
 * A global exception filter to catch all HttpException instances and format them
 * into a standardized JSON error response.
 *
 * This filter enforces a consistent error response structure across all microservices,
 * improving API client and developer experience. It also ensures that server-side errors
 * are properly logged without leaking sensitive information like stack traces in the
 * production response body.
 *
 * @implements {ExceptionFilter}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * The main method to handle caught exceptions.
   *
   * @param {HttpException} exception - The exception instance that was thrown.
   * @param {ArgumentsHost} host - The arguments host, used to get request and response objects.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse();
    let message: string | string[];
    let errorType: string;

    if (exception instanceof ValidationException) {
      // Handle our custom validation exception for structured validation errors
      message = exception.validationErrors;
      errorType = 'Validation Error';
    } else if (typeof errorResponse === 'object' && errorResponse !== null) {
      // Handle standard NestJS validation pipe errors or other object-based responses
      const responseObj = errorResponse as {
        message: string | string[];
        error: string;
      };
      message = responseObj.message;
      errorType = responseObj.error || exception.constructor.name;
    } else {
      // Handle simple string responses
      message = errorResponse as string;
      errorType = exception.constructor.name;
    }

    const errorPayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorType: errorType,
      message: message,
    };

    // Log server errors with full stack trace for observability
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP Status ${status} on ${request.method} ${request.url}`,
        exception.stack,
        errorPayload,
      );
    } else {
      // Log client errors for debugging and monitoring purposes
      this.logger.warn(
        `HTTP Status ${status} on ${request.method} ${request.url}`,
        errorPayload,
      );
    }

    response.status(status).json(errorPayload);
  }
}