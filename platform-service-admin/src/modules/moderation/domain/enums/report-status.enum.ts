/**
 * Defines the lifecycle status of a content report in the moderation queue.
 * This enum provides type safety within the domain and application layers.
 * It must be kept in sync with the Prisma schema and the admin.proto contract.
 * Fulfills REQ-1-041.
 */
export enum ReportStatus {
  PENDING = 'PENDING',
  DISMISSED = 'DISMISSED',
  ACTION_TAKEN = 'ACTION_TAKEN',
}