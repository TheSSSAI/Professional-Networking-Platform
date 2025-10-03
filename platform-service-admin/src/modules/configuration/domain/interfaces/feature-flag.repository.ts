import { FeatureFlag } from '../entities/feature-flag.entity';

/**
 * Interface for the FeatureFlag repository (Port in Clean Architecture).
 * It defines the contract for data persistence operations related to feature flags.
 *
 * Fulfills REQ-1-045.
 */
export interface FeatureFlagRepository {
  /**
   * Finds a feature flag by its unique key.
   * @param key The unique key of the feature flag.
   * @returns A promise that resolves to the FeatureFlag entity or null if not found.
   */
  findByKey(key: string): Promise<FeatureFlag | null>;

  /**
   * Retrieves all feature flags from the data store.
   * @returns A promise that resolves to an array of all FeatureFlag entities.
   */
  findAll(): Promise<FeatureFlag[]>;

  /**
   * Updates an existing feature flag.
   * @param key The unique key of the feature flag to update.
   * @param data The partial data to update.
   * @returns A promise that resolves to the updated FeatureFlag entity.
   */
  update(
    key: string,
    data: Partial<{ isEnabled: boolean; description: string }>,
  ): Promise<FeatureFlag>;
}