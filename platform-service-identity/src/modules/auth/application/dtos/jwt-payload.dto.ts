import { UserStatus } from '../../domain/enums/user-status.enum';

/**
 * Data Transfer Object representing the payload of a JSON Web Token.
 * This is the data that gets encoded into the JWT and is available
 * on authenticated requests.
 */
export class JwtPayloadDto {
  /**
   * The unique identifier for the user (subject of the token).
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  readonly sub: string;

  /**
   * The user's email address.
   * @example 'user@example.com'
   */
  readonly email: string;

  /**
   * The user's current status.
   * @example UserStatus.ACTIVE
   */
  readonly status: UserStatus;

  /**
   * The unique identifier for this specific token instance.
   * Used for token revocation (blocklisting).
   * @example 'f7b3b3b3-3b3b-4b3b-8b3b-3b3b3b3b3b3b'
   */
  readonly jti: string;

  /**
   * The user's roles.
   * @example ['USER']
   */
  readonly roles: string[];
}