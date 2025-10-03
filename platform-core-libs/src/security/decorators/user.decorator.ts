import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * A custom parameter decorator to extract the authenticated user object
 * (or a specific property of it) from the request.
 *
 * This decorator assumes that a preceding authentication guard (e.g., `JwtAuthGuard`)
 * has successfully validated the user and attached the user payload to the request object.
 *
 * @param {string} data - Optional. The name of a property to extract from the user object.
 *                        If not provided, the entire user object is returned.
 *
 * @example
 * ```
 * // 1. Get the entire user object
 * @Get('profile')
 * getProfile(@User() user: JwtPayload) {
 *   return user;
 * }
 *
 * // 2. Get a specific property (e.g., the user ID 'sub')
 * @Get('my-posts')
 * getMyPosts(@User('sub') userId: string) {
 *   return this.postsService.findByAuthor(userId);
 * }
 * ```
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a property name is passed (e.g., @User('sub')), return that property.
    // Otherwise, return the entire user object.
    return data ? user?.[data] : user;
  },
);