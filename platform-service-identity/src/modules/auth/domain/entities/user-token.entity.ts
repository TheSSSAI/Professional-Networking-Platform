import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';
import { TokenType } from '../enums/token-type.enum';

interface UserTokenProps {
  id?: string;
  userId: string;
  tokenType: TokenType;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
}

/**
 * @class UserToken
 * @description Represents a single-use token for actions like email verification or password reset.
 * This domain entity encapsulates token logic, such as creation and expiration checks.
 */
export class UserToken {
  public readonly id: string;
  public readonly userId: string;
  public readonly tokenType: TokenType;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;

  private constructor(props: UserTokenProps) {
    this.id = props.id ?? uuidv4();
    this.userId = props.userId;
    this.tokenType = props.tokenType;
    this.tokenHash = props.tokenHash;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt ?? new Date();
  }

  /**
   * Checks if the token has expired.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  /**
   * Factory method to create a new UserToken for email verification.
   * @param userId - The ID of the user for whom the token is generated.
   * @returns An object containing the plaintext token and the UserToken entity.
   */
  public static createForEmailVerification(userId: string): {
    token: string;
    entity: UserToken;
  } {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const entity = new UserToken({
      userId,
      tokenType: TokenType.EMAIL_VERIFICATION,
      tokenHash,
      expiresAt,
    });

    return { token, entity };
  }

  /**
   * Factory method to create a new UserToken for password reset.
   * @param userId - The ID of the user for whom the token is generated.
   * @returns An object containing the plaintext token and the UserToken entity.
   */
  public static createForPasswordReset(userId: string): {
    token: string;
    entity: UserToken;
  } {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const entity = new UserToken({
      userId,
      tokenType: TokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt,
    });

    return { token, entity };
  }

  /**
   * Rehydrates a UserToken entity from its properties.
   * @param props - The properties of an existing UserToken.
   * @returns A UserToken instance.
   */
  public static from(props: UserTokenProps): UserToken {
    return new UserToken(props);
  }
}