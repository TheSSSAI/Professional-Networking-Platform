.md
# Platform Core Libraries (@platform/core-libs)

This repository contains the shared, reusable backend library for all NestJS-based microservices within the platform. It provides standardized implementations for cross-cutting concerns to reduce code duplication and enforce consistent architectural patterns.

**Note:** This is a private package and requires authentication with the appropriate NPM registry.

## Features

- **Observability**: A comprehensive, configurable observability stack (`REQ-1-083`).
  - **Structured Logging**: High-performance JSON logging with automatic trace context injection for correlation in Loki.
  - **Distributed Tracing**: OpenTelemetry SDK configuration for tracing requests across services with Jaeger.
  - **Metrics**: Prometheus client configuration and an injectable service for custom application metrics.
- **Security**: Centralized security components for consistent policy enforcement.
  - **Authentication**: A robust `JwtAuthGuard` that validates tokens and checks against a Redis-backed blocklist for immediate session revocation (`REQ-1-005`).
  - **Authorization**: A flexible `RolesGuard` and `@Roles` decorator for implementing Role-Based Access Control (RBAC).
- **Core Utilities**: Boilerplate reduction for common application patterns.
  - **Standardized Error Handling**: A global `HttpExceptionFilter` to ensure all HTTP errors have a consistent JSON format.
  - **Global Validation**: A `ValidationPipe` that automatically validates all incoming DTOs.

## Installation

First, ensure your project's `.npmrc` file is configured to fetch packages from the private registry.

```.npmrc
@platform:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then, install the package:

```bash
npm install @platform/core-libs
```

You will also need to install the required `peerDependencies`. These are not bundled with the library to avoid version conflicts in your application.

```bash
npm install @nestjs/common @nestjs/core @nestjs/config reflect-metadata rxjs class-validator class-transformer
```

## Usage

### 1. ObservabilityModule

This module provides logging, metrics, and tracing. Import it into your main `AppModule`.

**`app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ObservabilityModule, CoreLibConfig } from '@platform/core-libs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Your app's config module
    ObservabilityModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CoreLibConfig['observability'] => ({
        serviceName: configService.get<string>('SERVICE_NAME', 'unknown-service'),
        otlpExporterUrl: configService.get<string>('OTLP_EXPORTER_URL'),
        logLevel: configService.get<string>('LOG_LEVEL', 'info'),
      }),
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

**`main.ts`**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '@platform/core-libs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until our custom logger is ready
  });

  // Use the custom logger from our library
  app.useLogger(app.get(LoggerService));
  
  // ... other app configuration
  
  await app.listen(3000);
}
bootstrap();
```

**Using the Logger in a Service**
The `LoggerService` is globally available and can be injected.

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@platform/core-libs';

@Injectable()
export class MyService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(MyService.name);
  }

  doSomething(userId: string) {
    this.logger.log(`Doing something for user ${userId}`);
    // Logs will automatically include traceId and spanId
  }
}
```

### 2. SecurityModule

To protect your application's endpoints, you need to provide the `JwtAuthGuard` globally and import the `SecurityModule`.

**`app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecurityModule, JwtAuthGuard, CoreLibConfig } from '@platform/core-libs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SecurityModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CoreLibConfig['security'] => ({
        jwtSecret: configService.get<string>('JWT_SECRET'),
        redisUrl: configService.get<string>('REDIS_URL'),
      }),
    }),
    // ... other modules
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply JWT validation to all routes by default
    },
  ],
})
export class AppModule {}
```

**Protecting a Route with Roles**
Use the `RolesGuard` in combination with the `@Roles` decorator.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard, Roles } from '@platform/core-libs';

@Controller('admin')
@UseGuards(RolesGuard) // Apply after JwtAuthGuard
export class AdminController {
  
  @Get('dashboard')
  @Roles('Administrator') // Only users with the 'Administrator' role can access this
  getDashboard() {
    return { data: 'Welcome to the admin dashboard!' };
  }
}
```

### 3. CoreModule

This module provides global exception filters and validation pipes. You typically import it once in your `AppModule`.

**`app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { CoreModule } from '@platform/core-libs';

@Module({
  imports: [
    CoreModule,
    // ... other modules
  ],
})
export class AppModule {}
```
This will automatically:
- Format all `HttpException` responses into a standard JSON structure.
- Validate all incoming DTOs that use `class-validator` decorators.

---

This library is a foundational piece of the platform architecture. Please refer to the `CHANGELOG.md` for version history.