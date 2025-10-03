# 1 Dependency Levels

## 1.1 Level

### 1.1.1 Level

🔹 0

### 1.1.2 Files

- prisma/schema.prisma
- proto/connections/connections.proto
- src/modules/connections/domain/connection-status.enum.ts
- src/modules/connections/domain/interfaces/connection-cache.repository.interface.ts
- src/modules/connections/domain/interfaces/connection.repository.interface.ts
- src/modules/connections/domain/interfaces/event-publisher.port.interface.ts

## 1.2.0 Level

### 1.2.1 Level

🔹 1

### 1.2.2 Files

- src/modules/connections/domain/events/connection-accepted.event.ts
- src/modules/connections/domain/events/connection-request-sent.event.ts
- src/modules/connections/application/dtos/send-request.dto.ts

## 1.3.0 Level

### 1.3.1 Level

🔹 2

### 1.3.2 Files

- src/modules/connections/domain/connection.aggregate.ts

## 1.4.0 Level

### 1.4.1 Level

🔹 3

### 1.4.2 Files

- src/modules/connections/application/commands/handlers/accept-request.handler.ts
- src/modules/connections/application/commands/handlers/remove-connection.handler.ts
- src/modules/connections/application/commands/handlers/send-request.handler.ts
- src/modules/connections/application/queries/handlers/get-connections.handler.ts
- src/modules/connections/application/queries/handlers/is-connected.handler.ts

## 1.5.0 Level

### 1.5.1 Level

🔹 4

### 1.5.2 Files

- src/modules/connections/infrastructure/publishers/sns-event.publisher.ts
- src/modules/connections/infrastructure/repositories/connection.prisma.repository.ts
- src/modules/connections/infrastructure/repositories/connection.redis.repository.ts

## 1.6.0 Level

### 1.6.1 Level

🔹 5

### 1.6.2 Files

- src/modules/connections/presentation/guards/connection-action.guard.ts
- src/modules/connections/presentation/connections.grpc.controller.ts

## 1.7.0 Level

### 1.7.1 Level

🔹 6

### 1.7.2 Files

- src/modules/connections/connections.module.ts
- src/app.module.ts

## 1.8.0 Level

### 1.8.1 Level

🔹 7

### 1.8.2 Files

- src/main.ts

## 1.9.0 Level

### 1.9.1 Level

🔹 8

### 1.9.2 Files

- package.json
- tsconfig.json
- nest-cli.json
- .env
- docker-compose.yml
- Dockerfile
- jest.config.js
- .eslintrc.js
- .prettierrc
- .gitignore
- .dockerignore

## 1.10.0 Level

### 1.10.1 Level

🔹 9

### 1.10.2 Files

- .github/workflows/ci.yml
- .vscode/settings.json
- .vscode/extensions.json

# 2.0.0 Total Files

33

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

