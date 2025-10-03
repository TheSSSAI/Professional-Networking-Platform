import { JwtPayloadDto } from '../../dtos/jwt-payload.dto';

/**
 * Command to log out a user.
 * This class encapsulates the payload of the token to be invalidated.
 */
export class LogoutUserCommand {
  /**
   * @param jwtPayload The decoded payload of the JWT access token to be invalidated.
   *                   It must contain the `jti` and `exp` claims.
   */
  constructor(public readonly jwtPayload: JwtPayloadDto & { exp: number }) {}
}