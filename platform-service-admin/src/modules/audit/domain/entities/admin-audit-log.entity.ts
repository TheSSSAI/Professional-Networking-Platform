import { randomUUID } from 'crypto';
import { AdminActionType } from '../enums/admin-action-type.enum';

export interface AdminAuditLogProps {
  id: string;
  adminId: string;
  actionType: AdminActionType;
  targetId: string;
  targetType: string;
  reason?: string;
  details: Record<string, any>;
  timestamp: Date;
}

/**
 * @class AdminAuditLog
 * @description Represents an immutable record of an action performed by an administrator.
 * This is an aggregate root for the Auditing bounded context.
 * Implements REQ-1-044.
 */
export class AdminAuditLog {
  private readonly _id: string;
  private readonly _adminId: string;
  private readonly _actionType: AdminActionType;
  private readonly _targetId: string;
  private readonly _targetType: string;
  private readonly _reason?: string;
  private readonly _details: Record<string, any>;
  private readonly _timestamp: Date;

  private constructor(props: AdminAuditLogProps) {
    this._id = props.id;
    this._adminId = props.adminId;
    this._actionType = props.actionType;
    this._targetId = props.targetId;
    this._targetType = props.targetType;
    this._reason = props.reason;
    this._details = props.details;
    this._timestamp = props.timestamp;
  }

  /**
   * Factory method to create a new AdminAuditLog instance.
   * This encapsulates the creation logic and ensures all new logs are valid.
   * @param createProps - The properties to create a new log entry.
   * @returns A new instance of AdminAuditLog.
   */
  public static create(createProps: {
    adminId: string;
    actionType: AdminActionType;
    targetId: string;
    targetType: string;
    reason?: string;
    details?: Record<string, any>;
  }): AdminAuditLog {
    if (!createProps.adminId || !createProps.actionType || !createProps.targetId || !createProps.targetType) {
      throw new Error('Admin ID, Action Type, Target ID, and Target Type are required to create an audit log.');
    }

    const props: AdminAuditLogProps = {
      id: randomUUID(),
      adminId: createProps.adminId,
      actionType: createProps.actionType,
      targetId: createProps.targetId,
      targetType: createProps.targetType,
      reason: createProps.reason,
      details: createProps.details || {},
      timestamp: new Date(),
    };

    return new AdminAuditLog(props);
  }

  // --- Getters to expose properties in a controlled way ---

  get id(): string {
    return this._id;
  }

  get adminId(): string {
    return this._adminId;
  }

  get actionType(): AdminActionType {
    return this._actionType;
  }
  
  get targetId(): string {
    return this._targetId;
  }
  
  get targetType(): string {
    return this._targetType;
  }
  
  get reason(): string | undefined {
    return this._reason;
  }

  get details(): Record<string, any> {
    // Return a deep copy to ensure immutability
    return JSON.parse(JSON.stringify(this._details));
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}