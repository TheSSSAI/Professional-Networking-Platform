import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  CoreLibConfig,
  ObservabilityConfig,
  SecurityConfig,
} from './interfaces/core-lib-config.interface';

/**
 * A type-safe wrapper around the NestJS ConfigService.
 * This service provides strongly-typed access to the configuration properties
 * defined in the CoreLibConfig interface. It acts as a facade, ensuring that
 * all configuration access within the core library and consuming services
 * is consistent and less prone to errors from typos in configuration keys.
 *
 * It is provided by the ConfigModule and can be injected into any other service
 * that requires access to configuration.
 */
@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  /**
   * Retrieves the entire observability configuration object.
   * @returns {ObservabilityConfig} The observability configuration section.
   */
  getObservabilityConfig(): ObservabilityConfig {
    const config = this.nestConfigService.get<ObservabilityConfig>('observability');
    if (!config) {
      throw new Error('Observability configuration is missing.');
    }
    return config;
  }

  /**
   * Retrieves the entire security configuration object.
   * @returns {SecurityConfig} The security configuration section.
   */
  getSecurityConfig(): SecurityConfig {
    const config = this.nestConfigService.get<SecurityConfig>('security');
    if (!config) {
      throw new Error('Security configuration is missing.');
    }
    return config;
  }

  /**
   * Retrieves the JWT secret from the security configuration.
   * @returns {string} The JWT secret key.
   */
  getJwtSecret(): string {
    const secret = this.nestConfigService.get<string>('security.jwtSecret');
    if (!secret) {
      throw new Error('JWT secret (security.jwtSecret) is not configured.');
    }
    return secret;
  }

  /**
   * Retrieves the Redis connection URL from the security configuration.
   * This is used for services like the token blocklist.
   * @returns {string} The Redis connection URL.
   */
  getRedisUrl(): string {
    const url = this.nestConfigService.get<string>('security.redisUrl');
    if (!url) {
      throw new Error('Redis URL (security.redisUrl) is not configured.');
    }
    return url;
  }
  
  /**
   * Retrieves the name of the service from the observability configuration.
   * This is crucial for OpenTelemetry resource attributes.
   * @returns {string} The service name.
   */
  getServiceName(): string {
    const serviceName = this.nestConfigService.get<string>('observability.serviceName');
    if (!serviceName) {
      throw new Error('Service name (observability.serviceName) is not configured.');
    }
    return serviceName;
  }

  /**
   * Retrieves the OTLP exporter URL from the observability configuration.
   * This is the endpoint where traces and metrics will be sent.
   * @returns {string} The OTLP exporter URL.
   */
  getOtlpExporterUrl(): string {
    const url = this.nestConfigService.get<string>('observability.otlpExporterUrl');
    if (!url) {
      throw new Error('OTLP Exporter URL (observability.otlpExporterUrl) is not configured.');
    }
    return url;
  }

  /**
   * A generic getter to access any configuration property with type safety.
   * This can be used for properties not explicitly exposed by other methods.
   * Throws an error if the configuration key is not found.
   * @template T - The expected type of the configuration value.
   * @param {keyof CoreLibConfig | string} propertyPath - The dot-notation path to the property.
   * @returns {T} The configuration value.
   */
  get<T>(propertyPath: keyof CoreLibConfig | string): T {
    const value = this.nestConfigService.get<T>(propertyPath);
    if (value === undefined) {
      throw new Error(`Configuration property "${propertyPath}" is not defined.`);
    }
    return value;
  }
}