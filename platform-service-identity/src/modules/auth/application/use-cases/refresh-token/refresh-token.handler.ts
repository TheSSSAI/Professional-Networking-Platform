import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { RefreshTokenCommand } from './refresh-token.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { ITokenService } from '../../../domain/interfaces/token.service.interface';
import { ITokenBlocklistService } from '../../../domain/interfaces/token-blocklist.service.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, { accessToken: string }>
{
  private readonly logger = new Logger(RefreshTokenHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('ITokenBlocklistService')
    private readonly tokenBlocklistService: ITokenBlocklistService
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = command;

    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const { userId, jti } = payload;
      
      if(!jti) {
         throw new Error('Refresh token is missing JTI');
      }

      const isBlocklisted = await this.tokenBlocklistService.isBlocklisted(jti);
      if (isBlocklisted) {
        this.logger.warn(`Refresh token is blocklisted for user: ${userId}`);
        throw new Error('Refresh token has been revoked');
      }

      const user = await this.userRepository.findById(userId);

      if (!user || user.status !== UserStatus.ACTIVE) {
        this.logger.warn(`Refresh token used for inactive/non-existent user: ${userId}`);
        throw new Error('User account is not active');
      }

      // Optional: Refresh Token Rotation
      // To enhance security, you could invalidate the current refresh token and issue a new one.
      // await this.tokenBlocklistService.addToBlocklist(jti, payload.exp);
      // const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.tokenService.generateTokens({ userId });
      // return { accessToken: newAccessToken, refreshToken: newRefreshToken };

      const { accessToken } = await this.tokenService.generateTokens({ userId });

      this.logger.log(`Access token refreshed for user: ${userId}`);

      return { accessToken };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid or expired refresh token.',
      });
    }
  }
}