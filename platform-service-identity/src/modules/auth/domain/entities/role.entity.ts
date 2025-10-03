import { randomInt } from 'crypto';

/**
 * @class Role
 * @description Represents a user role within the system (e.g., 'User', 'Administrator').
 * This is a domain entity that encapsulates the properties of a role.
 */
export class Role {
  public readonly id: number;
  public readonly name: string;

  private constructor(props: { id?: number; name: string }) {
    this.id = props.id ?? randomInt(1, 10000); // In a real app, this would be auto-incremented by the DB
    this.name = props.name;
  }

  /**
   * Factory method to create a new Role instance.
   * Enforces validation rules for role creation.
   * @param props - The properties for the new role.
   * @returns A new Role instance.
   */
  public static create(props: { id?: number; name: string }): Role {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Role name cannot be empty.');
    }
    // In a real application, more complex validation could be added here.
    return new Role(props);
  }
}