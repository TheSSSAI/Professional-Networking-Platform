import { v4 as uuidv4 } from 'uuid';

type DeletionStatus = 'PENDING' | 'CANCELLED' | 'COMPLETED';

interface AccountDeletionRequestProps {
  id?: string;
  userId: string;
  scheduledPurgeAt: Date;
  status: DeletionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @class AccountDeletionRequest
 * @description Represents a user's request to permanently delete their account.
 * This entity encapsulates the state of the deletion process, including the grace period.
 */
export class AccountDeletionRequest {
  public readonly id: string;
  public readonly userId: string;
  public scheduledPurgeAt: Date;
  public status: DeletionStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: AccountDeletionRequestProps) {
    this.id = props.id ?? uuidv4();
    this.userId = props.userId;
    this.scheduledPurgeAt = props.scheduledPurgeAt;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Factory method to create a new account deletion request.
   * @param userId - The ID of the user requesting deletion.
   * @param gracePeriodDays - The number of days for the grace period.
   * @returns A new AccountDeletionRequest instance.
   */
  public static create(
    userId: string,
    gracePeriodDays: number,
  ): AccountDeletionRequest {
    if (!userId) {
      throw new Error('User ID is required to create a deletion request.');
    }
    if (gracePeriodDays <= 0) {
      throw new Error('Grace period must be a positive number.');
    }

    const scheduledPurgeAt = new Date();
    scheduledPurgeAt.setDate(scheduledPurgeAt.getDate() + gracePeriodDays);

    return new AccountDeletionRequest({
      userId,
      scheduledPurgeAt,
      status: 'PENDING',
    });
  }

  /**
   * Cancels a pending deletion request.
   */
  public cancel(): void {
    if (this.status !== 'PENDING') {
      throw new Error('Only pending deletion requests can be cancelled.');
    }
    if (new Date() > this.scheduledPurgeAt) {
      throw new Error('Cannot cancel a deletion request after the grace period has expired.');
    }
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
  }

    /**
   * Marks a deletion request as completed.
   */
  public complete(): void {
    if (this.status !== 'PENDING') {
      throw new Error('Only a pending request can be marked as completed.');
    }
    this.status = 'COMPLETED';
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === 'PENDING';
  }
}