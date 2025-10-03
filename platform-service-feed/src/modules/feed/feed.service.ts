import { Inject, Injectable, Logger, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import { IFeedService } from './interfaces/feed.service.interface';
import { IFeedRepository } from './interfaces/feed.repository.interface';
import { IConnectionsClientService } from '../../shared/grpc-clients/connections/interfaces/connections-client.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeedService implements IFeedService {
  private readonly logger = new Logger(FeedService.name);
  private readonly SUPER_NODE_THRESHOLD: number;
  private readonly FAN_OUT_CHUNK_SIZE: number;

  constructor(
    @Inject('IFeedRepository')
    private readonly feedRepository: IFeedRepository,
    @Inject('IConnectionsClientService')
    private readonly connectionsClientService: IConnectionsClientService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.SUPER_NODE_THRESHOLD = this.configService.get<number>(
      'SUPER_NODE_THRESHOLD',
      5000,
    );
    this.FAN_OUT_CHUNK_SIZE = this.configService.get<number>(
      'FAN_OUT_CHUNK_SIZE',
      1000,
    );
  }

  async getFeed(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ postIds: string[] }> {
    this.logger.log(`Fetching feed for userId: ${userId}, page: ${page}, limit: ${limit}`);
    try {
      const start = (page - 1) * limit;
      const stop = start + limit - 1;
      const postIds = await this.feedRepository.getFeedPage(userId, start, stop);
      this.logger.log(`Found ${postIds.length} posts for userId: ${userId}`);
      return { postIds };
    } catch (error) {
      this.logger.error(`Error fetching feed for userId: ${userId}`, error.stack);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An error occurred while fetching the feed.',
      });
    }
  }

  async fanOutPostToConnections(
    authorId: string,
    postId: string,
    createdAt: Date,
  ): Promise<void> {
    this.logger.log(`Starting fan-out for postId: ${postId} from authorId: ${authorId}`);
    try {
      const connectionIds = await this.getConnectionsWithCache(authorId);

      if (!connectionIds || connectionIds.length === 0) {
        this.logger.log(`No connections found for authorId: ${authorId}. Fan-out complete.`);
        return;
      }

      this.logger.log(`Found ${connectionIds.length} connections for authorId: ${authorId}.`);

      // Handle super-node scenario by chunking
      if (connectionIds.length > this.SUPER_NODE_THRESHOLD) {
        this.logger.warn(
          `Super-node detected for authorId: ${authorId} with ${connectionIds.length} connections. Chunking fan-out.`,
        );
        await this.performChunkedFanOut(connectionIds, postId, createdAt);
      } else {
        await this.performStandardFanOut(connectionIds, postId, createdAt);
      }

      this.logger.log(`Successfully completed fan-out for postId: ${postId}`);
    } catch (error) {
      this.logger.error(
        `Failed to fan-out post for postId: ${postId}. Error: ${error.message}`,
        error.stack,
      );
      // Re-throw to allow the SQS consumer to handle retries/DLQ
      throw error;
    }
  }

  private async getConnectionsWithCache(authorId: string): Promise<string[]> {
    const cacheKey = `connections:${authorId}`;
    let connectionIds: string[] | undefined = await this.cacheManager.get(cacheKey);

    if (connectionIds) {
      this.logger.debug(`Cache HIT for connections of authorId: ${authorId}`);
      return connectionIds;
    }

    this.logger.debug(`Cache MISS for connections of authorId: ${authorId}`);
    try {
      connectionIds = await this.connectionsClientService.getConnections(authorId);
      // Cache the result for a short period to handle bursts of posts from the same user
      await this.cacheManager.set(cacheKey, connectionIds, { ttl: 300 }); // 5 minutes TTL
      return connectionIds;
    } catch (error) {
      this.logger.error(
        `gRPC call to Connections service failed for authorId: ${authorId}`,
        error.stack,
      );
      // Throw a specific error that the SQS consumer can interpret for retries
      throw new RpcException({
        code: status.UNAVAILABLE,
        message: 'Connections service is unavailable.',
      });
    }
  }

  private async performStandardFanOut(
    connectionIds: string[],
    postId: string,
    createdAt: Date,
  ): Promise<void> {
    const score = createdAt.getTime();
    const updates = connectionIds.map((userId) => ({ userId, postId, score }));
    await this.feedRepository.addPostToFeeds(updates);
  }

  private async performChunkedFanOut(
    connectionIds: string[],
    postId: string,
    createdAt: Date,
  ): Promise<void> {
    const score = createdAt.getTime();
    const totalConnections = connectionIds.length;
    for (let i = 0; i < totalConnections; i += this.FAN_OUT_CHUNK_SIZE) {
      const chunk = connectionIds.slice(i, i + this.FAN_OUT_CHUNK_SIZE);
      this.logger.log(
        `Processing chunk ${i / this.FAN_OUT_CHUNK_SIZE + 1} of ${Math.ceil(
          totalConnections / this.FAN_OUT_CHUNK_SIZE,
        )} for postId: ${postId}`,
      );
      const updates = chunk.map((userId) => ({ userId, postId, score }));
      await this.feedRepository.addPostToFeeds(updates);
    }
  }
}