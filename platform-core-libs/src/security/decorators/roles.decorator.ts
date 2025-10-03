import { SetMetadata } from '@nestjs/common';

/**
 * The metadata key used to store and retrieve role information
 * for a route handler. Exported to be used by the RolesGuard.
 */
export const ROLES_KEY = 'roles';

/**
 * A custom decorator to associate a set of roles with a route handler.
 * This metadata is used by the `RolesGuard` to perform role-based access control (RBAC).
 *
 * @param {...string[]} roles - An array of role names required to access the resource.
 *
 * @example
 * ```
 * @Roles('Admin', 'Moderator')
 * @Get('admin/dashboard')
 * getDashboard() { ... }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);