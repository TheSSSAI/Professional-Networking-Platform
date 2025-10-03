import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, FeatureFlag as PrismaFeatureFlag } from '@prisma/client';
import { IFeatureFlagRepository } from '../../domain/interfaces/feature-flag.repository';
import { FeatureFlag } from '../../domain/entities/feature-flag.entity';

/**
 * Prisma-based implementation of the IFeatureFlagRepository.
 * Handles persistence and retrieval of FeatureFlag entities.
 */
@Injectable()
export class FeatureFlagPrismaRepository implements IFeatureFlagRepository {
  private readonly logger = new Logger(FeatureFlagPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaFlag: PrismaFeatureFlag): FeatureFlag {
    return new FeatureFlag(
      prismaFlag.name,
      prismaFlag.description,
      prismaFlag.isEnabled,
    );
  }

  /**
   * Finds a feature flag by its unique name.
   * @param name The name of the feature flag.
   * @returns A FeatureFlag domain entity or null if not found.
   */
  async findByName(name: string): Promise<FeatureFlag | null> {
    try {
      const prismaFlag = await this.prisma.featureFlag.findUnique({
        where: { name },
      });

      return prismaFlag ? this.toDomain(prismaFlag) : null;
    } catch (error) {
      this.logger.error(`Failed to find feature flag by name: ${name}`, error.stack);
      throw new Error('Database error while finding feature flag.');
    }
  }

  /**
   * Retrieves all feature flags from the data store.
   * @returns An array of FeatureFlag domain entities.
   */
  async findAll(): Promise<FeatureFlag[]> {
    try {
      const prismaFlags = await this.prisma.featureFlag.findMany({
        orderBy: { name: 'asc' },
      });
      return prismaFlags.map(this.toDomain);
    } catch (error) {
      this.logger.error('Failed to find all feature flags', error.stack);
      throw new Error('Database error while finding all feature flags.');
    }
  }

  /**
   * Updates the state of an existing feature flag.
   * @param flag The FeatureFlag domain entity with updated values.
   * @returns The updated FeatureFlag domain entity.
   */
  async update(flag: FeatureFlag): Promise<FeatureFlag> {
    try {
      const updatedPrismaFlag = await this.prisma.featureFlag.update({
        where: { name: flag.name },
        data: {
          isEnabled: flag.isEnabled,
          description: flag.description,
        },
      });

      return this.toDomain(updatedPrismaFlag);
    } catch (error) {
      // Prisma throws a specific error if the record to update is not found.
      if (error.code === 'P2025') {
          throw new Error(`Feature flag with name '${flag.name}' not found.`);
      }
      this.logger.error(`Failed to update feature flag: ${flag.name}`, error.stack);
      throw new Error('Database error while updating feature flag.');
    }
  }
}