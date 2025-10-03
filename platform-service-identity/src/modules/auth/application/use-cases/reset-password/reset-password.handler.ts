import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { ResetPasswordCommand } from './reset-password.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IHashingService } from '../../../domain/interfaces/hashing.service.interface';
import { IUnitOfWork } from '../../../domain/interfaces/unit-of-work.interface';
import { TokenType } from '../../../domain/enums/token-type.enum';
import { PasswordDomainService } from '../../../domain/services/password.domain-service';
import { ITokenBlocklistService } from '../../../domain/interfaces/token-blocklist.service.interface';


@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  private readonly logger = new Logger(ResetPasswordHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHashingService')
    private readonly hashingService: IHashingService,
    @Inject('ITokenBlocklistService')
    private readonly tokenBlocklistService: ITokenBlocklistService,
    @Inject('IUnitOfWork')
    private readonly unitOfWork: IUnitOfWork,
    private readonly passwordDomainService: PasswordDomainService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { token, newPassword } = command;

    this.passwordDomainService.validatePasswordComplexity(newPassword);

    await this.unitOfWork.startTransaction();
    try {
      const userToken = await this.userRepository.findToken(
        token,
        TokenType.PASSWORD_RESET,
      );

      if (!userToken || userToken.isExpired() || userToken.isUsed()) {
        throw new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'This password reset link is invalid or has expired.',
        });
      }

      const user = await this.userRepository.findById(userToken.userId);

      if (!user) {
        throw new RpcException({
          code: grpc.status.NOT_FOUND,
          message: 'Associated user account not found.',
        });
      }

      const newPasswordHash = await this.hashingService.hash(newPassword);
      user.updatePassword(newPasswordHash);
      userToken.use();

      await this.userRepository.update(user);
      await this.userRepository.updateUserToken(userToken);
      
      // Invalidate all active sessions for the user.
      await this.tokenBlocklistService.invalidateAllUserTokens(user.id);
      this.logger.log(`All active sessions invalidated for user ${user.id} after password reset.`);

      await this.unitOfWork.commitTransaction();

      this.logger.log(`Password reset successful for user: ${user.id}`);
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      this.logger.error(`Password reset failed: ${error.message}`, error.stack);
      
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'An error occurred during password reset.',
      });
    }
  }
}