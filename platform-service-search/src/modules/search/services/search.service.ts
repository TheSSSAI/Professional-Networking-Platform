import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  CACHE_MANAGER,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';
import { OpenSearchService } from '../../../shared/opensearch/opensearch.service';
import { SearchRequestDto } from '../dtos/search-request.dto';
import { SearchResponseDto } from '../dtos/search-response.dto';
import { UserProfileIndexDto } from '../dtos/user-profile-index.dto';
import { Cache } from 'cache-manager';

// These interfaces should ideally be in a shared contracts library
interface IConnectionsService {
  getFirstDegreeConnectionIds(request: {
    userId: string;
  }): Promise<{ connectionIds: string[] }>;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private connectionsService: IConnectionsService;
  private readonly CACHE_TTL: number = 300; // 5 minutes

  constructor(
    private readonly openSearchService: OpenSearchService,
    private readonly configService: ConfigService,
    @Inject('CONNECTIONS_PACKAGE')
    private readonly connectionsServiceClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.connectionsService =
      this.connectionsServiceClient.getService<IConnectionsService>(
        'ConnectionsService',
      );
  }

  /**
   * Orchestrates a user search request.
   * 1. Fetches connection data (with caching).
   * 2. Builds a complex OpenSearch query.
   * 3. Executes the search.
   * 4. Maps the results to a response DTO.
   * @param request - The incoming search request DTO.
   * @returns A promise resolving to the search results.
   */
  async search(request: SearchRequestDto): Promise<SearchResponseDto> {
    this.logger.log(
      `Performing search for user ${request.searchingUserId} with query: "${request.query}"`,
    );

    try {
      // Step 1: Get connection IDs for relevance boosting, with caching.
      const connectionIds = await this._getConnections(request.searchingUserId);

      // Step 2: Build the complex OpenSearch query.
      const osQuery = this._buildSearchQuery(request, connectionIds);

      // Step 3: Execute the query against OpenSearch.
      const searchResult = await this.openSearchService.search(osQuery);

      // Step 4: Map the raw OpenSearch result to our response DTO.
      return this._mapResultsToResponse(searchResult, request.page);
    } catch (error) {
      this.logger.error(
        `Error during search for user ${request.searchingUserId}: ${error.message}`,
        error.stack,
      );
      throw new RpcException('An error occurred while performing the search.');
    }
  }

  /**
   * Fetches first-degree connection IDs for a user, utilizing a cache to reduce latency.
   * @param userId - The ID of the user whose connections are needed.
   * @returns An array of connection user IDs.
   */
  private async _getConnections(userId: string): Promise<string[]> {
    const cacheKey = `connections:${userId}`;
    const cachedConnections = await this.cacheManager.get<string[]>(cacheKey);

    if (cachedConnections) {
      this.logger.debug(`Cache hit for connections of user ${userId}`);
      return cachedConnections;
    }

    this.logger.debug(`Cache miss for connections of user ${userId}. Fetching via gRPC.`);
    try {
      const response = await firstValueFrom(
        this.connectionsService.getFirstDegreeConnectionIds({ userId }).pipe(
          timeout(2000), // 2-second timeout for the gRPC call
          catchError((error) => {
            this.logger.error(
              `gRPC call to ConnectionsService failed for user ${userId}: ${error.message}`,
            );
            return of({ connectionIds: [] }); // Graceful degradation
          }),
        ),
      );

      const connectionIds = response.connectionIds || [];
      await this.cacheManager.set(cacheKey, connectionIds, this.CACHE_TTL);
      return connectionIds;
    } catch (error) {
      this.logger.error(
        `Unexpected error fetching connections for user ${userId}: ${error.message}`,
        error.stack,
      );
      return []; // Return empty array on failure to allow search to proceed
    }
  }

  /**
   * Constructs the OpenSearch Query DSL object based on the search request and context.
   * Implements fuzzy matching, filtering, privacy rules, and connection boosting.
   * @param request - The search request DTO.
   * @param connectionIds - The list of first-degree connection IDs.
   * @returns The OpenSearch query object.
   */
  private _buildSearchQuery(
    request: SearchRequestDto,
    connectionIds: string[],
  ): object {
    const { query, filters, page = 1, size = 10 } = request;
    const from = (page - 1) * size;

    const filterClauses = [];

    // REQ-1-035: Add filters for location, company, etc.
    if (filters?.location) {
      filterClauses.push({ term: { 'location.keyword': filters.location } });
    }
    if (filters?.company) {
      filterClauses.push({
        term: { 'workExperience.companyName.keyword': filters.company },
      });
    }

    // REQ-1-032: Add crucial privacy filter
    const privacyFilter = {
      bool: {
        should: [
          { term: { visibility: 'Public' } },
          {
            bool: {
              must: [
                { term: { visibility: 'Private' } },
                { terms: { userId: [...connectionIds, request.searchingUserId] } }, // User can always see themselves
              ],
            },
          },
        ],
        minimum_should_match: 1,
      },
    };
    filterClauses.push(privacyFilter);

    // Main query with fuzzy matching (REQ-1-033)
    const mustQuery = {
      multi_match: {
        query: query,
        fields: [
          'fullName^3', // Boost full name matches
          'headline^2',
          'skills',
          'workExperience.title',
          'workExperience.companyName',
          'education.institutionName',
          'education.degree',
        ],
        fuzziness: 'AUTO',
        prefix_length: 2,
      },
    };

    // REQ-1-034: Connection boosting using function_score
    const finalQuery = {
      query: {
        function_score: {
          query: {
            bool: {
              must: mustQuery,
              filter: filterClauses,
            },
          },
          functions: [
            {
              filter: { terms: { userId: connectionIds } },
              weight: 1.5, // Apply a boost factor for connections
            },
          ],
          score_mode: 'multiply', // Combine query score with boost
          boost_mode: 'multiply',
        },
      },
      from,
      size,
    };

    return finalQuery;
  }

  /**
   * Maps the raw OpenSearch search result to the SearchResponseDto.
   * @param searchResult - The raw result from the OpenSearch client.
   * @param page - The current page number.
   * @returns A formatted SearchResponseDto.
   */
  private _mapResultsToResponse(
    searchResult: any,
    page: number,
  ): SearchResponseDto {
    const hits = searchResult.body?.hits?.hits || [];
    const total = searchResult.body?.hits?.total?.value || 0;
    const size = hits.length;

    const results: UserProfileIndexDto[] = hits.map(
      (hit: any) => hit._source as UserProfileIndexDto,
    );

    return {
      results,
      pagination: {
        totalItems: total,
        currentPage: page,
        itemsPerPage: size,
        totalPages: Math.ceil(total / size),
      },
    };
  }
}