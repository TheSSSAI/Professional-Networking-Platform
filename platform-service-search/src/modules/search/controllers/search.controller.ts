import { Controller, Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SearchService } from '../services/search.service';
import { SearchRequestDto } from '../dtos/search-request.dto';
import { SearchResponseDto } from '../dtos/search-response.dto';
import { GrpcExceptionFilter } from 'src/common/filters/grpc-exception.filter';
import { status } from '@grpc/grpc-js';

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  /**
   * Implements the gRPC method for searching users.
   * This method receives a search request, delegates the complex query logic
   * to the SearchService, and returns the results.
   *
   * @param {SearchRequestDto} request - The DTO containing the search query,
   *   filters, pagination info, and the ID of the user performing the search.
   * @returns {Promise<SearchResponseDto>} A promise that resolves to the search results.
   */
  @GrpcMethod('SearchService', 'SearchUsers')
  @UsePipes(new ValidationPipe({ transform: true, exceptionFactory: (errors) => ({ code: status.INVALID_ARGUMENT, message: errors.toString() }) }))
  async searchUsers(request: SearchRequestDto): Promise<SearchResponseDto> {
    this.logger.log(
      `Received search request from user ${request.searchingUserId} with query: "${request.query}"`,
    );

    try {
      const results = await this.searchService.search(request);
      this.logger.log(
        `Returning ${results.users.length} results for query: "${request.query}"`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Error processing search for user ${request.searchingUserId} with query "${request.query}": ${error.message}`,
        error.stack,
      );
      // The GrpcExceptionFilter will catch this and translate it to a gRPC status code.
      throw error;
    }
  }
}