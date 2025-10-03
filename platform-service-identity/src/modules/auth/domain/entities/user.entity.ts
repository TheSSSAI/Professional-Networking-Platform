import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '../enums/user-status.enum';
import { IHashingService } from '../interfaces/hashing.service.interface';
import { PasswordDomainService } from '../services/password.domain-service';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidUserStateException extends DomainError {}
export class AgeRestrictionError extends DomainError {}

interface UserProps {
  id?: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  dateOfBirth: Date;
  mfaSecret?: string | null;
  mfaEnabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @class User
 * @description Represents a user in the domain. Encapsulates user state and business logic related to identity management.
 * This is the Aggregate Root for the User context.
 */
export class User {
  public readonly id: string;
  public readonly email: string;
  private passwordHash: string;
  public status: UserStatus;
  public readonly dateOfBirth: Date;
  private mfaSecret: string | null;
  public mfaEnabled: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private events: any[] = [];

  private constructor(props: UserProps) {
    this.id = props.id ?? uuidv4();
    this.email = props.email.toLowerCase();
    this.passwordHash = props.passwordHash;
    this.status = props.status;
    this.dateOfBirth = props.dateOfBirth;
    this.mfaSecret = props.mfaSecret ?? null;
    this.mfaEnabled = props.mfaEnabled ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }
  
  public getMfaSecret(): string | null {
    return this.mfaSecret;
  }

  public getEvents(): any[] {
    return this.events;
  }

  public clearEvents(): void {
    this.events = [];
  }

  private addEvent(event: any): void {
    this.events.push(event);
  }

  /**
   * Factory method to create a new User instance. Enforces creation invariants.
   * @param props - Properties for creating a new user.
   * @param hashingService - Service for hashing the password.
   * @returns A new User instance.
   */
  public static async create(
    props: { email: string; password; string; dateOfBirth: Date },
    hashingService: IHashingService,
    passwordDomainService: PasswordDomainService,
  ): Promise<User> {
    this.validateAge(props.dateOfBirth);
    passwordDomainService.validateComplexity(props.password);

    const passwordHash = await hashingService.hash(props.password);
    const user = new User({
      ...props,
      passwordHash,
      status: UserStatus.INACTIVE,
    });

    user.addEvent(new UserRegisteredEvent(user.id, user.email));
    return user;
  }

  private static validateAge(dateOfBirth: Date): void {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    const m = new Date().getMonth() - new Date(dateOfBirth).getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < new Date(dateOfBirth).getDate())) {
      // Not had birthday this year yet
    }
    if (age < 16) {
      throw new AgeRestrictionError('User must be at least 16 years old.');
    }
  }

  /**
   * Compares a plaintext password against the user's stored hash.
   * @param password - The plaintext password to compare.
   * @param hashingService - Service for comparing the password.
   * @returns True if the password matches, false otherwise.
   */
  public async comparePassword(
    password: string,
    hashingService: IHashingService,
  ): Promise<boolean> {
    return hashingService.compare(password, this.passwordHash);
  }

  /**
   * Activates a user account, typically after email verification.
   */
  public activate(): void {
    if (this.status !== UserStatus.INACTIVE) {
      throw new InvalidUserStateException(
        'Only an inactive user can be activated.',
      );
    }
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  /**
   * Changes the user's password.
   * @param newPassword - The new plaintext password.
   * @param hashingService - Service for hashing the new password.
   */
  public async changePassword(
    newPassword: string,
    hashingService: IHashingService,
    passwordDomainService: PasswordDomainService,
  ): Promise<void> {
    passwordDomainService.validateComplexity(newPassword);
    this.passwordHash = await hashingService.hash(newPassword);
    this.updatedAt = new Date();
    // In a real system, an event `PasswordChangedEvent` would be raised here
    // to trigger session invalidation for this user.
  }
  
  /**
   * Initiates the password reset flow.
   */
  public requestPasswordReset(): void {
    if (this.status === UserStatus.BANNED) {
      // Silently fail for banned users to prevent account status enumeration
      return;
    }
    this.addEvent(new PasswordResetRequestedEvent(this.id, this.email));
  }

  /**
   * Deactivates a user's account.
   */
  public deactivate(): void {
    if (this.status !== UserStatus.ACTIVE) {
      throw new InvalidUserStateException('Only an active account can be deactivated.');
    }
    this.status = UserStatus.DEACTIVATED;
    this.updatedAt = new Date();
  }

  /**
   * Reactivates a deactivated user's account.
   */
  public reactivate(): void {
    if (this.status !== UserStatus.DEACTIVATED) {
        throw new InvalidUserStateException('Only a deactivated account can be reactivated.');
    }
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  public enableMfa(mfaSecret: string): void {
    if (this.mfaEnabled) {
      throw new InvalidUserStateException('MFA is already enabled.');
    }
    this.mfaSecret = mfaSecret;
    this.mfaEnabled = true;
    this.updatedAt = new Date();
  }

  public disableMfa(): void {
    if (!this.mfaEnabled) {
      throw new InvalidUserStateException('MFA is not enabled.');
    }
    this.mfaSecret = null;
    this.mfaEnabled = false;
    this.updatedAt = new Date();
  }

  public canLogin(): boolean {
      return this.status === UserStatus.ACTIVE || this.status === UserStatus.DEACTIVATED;
  }
}