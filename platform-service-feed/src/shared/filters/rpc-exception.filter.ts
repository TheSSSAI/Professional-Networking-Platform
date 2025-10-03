import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

/**
 * A global exception filter for gRPC services.
 * It catches application-level exceptions and translates them into standard gRPC status codes.
 * This ensures that clients receive consistent and meaningful error responses.
 *
 * It handles three main cases:
 * 1. RpcException: These are passed through as-is, as they are already in the correct format for gRPC.
 * 2. HttpException: NestJS's standard HTTP exceptions are mapped to corresponding gRPC status codes.
 * 3. Unhandled Exceptions: Any other error is caught, logged as a critical failure, and returned as a gRPC UNKNOWN error.
 */
@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // Case 1: If the exception is already an RpcException, pass it through.
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    // Case 2: Handle NestJS's built-in HttpException and map to gRPC status codes.
    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const message = exception.message;
      const grpcStatus = this.mapHttpStatusToGrpcStatus(httpStatus);

      this.logger.warn(
        `[${httpStatus} -> ${grpcStatus}] HttpException caught: ${message}`,
      );

      return throwError(() => new RpcException({ code: grpcStatus, message }));
    }

    // Case 3: Handle all other unhandled exceptions.
    // This is a critical failure, so we log the full exception and stack trace.
    this.logger.error(
      'Unhandled exception caught by RpcExceptionFilter',
      exception.stack,
    );

    // Return a generic UNKNOWN error to the client to avoid leaking implementation details.
    return throwError(
      () =>
        new RpcException({
          code: GrpcStatus.UNKNOWN,
          message: 'An unexpected internal error occurred.',
        }),
    );
  }

  /**
   * Maps standard HTTP status codes to their closest gRPC status code equivalent.
   * @param status The HTTP status code.
   * @returns The corresponding gRPC status code.
   */
  private mapHttpStatusToGrpcStatus(status: number): GrpcStatus {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return GrpcStatus.INVALID_ARGUMENT;
      case HttpStatus.UNAUTHORIZED:
        return GrpcStatus.UNAUTHENTICATED;
      case HttpStatus.FORBIDDEN:
        return GrpcStatus.PERMISSION_DENIED;
      case HttpStatus.NOT_FOUND:
        return GrpcStatus.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return GrpcStatus.ALREADY_EXISTS;
      case HttpStatus.TOO_MANY_REQUESTS:
        return GrpcStatus.RESOURCE_EXHAUSTED;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return GrpcStatus.UNAVAILABLE;
      case HttpStatus.GATEWAY_TIMEOUT:
        return GrpcStatus.DEADLINE_EXCEEDED;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return GrpcStatus.INTERNAL;
      default:
        // For other unmapped HTTP errors, default to UNKNOWN.
        return GrpcStatus.UNKNOWN;
    }
  }
}