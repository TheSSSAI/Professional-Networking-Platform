import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { IProfileServicePort } from '../../domain/interfaces/profile.service.port.interface';

// This interface should be auto-generated from the .proto file
// For generation purposes, it is defined here based on the contract.
interface IProfileGrpcService {
  getProfile(request: { userId: string }): Promise<{ visibility: string }>;
}

@Injectable()
export class ProfileServiceAdapter implements IProfileServicePort, OnModuleInit {
  private readonly logger = new Logger(ProfileServiceAdapter.name);
  private profileGrpcService: IProfileGrpcService;

  constructor(@Inject('PROFILE_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.profileGrpcService =
      this.client.getService<IProfileGrpcService>('ProfileService');
  }

  async getProfileVisibility(userId: string): Promise<'Public' | 'Private'> {
    try {
      this.logger.log(`Fetching profile visibility for user: ${userId}`);
      const response = await firstValueFrom(
        this.profileGrpcService
          .getProfile({ userId })
          // @ts-ignore
          .pipe(timeout(5000)),
      );

      if (response.visibility === 'PUBLIC') {
        return 'Public';
      }
      return 'Private';
    } catch (error) {
      this.logger.error(
        `Failed to fetch profile visibility for user ${userId}. Error: ${error.message}`,
        error.stack,
      );
      // Fail-closed for security. If we can't get visibility, assume it's private.
      return 'Private';
    }
  }
}