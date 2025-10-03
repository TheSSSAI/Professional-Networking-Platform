import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ITokenBlocklistService } from './interfaces/token-blocklist-service.interface';
import { TokenBlocklistService } from './services/token-blocklist.service';
import { CoreLibConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CoreLibConfig } from '../config/interfaces/core-lib-config.interface';

/**
 * A comprehensive security module that provides and configures authentication
 * (JWT) and authorization (RBAC) for consuming microservices.
 *
 * This is a dynamic module that must be configured using the `forRootAsync`
 * static method. It sets up Passport.js with a JWT strategy and provides
 * the necessary guards and services for securing endpoints.
 */
@Global()
@Module({})
export class SecurityModule {
  /**
   * Configures the security module asynchronously.
   * Allows the consumer application to provide JWT and Redis configuration
   * from its own `ConfigModule`.
   * @param options - The async options for configuring the module.
   * @returns A `DynamicModule` with the configured providers.
   */
  static forRootAsync(
    options: {
      imports?: any[];
      useFactory: (
        ...args: any[]
      ) => CoreLibConfig['security'] | Promise<CoreLibConfig['security']>;
      inject?: any[];
    } = {
      imports: [CoreLibConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('security'),
      inject: [ConfigService],
    },
  ): DynamicModule {
    const securityConfigProvider: Provider = {
      provide: 'SECURITY_CONFIG',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const tokenBlocklistServiceProvider: Provider = {
      provide: ITokenBlocklistService,
      useFactory: (config: CoreLibConfig['security']) => {
        // Here you would typically initialize a Redis client based on the URL
        // and pass it to the TokenBlocklistService.
        // For this library, we assume a Redis client provider is available
        // in the consuming service, or we abstract it further.
        // Let's create a placeholder for the Redis client.
        const redisClient = {}; // Placeholder for an actual Redis client instance
        return new TokenBlocklistService(redisClient as any);
      },
      inject: ['SECURITY_CONFIG'],
    };

    return {
      module: SecurityModule,
      imports: [
        ...(options.imports || []),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [CoreLibConfigModule, ...(options.imports || [])],
          useFactory: async (configService: ConfigService) => {
            const securityConfig = configService.get('security');
            return {
              secret: securityConfig.jwtSecret,
              signOptions: {
                // Default sign options can be added here if needed
                // e.g., expiresIn: '15m'
              },
            };
          },
          inject: [ConfigService, ...(options.inject || [])],
        }),
      ],
      providers: [
        securityConfigProvider,
        tokenBlocklistServiceProvider,
        JwtStrategy,
        JwtAuthGuard,
        RolesGuard,
      ],
      exports: [
        JwtAuthGuard,
        RolesGuard,
        ITokenBlocklistService,
        PassportModule,
        JwtModule,
      ],
    };
  }
}