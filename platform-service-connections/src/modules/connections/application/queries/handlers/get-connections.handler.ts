import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IConnectionRepository } from '../../../../connections/domain/interfaces/connection.repository.interface';
import { GetConnectionsQuery } from '../impl/get-connections.query';

// This DTO should ideally be defined in a shared contracts library or a DTOs folder
// For simplicity here, it's defined in the handler.
interface ConnectionDto {
  userId: string;
  name: string;
  headline: string;
  profilePictureUrl: string | null;
  connectedAt: Date;
}

interface PaginatedConnectionsDto {
  connections: ConnectionDto[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(GetConnectionsQuery)
export class GetConnectionsQueryHandler
  implements IQueryHandler<GetConnectionsQuery, PaginatedConnectionsDto>
{
  private readonly logger = new Logger(GetConnectionsQueryHandler.name);

  constructor(
    @Inject('ConnectionRepository')
    private readonly connectionRepository: IConnectionRepository,
  ) {}

  async execute(query: GetConnectionsQuery): Promise<PaginatedConnectionsDto> {
    this.logger.log(`Executing GetConnectionsQuery for user ${query.userId}`);

    const { userId, paginationOptions } = query;

    try {
      const result = await this.connectionRepository.findAcceptedForUser(
        userId,
        paginationOptions,
      );

      // In a real application, the repository would return a DTO that already includes
      // enriched profile data from the Profile service via an internal gRPC call.
      // Here we assume the repository implementation handles that enrichment.
      
      this.logger.log(`Found ${result.total} connections for user ${userId}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error executing GetConnectionsQuery: ${error.message}`, error.stack);
      throw new RpcException('An error occurred while fetching connections.');
    }
  }
}