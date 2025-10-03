import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CoreLibConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CoreLibConfig } from '../config/interfaces/core-lib-config.interface';

import { LoggerService } from './logging/logger.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { MetricsService } from './metrics/metrics.service';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { TracingService } from './tracing/tracing.service';

/**
 * A comprehensive observability module that provides and configures logging,
 * metrics, and tracing for consuming microservices.
 *
 * This is a dynamic module that must be configured using the `forRootAsync`
 * static method. It is marked as global to make the LoggerService and MetricsService
 * available for injection throughout the application without needing to import this
 * module in every feature module.
 *
 * It also globally registers the LoggingInterceptor and MetricsInterceptor to
 * automatically instrument all incoming requests.
 */
@Global()
@Module({})
export class ObservabilityModule {
  /**
   * Configures the observability module asynchronously.
   * This is the intended way to use this module. It allows the consumer application
   * to provide configuration from its own `ConfigModule`.
   * @param options - The async options for configuring the module.
   * @returns A `DynamicModule` with the configured providers.
   */
  static forRootAsync(
    options: {
      imports?: any[];
      useFactory: (
        ...args: any[]
      ) =>
        | CoreLibConfig['observability']
        | Promise<CoreLibConfig['observability']>;
      inject?: any[];
    } = {
      imports: [CoreLibConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('observability'),
      inject: [ConfigService],
    },
  ): DynamicModule {
    const observabilityConfigProvider: Provider = {
      provide: 'OBSERVABILITY_CONFIG',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const tracingServiceProvider: Provider = {
      provide: TracingService,
      useFactory: (config: CoreLibConfig['observability']) => {
        const tracingService = new TracingService(config);
        tracingService.start();
        return tracingService;
      },
      inject: ['OBSERVABILITY_CONFIG'],
    };

    return {
      module: ObservabilityModule,
      imports: options.imports,
      providers: [
        observabilityConfigProvider,
        tracingServiceProvider,
        LoggerService,
        MetricsService,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: MetricsInterceptor,
        },
      ],
      exports: [LoggerService, MetricsService, TracingService],
    };
  }
}