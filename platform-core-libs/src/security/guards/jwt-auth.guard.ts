import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ITokenBlocklistService } from '../interfaces/token-blocklist-service.interface';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * A custom JWT authentication guard that extends the default Passport JWT guard.
 *
 * This guard is responsible for:
 * 1. Validating the JWT access token's signature and expiration using Passport.
 * 2. Allowing access to routes marked with the `@Public()` decorator.
 * 3. Checking the validated token's unique identifier (jti) against a Redis-backed
 *    blocklist to implement immediate token revocation for security events like
 *    logout and password changes, as required by REQ-1-005.
 *
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ITokenBlocklistService)
    private readonly tokenBlocklistService: ITokenBlocklistService,
  ) {
    super();
  }

  /**
   * Determines if the current request is authorized.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {Promise<boolean>} A promise that resolves to true if authorized, or throws an exception.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // `super.canActivate(context)` will trigger the Passport JWT strategy.
    // If the token is invalid or expired, it will throw an UnauthorizedException.
    // If it's valid, it will attach the payload to `request.user`.
    // We await it to ensure this process completes before our custom logic.
    await super.canActivate(context);

    const request = this.getRequest(context);
    const user = request.user;

    if (!user || !user.jti) {
      throw new UnauthorizedException('Invalid token: Missing required claims.');
    }

    const isBlocked = await this.tokenBlocklistService.isBlocked(user.jti);
    if (isBlocked) {
      throw new UnauthorizedException('Token has been revoked.');
    }

    return true;
  }
  
  /**
   * Overrides the default handleRequest to add custom logic after Passport's
   * standard JWT validation. Although canActivate is overridden for more complex
   * checks, this method is useful for custom error handling.
   *
   * @param {any} err - Error from Passport strategy.
   * @param {any} user - The user payload from the validated token.
   * @param {any} info - Additional information from the strategy (e.g., error message).
   * @returns {any} The user payload if authentication is successful.
   * @throws {UnauthorizedException} If authentication fails for any reason.
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      // This handles cases like expired token, invalid signature, etc.
      // `info` might contain details like `JsonWebTokenError` or `TokenExpiredError`.
      throw err || new UnauthorizedException(info?.message || 'Invalid token.');
    }
    
    // The main blocklist logic is now in canActivate to work with Public decorators.
    // This method simply returns the user if the initial passport validation passes.
    // The `canActivate` method will then proceed with its own checks.
    return user;
  }
  
  private getRequest(context: ExecutionContext) {
      const contextType = context.getType();
      if (contextType === 'http') {
          return context.switchToHttp().getRequest();
      } else if (contextType === 'rpc') {
          return context.switchToRpc().getData();
      } else if (context.getType<"graphql">() === 'graphql') {
          const { req } = context.getArgs()[2];
          return req;
      }
      // Fallback for unknown context types
      return context.switchToHttp().getRequest();
  }
}