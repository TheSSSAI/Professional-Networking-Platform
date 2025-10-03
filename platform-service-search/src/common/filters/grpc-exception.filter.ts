import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

/**
 * A global exception filter to catch unhandled exceptions and translate them
 * into standard gRPC status codes and error messages.
 *
 * This filter handles three types of exceptions:
 * 1. RpcException: These are already in the correct format for gRPC and are re-thrown as-is.
 * 2. HttpException: Common NestJS exceptions are mapped from their HTTP status codes to corresponding gRPC status codes.
 * 3. Generic Error/Unknown: Any other exception is caught, logged as a critical error, and returned as a gRPC 'UNKNOWN' error to prevent leaking implementation details.
 */
@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      // If the exception is already an RpcException, just re-throw it.
      return throwError(() => exception);
    }

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const message = exception.message;
      const grpcStatus = this.mapHttpStatusToGrpcStatus(httpStatus);

      this.logger.warn(
        `Caught HttpException: ${httpStatus} - ${message}. Mapping to gRPC status: ${grpcStatus}`,
      );

      return throwError(() => new RpcException({ code: grpcStatus, message }));
    }


    // For any other type of exception, log it as a critical error and return a generic 'UNKNOWN' gRPC error.
    this.logger.error(
      `Caught unhandled exception: ${
        exception instanceof Error ? exception.message : 'Unknown error'
      }`,
      exception instanceof Error ? exception.stack : undefined,
    );
    
    const message = 'An unexpected internal error occurred.';
    return throwError(
      () => new RpcException({ code: GrpcStatus.UNKNOWN, message }),
    );
  }

  /**
   * Maps standard HTTP status codes to their most appropriate gRPC status code counterparts.
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
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return GrpcStatus.INTERNAL;
      case HttpStatus.NOT_IMPLEMENTED:
        return GrpcStatus.UNIMPLEMENTED;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return GrpcStatus.UNAVAILABLE;
      case HttpStatus.GATEWAY_TIMEOUT:
        return GrpcStatus.DEADLINE_EXCEEDED;
      default:
        // Default to UNKNOWN for unmapped HTTP errors.
        return GrpcStatus.UNKNOWN;
    }
  }
}