import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ITokenBlocklistService } from '../interfaces/token-blocklist-service.interface';
import { LoggerService } from '../../observability/logging/logger.service';
import { ConfigService } from '../../config/config.service';

/**
 * @class TokenBlocklistService
 * @description Implements the logic for managing a JWT blocklist using Redis.
 * This service provides methods to add tokens to the blocklist and check if they are blocked.
 * It is a core component for implementing secure logout and session invalidation as per REQ-1-005.
 *
 * @implements {ITokenBlocklistService}
 *
 * @requires Redis - A Redis client instance (expected to be injected).
 * @requires LoggerService - For logging errors during Redis operations.
 * @requires ConfigService - To provide context to the logger.
 */
@Injectable()
export class TokenBlocklistService implements ITokenBlocklistService {
  private readonly logger: LoggerService;
  private readonly keyPrefix = 'blocklist:jwt:';

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    // Injecting ConfigService to pass to the logger constructor
    private readonly configService: ConfigService,
  ) {
    this.logger = new LoggerService(this.configService);
    this.logger.setContext(TokenBlocklistService.name);
  }

  /**
   * @method isBlocked
   * @description Checks if a JWT's unique identifier (jti) is on the blocklist.
   * @param {string} jti - The unique identifier of the JWT.
   * @returns {Promise<boolean>} True if the token is blocked, false otherwise.
   * Fails safely by returning false and logging an error if Redis is unavailable.
   */
  async isBlocked(jti: string): Promise<boolean> {
    if (!jti) {
      return false;
    }
    try {
      const key = `${this.keyPrefix}${jti}`;
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        'Failed to check token blocklist in Redis. Failing safely (token not blocked).',
        error.stack,
      );
      return false;
    }
  }

  /**
   * @method addToBlocklist
   * @description Adds a JWT's unique identifier (jti) to the blocklist with a TTL.
   * The TTL is calculated based on the token's original expiry time to prevent
   * the blocklist from growing indefinitely.
   * @param {string} jti - The unique identifier of the JWT to block.
   * @param {number} expiry - The Unix timestamp (in seconds) when the token expires.
   * @returns {Promise<void>}
   */
  async addToBlocklist(jti: string, expiry: number): Promise<void> {
    if (!jti || !expiry) {
        return;
    }
    try {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const ttl = expiry - nowInSeconds;

      // Only add to blocklist if the token is not already expired.
      if (ttl > 0) {
        const key = `${this.keyPrefix}${jti}`;
        await this.redisClient.set(key, 'revoked', 'EX', ttl);
      }
    } catch (error) {
      this.logger.error(
        'Failed to add token to blocklist in Redis.',
        error.stack,
      );
      // We log the error but do not throw, as failing to blocklist a token
      // should not crash the primary operation (e.g., logout, password change).
    }
  }
}