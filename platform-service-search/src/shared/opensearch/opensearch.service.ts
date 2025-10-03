import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT } from './constants';
import { UserProfileIndexDto } from '../../modules/search/dtos/user-profile-index.dto';

/**
 * OpenSearchService acts as a repository-pattern wrapper around the OpenSearch client.
 * It encapsulates all direct interactions with the OpenSearch cluster, such as
 * indexing, searching, and deleting documents.
 *
 * On module initialization, it ensures that the required index exists and has the correct mapping,
 * making the service self-sufficient for new deployments.
 */
@Injectable()
export class OpenSearchService implements OnModuleInit, OnModuleDestroy {
  private readonly indexName: string;
  private readonly logger = new Logger(OpenSearchService.name);

  constructor(
    @Inject(OPENSEARCH_CLIENT) private readonly client: Client,
    private readonly configService: ConfigService,
  ) {
    this.indexName = this.configService.get<string>('opensearch.indexName');
  }

  /**
   * NestJS lifecycle hook. Called once the host module has been initialized.
   * Checks for the existence of the search index and creates it with the
   * correct mapping if it does not exist.
   */
  async onModuleInit() {
    await this.ensureIndexExists();
  }

  /**
   * NestJS lifecycle hook. Called when the host module is destroyed.
   * Gracefully closes the OpenSearch client connection.
   */
  async onModuleDestroy() {
    try {
      this.logger.log('Closing OpenSearch client connection...');
      await this.client.close();
      this.logger.log('OpenSearch client connection closed successfully.');
    } catch (error) {
      this.logger.error('Failed to close OpenSearch client connection.', error);
    }
  }

  /**
   * Checks if the configured OpenSearch index exists. If not, it creates the index
   * with a predefined mapping suitable for user profile search.
   */
  private async ensureIndexExists(): Promise<void> {
    this.logger.log(`Checking for existence of index: '${this.indexName}'`);
    try {
      const { body: indexExists } = await this.client.indices.exists({
        index: this.indexName,
      });

      if (indexExists) {
        this.logger.log(`Index '${this.indexName}' already exists.`);
        return;
      }

      this.logger.log(
        `Index '${this.indexName}' not found. Creating index with mapping...`,
      );
      await this.client.indices.create({
        index: this.indexName,
        body: {
          mappings: {
            properties: {
              userId: { type: 'keyword' },
              fullName: { type: 'text' },
              headline: { type: 'text' },
              location: { type: 'text', fields: { keyword: { type: 'keyword' } } },
              profilePictureUrl: { type: 'keyword', index: false },
              customUrlSlug: { type: 'keyword' },
              visibility: { type: 'keyword' },
              skills: { type: 'text' },
              workExperience: {
                type: 'nested',
                properties: {
                  title: { type: 'text' },
                  companyName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                },
              },
              education: {
                type: 'nested',
                properties: {
                  institutionName: { type: 'text' },
                  degree: { type: 'text' },
                  fieldOfStudy: { type: 'text' },
                },
              },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      this.logger.log(`Index '${this.indexName}' created successfully.`);
    } catch (error) {
      this.logger.error(
        `Failed to ensure index '${this.indexName}' exists.`,
        error,
      );
      // Throwing the error will prevent the application from starting if OpenSearch is not configured correctly.
      throw error;
    }
  }

  /**
   * Indexes or updates a user profile document in OpenSearch.
   * Uses the userId as the document ID for idempotency.
   * @param profile The denormalized user profile document to index.
   */
  async indexProfile(profile: UserProfileIndexDto): Promise<void> {
    try {
      await this.client.index({
        index: this.indexName,
        id: profile.userId,
        body: profile,
        refresh: true, // Refresh for immediate availability in tests/low-traffic, consider 'wait_for' or false in high-traffic
      });
      this.logger.debug(`Successfully indexed profile for userId: ${profile.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to index profile for userId: ${profile.userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Deletes a user profile document from the OpenSearch index.
   * Handles "not found" errors gracefully.
   * @param userId The ID of the user profile document to delete.
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: userId,
        refresh: true,
      });
      this.logger.debug(`Successfully deleted profile for userId: ${userId}`);
    } catch (error) {
      // If the document is not found, OpenSearch throws an error.
      // We can treat this as a success for deletion idempotency.
      if (error.meta && error.meta.statusCode === 404) {
        this.logger.warn(
          `Attempted to delete profile for userId: ${userId}, but document was not found.`,
        );
        return;
      }
      this.logger.error(
        `Failed to delete profile for userId: ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Executes a search query against the OpenSearch index.
   * @param query The complete OpenSearch Query DSL object.
   * @returns The raw search result from the OpenSearch client.
   */
  async search<T>(query: object): Promise<{_source: T, _score: number}[]> {
    try {
      const { body } = await this.client.search({
        index: this.indexName,
        body: query,
      });

      // Map the results to a cleaner format
      return body.hits.hits.map((hit: any) => ({
        _source: hit._source,
        _score: hit._score,
      }));
    } catch (error) {
      this.logger.error('Failed to execute search query.', error);
      throw error;
    }
  }
}