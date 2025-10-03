# 1 Dependency Levels

## 1.1 Level

### 1.1.1 Level

🔹 0

### 1.1.2 Files

- prisma/schema.prisma
- proto/admin.proto
- src/modules/audit/domain/enums/admin-action-type.enum.ts
- src/modules/audit/domain/interfaces/admin-audit-log.repository.ts
- src/modules/configuration/domain/interfaces/feature-flag.repository.ts
- src/modules/moderation/domain/enums/report-status.enum.ts
- src/modules/moderation/domain/interfaces/content-report.repository.ts

## 1.2.0 Level

### 1.2.1 Level

🔹 1

### 1.2.2 Files

- src/modules/audit/domain/entities/admin-audit-log.entity.ts
- src/modules/configuration/domain/entities/feature-flag.entity.ts
- src/modules/moderation/domain/entities/content-report.entity.ts

## 1.3.0 Level

### 1.3.1 Level

🔹 2

### 1.3.2 Files

- src/modules/moderation/presentation/dtos/take-moderation-action.dto.ts
- src/modules/moderation/application/commands/take-moderation-action/take-moderation-action.command.ts
- src/modules/moderation/application/queries/get-moderation-queue/get-moderation-queue.query.ts
- src/modules/configuration/application/commands/update-feature-flag/update-feature-flag.command.ts
- src/modules/configuration/application/queries/get-feature-flags/get-feature-flags.query.ts
- src/modules/user_management/application/commands/trigger-password-reset/trigger-password-reset.command.ts
- src/modules/user_management/application/queries/search-users-admin/search-users-admin.query.ts
- src/modules/audit/application/queries/get-audit-logs/get-audit-logs.query.ts

## 1.4.0 Level

### 1.4.1 Level

🔹 3

### 1.4.2 Files

- src/shared/infrastructure/filters/grpc-exception.filter.ts
- src/shared/infrastructure/guards/admin-role.guard.ts
- src/shared/infrastructure/grpc-clients/identity/identity.client.ts
- src/shared/infrastructure/grpc-clients/posts/posts.client.ts
- src/modules/audit/infrastructure/repositories/admin-audit-log.prisma.repository.ts
- src/modules/configuration/infrastructure/repositories/feature-flag.prisma.repository.ts
- src/modules/moderation/infrastructure/repositories/content-report.prisma.repository.ts

## 1.5.0 Level

### 1.5.1 Level

🔹 4

### 1.5.2 Files

- src/modules/audit/application/services/audit.service.ts
- src/modules/moderation/application/events/content-reported.handler.ts
- src/modules/audit/application/queries/get-audit-logs/get-audit-logs.handler.ts
- src/modules/configuration/application/queries/get-feature-flags/get-feature-flags.handler.ts
- src/modules/moderation/application/queries/get-moderation-queue/get-moderation-queue.handler.ts
- src/modules/user_management/application/queries/search-users-admin/search-users-admin.handler.ts

## 1.6.0 Level

### 1.6.1 Level

🔹 5

### 1.6.2 Files

- src/modules/configuration/application/commands/update-feature-flag/update-feature-flag.handler.ts
- src/modules/moderation/application/commands/take-moderation-action/take-moderation-action.handler.ts
- src/modules/user_management/application/commands/trigger-password-reset/trigger-password-reset.handler.ts

## 1.7.0 Level

### 1.7.1 Level

🔹 6

### 1.7.2 Files

- src/modules/configuration/presentation/configuration.grpc.controller.ts
- src/modules/moderation/presentation/moderation.grpc.controller.ts
- src/modules/user_management/presentation/user-management.grpc.controller.ts

## 1.8.0 Level

### 1.8.1 Level

🔹 7

### 1.8.2 Files

- src/shared/infrastructure/grpc-clients/grpc-clients.module.ts
- src/modules/audit/audit.module.ts
- src/modules/configuration/configuration.module.ts
- src/modules/moderation/moderation.module.ts
- src/modules/user_management/user-management.module.ts

## 1.9.0 Level

### 1.9.1 Level

🔹 8

### 1.9.2 Files

- src/app.module.ts
- src/main.ts

## 1.10.0 Level

### 1.10.1 Level

🔹 9

### 1.10.2 Files

- package.json
- tsconfig.json
- nest-cli.json
- .editorconfig
- .prettierrc
- .env.example
- Dockerfile
- docker-compose.yml
- .eslintrc.js
- jest.config.js
- .gitignore
- .dockerignore
- README.md
- .github/workflows/ci.yml
- .vscode/settings.json
- .vscode/extensions.json
- .vscode/launch.json
- test/jest-e2e.json

# 2.0.0 Total Files

66

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
- 9

