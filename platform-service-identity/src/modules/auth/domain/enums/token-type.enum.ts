/**
 * Defines the types of single-use tokens stored in the database for security-sensitive actions.
 * This corresponds to the `TokenType` enum in `schema.prisma`.
 */
export enum TokenType {
  /**
   * A token used to verify a user's email address upon registration (REQ-1-001).
   */
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',

  /**
   * A token used to authorize a password reset action (REQ-1-003).
   */
  PASSWORD_RESET = 'PASSWORD_RESET',
}