import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { RegisterUserCommand } from './register-user.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IHashingService } from '../../../domain/interfaces/hashing.service.interface';
import { IUnitOfWork } from '../../../domain/interfaces/unit-of-work.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';
import { UserStatus } from '../../../domain/enums/user-status.enum';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  private readonly logger = new Logger(RegisterUserHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHashingService')
    private readonly hashingService: IHashingService,
    @Inject('IUnitOfWork')
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { email, password, dateOfBirth } = command;

    await this.unitOfWork.startTransaction();
    try {
      const existingUser = await this.userRepository.findByEmail(
        email.toLowerCase(),
      );

      if (existingUser) {
        this.logger.warn(`Registration attempt for existing email: ${email}`);
        throw new RpcException({
          code: grpc.status.ALREADY_EXISTS,
          message: 'An account with this email already exists.',
        });
      }

      const user = await User.create(
        {
          email: email.toLowerCase(),
          password,
          dateOfBirth,
        },
        this.hashingService,
      );

      const verificationToken = user.generateEmailVerificationToken();

      await this.userRepository.add(user);
      await this.userRepository.addUserToken(verificationToken);

      await this.unitOfWork.commitTransaction();

      // Publish event after transaction is committed
      this.eventBus.publish(
        new UserRegisteredEvent(
          user.id,
          user.email,
          verificationToken.getToken(),
        ),
      );

      this.logger.log(`User registered successfully: ${user.id}`);
      return user;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      this.logger.error(`Registration failed for email ${email}: ${error.message}`, error.stack);

      if (error instanceof RpcException) {
        throw error;
      }
      
      // Handle domain specific errors from User.create
      if (error.message.includes('User must be at least')) {
          throw new RpcException({
              code: grpc.status.INVALID_ARGUMENT,
              message: error.message,
          });
      }

      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'An unexpected error occurred during registration.',
      });
    }
  }
}