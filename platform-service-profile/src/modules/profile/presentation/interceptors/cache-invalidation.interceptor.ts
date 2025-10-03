import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProfileCacheService } from '../../infrastructure/caching/profile-cache.service';

/**
 * A NestJS interceptor for gRPC methods that automatically invalidates the profile cache
 * for a specific user after a successful write operation (e.g., update, add/remove experience).
 *
 * This follows a cache invalidation strategy where writes to the primary data store
 * trigger a cache clear, ensuring subsequent reads fetch fresh data.
 */
@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

  constructor(private readonly profileCacheService: ProfileCacheService) {}

  /**
   * Intercepts the request-response cycle to apply cache invalidation logic.
   * @param context The execution context of the incoming gRPC request.
   * @param next The call handler to proceed with the request.
   * @returns An observable of the response stream.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const userId = data.userId;

    if (!userId) {
      this.logger.warn(
        'CacheInvalidationInterceptor could not find userId in the request payload. Skipping cache invalidation.',
      );
      return next.handle();
    }

    // The 'tap' operator allows us to perform a side-effect (cache invalidation)
    // after the main handler has successfully completed, without altering the response.
    return next.handle().pipe(
      tap({
        // This block runs only on a successful response from the controller method.
        next: () => {
          this.logger.log(
            `Write operation successful for user '${userId}'. Invalidating profile cache.`,
          );
          // Asynchronously clear the cache. We don't await this to avoid adding latency
          // to the response. The operation is fire-and-forget from the client's perspective.
          this.profileCacheService
            .clearProfileCache(userId)
            .catch((error) => {
              this.logger.error(
                `Failed to invalidate cache for user '${userId}'. Error: ${error.message}`,
                error.stack,
              );
              // Note: We log the error but do not throw, as the primary operation was successful.
              // This prevents a cache failure from failing the entire user request.
              // Monitoring should be in place for cache failures.
            });
        },
        // Error block is optional. If the controller method throws an error, this interceptor
        // will not attempt to clear the cache, which is the correct behavior.
        error: (err) => {
            this.logger.debug(`Operation failed for user '${userId}'. Skipping cache invalidation. Error: ${err.message}`)
        }
      }),
    );
  }
}