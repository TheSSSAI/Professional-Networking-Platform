/**
 * Represents the lifecycle states of a connection request.
 * This enum mirrors the 'ConnectionStatus' enum in the Prisma schema.
 *
 * @enum {string}
 * @property {string} PENDING - The request has been sent but not yet actioned.
 * @property {string} ACCEPTED - The request has been accepted, forming a connection.
 * @property {string} DECLINED - The request has been declined by the recipient.
 */
export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}