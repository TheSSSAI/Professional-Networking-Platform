/**
 * Defines the types of actions an administrator can perform that must be logged.
 * This enum provides type safety within the domain and application layers.
 * It must be kept in sync with the Prisma schema and the admin.proto contract.
 * Fulfills REQ-1-044.
 */
export enum AdminActionType {
  DISMISS_REPORT = 'DISMISS_REPORT',
  REMOVE_CONTENT = 'REMOVE_CONTENT',
  ISSUE_WARNING = 'ISSUE_WARNING',
  SUSPEND_USER = 'SUSPEND_USER',
  BAN_USER = 'BAN_USER',
  TRIGGER_PASSWORD_RESET = 'TRIGGER_PASSWORD_RESET',
  UPDATE_FEATURE_FLAG = 'UPDATE_FEATURE_FLAG',
}