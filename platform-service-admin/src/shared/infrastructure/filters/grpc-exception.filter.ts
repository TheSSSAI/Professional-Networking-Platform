import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { status as grpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

/**
 * A global gRPC exception filter that catches application-level exceptions
 * and translates them into appropriate gRPC status codes and messages.
 * This ensures a consistent error contract for all gRPC clients.
 */
@Catch()
export class GrpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // If the exception is already an RpcException, let the base filter handle it.
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    // Default status for unknown errors
    let grpcCode = grpcStatus.INTERNAL;
    let message = 'An internal server error occurred.';

    // Handle NestJS built-in HttpException and its derivatives
    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      message = exception.message;

      switch (httpStatus) {
        case 400: // Bad Request
          grpcCode = grpcStatus.INVALID_ARGUMENT;
          break;
        case 401: // Unauthorized
          grpcCode = grpcStatus.UNAUTHENTICATED;
          break;
        case 403: // Forbidden
          grpcCode = grpcStatus.PERMISSION_DENIED;
          break;
        case 404: // Not Found
          grpcCode = grpcStatus.NOT_FOUND;
          break;
        case 409: // Conflict
          grpcCode = grpcStatus.ALREADY_EXISTS;
          break;
        case 429: // Too Many Requests
          grpcCode = grpcStatus.RESOURCE_EXHAUSTED;
          break;
        default:
          grpcCode = grpcStatus.INTERNAL;
          break;
      }
    } else if (exception instanceof Error) {
      // Handling for custom domain exceptions could be added here.
      // For now, we'll treat them based on their name or a property.
      switch (exception.name) {
        case 'EntityNotFoundException':
          grpcCode = grpcStatus.NOT_FOUND;
          message = exception.message || 'The requested resource was not found.';
          break;
        case 'DomainRuleViolationException':
          grpcCode = grpcStatus.FAILED_PRECONDITION;
          message =
            exception.message || 'A business rule violation occurred.';
          break;
        case 'DuplicateRecordException':
          grpcCode = grpcStatus.ALREADY_EXISTS;
          message =
            exception.message || 'The resource already exists.';
          break;
        default:
          // For any other standard Error, log it and return a generic internal error.
          this.logger.error(
            `Unhandled exception caught: ${exception.message}`,
            exception.stack,
          );
          grpcCode = grpcStatus.INTERNAL;
          message = 'An unexpected error occurred inside the service.';
          break;
      }
    }

    // For non-Error objects that are thrown
    if (typeof exception !== 'object' || !(exception instanceof Error)) {
      this.logger.error(`Non-error object thrown: ${JSON.stringify(exception)}`);
    }

    const rpcException = new RpcException({
      code: grpcCode,
      message,
    });

    return throwError(() => rpcException.getError());
  }
}