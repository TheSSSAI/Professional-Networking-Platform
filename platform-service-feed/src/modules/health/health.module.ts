import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * @class HealthModule
 * @description A module dedicated to providing application health check endpoints.
 * This is a standard pattern for microservice observability, allowing orchestrators
 * like Kubernetes to monitor the service's liveness and readiness.
 */
@Module({
  controllers: [
    // Register HealthController to handle incoming gRPC requests for health checks.
    HealthController,
  ],
})
export class HealthModule {}