import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { VerifyEmailCommand } from './verify-email.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IUnitOfWork } from '../../../domain/interfaces/unit-of-work.interface';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { TokenType } from '../../../domain/enums/token-type.enum';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  private readonly logger = new Logger(VerifyEmailHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUnitOfWork')
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const { token } = command;

    await this.unitOfWork.startTransaction();
    try {
      const userToken = await this.userRepository.findToken(
        token,
        TokenType.EMAIL_VERIFICATION,
      );

      if (!userToken || userToken.isExpired() || userToken.isUsed()) {
        throw new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'This verification link is invalid or has expired.',
        });
      }

      const user = await this.userRepository.findById(userToken.userId);

      if (!user) {
        throw new RpcException({
          code: grpc.status.NOT_FOUND,
          message: 'Associated user account not found.',
        });
      }

      if (user.status === UserStatus.ACTIVE) {
        this.logger.log(`Account ${user.id} is already active. Invalidating token.`);
        userToken.use();
        await this.userRepository.updateUserToken(userToken);
        await this.unitOfWork.commitTransaction();
        // Silently succeed for idempotency, but don't throw an error.
        return;
      }

      user.activate();
      userToken.use();

      await this.userRepository.update(user);
      await this.userRepository.updateUserToken(userToken);

      await this.unitOfWork.commitTransaction();

      this.logger.log(`User account activated successfully: ${user.id}`);
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      this.logger.error(`Email verification failed: ${error.message}`, error.stack);
      
      if (error instanceof RpcException) {
          throw error;
      }

      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'An error occurred during email verification.',
      });
    }
  }
}