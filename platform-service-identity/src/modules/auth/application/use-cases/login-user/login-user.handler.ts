import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { LoginUserCommand } from './login-user.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IHashingService } from '../../../domain/interfaces/hashing.service.interface';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { ITokenService } from '../../../domain/interfaces/token.service.interface';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements ICommandHandler<LoginUserCommand, LoginResponseDto>
{
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHashingService')
    private readonly hashingService: IHashingService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginResponseDto> {
    const { email, password } = command;
    const lowercasedEmail = email.toLowerCase();

    const user = await this.userRepository.findByEmail(lowercasedEmail);
    if (!user) {
      this.logger.warn(`Login attempt for non-existent user: ${lowercasedEmail}`);
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await user.comparePassword(
      password,
      this.hashingService,
    );
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for user: ${user.id}`);
      // Here you would also log the failed attempt to a security audit log
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === UserStatus.INACTIVE) {
      this.logger.log(`Login attempt for inactive user: ${user.id}`);
      throw new RpcException({
        code: grpc.status.FAILED_PRECONDITION,
        message: 'Account is not verified. Please check your email.',
      });
    }

    if (user.status === UserStatus.BANNED) {
      this.logger.warn(`Login attempt for banned user: ${user.id}`);
      throw new RpcException({
        code: grpc.status.PERMISSION_DENIED,
        message: 'This account has been permanently banned.',
      });
    }
    
    // REQ-1-014: Reactivate on login
    if (user.status === UserStatus.DEACTIVATED || user.status === UserStatus.PENDING_DELETION) {
        this.logger.log(`Reactivating account on login for user: ${user.id}`);
        user.reactivate();
        await this.userRepository.update(user);
    }


    if (user.mfaEnabled) {
      this.logger.log(`MFA required for user: ${user.id}`);
      const mfaSessionToken = await this.tokenService.generateMfaSessionToken({
        userId: user.id,
      });
      return {
        mfaRequired: true,
        mfaSessionToken,
        accessToken: '',
        refreshToken: '',
      };
    }

    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      userId: user.id,
    });

    this.logger.log(`User logged in successfully: ${user.id}`);
    // Here you would log the successful login to a security audit log

    return {
      mfaRequired: false,
      mfaSessionToken: '',
      accessToken,
      refreshToken,
    };
  }
}