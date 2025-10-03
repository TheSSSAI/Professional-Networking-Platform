import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

/**
 * A shared service to manage the Redis client instance and provide a clean
 * interface for interacting with the Redis server. This service handles
 * the connection lifecycle and abstracts the `ioredis` client.
 *
 * It is a foundational component for features requiring caching, real-time
 * state management, and distributed communication, such as the Socket.IO Redis adapter
 * for scalability (REQ-1-052).
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Initializes the Redis client upon module start.
   * Fetches the Redis connection URL from the application configuration.
   * Sets up listeners for connection events.
   */
  async onModuleInit(): Promise<void> {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.error('REDIS_URL is not defined in the configuration.');
      throw new Error('REDIS_URL is not defined.');
    }

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Allow NestJS to handle restarts
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis server.');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  /**
   * Gracefully disconnects the Redis client upon module destruction.
   */
  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis client disconnected.');
    }
  }

  /**
   * Provides direct access to the underlying ioredis client instance.
   * This is particularly useful for integrating with libraries that require
   * a client object, such as the `socket.io-redis` adapter.
   * @returns The ioredis client instance.
   */
  getClient(): RedisClient {
    return this.client;
  }

  // --- String Commands ---

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  // --- Set Commands ---

  async sadd(key: string, member: string | string[]): Promise<number> {
    const members = Array.isArray(member) ? member : [member];
    return this.client.sadd(key, ...members);
  }

  async srem(key: string, member: string | string[]): Promise<number> {
    const members = Array.isArray(member) ? member : [member];
    return this.client.srem(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  // --- Hash Commands ---

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, field: string | string[]): Promise<number> {
    const fields = Array.isArray(field) ? field : [field];
    return this.client.hdel(key, ...fields);
  }

  // --- Key Management ---

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}