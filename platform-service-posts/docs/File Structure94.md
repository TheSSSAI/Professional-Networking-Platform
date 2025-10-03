# 1 Dependency Levels

## 1.1 Level

### 1.1.1 Level

🔹 0

### 1.1.2 Files

- proto/posts/posts.proto
- src/modules/posts/domain/events/post-created.event.ts
- src/modules/posts/domain/events/post-deleted.event.ts
- src/modules/posts/domain/interfaces/connection.service.port.interface.ts
- src/modules/posts/domain/interfaces/event-publisher.port.interface.ts
- src/modules/posts/domain/interfaces/file-storage.port.interface.ts
- src/modules/posts/domain/interfaces/post.repository.interface.ts
- src/modules/posts/domain/interfaces/profile.service.port.interface.ts

## 1.2.0 Level

### 1.2.1 Level

🔹 1

### 1.2.2 Files

- src/modules/posts/domain/link-preview.value-object.ts
- src/modules/posts/domain/post-media.entity.ts

## 1.3.0 Level

### 1.3.1 Level

🔹 2

### 1.3.2 Files

- src/modules/posts/domain/post.aggregate.ts
- src/modules/posts/domain/services/link-preview-fetcher.service.ts
- src/modules/posts/application/commands/create-post/create-post.command.ts
- src/modules/posts/application/commands/delete-post/delete-post.command.ts
- src/modules/posts/application/commands/update-post/update-post.command.ts
- src/modules/posts/application/dtos/post.response.dto.ts
- src/modules/posts/application/queries/get-post-by-id/get-post-by-id.query.ts

## 1.4.0 Level

### 1.4.1 Level

🔹 3

### 1.4.2 Files

- src/modules/posts/application/mappers/post.mapper.ts
- src/modules/posts/application/commands/create-post/create-post.handler.ts
- src/modules/posts/application/commands/delete-post/delete-post.handler.ts
- src/modules/posts/application/commands/update-post/update-post.handler.ts
- src/modules/posts/application/queries/get-post-by-id/get-post-by-id.handler.ts

## 1.5.0 Level

### 1.5.1 Level

🔹 4

### 1.5.2 Files

- prisma/schema.prisma
- prisma/migrations/
- src/modules/posts/infrastructure/clients/grpc-clients.module.ts
- src/modules/posts/infrastructure/adapters/connection.service.adapter.ts
- src/modules/posts/infrastructure/adapters/post.prisma.repository.ts
- src/modules/posts/infrastructure/adapters/profile.service.adapter.ts
- src/modules/posts/infrastructure/adapters/s3-file-storage.adapter.ts
- src/modules/posts/infrastructure/adapters/sns-event-publisher.adapter.ts

## 1.6.0 Level

### 1.6.1 Level

🔹 5

### 1.6.2 Files

- src/modules/posts/presentation/posts.grpc.controller.ts

## 1.7.0 Level

### 1.7.1 Level

🔹 6

### 1.7.2 Files

- .dockerignore
- .editorconfig
- .env.example
- .eslintrc.js
- .gitignore
- .nvmrc
- .prettierrc
- .vscode/settings.json
- Dockerfile
- docker-compose.yml
- jest.config.js
- nest-cli.json
- package.json
- tsconfig.json

# 2.0.0 Total Files

44

# 3.0.0 Generation Order

- 0
- 1
- 2
- 3
- 4
- 5
- 6

