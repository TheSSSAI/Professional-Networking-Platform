import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchUsersAdminQuery } from './search-users-admin.query';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { IdentityClient } from 'src/shared/infrastructure/grpc-clients/identity/identity.client';
import {
  IIdentityService,
  SearchUsersResponse,
} from 'src/shared/infrastructure/grpc-clients/identity/identity.client';

@QueryHandler(SearchUsersAdminQuery)
export class SearchUsersAdminHandler
  implements
    IQueryHandler<SearchUsersAdminQuery, SearchUsersResponse>,
    OnModuleInit
{
  private readonly logger = new Logger(SearchUsersAdminHandler.name);
  private identityService: IIdentityService;

  constructor(
    @Inject(IdentityClient) private readonly identityClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.identityService =
      this.identityClient.getService<IIdentityService>('IdentityService');
  }

  async execute(query: SearchUsersAdminQuery): Promise<SearchUsersResponse> {
    this.logger.log(`Searching for users with query: ${query.searchQuery}`);

    try {
      const response = await firstValueFrom(
        this.identityService.searchUsersAdmin({
          query: query.searchQuery,
          page: query.page,
          limit: query.limit,
          statusFilter: query.status,
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(
        `gRPC call to IdentityService failed: ${error.message}`,
        error.stack,
      );

      // Assuming the gRPC client throws an RpcException or a compatible error
      if (error.code) {
        throw new RpcException({ code: error.code, message: error.details });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'An internal error occurred while searching for users.',
      });
    }
  }
}