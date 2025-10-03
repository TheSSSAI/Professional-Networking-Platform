import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Profile } from '../../domain/entities/profile.entity';

@Injectable()
export class ProfileCacheService {
  private readonly logger = new Logger(ProfileCacheService.name);
  private readonly ttl: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.ttl = this.configService.get<number>('CACHE_TTL_PROFILE', 3600);
  }

  private getCacheKey(userId: string): string {
    return `profile:${userId}`;
  }

  async get(userId: string): Promise<Profile | null> {
    try {
      const cachedProfile = await this.cacheManager.get<string>(
        this.getCacheKey(userId),
      );
      if (cachedProfile) {
        this.logger.log(`Cache HIT for user ID: ${userId}`);
        const plainProfile = JSON.parse(cachedProfile);
        // Re-hydrate the domain entity from plain object
        return Profile.reconstitute(plainProfile);
      }
      this.logger.log(`Cache MISS for user ID: ${userId}`);
      return null;
    } catch (error) {
      this.logger.error(
        `Error getting profile from cache for user ID: ${userId}`,
        error.stack,
      );
      return null;
    }
  }

  async set(profile: Profile): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(profile.userId);
      // Serialize the entity to a plain object for caching
      const plainProfile = profile.toObject();
      await this.cacheManager.set(cacheKey, JSON.stringify(plainProfile), {
        ttl: this.ttl,
      } as any); // Type assertion for TTL compatibility if needed
      this.logger.log(`Profile cached for user ID: ${profile.userId}`);
    } catch (error) {
      this.logger.error(
        `Error setting profile in cache for user ID: ${profile.userId}`,
        error.stack,
      );
    }
  }

  async invalidate(userId: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(userId);
      await this.cacheManager.del(cacheKey);
      this.logger.log(`Cache invalidated for user ID: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error invalidating cache for user ID: ${userId}`,
        error.stack,
      );
    }
  }
}