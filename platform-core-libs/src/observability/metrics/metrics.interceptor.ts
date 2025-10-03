import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

/**
 * A NestJS interceptor that captures and records key performance metrics for
 * incoming requests, compatible with Prometheus.
 *
 * This interceptor measures request duration and counts the number of requests,
 * labeling them with essential dimensions like route, method, and status code.
 * This data is crucial for monitoring application health, setting up SLOs/SLAs,
 * and diagnosing performance issues as required by REQ-1-083.
 *
 * @implements {NestInterceptor}
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Intercepts incoming requests to measure and record performance metrics.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @param {CallHandler} next - The handler for the next step in the request pipeline.
   * @returns {Observable<any>} An observable of the response stream.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = process.hrtime.bigint();
    const contextType = context.getType();
    let handler;
    let path: string;

    if (contextType === 'http') {
        handler = context.getHandler();
        path = this.reflector.get<string>('path', handler);
    } else if (context.getType<"graphql">() === 'graphql') {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        path = `${info.parentType.name}.${info.fieldName}`;
    } else {
        // Fallback for other context types like RPC
        path = context.getClass().name + '.' + context.getHandler().name;
    }


    return next.handle().pipe(
      tap(() => {
        const duration = this.calculateDuration(startTime);
        this.recordMetrics(context, path, duration);
      }),
      catchError((error) => {
        const duration = this.calculateDuration(startTime);
        this.recordMetrics(context, path, duration, error);
        throw error;
      }),
    );
  }

  private calculateDuration(startTime: bigint): number {
    const endTime = process.hrtime.bigint();
    return Number(endTime - startTime) / 1e6; // Convert nanoseconds to milliseconds
  }
  
  private recordMetrics(
    context: ExecutionContext,
    path: string,
    duration: number,
    error?: any,
  ) {
    const contextType = context.getType();
    let method: string;
    let statusCode: string;

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      method = request.method;
      statusCode = error ? (error.status || 500).toString() : response.statusCode.toString();
    } else if (context.getType<"graphql">() === 'graphql') {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        method = info.operation.operation.toUpperCase();
        statusCode = error ? 'ERROR' : 'SUCCESS';
    } else {
        method = 'RPC';
        statusCode = error ? 'ERROR' : 'SUCCESS';
    }


    this.metricsService.incrementRequestCounter(method, path, statusCode);
    this.metricsService.observeRequestDuration(method, path, statusCode, duration);
  }
}