erDiagram
    User {
        Guid userId PK
        VARCHAR email UK
        VARCHAR passwordHash
        VARCHAR status
    }
    Role {
        INT roleId PK
        VARCHAR roleName UK
    }
    UserRole {
        Guid userId PK, FK
        INT roleId PK, FK
    }
    UserToken {
        Guid tokenId PK
        Guid userId FK
        VARCHAR tokenType
        DateTime expiresAt
    }
    AccountDeletionRequest {
        Guid requestId PK
        Guid userId FK, UK
        VARCHAR status
        DateTime scheduledPurgeAt
    }
    UserSecurityAuditLog {
        Guid logId PK
        Guid userId FK
        VARCHAR action
        DateTime createdAt
    }

    User ||--|{ UserRole : has
    Role ||--|{ UserRole : has
    User ||--o{ UserToken : issues
    User ||--o| AccountDeletionRequest : requests
    User ||--o{ UserSecurityAuditLog : logs