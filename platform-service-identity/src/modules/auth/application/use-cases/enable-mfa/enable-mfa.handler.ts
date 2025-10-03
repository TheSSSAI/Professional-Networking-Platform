import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { EnableMfaCommand } from './enable-mfa.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IUnitOfWork } from '../../../domain/interfaces/unit-of-work.interface';
import { IMfaService } from '../../../domain/interfaces/mfa.service.interface';

interface EnableMfaResult {
  recoveryCodes: string[];
}

@CommandHandler(EnableMfaCommand)
export class EnableMfaHandler
  implements ICommandHandler<EnableMfaCommand, EnableMfaResult>
{
  private readonly logger = new Logger(EnableMfaHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IMfaService')
    private readonly mfaService: IMfaService,
    @Inject('IUnitOfWork')
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(command: EnableMfaCommand): Promise<EnableMfaResult> {
    const { userId, mfaSecret, code } = command;

    await this.unitOfWork.startTransaction();
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new RpcException({
          code: grpc.status.NOT_FOUND,
          message: 'User not found.',
        });
      }

      if (user.mfaEnabled) {
        throw new RpcException({
          code: grpc.status.ALREADY_EXISTS,
          message: 'MFA is already enabled for this account.',
        });
      }

      const isValid = await this.mfaService.verifyTotp(code, mfaSecret);
      if (!isValid) {
        throw new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Invalid verification code.',
        });
      }

      const recoveryCodes = await this.mfaService.generateRecoveryCodes();
      
      user.enableMfa(mfaSecret, recoveryCodes);
      
      await this.userRepository.update(user);

      await this.unitOfWork.commitTransaction();

      this.logger.log(`MFA enabled for user: ${userId}`);

      return { recoveryCodes };
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      this.logger.error(`Failed to enable MFA for user ${userId}: ${error.message}`, error.stack);
      
      if (error instanceof RpcException) {
          throw error;
      }
      
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'An error occurred while enabling MFA.',
      });
    }
  }
}