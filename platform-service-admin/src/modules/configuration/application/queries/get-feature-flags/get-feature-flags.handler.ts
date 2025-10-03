import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeatureFlagsQuery } from './get-feature-flags.query';
import { Inject } from '@nestjs/common';
import { IFeatureFlagRepository } from '../../../domain/interfaces/feature-flag.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface FeatureFlagDto {
  key: string;
  description: string;
  isEnabled: boolean;
}

export interface GetFeatureFlagsResponse {
  featureFlags: FeatureFlagDto[];
}

@QueryHandler(GetFeatureFlagsQuery)
export class GetFeatureFlagsHandler
  implements IQueryHandler<GetFeatureFlagsQuery, GetFeatureFlagsResponse>
{
  constructor(
    @Inject(IFeatureFlagRepository)
    private readonly featureFlagRepository: IFeatureFlagRepository,
  ) {}

  async execute(
    _query: GetFeatureFlagsQuery,
  ): Promise<GetFeatureFlagsResponse> {
    try {
      const flags = await this.featureFlagRepository.findAll();

      const featureFlags = flags.map((flag) => ({
        key: flag.key,
        description: flag.description,
        isEnabled: flag.isEnabled,
      }));

      return { featureFlags };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An error occurred while fetching feature flags.',
      });
    }
  }
}