import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ITokenBlocklistService } from '../../domain/interfaces/token-blocklist.service.interface';
import { REDIS_CLIENT } from 'src/config/redis.config';

@Injectable()
export class RedisTokenBlocklistService implements ITokenBlocklistService {
  private readonly logger = new Logger(RedisTokenBlocklistService.name);
  private readonly keyPrefix = 'blocklist:jti:';

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  /**
   * Adds a JWT identifier (jti) to the blocklist in Redis.
   * The key is set with a TTL equal to the token's remaining validity.
   * @param jti The unique identifier of the JWT.
   * @param expiry The Unix timestamp (in seconds) when the token expires.
   */
  async addToBlocklist(jti: string, expiry: number): Promise<void> {
    const key = `${this.keyPrefix}${jti}`;
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiry - now;

    if (ttl <= 0) {
      // Token is already expired, no need to add to blocklist.
      this.logger.verbose(`Token ${jti} is already expired. Not adding to blocklist.`);
      return;
    }

    try {
      // 'EX' sets the expiry in seconds.
      // The value '1' is arbitrary; we only care about the key's existence.
      await this.redisClient.set(key, '1', 'EX', ttl);
      this.logger.log(`Token ${jti} added to blocklist with TTL of ${ttl} seconds.`);
    } catch (error) {
      this.logger.error(`Failed to add token ${jti} to Redis blocklist.`, error.stack);
      // We throw an error here so the calling service (e.g., logout)
      // knows the operation failed and can handle it accordingly.
      throw new Error('Could not add token to blocklist.');
    }
  }

  /**
   * Checks if a JWT identifier (jti) exists in the blocklist.
   * Implements a fail-secure approach: if Redis is unavailable, it assumes the token is blocklisted.
   * @param jti The unique identifier of the JWT to check.
   * @returns A promise that resolves to true if the token is blocklisted or if Redis is unavailable, otherwise false.
   */
  async isBlocklisted(jti: string): Promise<boolean> {
    const key = `${this.keyPrefix}${jti}`;

    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check Redis blocklist for token ${jti}. Failing secure by assuming token is blocklisted.`,
        error.stack,
      );
      // Fail-secure: If we can't check the blocklist, we must assume the token is revoked
      // to prevent a security vulnerability where a Redis outage allows revoked tokens to be used.
      return true;
    }
  }
}