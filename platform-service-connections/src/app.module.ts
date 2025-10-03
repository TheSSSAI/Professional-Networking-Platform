import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionsModule } from './modules/connections/connections.module';
import { HealthModule } from './modules/health/health.module';
import { ObservabilityModule } from './shared/observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      cache: true, // Improve performance by caching environment variables
    }),
    ConnectionsModule,
    HealthModule,
    ObservabilityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}