import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { ValidateTokenQuery } from './validate-token.query';
import { ITokenBlocklistService } from '../../../domain/interfaces/token-blocklist.service.interface';
import { JwtPayloadDto } from '../../dtos/jwt-payload.dto';
import { ITokenService } from '../../../domain/interfaces/token.service.interface';

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler
  implements IQueryHandler<ValidateTokenQuery, JwtPayloadDto>
{
  private readonly logger = new Logger(ValidateTokenHandler.name);

  constructor(
    @Inject('ITokenBlocklistService')
    private readonly tokenBlocklistService: ITokenBlocklistService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(query: ValidateTokenQuery): Promise<JwtPayloadDto> {
    const { accessToken } = query;

    try {
      const payload = await this.tokenService.verifyAccessToken(accessToken);

      if (!payload.jti) {
        this.logger.error('Token validation failed: Missing JTI');
        throw new Error('Token is missing JTI');
      }

      const isBlocklisted = await this.tokenBlocklistService.isBlocklisted(
        payload.jti,
      );

      if (isBlocklisted) {
        this.logger.warn(`Token validation failed: Token is blocklisted (jti: ${payload.jti})`);
        throw new Error('Token is blocklisted');
      }
      
      // Additional check for session invalidation (e.g., after password reset)
      // This is a more advanced pattern but good for security.
      // const lastInvalidation = await this.tokenBlocklistService.getGlobalInvalidationTime(payload.userId);
      // if (payload.iat < lastInvalidation) {
      //   this.logger.warn(`Token validation failed: Token issued before global invalidation time for user ${payload.userId}`);
      //   throw new Error('Token has been invalidated');
      // }


      return payload;
    } catch (error) {
      this.logger.debug(`Token validation failed: ${error.message}`);
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid or expired access token.',
      });
    }
  }
}