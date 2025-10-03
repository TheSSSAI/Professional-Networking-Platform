# 1 Dependency Levels

## 1.1 Level

### 1.1.1 Level

🔹 0

### 1.1.2 Files

- prisma/schema.prisma
- proto/identity/identity.proto
- src/config/app.config.ts
- src/config/database.config.ts
- src/config/jwt.config.ts
- src/config/redis.config.ts
- src/shared/interfaces/event-publisher.interface.ts
- src/modules/auth/domain/enums/user-status.enum.ts
- src/modules/auth/domain/enums/token-type.enum.ts
- src/modules/auth/domain/events/user-registered.event.ts
- src/modules/auth/domain/events/password-reset-requested.event.ts
- src/modules/auth/domain/interfaces/hashing.service.interface.ts
- src/modules/auth/domain/interfaces/token-blocklist.service.interface.ts
- src/modules/auth/domain/interfaces/unit-of-work.interface.ts
- src/modules/auth/domain/interfaces/user.repository.interface.ts

## 1.2.0 Level

### 1.2.1 Level

🔹 1

### 1.2.2 Files

- src/modules/auth/domain/entities/role.entity.ts
- src/modules/auth/domain/entities/user-role.entity.ts
- src/modules/auth/domain/entities/user-token.entity.ts
- src/modules/auth/domain/entities/account-deletion-request.entity.ts
- src/modules/auth/domain/entities/user-security-audit-log.entity.ts
- src/modules/auth/domain/entities/user.entity.ts
- src/modules/auth/domain/services/password.domain-service.ts

## 1.3.0 Level

### 1.3.1 Level

🔹 2

### 1.3.2 Files

- src/modules/auth/application/dtos/jwt-payload.dto.ts
- src/modules/auth/application/dtos/login-response.dto.ts
- src/modules/auth/application/use-cases/register-user/register-user.command.ts
- src/modules/auth/application/use-cases/login-user/login-user.command.ts
- src/modules/auth/application/use-cases/logout-user/logout-user.command.ts
- src/modules/auth/application/use-cases/validate-token/validate-token.query.ts
- src/modules/auth/application/use-cases/refresh-token/refresh-token.command.ts
- src/modules/auth/application/use-cases/verify-email/verify-email.command.ts
- src/modules/auth/application/use-cases/request-password-reset/request-password-reset.command.ts
- src/modules/auth/application/use-cases/reset-password/reset-password.command.ts
- src/modules/auth/application/use-cases/enable-mfa/enable-mfa.command.ts
- src/modules/auth/application/use-cases/verify-mfa/verify-mfa.command.ts

## 1.4.0 Level

### 1.4.1 Level

🔹 3

### 1.4.2 Files

- src/shared/pipes/zod-validation.pipe.ts
- src/modules/auth/infrastructure/services/bcrypt.service.ts
- src/modules/auth/infrastructure/services/redis-token-blocklist.service.ts
- src/modules/auth/infrastructure/services/event-publisher.service.ts

## 1.5.0 Level

### 1.5.1 Level

🔹 4

### 1.5.2 Files

- src/modules/auth/infrastructure/repositories/user.prisma.repository.ts
- src/modules/auth/infrastructure/repositories/prisma.unit-of-work.ts

## 1.6.0 Level

### 1.6.1 Level

🔹 5

### 1.6.2 Files

- src/modules/auth/application/use-cases/register-user/register-user.handler.ts
- src/modules/auth/application/use-cases/login-user/login-user.handler.ts
- src/modules/auth/application/use-cases/logout-user/logout-user.handler.ts
- src/modules/auth/application/use-cases/validate-token/validate-token.handler.ts
- src/modules/auth/application/use-cases/refresh-token/refresh-token.handler.ts
- src/modules/auth/application/use-cases/verify-email/verify-email.handler.ts
- src/modules/auth/application/use-cases/request-password-reset/request-password-reset.handler.ts
- src/modules/auth/application/use-cases/reset-password/reset-password.handler.ts
- src/modules/auth/application/use-cases/enable-mfa/enable-mfa.handler.ts
- src/modules/auth/application/use-cases/verify-mfa/verify-mfa.handler.ts

## 1.7.0 Level

### 1.7.1 Level

🔹 6

### 1.7.2 Files

- src/shared/exceptions/grpc-exception.filter.ts
- src/modules/auth/presentation/auth.grpc.controller.ts

## 1.8.0 Level

### 1.8.1 Level

🔹 7

### 1.8.2 Files

- src/modules/auth/auth.module.ts

## 1.9.0 Level

### 1.9.1 Level

🔹 8

### 1.9.2 Files

- .github/workflows/ci.yml
- .vscode/settings.json
- .vscode/launch.json
- package.json
- tsconfig.json
- nest-cli.json
- .env.example
- .editorconfig
- Dockerfile
- docker-compose.yml
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore
- .dockerignore

# 2.0.0 Total Files

70

# 3.0.0 Generation Order

- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8

