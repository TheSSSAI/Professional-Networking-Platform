export interface FeatureFlagProps {
  key: string;
  description: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class FeatureFlag
 * @description Represents a system-level feature flag that can be toggled by an administrator.
 * This is an aggregate root for the Configuration bounded context.
 * Implements REQ-1-045.
 */
export class FeatureFlag {
  private _key: string;
  private _description: string;
  private _isEnabled: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: FeatureFlagProps) {
    this._key = props.key;
    this._description = props.description;
    this._isEnabled = props.isEnabled;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Factory method to create a new FeatureFlag.
   * @param createProps - Properties for the new feature flag.
   * @returns A new instance of FeatureFlag.
   */
  public static create(createProps: {
    key: string;
    description: string;
    isEnabled?: boolean;
  }): FeatureFlag {
    if (!createProps.key || createProps.key.trim() === '') {
      throw new Error('Feature flag key cannot be empty.');
    }
    if (!createProps.description || createProps.description.trim() === '') {
        throw new Error('Feature flag description cannot be empty.');
    }

    const now = new Date();
    const props: FeatureFlagProps = {
      key: createProps.key,
      description: createProps.description,
      isEnabled: createProps.isEnabled ?? false,
      createdAt: now,
      updatedAt: now,
    };
    return new FeatureFlag(props);
  }

  /**
   * Reconstitutes a FeatureFlag from its properties, e.g., from a database record.
   * @param props - The complete properties of an existing feature flag.
   * @returns An instance of FeatureFlag.
   */
  public static reconstitute(props: FeatureFlagProps): FeatureFlag {
    return new FeatureFlag(props);
  }

  // --- Business Logic Methods ---

  /**
   * Enables the feature flag.
   */
  public enable(): void {
    if (this._isEnabled) {
      // Idempotent operation, no error needed.
      return;
    }
    this._isEnabled = true;
    this._updatedAt = new Date();
  }

  /**
   * Disables the feature flag.
   */
  public disable(): void {
    if (!this._isEnabled) {
      // Idempotent operation, no error needed.
      return;
    }
    this._isEnabled = false;
    this._updatedAt = new Date();
  }

  /**
   * Updates the description of the feature flag.
   * @param newDescription The new description text.
   */
  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim() === '') {
        throw new Error('Description cannot be empty.');
    }
    if (this._description === newDescription) {
        return;
    }
    this._description = newDescription;
    this._updatedAt = new Date();
  }
  
  // --- Getters ---

  get key(): string {
    return this._key;
  }

  get description(): string {
    return this._description;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }
  
  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}