.md
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - YYYY-MM-DD

### Added

- **Initial Release** of the `platform-core-libs` shared library.
- **ObservabilityModule**: Provides comprehensive, configurable observability stack implementation for NestJS microservices, fulfilling `REQ-1-083`.
  - `LoggerService`: High-performance, structured JSON logger (Pino-based) with automatic OpenTelemetry trace context injection for Loki.
  - `TracingService`: Configures OpenTelemetry SDK for distributed tracing with Jaeger.
  - `MetricsService`: Provides injectable service for creating and managing Prometheus metrics (Counters, Gauges, Histograms).
  - `LoggingInterceptor` & `MetricsInterceptor`: Automatically instrument incoming requests for logging and metrics.
- **SecurityModule**: Provides reusable security primitives for authentication and authorization.
  - `JwtAuthGuard`: Protects routes by validating JWT access tokens and checking against a Redis-backed token blocklist, fulfilling `REQ-1-005`.
  - `RolesGuard` & `@Roles` decorator: Enforces Role-Based Access Control (RBAC) for features like the Admin Dashboard (`REQ-1-040`).
  - `TokenBlocklistService`: Service for managing JWT revocation in Redis.
- **CoreModule**: Contains foundational, globally-applicable utilities.
  - `HttpExceptionFilter`: Standardizes JSON error responses across all services.
  - `ValidationPipe`: Enforces consistent DTO validation using `class-validator`.
  - `PaginationQueryDto`: A reusable DTO for standardized API pagination.
- **ConfigModule**: A dynamic module for configuring the library's features in consumer services.