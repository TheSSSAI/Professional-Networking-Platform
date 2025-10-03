import { Controller, Logger, UseFilters, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import {
  IdentityServiceController,
  IdentityServiceControllerMethods,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ValidateTokenRequest,
  ValidateTokenResponse,
  VerifyEmailRequest,
  EnableMfaRequest,
  EnableMfaResponse,
  VerifyMfaRequest,
  UserResponse,
} from '../../../../proto/identity/identity';
import { RegisterUserCommand } from '../application/use-cases/register-user/register-user.command';
import { LoginUserCommand } from '../application/use-cases/login-user/login-user.command';
import { ValidateTokenQuery } from '../application/use-cases/validate-token/validate-token.query';
import { GrpcExceptionFilter } from '../../../shared/exceptions/grpc-exception.filter';
import { RefreshTokenCommand } from '../application/use-cases/refresh-token/refresh-token.command';
import { VerifyEmailCommand } from '../application/use-cases/verify-email/verify-email.command';
import { RequestPasswordResetCommand } from '../application/use-cases/request-password-reset/request-password-reset.command';
import { ResetPasswordCommand } from '../application/use-cases/reset-password/reset-password.command';
import { EnableMfaCommand } from '../application/use-cases/enable-mfa/enable-mfa.command';
import { VerifyMfaCommand } from '../application/use-cases/verify-mfa/verify-mfa.command';
import { LogoutUserCommand } from '../application/use-cases/logout-user/logout-user.command';
import { JwtPayload } from '../application/dtos/jwt-payload.dto';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@UseFilters(new GrpcExceptionFilter())
@IdentityServiceControllerMethods()
export class AuthGrpcController implements IdentityServiceController {
  private readonly logger = new Logger(AuthGrpcController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('IdentityService', 'RegisterUser')
  async registerUser(request: RegisterRequest): Promise<UserResponse> {
    this.logger.log(`Received RegisterUser request for email: ${request.email}`);
    const command = new RegisterUserCommand(
      request.email,
      request.password,
      new Date(request.dateOfBirth),
    );
    const user = await this.commandBus.execute(command);
    return { id: user.id, email: user.email };
  }

  @GrpcMethod('IdentityService', 'Login')
  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`Received Login request for email: ${request.email}`);
    const command = new LoginUserCommand(request.email, request.password);
    return this.commandBus.execute(command);
  }

  @GrpcMethod('IdentityService', 'Logout')
  async logout(request: any, metadata: Metadata): Promise<{}> {
    this.logger.log(`Received Logout request`);
    // Assuming user payload from an upstream authenticator (e.g., in API Gateway) is passed in metadata
    const userPayload = metadata.get('user');
    if (!userPayload || !userPayload.length) {
      this.logger.warn('Logout called without user metadata.');
      return {}; // Or throw an unauthenticated error
    }

    const payload: JwtPayload = JSON.parse(userPayload[0].toString());
    const command = new LogoutUserCommand(payload);
    await this.commandBus.execute(command);
    return {};
  }

  @GrpcMethod('IdentityService', 'ValidateToken')
  async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    this.logger.log(`Received ValidateToken request`);
    const query = new ValidateTokenQuery(request.accessToken);
    return this.queryBus.execute(query);
  }

  @GrpcMethod('IdentityService', 'RefreshToken')
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    this.logger.log(`Received RefreshToken request`);
    const command = new RefreshTokenCommand(request.refreshToken);
    return this.commandBus.execute(command);
  }

  @GrpcMethod('IdentityService', 'VerifyEmail')
  async verifyEmail(request: VerifyEmailRequest): Promise<{}> {
    this.logger.log(`Received VerifyEmail request with token: ${request.token}`);
    const command = new VerifyEmailCommand(request.token);
    await this.commandBus.execute(command);
    return {};
  }

  @GrpcMethod('IdentityService', 'RequestPasswordReset')
  async requestPasswordReset(
    request: RequestPasswordResetRequest,
  ): Promise<{}> {
    this.logger.log(
      `Received RequestPasswordReset request for email: ${request.email}`,
    );
    const command = new RequestPasswordResetCommand(request.email);
    await this.commandBus.execute(command);
    // Always return success to prevent email enumeration
    return {};
  }

  @GrpcMethod('IdentityService', 'ResetPassword')
  async resetPassword(request: ResetPasswordRequest): Promise<{}> {
    this.logger.log(`Received ResetPassword request`);
    const command = new ResetPasswordCommand(
      request.token,
      request.newPassword,
    );
    await this.commandBus.execute(command);
    return {};
  }

  @GrpcMethod('IdentityService', 'EnableMfa')
  async enableMfa(request: EnableMfaRequest): Promise<EnableMfaResponse> {
    this.logger.log(`Received EnableMfa request for userId: ${request.userId}`);
    const command = new EnableMfaCommand(request.userId);
    return this.commandBus.execute(command);
  }

  @GrpcMethod('IdentityService', 'VerifyMfa')
  async verifyMfa(request: VerifyMfaRequest): Promise<LoginResponse> {
    this.logger.log(`Received VerifyMfa request`);
    const command = new VerifyMfaCommand(
      request.mfaSessionToken,
      request.code,
    );
    return this.commandBus.execute(command);
  }
}