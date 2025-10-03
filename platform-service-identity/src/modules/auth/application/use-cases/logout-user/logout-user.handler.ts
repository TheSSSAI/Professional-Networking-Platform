import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { LogoutUserCommand } from './logout-user.command';
import { ITokenBlocklistService } from '../../../domain/interfaces/token-blocklist.service.interface';
import { ITokenService } from '../../../domain/interfaces/token.service.interface';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  private readonly logger = new Logger(LogoutUserHandler.name);

  constructor(
    @Inject('ITokenBlocklistService')
    private readonly tokenBlocklistService: ITokenBlocklistService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const { accessToken } = command;

    try {
      const payload = await this.tokenService.verifyAccessToken(accessToken);

      if (!payload.jti || !payload.exp) {
        this.logger.warn('Logout attempt with token missing jti or exp');
        throw new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Invalid token payload for logout.',
        });
      }

      const { jti, exp } = payload;
      await this.tokenBlocklistService.addToBlocklist(jti, exp);
      this.logger.log(`Token ${jti} for user ${payload.userId} added to blocklist.`);

      // Optionally, block the associated refresh token if its JTI is known or linked
    } catch (error) {
      // If token is already expired, logout is implicitly successful.
      // We log but do not throw an error to the client.
      if (error.name === 'TokenExpiredError') {
        this.logger.log('Logout attempt with an already expired token.');
        return;
      }

      this.logger.error(`Error during logout: ${error.message}`, error.stack);
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'An error occurred during logout.',
      });
    }
  }
}