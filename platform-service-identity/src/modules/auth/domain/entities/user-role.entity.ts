/**
 * @class UserRole
 * @description Represents the association between a User and a Role (linking entity for many-to-many relationship).
 * This is a domain entity that encapsulates the properties of this association.
 */
export class UserRole {
  public readonly userId: string;
  public readonly roleId: number;

  private constructor(props: { userId: string; roleId: number }) {
    this.userId = props.userId;
    this.roleId = props.roleId;
  }

  /**
   * Factory method to create a new UserRole association.
   * @param props - The properties for the user-role link.
   * @returns A new UserRole instance.
   */
  public static create(props: { userId: string; roleId: number }): UserRole {
    if (!props.userId || !props.roleId) {
      throw new Error('User ID and Role ID are required to create a UserRole association.');
    }
    return new UserRole(props);
  }
}