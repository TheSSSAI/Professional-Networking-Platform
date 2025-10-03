import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError, throwError, timeout } from 'rxjs';
import { status as grpcStatus } from '@grpc/grpc-js';

// These interfaces would typically be generated from a .proto file
// and placed in a shared contracts library.
interface IdentityServiceClient {
  banUser(request: BanUserRequest): Promise<StatusResponse>;
  suspendUser(request: SuspendUserRequest): Promise<StatusResponse>;
  triggerPasswordResetForUser(
    request: TriggerPasswordResetRequest,
  ): Promise<StatusResponse>;
}

interface BanUserRequest {
  userId: string;
  adminId: string;
  reason: string;
}

interface SuspendUserRequest {
  userId: string;
  adminId: string;
  reason: string;
  durationSeconds: number;
}

interface TriggerPasswordResetRequest {
  userId: string;
  adminId: string;
}

interface StatusResponse {
  success: boolean;
  message?: string;
}

/**
 * A client service to interact with the Identity microservice via gRPC.
 * It abstracts the low-level gRPC client proxy and provides a clean,
 * Promise-based interface for the application layer.
 */
@Injectable()
export class IdentityClient implements OnModuleInit {
  private identityService: IdentityServiceClient;
  private readonly timeoutMs = 5000; // 5 seconds

  constructor(
    @Inject('IDENTITY_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.identityService =
      this.client.getService<IdentityServiceClient>('IdentityService');
  }

  /**
   * Sends a command to ban a user.
   * @param {BanUserRequest} request - The ban user request payload.
   * @returns {Promise<StatusResponse>} The status response from the Identity service.
   */
  async banUser(request: BanUserRequest): Promise<StatusResponse> {
    return firstValueFrom(
      this.identityService.banUser(request).pipe(
        timeout(this.timeoutMs),
        catchError((err) =>
          throwError(
            () =>
              new Error(
                `gRPC call to IdentityService.banUser failed: ${
                  err.details || err.message
                }`,
              ),
          ),
        ),
      ),
    );
  }

  /**
   * Sends a command to suspend a user.
   * @param {SuspendUserRequest} request - The suspend user request payload.
   * @returns {Promise<StatusResponse>} The status response from the Identity service.
   */
  async suspendUser(request: SuspendUserRequest): Promise<StatusResponse> {
    return firstValueFrom(
      this.identityService.suspendUser(request).pipe(
        timeout(this.timeoutMs),
        catchError((err) =>
          throwError(
            () =>
              new Error(
                `gRPC call to IdentityService.suspendUser failed: ${
                  err.details || err.message
                }`,
              ),
          ),
        ),
      ),
    );
  }

  /**
   * Sends a command to trigger a password reset for a user.
   * @param {TriggerPasswordResetRequest} request - The trigger password reset request payload.
   * @returns {Promise<StatusResponse>} The status response from the Identity service.
   */
  async triggerPasswordResetForUser(
    request: TriggerPasswordResetRequest,
  ): Promise<StatusResponse> {
    return firstValueFrom(
      this.identityService.triggerPasswordResetForUser(request).pipe(
        timeout(this.timeoutMs),
        catchError((err) =>
          throwError(
            () =>
              new Error(
                `gRPC call to IdentityService.triggerPasswordResetForUser failed: ${
                  err.details || err.message
                }`,
              ),
          ),
        ),
      ),
    );
  }
}