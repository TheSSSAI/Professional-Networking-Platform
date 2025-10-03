/**
 * @fileoverview This is the main entry point for the platform-core-libs package.
 * It serves as a "barrel file" to export all the public-facing modules, services,
 * guards, interceptors, pipes, filters, decorators, and interfaces.
 *
 * By exporting everything from this single file, consumer microservices can have
 * clean, consistent import statements, such as:
 * `import { ObservabilityModule, LoggerService, JwtAuthGuard } from '@platform/core-libs';`
 *
 * This pattern decouples consumer services from the internal directory structure of this library,
 * making it easier to refactor the library in the future without causing breaking changes
 * for consumers, as long as the public API exported here remains consistent.
 *
 * @see REQ-1-063 - This file supports code quality and organization by providing a clear API surface.
 * @see REQ-1-083 - Exports the entire observability stack.
 * @see REQ-1-005 - Exports the security components for JWT validation and blocklisting.
 */

// =====================================================================================
//      CONFIG MODULE
// =====================================================================================

// Module
export * from './config/config.module';

// Services
export * from './config/config.service';

// Interfaces
export * from './config/interfaces/core-lib-config.interface';

// =====================================================================================
//      CORE MODULE
// =====================================================================================

// Module
export * from './core/core.module';

// DTOs
export * from './core/dtos/pagination.dto';

// Exceptions & Filters
export * from './core/exceptions/http-exception.filter';
export * from './core/exceptions/validation.exception';

// Pipes
export * from './core/pipes/validation.pipe';

// =====================================================================================
//      OBSERVABILITY MODULE
// =====================================================================================

// Module
export * from './observability/observability.module';

// Logging
export * from './observability/logging/logger.service';
export * from './observability/logging/logging.interceptor';

// Metrics
export * from './observability/metrics/metrics.service';
export * from './observability/metrics/metrics.interceptor';

// Tracing
export * from './observability/tracing/tracing.service';

// =====================================================================================
//      SECURITY MODULE
// =====================================================================================

// Module
export * from './security/security.module';

// Decorators
export * from './security/decorators/roles.decorator';
export * from './security/decorators/user.decorator';

// Guards
export * from './security/guards/jwt-auth.guard';
export * from './security/guards/roles.guard';

// Services & Interfaces
export * from './security/services/token-blocklist.service';
export * from './security/interfaces/token-blocklist-service.interface';