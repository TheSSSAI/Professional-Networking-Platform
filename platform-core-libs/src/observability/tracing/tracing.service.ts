import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConfigService } from '../../config/config.service';
import { LoggerService } from '../logging/logger.service';

/**
 * @class TracingService
 * @description A service responsible for initializing and managing the OpenTelemetry NodeSDK.
 * This service should be instantiated only once at the application's root (e.g., in AppModule).
 * It configures and starts the SDK on module initialization and gracefully shuts it down
 * on application shutdown. This is a core part of implementing REQ-1-083.
 *
 * @property {NodeSDK} sdk - The OpenTelemetry NodeSDK instance.
 *
 * @requires ConfigService - To get configuration like service name and OTLP exporter URL.
 * @requires LoggerService - For logging during the bootstrap and shutdown process.
 */
@Injectable()
export class TracingService implements OnModuleInit, OnApplicationShutdown {
  private sdk: NodeSDK;
  private readonly logger = new LoggerService(this.configService);

  constructor(private readonly configService: ConfigService) {
    this.logger.setContext(TracingService.name);
  }

  /**
   * @method onModuleInit
   * @description NestJS lifecycle hook. Initializes and starts the OpenTelemetry SDK.
   * This is where all tracing instrumentation is configured.
   */
  onModuleInit() {
    const coreLibConfig = this.configService.get();
    const serviceName = coreLibConfig.observability.serviceName;
    const otlpExporterUrl = coreLibConfig.observability.otlpExporterUrl;

    if (!serviceName || !otlpExporterUrl) {
        this.logger.error(
            'Observability configuration is incomplete. Tracing will be disabled. ' +
            'Please provide serviceName and otlpExporterUrl.'
        );
        return;
    }

    const traceExporter = new OTLPTraceExporter({
      url: otlpExporterUrl,
    });

    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    });

    const spanProcessor = new BatchSpanProcessor(traceExporter);

    this.sdk = new NodeSDK({
      resource: resource,
      spanProcessor: spanProcessor,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Example of disabling an instrumentation if it's too noisy or causes issues
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
        }),
      ],
    });

    try {
      this.sdk.start();
      this.logger.log('OpenTelemetry Tracing SDK started successfully.');
    } catch (error) {
      this.logger.error('Failed to start OpenTelemetry Tracing SDK.', error.stack);
      process.exit(1); // Exit if tracing fails to start, as it's a critical component.
    }
  }

  /**
   * @method onApplicationShutdown
   * @description NestJS lifecycle hook. Gracefully shuts down the OpenTelemetry SDK.
   * @param {string} [signal] - The shutdown signal received.
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Received shutdown signal (${signal || 'unknown'}). Shutting down OpenTelemetry SDK...`);
    if (this.sdk) {
      try {
        await this.sdk.shutdown();
        this.logger.log('OpenTelemetry Tracing SDK shut down successfully.');
      } catch (error) {
        this.logger.error('Error shutting down OpenTelemetry Tracing SDK.', error.stack);
      }
    }
  }
}