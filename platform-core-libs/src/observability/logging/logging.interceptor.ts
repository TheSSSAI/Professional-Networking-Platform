import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * A NestJS interceptor that provides comprehensive request and response logging.
 *
 * This interceptor is designed to be used globally to ensure that every request
 * is logged with crucial context, such as correlation IDs, user information,
 * request duration, and status codes. This is essential for observability
 * and debugging in a distributed system.
 *
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercepts incoming requests and outgoing responses to log them.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @param {CallHandler} next - The handler for the next step in the request pipeline.
   * @returns {Observable<any>} An observable of the response stream.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const contextType = context.getType();

    if (contextType === 'http') {
      return this.logHttp(context, next, now);
    } else if (contextType === 'rpc') {
      // Placeholder for gRPC logging if needed in the future
      this.logger.log('gRPC request intercepted', context.getClass().name);
      return next.handle();
    } else if (context.getType<"graphql">() === 'graphql') {
        return this.logGql(context, next, now);
    }
    
    return next.handle();
  }

  private logHttp(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'N/A';
    const userId = (request as any).user?.sub;

    this.logger.log(`[Request] ${method} ${url}`, LoggingInterceptor.name, {
      method,
      url,
      ip,
      userAgent,
      userId,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;
        this.logger.log(
          `[Response] ${method} ${url} - ${statusCode} (${duration}ms)`,
          LoggingInterceptor.name,
          {
            method,
            url,
            statusCode,
            duration,
            userId,
          },
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;
        this.logger.error(
          `[Error] ${method} ${url} - ${statusCode} (${duration}ms)`,
          error.stack,
          LoggingInterceptor.name,
          {
            method,
            url,
            statusCode,
            duration,
            userId,
            errorMessage: error.message,
          },
        );
        throw error;
      }),
    );
  }

  private logGql(context: ExecutionContext, next: CallHandler, startTime: number): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const { req } = gqlContext.getContext();
    const userId = req.user?.sub;
    const parentType = info.parentType.name;
    const fieldName = info.fieldName;

    this.logger.log(`[GraphQL Request] ${parentType}.${fieldName}`, LoggingInterceptor.name, {
      type: parentType,
      field: fieldName,
      userId,
    });
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[GraphQL Response] ${parentType}.${fieldName} (${duration}ms)`,
          LoggingInterceptor.name,
          {
            type: parentType,
            field: fieldName,
            duration,
            userId,
          },
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[GraphQL Error] ${parentType}.${fieldName} (${duration}ms)`,
          error.stack,
          LoggingInterceptor.name,
          {
            type: parentType,
            field: fieldName,
            duration,
            userId,
            errorMessage: error.message,
          },
        );
        throw error;
      }),
    );
  }
}