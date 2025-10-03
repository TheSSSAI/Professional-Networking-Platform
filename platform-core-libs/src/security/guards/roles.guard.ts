import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../../../platform-contracts/src/users/user.dto';

/**
 * A NestJS Guard for implementing Role-Based Access Control (RBAC).
 *
 * This guard works in conjunction with the `@Roles()` decorator. It intercepts
 * incoming requests, retrieves the roles required by the route handler (as defined
 * by the decorator), and compares them against the roles assigned to the authenticated user.
 *
 * The user object, which should contain a `roles` array, is expected to be attached
 * to the request object by a preceding authentication guard (e.g., `JwtAuthGuard`).
 *
 * If the user has at least one of the required roles, access is granted.
 * If the user does not have the required roles, or if the user object is missing,
 * a `ForbiddenException` is thrown, resulting in a 403 Forbidden response.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles required for the current route handler from metadata.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required for this route, access is granted by default.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract the request object from the execution context.
    // This guard supports both HTTP and gRPC contexts.
    const request = this.getRequestFromContext(context);
    const user = request.user;

    // If there is no user object on the request, or the user has no roles,
    // they cannot possibly satisfy the role requirement.
    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource.',
      );
    }

    // Check if the user's roles array includes at least one of the required roles.
    const hasRequiredRole = this.matchRoles(requiredRoles, user.roles);

    if (hasRequiredRole) {
      return true;
    }

    // If the user does not have the required role, deny access.
    throw new ForbiddenException(
      'You do not have the necessary permissions to access this resource.',
    );
  }

  /**
   * Extracts the request object from either an HTTP or gRPC execution context.
   * @param {ExecutionContext} context - The NestJS execution context.
   * @returns {any} The request object, which is expected to contain a `user` property.
   */
  private getRequestFromContext(context: ExecutionContext): any {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    // Assuming gRPC context if not HTTP
    // In a real-world gRPC scenario, user data might be in metadata.
    // This is a simplified placeholder for gRPC compatibility.
    // A more robust implementation would parse gRPC metadata.
    const rpc = context.switchToRpc();
    const metadata = rpc.getContext(); // Assumes metadata holds the context
    // You would typically get the request or user from the gRPC context
    return metadata.getRequest ? metadata.getRequest() : {};
  }

  /**
   * Checks if the user's roles array contains any of the required roles.
   * @param {Role[]} requiredRoles - Array of roles required to access the resource.
   * @param {Role[]} userRoles - Array of roles assigned to the user.
   * @returns {boolean} - True if the user has at least one matching role, false otherwise.
   */
  private matchRoles(requiredRoles: Role[], userRoles: Role[]): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}