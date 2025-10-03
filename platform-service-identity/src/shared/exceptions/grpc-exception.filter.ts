import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

/**
 * A global exception filter for gRPC microservices.
 * It catches application-level exceptions and translates them into standard gRPC status codes.
 * This ensures that clients receive consistent and meaningful error responses.
 */
@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // If the exception is already an RpcException, rethrow it as is.
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    const contextType = host.getType();
    if (contextType !== 'rpc') {
      this.logger.warn(
        `GrpcExceptionFilter was applied to a non-RPC context: ${contextType}`,
      );
      // Fallback for non-RPC contexts if used improperly
      return throwError(() => new RpcException('Internal server error.'));
    }

    const { code, message } = this.mapExceptionToGrpcStatus(exception);

    // For internal errors, log the full exception details for debugging.
    if (code === GrpcStatus.INTERNAL || code === GrpcStatus.UNKNOWN) {
      this.logger.error(
        `Unhandled exception caught: ${exception.message}`,
        exception.stack,
      );
    } else {
      // For expected business logic errors, a warning is sufficient.
      this.logger.warn(`Mapped exception to gRPC status: ${GrpcStatus[code]} - ${message}`);
    }

    return throwError(() => new RpcException({ code, message }));
  }

  /**
   * Maps various application-level exceptions to gRPC status codes and messages.
   * @param exception The exception caught by the filter.
   * @returns An object with the gRPC status code and a corresponding message.
   */
  private mapExceptionToGrpcStatus(exception: any): {
    code: GrpcStatus;
    message: string;
  } {
    // Handle standard NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : (response as any).message || 'An error occurred';

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          return { code: GrpcStatus.INVALID_ARGUMENT, message };
        case HttpStatus.UNAUTHORIZED:
          return { code: GrpcStatus.UNAUTHENTICATED, message };
        case HttpStatus.FORBIDDEN:
          return { code: GrpcStatus.PERMISSION_DENIED, message };
        case HttpStatus.NOT_FOUND:
          return { code: GrpcStatus.NOT_FOUND, message };
        case HttpStatus.CONFLICT:
          return { code: GrpcStatus.ALREADY_EXISTS, message };
        case HttpStatus.TOO_MANY_REQUESTS:
          return { code: GrpcStatus.RESOURCE_EXHAUSTED, message };
        default:
          return { code: GrpcStatus.UNKNOWN, message };
      }
    }

    // Handle Prisma specific errors
    if (exception.code) {
      switch (exception.code) {
        case 'P2002': // Unique constraint failed
          return {
            code: GrpcStatus.ALREADY_EXISTS,
            message: `A record with this value already exists.`,
          };
        case 'P2025': // Record to update/delete not found
          return {
            code: GrpcStatus.NOT_FOUND,
            message: 'The requested resource was not found.',
          };
      }
    }

    // Handle custom application exceptions (assuming a structure)
    if (exception.name) {
      switch (exception.name) {
        case 'UserAlreadyExistsException':
          return { code: GrpcStatus.ALREADY_EXISTS, message: exception.message };
        case 'InvalidCredentialsException':
        case 'TokenExpiredException':
        case 'InvalidTokenException':
          return { code: GrpcStatus.UNAUTHENTICATED, message: exception.message };
        case 'AccountNotVerifiedException':
          return {
            code: GrpcStatus.FAILED_PRECONDITION,
            message: exception.message,
          };
        case 'DomainException':
        case 'ValidationException':
          return {
            code: GrpcStatus.INVALID_ARGUMENT,
            message: exception.message,
          };
        case 'NotFoundException':
            return {
              code: GrpcStatus.NOT_FOUND,
              message: exception.message,
            };
      }
    }

    // Fallback for any other unhandled errors
    return {
      code: GrpcStatus.INTERNAL,
      message: 'An internal server error occurred.',
    };
  }
}