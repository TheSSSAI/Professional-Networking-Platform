import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { IFeedRepository } from './interfaces/feed.repository.interface';

@Injectable()
export class FeedRepository implements IFeedRepository {
  private readonly logger = new Logger(FeedRepository.name);
  private readonly feedMaxSize: number;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.feedMaxSize = this.configService.get<number>('redis.feedMaxSize');
    if (!this.feedMaxSize || this.feedMaxSize <= 0) {
      this.feedMaxSize = 1000; // A sensible default
      this.logger.warn(
        `Redis feedMaxSize not configured or invalid, using default of ${this.feedMaxSize}`,
      );
    }
  }

  /**
   * Adds a post to multiple user feeds using a Redis pipeline for high performance.
   * For each user, it adds the post to their sorted set and then trims the set
   * to maintain the maximum feed size.
   * @param updates An array of objects, each containing a userId, postId, and the score (timestamp).
   */
  async addPostToFeeds(
    updates: { userId: string; postId: string; score: number }[],
  ): Promise<void> {
    if (!updates || updates.length === 0) {
      return;
    }

    try {
      const pipeline = this.redis.pipeline();

      for (const update of updates) {
        const { userId, postId, score } = update;
        const feedKey = `feed:${userId}`;

        // Add the new post ID to the user's feed sorted set.
        // The score is the timestamp, ensuring chronological order.
        pipeline.zadd(feedKey, score, postId);

        // Trim the sorted set to keep only the latest `feedMaxSize` posts.
        // ZREMRANGEBYRANK removes elements in the given range of ranks.
        // 0 is the start rank, -N-1 means "up to the element before the Nth last one".
        // This keeps the N most recent items (from rank -N to -1).
        pipeline.zremrangebyrank(feedKey, 0, -this.feedMaxSize - 1);
      }

      const results = await pipeline.exec();
      this.logger.log(
        `Successfully executed fan-out pipeline for post to ${updates.length} feeds.`,
      );

      // Optionally, check pipeline results for errors
      results.forEach(([error, _], index) => {
        if (error) {
          this.logger.error(
            `Error in pipeline command for user ${updates[index]?.userId}: ${error.message}`,
          );
        }
      });
    } catch (error) {
      this.logger.error(
        `Failed to execute Redis pipeline for fan-out: ${error.message}`,
        error.stack,
      );
      // This is an infrastructure failure. We throw a standard RpcException
      // that can be caught by a global filter.
      throw new RpcException({
        code: status.INTERNAL,
        message: 'A database error occurred while updating feeds.',
      });
    }
  }

  /**
   * Retrieves a paginated list of post IDs from a user's feed.
   * @param userId The ID of the user whose feed is being requested.
   * @param start The starting index for the range query.
   * @param stop The ending index for the range query.
   * @returns A promise that resolves to an array of post IDs.
   */
  async getFeedPage(
    userId: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    const feedKey = `feed:${userId}`;
    try {
      // ZREVRANGE fetches a range of members from a sorted set, ordered from the highest
      // score (most recent) to the lowest.
      const postIds = await this.redis.zrevrange(feedKey, start, stop);
      return postIds;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve feed for user ${userId} from Redis: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'A database error occurred while fetching the feed.',
      });
    }
  }
}