# 1 Dependency Levels

## 1.1 Level

### 1.1.1 Level

🔹 0

### 1.1.2 Files

- proto/common.proto
- src/modules/profile/domain/events/profile-updated.event.ts
- src/modules/profile/domain/exceptions/profile-not-found.exception.ts
- src/modules/profile/domain/exceptions/work-experience-not-found.exception.ts
- src/modules/profile/domain/interfaces/profile-repository.interface.ts
- src/modules/profile/domain/value-objects/visibility.enum.ts

## 1.2.0 Level

### 1.2.1 Level

🔹 1

### 1.2.2 Files

- prisma/schema.prisma
- proto/profile.proto
- src/modules/profile/application/dtos/add-work-experience.dto.ts
- src/modules/profile/application/dtos/generate-upload-url.dto.ts
- src/modules/profile/application/dtos/update-basic-info.dto.ts
- src/modules/profile/domain/entities/education.entity.ts
- src/modules/profile/domain/entities/skill-endorsement.entity.ts
- src/modules/profile/domain/entities/skill.entity.ts
- src/modules/profile/domain/entities/work-experience.entity.ts

## 1.3.0 Level

### 1.3.1 Level

🔹 2

### 1.3.2 Files

- src/modules/profile/application/commands/handlers/add-work-experience.handler.ts
- src/modules/profile/application/commands/handlers/update-basic-info.handler.ts
- src/modules/profile/application/queries/handlers/get-profile.handler.ts
- src/modules/profile/application/services/media.service.ts
- src/modules/profile/application/subscribers/user-registered.subscriber.ts
- src/modules/profile/domain/entities/profile.entity.ts
- src/modules/profile/domain/services/link-preview-fetcher.service.ts

## 1.4.0 Level

### 1.4.1 Level

🔹 3

### 1.4.2 Files

- src/modules/profile/infrastructure/caching/profile-cache.service.ts
- src/modules/profile/infrastructure/clients/connection-service.grpc.client.ts
- src/modules/profile/infrastructure/event-publishing/sns-event.publisher.ts
- src/modules/profile/infrastructure/repositories/profile.prisma.repository.ts

## 1.5.0 Level

### 1.5.1 Level

🔹 4

### 1.5.2 Files

- src/modules/profile/presentation/guards/profile-owner.guard.ts
- src/modules/profile/presentation/interceptors/cache-invalidation.interceptor.ts
- src/modules/profile/presentation/profile.grpc.controller.ts

## 1.6.0 Level

### 1.6.1 Level

🔹 5

### 1.6.2 Files

- src/modules/profile/profile.module.ts

## 1.7.0 Level

### 1.7.1 Level

🔹 6

### 1.7.2 Files

- .editorconfig
- .env.example
- .eslintc.js
- .gitignore
- .prettierrc
- Dockerfile
- .dockerignore
- jest.config.js
- nest-cli.json
- package.json
- tsconfig.build.json
- tsconfig.json
- .github/workflows/ci.yml
- .vscode/launch.json
- .vscode/settings.json
- src/app.module.ts
- src/main.ts

# 2.0.0 Total Files

42

# 3.0.0 Generation Order

- 0
- 1
- 2
- 3
- 4
- 5
- 6

