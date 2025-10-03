import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { VerifyMfaCommand } from './verify-mfa.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { ITokenService } from '../../../domain/interfaces/token.service.interface';
import { IMfaService } from '../../../domain/interfaces/mfa.service.interface';
import { LoginResponseDto } from '../../dtos/login-response.dto';

@CommandHandler(VerifyMfaCommand)
export class VerifyMfaHandler
  implements ICommandHandler<VerifyMfaCommand, LoginResponseDto>
{
  private readonly logger = new Logger(VerifyMfaHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IMfaService')
    private readonly mfaService: IMfaService,
  ) {}

  async execute(command: VerifyMfaCommand): Promise<LoginResponseDto> {
    const { mfaSessionToken, code } = command;

    try {
      const { userId } = await this.tokenService.verifyMfaSessionToken(
        mfaSessionToken,
      );

      const user = await this.userRepository.findById(userId);
      if (!user || !user.mfaEnabled || !user.getMfaSecret()) {
        throw new RpcException({
          code: grpc.status.FAILED_PRECONDITION,
          message: 'MFA is not configured for this user.',
        });
      }
      
      // Here you would implement rate limiting for MFA attempts against Redis

      const mfaSecret = user.getMfaSecret(); // Assume this decrypts the secret
      const isValid = await this.mfaService.verifyTotp(code, mfaSecret);

      if (!isValid) {
        // Here you would increment the failed attempt counter in Redis
        this.logger.warn(`Invalid MFA code attempt for user: ${userId}`);
        throw new RpcException({
          code: grpc.status.UNAUTHENTICATED,
          message: 'Invalid verification code.',
        });
      }
      
      // Here you would reset the failed attempt counter in Redis

      const { accessToken, refreshToken } = await this.tokenService.generateTokens(
        { userId: user.id },
      );
      
      this.logger.log(`MFA verification successful, user logged in: ${userId}`);
      // Here you would log the successful MFA login to a security audit log

      return {
        accessToken,
        refreshToken,
        mfaRequired: false,
        mfaSessionToken: '',
      };
    } catch (error) {
      this.logger.error(`MFA verification failed: ${error.message}`, error.stack);
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'MFA verification failed. Please try logging in again.',
      });
    }
  }
}