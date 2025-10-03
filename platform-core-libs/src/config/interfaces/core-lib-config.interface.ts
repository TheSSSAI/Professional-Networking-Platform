/**
 * @interface ObservabilityConfig
 * Defines the configuration properties for the observability stack,
 * including tracing, logging, and metrics.
 */
export interface ObservabilityConfig {
  /**
   * The name of the consumer microservice, used to identify the service
   * in observability platforms like Jaeger, Grafana, and Loki.
   * @example 'identity-service'
   */
  serviceName: string;

  /**
   * The URL of the OpenTelemetry Collector's OTLP/HTTP endpoint for traces.
   * @example 'http://jaeger-collector:4318/v1/traces'
   */
  otlpExporterUrl: string;

  /**
   * The minimum log level to output.
   * Follows standard log level conventions.
   * @example 'info' | 'debug' | 'warn' | 'error'
   * @default 'info'
   */
  logLevel?: string;
}

/**
 * @interface SecurityConfig
 * Defines the configuration properties for security-related components,
 * such as JWT validation and Redis connection for token blocklisting.
 */
export interface SecurityConfig {
  /**
   * The secret key used to verify JWT signatures. This must be a long,
   * complex, and securely stored string.
   */
  jwtSecret: string;

  /**
   * The connection URL for the Redis instance used for the token blocklist.
   * @example 'redis://redis:6379'
   */
  redisUrl: string;
}

/**
 * @interface CoreLibConfig
 * Defines the complete shape of the configuration object that consumer
 * applications must provide to initialize the library's modules.
 * This contract ensures type-safe configuration across all microservices.
 */
export interface CoreLibConfig {
  /**
   * Configuration for observability components.
   */
  observability: ObservabilityConfig;

  /**
   * Configuration for security components.
   */
  security: SecurityConfig;
}