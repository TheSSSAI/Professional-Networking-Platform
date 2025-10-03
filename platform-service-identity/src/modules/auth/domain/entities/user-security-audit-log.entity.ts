import { v4 as uuidv4 } from 'uuid';

interface UserSecurityAuditLogProps {
  id?: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt?: Date;
}

/**
 * @class UserSecurityAuditLog
 * @description Represents an immutable log entry for a security-sensitive action performed by or on a user's account.
 */
export class UserSecurityAuditLog {
  public readonly id: string;
  public readonly userId: string;
  public readonly action: string;
  public readonly ipAddress: string;
  public readonly userAgent: string;
  public readonly createdAt: Date;

  private constructor(props: UserSecurityAuditLogProps) {
    this.id = props.id ?? uuidv4();
    this.userId = props.userId;
    this.action = props.action;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.createdAt = props.createdAt ?? new Date();
  }

  /**
   * Factory method to create a new security audit log entry.
   * @param props - The properties for the new log entry.
   * @returns A new UserSecurityAuditLog instance.
   */
  public static create(props: Omit<UserSecurityAuditLogProps, 'id' | 'createdAt'>): UserSecurityAuditLog {
    if (!props.userId || !props.action) {
      throw new Error('User ID and action are required for an audit log entry.');
    }

    return new UserSecurityAuditLog({
      ...props,
      ipAddress: props.ipAddress || 'unknown',
      userAgent: props.userAgent || 'unknown',
    });
  }
}