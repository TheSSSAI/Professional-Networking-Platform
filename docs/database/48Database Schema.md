# 1 Title

Professional Networking Platform - Core Relational Database

# 2 Name

professional_network_main_db

# 3 Db Type

- relational
- multimodel

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 User

### 5.1.1 Name

User

### 5.1.2 Description

Owner: Identity & Access Service. Stores user account credentials, status, and security settings. This is the core authentication entity and the source of truth for a user's existence.

### 5.1.3 Attributes

#### 5.1.3.1 userId

##### 5.1.3.1.1 Name

userId

##### 5.1.3.1.2 Type

🔹 Guid

##### 5.1.3.1.3 Is Required

✅ Yes

##### 5.1.3.1.4 Is Primary Key

✅ Yes

##### 5.1.3.1.5 Size

0

##### 5.1.3.1.6 Is Unique

✅ Yes

##### 5.1.3.1.7 Constraints

*No items available*

##### 5.1.3.1.8 Precision

0

##### 5.1.3.1.9 Scale

0

##### 5.1.3.1.10 Is Foreign Key

❌ No

#### 5.1.3.2.0 email

##### 5.1.3.2.1 Name

email

##### 5.1.3.2.2 Type

🔹 VARCHAR

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

255

##### 5.1.3.2.6 Is Unique

✅ Yes

##### 5.1.3.2.7 Constraints

- EMAIL_FORMAT

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

#### 5.1.3.3.0 passwordHash

##### 5.1.3.3.1 Name

passwordHash

##### 5.1.3.3.2 Type

🔹 VARCHAR

##### 5.1.3.3.3 Is Required

✅ Yes

##### 5.1.3.3.4 Is Primary Key

❌ No

##### 5.1.3.3.5 Size

255

##### 5.1.3.3.6 Is Unique

❌ No

##### 5.1.3.3.7 Constraints

*No items available*

##### 5.1.3.3.8 Precision

0

##### 5.1.3.3.9 Scale

0

##### 5.1.3.3.10 Is Foreign Key

❌ No

#### 5.1.3.4.0 dateOfBirth

##### 5.1.3.4.1 Name

dateOfBirth

##### 5.1.3.4.2 Type

🔹 DATE

##### 5.1.3.4.3 Is Required

✅ Yes

##### 5.1.3.4.4 Is Primary Key

❌ No

##### 5.1.3.4.5 Size

0

##### 5.1.3.4.6 Is Unique

❌ No

##### 5.1.3.4.7 Constraints

*No items available*

##### 5.1.3.4.8 Precision

0

##### 5.1.3.4.9 Scale

0

##### 5.1.3.4.10 Is Foreign Key

❌ No

#### 5.1.3.5.0 status

##### 5.1.3.5.1 Name

status

##### 5.1.3.5.2 Type

🔹 VARCHAR

##### 5.1.3.5.3 Is Required

✅ Yes

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

50

##### 5.1.3.5.6 Is Unique

❌ No

##### 5.1.3.5.7 Constraints

- ENUM('inactive', 'active', 'deactivated', 'suspended', 'banned')
- DEFAULT 'inactive'

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 mfaSecret

##### 5.1.3.6.1 Name

mfaSecret

##### 5.1.3.6.2 Type

🔹 VARCHAR

##### 5.1.3.6.3 Is Required

❌ No

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

255

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

*No items available*

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 mfaEnabled

##### 5.1.3.7.1 Name

mfaEnabled

##### 5.1.3.7.2 Type

🔹 BOOLEAN

##### 5.1.3.7.3 Is Required

✅ Yes

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

- DEFAULT false

##### 5.1.3.7.8 Precision

0

##### 5.1.3.7.9 Scale

0

##### 5.1.3.7.10 Is Foreign Key

❌ No

#### 5.1.3.8.0 createdAt

##### 5.1.3.8.1 Name

createdAt

##### 5.1.3.8.2 Type

🔹 DateTime

##### 5.1.3.8.3 Is Required

✅ Yes

##### 5.1.3.8.4 Is Primary Key

❌ No

##### 5.1.3.8.5 Size

0

##### 5.1.3.8.6 Is Unique

❌ No

##### 5.1.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.8.8 Precision

0

##### 5.1.3.8.9 Scale

0

##### 5.1.3.8.10 Is Foreign Key

❌ No

#### 5.1.3.9.0 updatedAt

##### 5.1.3.9.1 Name

updatedAt

##### 5.1.3.9.2 Type

🔹 DateTime

##### 5.1.3.9.3 Is Required

✅ Yes

##### 5.1.3.9.4 Is Primary Key

❌ No

##### 5.1.3.9.5 Size

0

##### 5.1.3.9.6 Is Unique

❌ No

##### 5.1.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.9.8 Precision

0

##### 5.1.3.9.9 Scale

0

##### 5.1.3.9.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- userId

### 5.1.5.0.0 Unique Constraints

- {'name': 'UC_User_Email', 'columns': ['email']}

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_User_Status

##### 5.1.6.1.1 Name

IX_User_Status

##### 5.1.6.1.2 Columns

- status

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 IX_User_CreatedAt

##### 5.1.6.2.1 Name

IX_User_CreatedAt

##### 5.1.6.2.2 Columns

- createdAt

##### 5.1.6.2.3 Type

🔹 BTree

## 5.2.0.0.0 Role

### 5.2.1.0.0 Name

Role

### 5.2.2.0.0 Description

Owner: Identity & Access Service. Defines the roles a user can have within the system, such as 'User' or 'Administrator'.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 roleId

##### 5.2.3.1.1 Name

roleId

##### 5.2.3.1.2 Type

🔹 INT

##### 5.2.3.1.3 Is Required

✅ Yes

##### 5.2.3.1.4 Is Primary Key

✅ Yes

##### 5.2.3.1.5 Size

0

##### 5.2.3.1.6 Is Unique

✅ Yes

##### 5.2.3.1.7 Constraints

*No items available*

##### 5.2.3.1.8 Precision

0

##### 5.2.3.1.9 Scale

0

##### 5.2.3.1.10 Is Foreign Key

❌ No

#### 5.2.3.2.0 roleName

##### 5.2.3.2.1 Name

roleName

##### 5.2.3.2.2 Type

🔹 VARCHAR

##### 5.2.3.2.3 Is Required

✅ Yes

##### 5.2.3.2.4 Is Primary Key

❌ No

##### 5.2.3.2.5 Size

50

##### 5.2.3.2.6 Is Unique

✅ Yes

##### 5.2.3.2.7 Constraints

*No items available*

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- roleId

### 5.2.5.0.0 Unique Constraints

- {'name': 'UC_Role_RoleName', 'columns': ['roleName']}

### 5.2.6.0.0 Indexes

*No items available*

## 5.3.0.0.0 UserRole

### 5.3.1.0.0 Name

UserRole

### 5.3.2.0.0 Description

Owner: Identity & Access Service. Join table to assign Roles to Users, creating a many-to-many relationship.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 userId

##### 5.3.3.1.1 Name

userId

##### 5.3.3.1.2 Type

🔹 Guid

##### 5.3.3.1.3 Is Required

✅ Yes

##### 5.3.3.1.4 Is Primary Key

✅ Yes

##### 5.3.3.1.5 Size

0

##### 5.3.3.1.6 Is Unique

❌ No

##### 5.3.3.1.7 Constraints

*No items available*

##### 5.3.3.1.8 Precision

0

##### 5.3.3.1.9 Scale

0

##### 5.3.3.1.10 Is Foreign Key

✅ Yes

#### 5.3.3.2.0 roleId

##### 5.3.3.2.1 Name

roleId

##### 5.3.3.2.2 Type

🔹 INT

##### 5.3.3.2.3 Is Required

✅ Yes

##### 5.3.3.2.4 Is Primary Key

✅ Yes

##### 5.3.3.2.5 Size

0

##### 5.3.3.2.6 Is Unique

❌ No

##### 5.3.3.2.7 Constraints

*No items available*

##### 5.3.3.2.8 Precision

0

##### 5.3.3.2.9 Scale

0

##### 5.3.3.2.10 Is Foreign Key

✅ Yes

### 5.3.4.0.0 Primary Keys

- userId
- roleId

### 5.3.5.0.0 Unique Constraints

*No items available*

### 5.3.6.0.0 Indexes

- {'name': 'IX_UserRole_RoleId', 'columns': ['roleId'], 'type': 'BTree'}

## 5.4.0.0.0 UserToken

### 5.4.1.0.0 Name

UserToken

### 5.4.2.0.0 Description

Owner: Identity & Access Service. Stores secure, single-use tokens for actions like email verification and password reset.

### 5.4.3.0.0 Attributes

#### 5.4.3.1.0 tokenId

##### 5.4.3.1.1 Name

tokenId

##### 5.4.3.1.2 Type

🔹 Guid

##### 5.4.3.1.3 Is Required

✅ Yes

##### 5.4.3.1.4 Is Primary Key

✅ Yes

##### 5.4.3.1.5 Size

0

##### 5.4.3.1.6 Is Unique

✅ Yes

##### 5.4.3.1.7 Constraints

*No items available*

##### 5.4.3.1.8 Precision

0

##### 5.4.3.1.9 Scale

0

##### 5.4.3.1.10 Is Foreign Key

❌ No

#### 5.4.3.2.0 userId

##### 5.4.3.2.1 Name

userId

##### 5.4.3.2.2 Type

🔹 Guid

##### 5.4.3.2.3 Is Required

✅ Yes

##### 5.4.3.2.4 Is Primary Key

❌ No

##### 5.4.3.2.5 Size

0

##### 5.4.3.2.6 Is Unique

❌ No

##### 5.4.3.2.7 Constraints

*No items available*

##### 5.4.3.2.8 Precision

0

##### 5.4.3.2.9 Scale

0

##### 5.4.3.2.10 Is Foreign Key

✅ Yes

#### 5.4.3.3.0 tokenHash

##### 5.4.3.3.1 Name

tokenHash

##### 5.4.3.3.2 Type

🔹 VARCHAR

##### 5.4.3.3.3 Is Required

✅ Yes

##### 5.4.3.3.4 Is Primary Key

❌ No

##### 5.4.3.3.5 Size

255

##### 5.4.3.3.6 Is Unique

✅ Yes

##### 5.4.3.3.7 Constraints

*No items available*

##### 5.4.3.3.8 Precision

0

##### 5.4.3.3.9 Scale

0

##### 5.4.3.3.10 Is Foreign Key

❌ No

#### 5.4.3.4.0 tokenType

##### 5.4.3.4.1 Name

tokenType

##### 5.4.3.4.2 Type

🔹 VARCHAR

##### 5.4.3.4.3 Is Required

✅ Yes

##### 5.4.3.4.4 Is Primary Key

❌ No

##### 5.4.3.4.5 Size

50

##### 5.4.3.4.6 Is Unique

❌ No

##### 5.4.3.4.7 Constraints

- ENUM('email_verification', 'password_reset')

##### 5.4.3.4.8 Precision

0

##### 5.4.3.4.9 Scale

0

##### 5.4.3.4.10 Is Foreign Key

❌ No

#### 5.4.3.5.0 expiresAt

##### 5.4.3.5.1 Name

expiresAt

##### 5.4.3.5.2 Type

🔹 DateTime

##### 5.4.3.5.3 Is Required

✅ Yes

##### 5.4.3.5.4 Is Primary Key

❌ No

##### 5.4.3.5.5 Size

0

##### 5.4.3.5.6 Is Unique

❌ No

##### 5.4.3.5.7 Constraints

*No items available*

##### 5.4.3.5.8 Precision

0

##### 5.4.3.5.9 Scale

0

##### 5.4.3.5.10 Is Foreign Key

❌ No

#### 5.4.3.6.0 createdAt

##### 5.4.3.6.1 Name

createdAt

##### 5.4.3.6.2 Type

🔹 DateTime

##### 5.4.3.6.3 Is Required

✅ Yes

##### 5.4.3.6.4 Is Primary Key

❌ No

##### 5.4.3.6.5 Size

0

##### 5.4.3.6.6 Is Unique

❌ No

##### 5.4.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.4.3.6.8 Precision

0

##### 5.4.3.6.9 Scale

0

##### 5.4.3.6.10 Is Foreign Key

❌ No

### 5.4.4.0.0 Primary Keys

- tokenId

### 5.4.5.0.0 Unique Constraints

- {'name': 'UC_UserToken_TokenHash', 'columns': ['tokenHash']}

### 5.4.6.0.0 Indexes

#### 5.4.6.1.0 IX_UserToken_UserId_TokenType

##### 5.4.6.1.1 Name

IX_UserToken_UserId_TokenType

##### 5.4.6.1.2 Columns

- userId
- tokenType

##### 5.4.6.1.3 Type

🔹 BTree

#### 5.4.6.2.0 IX_UserToken_ExpiresAt

##### 5.4.6.2.1 Name

IX_UserToken_ExpiresAt

##### 5.4.6.2.2 Columns

- expiresAt

##### 5.4.6.2.3 Type

🔹 BTree

## 5.5.0.0.0 AccountDeletionRequest

### 5.5.1.0.0 Name

AccountDeletionRequest

### 5.5.2.0.0 Description

Owner: Identity & Access Service. Logs user requests for account deletion, managing the grace period and final purge.

### 5.5.3.0.0 Attributes

#### 5.5.3.1.0 requestId

##### 5.5.3.1.1 Name

requestId

##### 5.5.3.1.2 Type

🔹 Guid

##### 5.5.3.1.3 Is Required

✅ Yes

##### 5.5.3.1.4 Is Primary Key

✅ Yes

##### 5.5.3.1.5 Size

0

##### 5.5.3.1.6 Is Unique

✅ Yes

##### 5.5.3.1.7 Constraints

*No items available*

##### 5.5.3.1.8 Precision

0

##### 5.5.3.1.9 Scale

0

##### 5.5.3.1.10 Is Foreign Key

❌ No

#### 5.5.3.2.0 userId

##### 5.5.3.2.1 Name

userId

##### 5.5.3.2.2 Type

🔹 Guid

##### 5.5.3.2.3 Is Required

✅ Yes

##### 5.5.3.2.4 Is Primary Key

❌ No

##### 5.5.3.2.5 Size

0

##### 5.5.3.2.6 Is Unique

✅ Yes

##### 5.5.3.2.7 Constraints

*No items available*

##### 5.5.3.2.8 Precision

0

##### 5.5.3.2.9 Scale

0

##### 5.5.3.2.10 Is Foreign Key

✅ Yes

#### 5.5.3.3.0 status

##### 5.5.3.3.1 Name

status

##### 5.5.3.3.2 Type

🔹 VARCHAR

##### 5.5.3.3.3 Is Required

✅ Yes

##### 5.5.3.3.4 Is Primary Key

❌ No

##### 5.5.3.3.5 Size

50

##### 5.5.3.3.6 Is Unique

❌ No

##### 5.5.3.3.7 Constraints

- ENUM('pending_grace_period', 'cancelled', 'purged')
- DEFAULT 'pending_grace_period'

##### 5.5.3.3.8 Precision

0

##### 5.5.3.3.9 Scale

0

##### 5.5.3.3.10 Is Foreign Key

❌ No

#### 5.5.3.4.0 scheduledPurgeAt

##### 5.5.3.4.1 Name

scheduledPurgeAt

##### 5.5.3.4.2 Type

🔹 DateTime

##### 5.5.3.4.3 Is Required

✅ Yes

##### 5.5.3.4.4 Is Primary Key

❌ No

##### 5.5.3.4.5 Size

0

##### 5.5.3.4.6 Is Unique

❌ No

##### 5.5.3.4.7 Constraints

*No items available*

##### 5.5.3.4.8 Precision

0

##### 5.5.3.4.9 Scale

0

##### 5.5.3.4.10 Is Foreign Key

❌ No

#### 5.5.3.5.0 finalPurgeAt

##### 5.5.3.5.1 Name

finalPurgeAt

##### 5.5.3.5.2 Type

🔹 DateTime

##### 5.5.3.5.3 Is Required

❌ No

##### 5.5.3.5.4 Is Primary Key

❌ No

##### 5.5.3.5.5 Size

0

##### 5.5.3.5.6 Is Unique

❌ No

##### 5.5.3.5.7 Constraints

*No items available*

##### 5.5.3.5.8 Precision

0

##### 5.5.3.5.9 Scale

0

##### 5.5.3.5.10 Is Foreign Key

❌ No

#### 5.5.3.6.0 createdAt

##### 5.5.3.6.1 Name

createdAt

##### 5.5.3.6.2 Type

🔹 DateTime

##### 5.5.3.6.3 Is Required

✅ Yes

##### 5.5.3.6.4 Is Primary Key

❌ No

##### 5.5.3.6.5 Size

0

##### 5.5.3.6.6 Is Unique

❌ No

##### 5.5.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.5.3.6.8 Precision

0

##### 5.5.3.6.9 Scale

0

##### 5.5.3.6.10 Is Foreign Key

❌ No

#### 5.5.3.7.0 updatedAt

##### 5.5.3.7.1 Name

updatedAt

##### 5.5.3.7.2 Type

🔹 DateTime

##### 5.5.3.7.3 Is Required

✅ Yes

##### 5.5.3.7.4 Is Primary Key

❌ No

##### 5.5.3.7.5 Size

0

##### 5.5.3.7.6 Is Unique

❌ No

##### 5.5.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.5.3.7.8 Precision

0

##### 5.5.3.7.9 Scale

0

##### 5.5.3.7.10 Is Foreign Key

❌ No

### 5.5.4.0.0 Primary Keys

- requestId

### 5.5.5.0.0 Unique Constraints

- {'name': 'UC_AccountDeletionRequest_UserId', 'columns': ['userId']}

### 5.5.6.0.0 Indexes

- {'name': 'IX_AccountDeletionRequest_Status_ScheduledPurgeAt', 'columns': ['status', 'scheduledPurgeAt'], 'type': 'BTree'}

## 5.6.0.0.0 UserSecurityAuditLog

### 5.6.1.0.0 Name

UserSecurityAuditLog

### 5.6.2.0.0 Description

Owner: Identity & Access Service. An immutable log of security-sensitive events related to a user's account. Partitioned by RANGE on createdAt (monthly or quarterly) for efficient data retention and time-bounded queries.

### 5.6.3.0.0 Attributes

#### 5.6.3.1.0 logId

##### 5.6.3.1.1 Name

logId

##### 5.6.3.1.2 Type

🔹 Guid

##### 5.6.3.1.3 Is Required

✅ Yes

##### 5.6.3.1.4 Is Primary Key

✅ Yes

##### 5.6.3.1.5 Size

0

##### 5.6.3.1.6 Is Unique

✅ Yes

##### 5.6.3.1.7 Constraints

*No items available*

##### 5.6.3.1.8 Precision

0

##### 5.6.3.1.9 Scale

0

##### 5.6.3.1.10 Is Foreign Key

❌ No

#### 5.6.3.2.0 userId

##### 5.6.3.2.1 Name

userId

##### 5.6.3.2.2 Type

🔹 Guid

##### 5.6.3.2.3 Is Required

✅ Yes

##### 5.6.3.2.4 Is Primary Key

❌ No

##### 5.6.3.2.5 Size

0

##### 5.6.3.2.6 Is Unique

❌ No

##### 5.6.3.2.7 Constraints

*No items available*

##### 5.6.3.2.8 Precision

0

##### 5.6.3.2.9 Scale

0

##### 5.6.3.2.10 Is Foreign Key

✅ Yes

#### 5.6.3.3.0 action

##### 5.6.3.3.1 Name

action

##### 5.6.3.3.2 Type

🔹 VARCHAR

##### 5.6.3.3.3 Is Required

✅ Yes

##### 5.6.3.3.4 Is Primary Key

❌ No

##### 5.6.3.3.5 Size

255

##### 5.6.3.3.6 Is Unique

❌ No

##### 5.6.3.3.7 Constraints

*No items available*

##### 5.6.3.3.8 Precision

0

##### 5.6.3.3.9 Scale

0

##### 5.6.3.3.10 Is Foreign Key

❌ No

#### 5.6.3.4.0 sourceIpAddress

##### 5.6.3.4.1 Name

sourceIpAddress

##### 5.6.3.4.2 Type

🔹 VARCHAR

##### 5.6.3.4.3 Is Required

❌ No

##### 5.6.3.4.4 Is Primary Key

❌ No

##### 5.6.3.4.5 Size

45

##### 5.6.3.4.6 Is Unique

❌ No

##### 5.6.3.4.7 Constraints

*No items available*

##### 5.6.3.4.8 Precision

0

##### 5.6.3.4.9 Scale

0

##### 5.6.3.4.10 Is Foreign Key

❌ No

#### 5.6.3.5.0 details

##### 5.6.3.5.1 Name

details

##### 5.6.3.5.2 Type

🔹 JSONB

##### 5.6.3.5.3 Is Required

❌ No

##### 5.6.3.5.4 Is Primary Key

❌ No

##### 5.6.3.5.5 Size

0

##### 5.6.3.5.6 Is Unique

❌ No

##### 5.6.3.5.7 Constraints

*No items available*

##### 5.6.3.5.8 Precision

0

##### 5.6.3.5.9 Scale

0

##### 5.6.3.5.10 Is Foreign Key

❌ No

#### 5.6.3.6.0 createdAt

##### 5.6.3.6.1 Name

createdAt

##### 5.6.3.6.2 Type

🔹 DateTime

##### 5.6.3.6.3 Is Required

✅ Yes

##### 5.6.3.6.4 Is Primary Key

❌ No

##### 5.6.3.6.5 Size

0

##### 5.6.3.6.6 Is Unique

❌ No

##### 5.6.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.6.3.6.8 Precision

0

##### 5.6.3.6.9 Scale

0

##### 5.6.3.6.10 Is Foreign Key

❌ No

### 5.6.4.0.0 Primary Keys

- logId

### 5.6.5.0.0 Unique Constraints

*No items available*

### 5.6.6.0.0 Indexes

- {'name': 'IX_UserSecurityAuditLog_UserId_CreatedAt', 'columns': ['userId', 'createdAt'], 'type': 'BTree'}

## 5.7.0.0.0 UserProfile

### 5.7.1.0.0 Name

UserProfile

### 5.7.2.0.0 Description

Owner: User Profile Service. Stores detailed, publicly-visible information about a user. Linked one-to-one with the User entity. This entity is heavily cached in Redis for fast read access.

### 5.7.3.0.0 Attributes

#### 5.7.3.1.0 userProfileId

##### 5.7.3.1.1 Name

userProfileId

##### 5.7.3.1.2 Type

🔹 Guid

##### 5.7.3.1.3 Is Required

✅ Yes

##### 5.7.3.1.4 Is Primary Key

✅ Yes

##### 5.7.3.1.5 Size

0

##### 5.7.3.1.6 Is Unique

✅ Yes

##### 5.7.3.1.7 Constraints

*No items available*

##### 5.7.3.1.8 Precision

0

##### 5.7.3.1.9 Scale

0

##### 5.7.3.1.10 Is Foreign Key

❌ No

#### 5.7.3.2.0 userId

##### 5.7.3.2.1 Name

userId

##### 5.7.3.2.2 Type

🔹 Guid

##### 5.7.3.2.3 Is Required

✅ Yes

##### 5.7.3.2.4 Is Primary Key

❌ No

##### 5.7.3.2.5 Size

0

##### 5.7.3.2.6 Is Unique

✅ Yes

##### 5.7.3.2.7 Constraints

*No items available*

##### 5.7.3.2.8 Precision

0

##### 5.7.3.2.9 Scale

0

##### 5.7.3.2.10 Is Foreign Key

✅ Yes

#### 5.7.3.3.0 fullName

##### 5.7.3.3.1 Name

fullName

##### 5.7.3.3.2 Type

🔹 VARCHAR

##### 5.7.3.3.3 Is Required

✅ Yes

##### 5.7.3.3.4 Is Primary Key

❌ No

##### 5.7.3.3.5 Size

100

##### 5.7.3.3.6 Is Unique

❌ No

##### 5.7.3.3.7 Constraints

*No items available*

##### 5.7.3.3.8 Precision

0

##### 5.7.3.3.9 Scale

0

##### 5.7.3.3.10 Is Foreign Key

❌ No

#### 5.7.3.4.0 headline

##### 5.7.3.4.1 Name

headline

##### 5.7.3.4.2 Type

🔹 VARCHAR

##### 5.7.3.4.3 Is Required

❌ No

##### 5.7.3.4.4 Is Primary Key

❌ No

##### 5.7.3.4.5 Size

220

##### 5.7.3.4.6 Is Unique

❌ No

##### 5.7.3.4.7 Constraints

*No items available*

##### 5.7.3.4.8 Precision

0

##### 5.7.3.4.9 Scale

0

##### 5.7.3.4.10 Is Foreign Key

❌ No

#### 5.7.3.5.0 location

##### 5.7.3.5.1 Name

location

##### 5.7.3.5.2 Type

🔹 VARCHAR

##### 5.7.3.5.3 Is Required

❌ No

##### 5.7.3.5.4 Is Primary Key

❌ No

##### 5.7.3.5.5 Size

255

##### 5.7.3.5.6 Is Unique

❌ No

##### 5.7.3.5.7 Constraints

*No items available*

##### 5.7.3.5.8 Precision

0

##### 5.7.3.5.9 Scale

0

##### 5.7.3.5.10 Is Foreign Key

❌ No

#### 5.7.3.6.0 contactInfoVisibility

##### 5.7.3.6.1 Name

contactInfoVisibility

##### 5.7.3.6.2 Type

🔹 JSONB

##### 5.7.3.6.3 Is Required

❌ No

##### 5.7.3.6.4 Is Primary Key

❌ No

##### 5.7.3.6.5 Size

0

##### 5.7.3.6.6 Is Unique

❌ No

##### 5.7.3.6.7 Constraints

*No items available*

##### 5.7.3.6.8 Precision

0

##### 5.7.3.6.9 Scale

0

##### 5.7.3.6.10 Is Foreign Key

❌ No

#### 5.7.3.7.0 profilePictureUrl

##### 5.7.3.7.1 Name

profilePictureUrl

##### 5.7.3.7.2 Type

🔹 VARCHAR

##### 5.7.3.7.3 Is Required

❌ No

##### 5.7.3.7.4 Is Primary Key

❌ No

##### 5.7.3.7.5 Size

2,048

##### 5.7.3.7.6 Is Unique

❌ No

##### 5.7.3.7.7 Constraints

*No items available*

##### 5.7.3.7.8 Precision

0

##### 5.7.3.7.9 Scale

0

##### 5.7.3.7.10 Is Foreign Key

❌ No

#### 5.7.3.8.0 bannerImageUrl

##### 5.7.3.8.1 Name

bannerImageUrl

##### 5.7.3.8.2 Type

🔹 VARCHAR

##### 5.7.3.8.3 Is Required

❌ No

##### 5.7.3.8.4 Is Primary Key

❌ No

##### 5.7.3.8.5 Size

2,048

##### 5.7.3.8.6 Is Unique

❌ No

##### 5.7.3.8.7 Constraints

*No items available*

##### 5.7.3.8.8 Precision

0

##### 5.7.3.8.9 Scale

0

##### 5.7.3.8.10 Is Foreign Key

❌ No

#### 5.7.3.9.0 customUrlSlug

##### 5.7.3.9.1 Name

customUrlSlug

##### 5.7.3.9.2 Type

🔹 VARCHAR

##### 5.7.3.9.3 Is Required

❌ No

##### 5.7.3.9.4 Is Primary Key

❌ No

##### 5.7.3.9.5 Size

100

##### 5.7.3.9.6 Is Unique

✅ Yes

##### 5.7.3.9.7 Constraints

*No items available*

##### 5.7.3.9.8 Precision

0

##### 5.7.3.9.9 Scale

0

##### 5.7.3.9.10 Is Foreign Key

❌ No

#### 5.7.3.10.0 visibility

##### 5.7.3.10.1 Name

visibility

##### 5.7.3.10.2 Type

🔹 VARCHAR

##### 5.7.3.10.3 Is Required

✅ Yes

##### 5.7.3.10.4 Is Primary Key

❌ No

##### 5.7.3.10.5 Size

50

##### 5.7.3.10.6 Is Unique

❌ No

##### 5.7.3.10.7 Constraints

- ENUM('public', 'private')
- DEFAULT 'public'

##### 5.7.3.10.8 Precision

0

##### 5.7.3.10.9 Scale

0

##### 5.7.3.10.10 Is Foreign Key

❌ No

#### 5.7.3.11.0 createdAt

##### 5.7.3.11.1 Name

createdAt

##### 5.7.3.11.2 Type

🔹 DateTime

##### 5.7.3.11.3 Is Required

✅ Yes

##### 5.7.3.11.4 Is Primary Key

❌ No

##### 5.7.3.11.5 Size

0

##### 5.7.3.11.6 Is Unique

❌ No

##### 5.7.3.11.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.7.3.11.8 Precision

0

##### 5.7.3.11.9 Scale

0

##### 5.7.3.11.10 Is Foreign Key

❌ No

#### 5.7.3.12.0 updatedAt

##### 5.7.3.12.1 Name

updatedAt

##### 5.7.3.12.2 Type

🔹 DateTime

##### 5.7.3.12.3 Is Required

✅ Yes

##### 5.7.3.12.4 Is Primary Key

❌ No

##### 5.7.3.12.5 Size

0

##### 5.7.3.12.6 Is Unique

❌ No

##### 5.7.3.12.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.7.3.12.8 Precision

0

##### 5.7.3.12.9 Scale

0

##### 5.7.3.12.10 Is Foreign Key

❌ No

### 5.7.4.0.0 Primary Keys

- userProfileId

### 5.7.5.0.0 Unique Constraints

#### 5.7.5.1.0 UC_UserProfile_UserId

##### 5.7.5.1.1 Name

UC_UserProfile_UserId

##### 5.7.5.1.2 Columns

- userId

#### 5.7.5.2.0 UC_UserProfile_CustomUrlSlug

##### 5.7.5.2.1 Name

UC_UserProfile_CustomUrlSlug

##### 5.7.5.2.2 Columns

- customUrlSlug

### 5.7.6.0.0 Indexes

#### 5.7.6.1.0 IX_UserProfile_FullName

##### 5.7.6.1.1 Name

IX_UserProfile_FullName

##### 5.7.6.1.2 Columns

- fullName

##### 5.7.6.1.3 Type

🔹 BTree

#### 5.7.6.2.0 IX_UserProfile_Location

##### 5.7.6.2.1 Name

IX_UserProfile_Location

##### 5.7.6.2.2 Columns

- location

##### 5.7.6.2.3 Type

🔹 BTree

#### 5.7.6.3.0 IX_UserProfile_Visibility

##### 5.7.6.3.1 Name

IX_UserProfile_Visibility

##### 5.7.6.3.2 Columns

- visibility

##### 5.7.6.3.3 Type

🔹 BTree

## 5.8.0.0.0 WorkExperience

### 5.8.1.0.0 Name

WorkExperience

### 5.8.2.0.0 Description

Owner: User Profile Service. Represents a single work experience entry on a user's profile.

### 5.8.3.0.0 Attributes

#### 5.8.3.1.0 workExperienceId

##### 5.8.3.1.1 Name

workExperienceId

##### 5.8.3.1.2 Type

🔹 Guid

##### 5.8.3.1.3 Is Required

✅ Yes

##### 5.8.3.1.4 Is Primary Key

✅ Yes

##### 5.8.3.1.5 Size

0

##### 5.8.3.1.6 Is Unique

✅ Yes

##### 5.8.3.1.7 Constraints

*No items available*

##### 5.8.3.1.8 Precision

0

##### 5.8.3.1.9 Scale

0

##### 5.8.3.1.10 Is Foreign Key

❌ No

#### 5.8.3.2.0 userProfileId

##### 5.8.3.2.1 Name

userProfileId

##### 5.8.3.2.2 Type

🔹 Guid

##### 5.8.3.2.3 Is Required

✅ Yes

##### 5.8.3.2.4 Is Primary Key

❌ No

##### 5.8.3.2.5 Size

0

##### 5.8.3.2.6 Is Unique

❌ No

##### 5.8.3.2.7 Constraints

*No items available*

##### 5.8.3.2.8 Precision

0

##### 5.8.3.2.9 Scale

0

##### 5.8.3.2.10 Is Foreign Key

✅ Yes

#### 5.8.3.3.0 companyName

##### 5.8.3.3.1 Name

companyName

##### 5.8.3.3.2 Type

🔹 VARCHAR

##### 5.8.3.3.3 Is Required

✅ Yes

##### 5.8.3.3.4 Is Primary Key

❌ No

##### 5.8.3.3.5 Size

255

##### 5.8.3.3.6 Is Unique

❌ No

##### 5.8.3.3.7 Constraints

*No items available*

##### 5.8.3.3.8 Precision

0

##### 5.8.3.3.9 Scale

0

##### 5.8.3.3.10 Is Foreign Key

❌ No

#### 5.8.3.4.0 title

##### 5.8.3.4.1 Name

title

##### 5.8.3.4.2 Type

🔹 VARCHAR

##### 5.8.3.4.3 Is Required

✅ Yes

##### 5.8.3.4.4 Is Primary Key

❌ No

##### 5.8.3.4.5 Size

255

##### 5.8.3.4.6 Is Unique

❌ No

##### 5.8.3.4.7 Constraints

*No items available*

##### 5.8.3.4.8 Precision

0

##### 5.8.3.4.9 Scale

0

##### 5.8.3.4.10 Is Foreign Key

❌ No

#### 5.8.3.5.0 startDate

##### 5.8.3.5.1 Name

startDate

##### 5.8.3.5.2 Type

🔹 DATE

##### 5.8.3.5.3 Is Required

✅ Yes

##### 5.8.3.5.4 Is Primary Key

❌ No

##### 5.8.3.5.5 Size

0

##### 5.8.3.5.6 Is Unique

❌ No

##### 5.8.3.5.7 Constraints

*No items available*

##### 5.8.3.5.8 Precision

0

##### 5.8.3.5.9 Scale

0

##### 5.8.3.5.10 Is Foreign Key

❌ No

#### 5.8.3.6.0 endDate

##### 5.8.3.6.1 Name

endDate

##### 5.8.3.6.2 Type

🔹 DATE

##### 5.8.3.6.3 Is Required

❌ No

##### 5.8.3.6.4 Is Primary Key

❌ No

##### 5.8.3.6.5 Size

0

##### 5.8.3.6.6 Is Unique

❌ No

##### 5.8.3.6.7 Constraints

*No items available*

##### 5.8.3.6.8 Precision

0

##### 5.8.3.6.9 Scale

0

##### 5.8.3.6.10 Is Foreign Key

❌ No

#### 5.8.3.7.0 description

##### 5.8.3.7.1 Name

description

##### 5.8.3.7.2 Type

🔹 TEXT

##### 5.8.3.7.3 Is Required

❌ No

##### 5.8.3.7.4 Is Primary Key

❌ No

##### 5.8.3.7.5 Size

0

##### 5.8.3.7.6 Is Unique

❌ No

##### 5.8.3.7.7 Constraints

*No items available*

##### 5.8.3.7.8 Precision

0

##### 5.8.3.7.9 Scale

0

##### 5.8.3.7.10 Is Foreign Key

❌ No

#### 5.8.3.8.0 createdAt

##### 5.8.3.8.1 Name

createdAt

##### 5.8.3.8.2 Type

🔹 DateTime

##### 5.8.3.8.3 Is Required

✅ Yes

##### 5.8.3.8.4 Is Primary Key

❌ No

##### 5.8.3.8.5 Size

0

##### 5.8.3.8.6 Is Unique

❌ No

##### 5.8.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.8.3.8.8 Precision

0

##### 5.8.3.8.9 Scale

0

##### 5.8.3.8.10 Is Foreign Key

❌ No

#### 5.8.3.9.0 updatedAt

##### 5.8.3.9.1 Name

updatedAt

##### 5.8.3.9.2 Type

🔹 DateTime

##### 5.8.3.9.3 Is Required

✅ Yes

##### 5.8.3.9.4 Is Primary Key

❌ No

##### 5.8.3.9.5 Size

0

##### 5.8.3.9.6 Is Unique

❌ No

##### 5.8.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.8.3.9.8 Precision

0

##### 5.8.3.9.9 Scale

0

##### 5.8.3.9.10 Is Foreign Key

❌ No

### 5.8.4.0.0 Primary Keys

- workExperienceId

### 5.8.5.0.0 Unique Constraints

*No items available*

### 5.8.6.0.0 Indexes

- {'name': 'IX_WorkExperience_Profile_StartDate', 'columns': ['userProfileId', 'startDate DESC'], 'type': 'BTree'}

## 5.9.0.0.0 Education

### 5.9.1.0.0 Name

Education

### 5.9.2.0.0 Description

Owner: User Profile Service. Represents a single education entry on a user's profile.

### 5.9.3.0.0 Attributes

#### 5.9.3.1.0 educationId

##### 5.9.3.1.1 Name

educationId

##### 5.9.3.1.2 Type

🔹 Guid

##### 5.9.3.1.3 Is Required

✅ Yes

##### 5.9.3.1.4 Is Primary Key

✅ Yes

##### 5.9.3.1.5 Size

0

##### 5.9.3.1.6 Is Unique

✅ Yes

##### 5.9.3.1.7 Constraints

*No items available*

##### 5.9.3.1.8 Precision

0

##### 5.9.3.1.9 Scale

0

##### 5.9.3.1.10 Is Foreign Key

❌ No

#### 5.9.3.2.0 userProfileId

##### 5.9.3.2.1 Name

userProfileId

##### 5.9.3.2.2 Type

🔹 Guid

##### 5.9.3.2.3 Is Required

✅ Yes

##### 5.9.3.2.4 Is Primary Key

❌ No

##### 5.9.3.2.5 Size

0

##### 5.9.3.2.6 Is Unique

❌ No

##### 5.9.3.2.7 Constraints

*No items available*

##### 5.9.3.2.8 Precision

0

##### 5.9.3.2.9 Scale

0

##### 5.9.3.2.10 Is Foreign Key

✅ Yes

#### 5.9.3.3.0 institutionName

##### 5.9.3.3.1 Name

institutionName

##### 5.9.3.3.2 Type

🔹 VARCHAR

##### 5.9.3.3.3 Is Required

✅ Yes

##### 5.9.3.3.4 Is Primary Key

❌ No

##### 5.9.3.3.5 Size

255

##### 5.9.3.3.6 Is Unique

❌ No

##### 5.9.3.3.7 Constraints

*No items available*

##### 5.9.3.3.8 Precision

0

##### 5.9.3.3.9 Scale

0

##### 5.9.3.3.10 Is Foreign Key

❌ No

#### 5.9.3.4.0 degree

##### 5.9.3.4.1 Name

degree

##### 5.9.3.4.2 Type

🔹 VARCHAR

##### 5.9.3.4.3 Is Required

❌ No

##### 5.9.3.4.4 Is Primary Key

❌ No

##### 5.9.3.4.5 Size

255

##### 5.9.3.4.6 Is Unique

❌ No

##### 5.9.3.4.7 Constraints

*No items available*

##### 5.9.3.4.8 Precision

0

##### 5.9.3.4.9 Scale

0

##### 5.9.3.4.10 Is Foreign Key

❌ No

#### 5.9.3.5.0 fieldOfStudy

##### 5.9.3.5.1 Name

fieldOfStudy

##### 5.9.3.5.2 Type

🔹 VARCHAR

##### 5.9.3.5.3 Is Required

❌ No

##### 5.9.3.5.4 Is Primary Key

❌ No

##### 5.9.3.5.5 Size

255

##### 5.9.3.5.6 Is Unique

❌ No

##### 5.9.3.5.7 Constraints

*No items available*

##### 5.9.3.5.8 Precision

0

##### 5.9.3.5.9 Scale

0

##### 5.9.3.5.10 Is Foreign Key

❌ No

#### 5.9.3.6.0 startDate

##### 5.9.3.6.1 Name

startDate

##### 5.9.3.6.2 Type

🔹 DATE

##### 5.9.3.6.3 Is Required

✅ Yes

##### 5.9.3.6.4 Is Primary Key

❌ No

##### 5.9.3.6.5 Size

0

##### 5.9.3.6.6 Is Unique

❌ No

##### 5.9.3.6.7 Constraints

*No items available*

##### 5.9.3.6.8 Precision

0

##### 5.9.3.6.9 Scale

0

##### 5.9.3.6.10 Is Foreign Key

❌ No

#### 5.9.3.7.0 endDate

##### 5.9.3.7.1 Name

endDate

##### 5.9.3.7.2 Type

🔹 DATE

##### 5.9.3.7.3 Is Required

❌ No

##### 5.9.3.7.4 Is Primary Key

❌ No

##### 5.9.3.7.5 Size

0

##### 5.9.3.7.6 Is Unique

❌ No

##### 5.9.3.7.7 Constraints

*No items available*

##### 5.9.3.7.8 Precision

0

##### 5.9.3.7.9 Scale

0

##### 5.9.3.7.10 Is Foreign Key

❌ No

#### 5.9.3.8.0 createdAt

##### 5.9.3.8.1 Name

createdAt

##### 5.9.3.8.2 Type

🔹 DateTime

##### 5.9.3.8.3 Is Required

✅ Yes

##### 5.9.3.8.4 Is Primary Key

❌ No

##### 5.9.3.8.5 Size

0

##### 5.9.3.8.6 Is Unique

❌ No

##### 5.9.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.9.3.8.8 Precision

0

##### 5.9.3.8.9 Scale

0

##### 5.9.3.8.10 Is Foreign Key

❌ No

#### 5.9.3.9.0 updatedAt

##### 5.9.3.9.1 Name

updatedAt

##### 5.9.3.9.2 Type

🔹 DateTime

##### 5.9.3.9.3 Is Required

✅ Yes

##### 5.9.3.9.4 Is Primary Key

❌ No

##### 5.9.3.9.5 Size

0

##### 5.9.3.9.6 Is Unique

❌ No

##### 5.9.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.9.3.9.8 Precision

0

##### 5.9.3.9.9 Scale

0

##### 5.9.3.9.10 Is Foreign Key

❌ No

### 5.9.4.0.0 Primary Keys

- educationId

### 5.9.5.0.0 Unique Constraints

*No items available*

### 5.9.6.0.0 Indexes

- {'name': 'IX_Education_UserProfileId', 'columns': ['userProfileId'], 'type': 'BTree'}

## 5.10.0.0.0 Skill

### 5.10.1.0.0 Name

Skill

### 5.10.2.0.0 Description

Owner: User Profile Service. A master table of all unique professional skills that can be added to profiles.

### 5.10.3.0.0 Attributes

#### 5.10.3.1.0 skillId

##### 5.10.3.1.1 Name

skillId

##### 5.10.3.1.2 Type

🔹 Guid

##### 5.10.3.1.3 Is Required

✅ Yes

##### 5.10.3.1.4 Is Primary Key

✅ Yes

##### 5.10.3.1.5 Size

0

##### 5.10.3.1.6 Is Unique

✅ Yes

##### 5.10.3.1.7 Constraints

*No items available*

##### 5.10.3.1.8 Precision

0

##### 5.10.3.1.9 Scale

0

##### 5.10.3.1.10 Is Foreign Key

❌ No

#### 5.10.3.2.0 skillName

##### 5.10.3.2.1 Name

skillName

##### 5.10.3.2.2 Type

🔹 VARCHAR

##### 5.10.3.2.3 Is Required

✅ Yes

##### 5.10.3.2.4 Is Primary Key

❌ No

##### 5.10.3.2.5 Size

100

##### 5.10.3.2.6 Is Unique

✅ Yes

##### 5.10.3.2.7 Constraints

*No items available*

##### 5.10.3.2.8 Precision

0

##### 5.10.3.2.9 Scale

0

##### 5.10.3.2.10 Is Foreign Key

❌ No

#### 5.10.3.3.0 createdAt

##### 5.10.3.3.1 Name

createdAt

##### 5.10.3.3.2 Type

🔹 DateTime

##### 5.10.3.3.3 Is Required

✅ Yes

##### 5.10.3.3.4 Is Primary Key

❌ No

##### 5.10.3.3.5 Size

0

##### 5.10.3.3.6 Is Unique

❌ No

##### 5.10.3.3.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.10.3.3.8 Precision

0

##### 5.10.3.3.9 Scale

0

##### 5.10.3.3.10 Is Foreign Key

❌ No

### 5.10.4.0.0 Primary Keys

- skillId

### 5.10.5.0.0 Unique Constraints

- {'name': 'UC_Skill_SkillName', 'columns': ['skillName']}

### 5.10.6.0.0 Indexes

*No items available*

## 5.11.0.0.0 UserProfileSkill

### 5.11.1.0.0 Name

UserProfileSkill

### 5.11.2.0.0 Description

Owner: User Profile Service. Join table to create a many-to-many relationship between UserProfiles and Skills.

### 5.11.3.0.0 Attributes

#### 5.11.3.1.0 userProfileId

##### 5.11.3.1.1 Name

userProfileId

##### 5.11.3.1.2 Type

🔹 Guid

##### 5.11.3.1.3 Is Required

✅ Yes

##### 5.11.3.1.4 Is Primary Key

✅ Yes

##### 5.11.3.1.5 Size

0

##### 5.11.3.1.6 Is Unique

❌ No

##### 5.11.3.1.7 Constraints

*No items available*

##### 5.11.3.1.8 Precision

0

##### 5.11.3.1.9 Scale

0

##### 5.11.3.1.10 Is Foreign Key

✅ Yes

#### 5.11.3.2.0 skillId

##### 5.11.3.2.1 Name

skillId

##### 5.11.3.2.2 Type

🔹 Guid

##### 5.11.3.2.3 Is Required

✅ Yes

##### 5.11.3.2.4 Is Primary Key

✅ Yes

##### 5.11.3.2.5 Size

0

##### 5.11.3.2.6 Is Unique

❌ No

##### 5.11.3.2.7 Constraints

*No items available*

##### 5.11.3.2.8 Precision

0

##### 5.11.3.2.9 Scale

0

##### 5.11.3.2.10 Is Foreign Key

✅ Yes

#### 5.11.3.3.0 endorsementCount

##### 5.11.3.3.1 Name

endorsementCount

##### 5.11.3.3.2 Type

🔹 INT

##### 5.11.3.3.3 Is Required

✅ Yes

##### 5.11.3.3.4 Is Primary Key

❌ No

##### 5.11.3.3.5 Size

0

##### 5.11.3.3.6 Is Unique

❌ No

##### 5.11.3.3.7 Constraints

- DEFAULT 0

##### 5.11.3.3.8 Precision

0

##### 5.11.3.3.9 Scale

0

##### 5.11.3.3.10 Is Foreign Key

❌ No

#### 5.11.3.4.0 createdAt

##### 5.11.3.4.1 Name

createdAt

##### 5.11.3.4.2 Type

🔹 DateTime

##### 5.11.3.4.3 Is Required

✅ Yes

##### 5.11.3.4.4 Is Primary Key

❌ No

##### 5.11.3.4.5 Size

0

##### 5.11.3.4.6 Is Unique

❌ No

##### 5.11.3.4.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.11.3.4.8 Precision

0

##### 5.11.3.4.9 Scale

0

##### 5.11.3.4.10 Is Foreign Key

❌ No

### 5.11.4.0.0 Primary Keys

- userProfileId
- skillId

### 5.11.5.0.0 Unique Constraints

*No items available*

### 5.11.6.0.0 Indexes

- {'name': 'IX_UserProfileSkill_SkillId', 'columns': ['skillId'], 'type': 'BTree'}

## 5.12.0.0.0 SkillEndorsement

### 5.12.1.0.0 Name

SkillEndorsement

### 5.12.2.0.0 Description

Owner: User Profile Service. Records an endorsement given by one user for a specific skill on another user's profile. Triggers an update to UserProfileSkill.endorsementCount.

### 5.12.3.0.0 Attributes

#### 5.12.3.1.0 skillEndorsementId

##### 5.12.3.1.1 Name

skillEndorsementId

##### 5.12.3.1.2 Type

🔹 Guid

##### 5.12.3.1.3 Is Required

✅ Yes

##### 5.12.3.1.4 Is Primary Key

✅ Yes

##### 5.12.3.1.5 Size

0

##### 5.12.3.1.6 Is Unique

✅ Yes

##### 5.12.3.1.7 Constraints

*No items available*

##### 5.12.3.1.8 Precision

0

##### 5.12.3.1.9 Scale

0

##### 5.12.3.1.10 Is Foreign Key

❌ No

#### 5.12.3.2.0 userProfileId

##### 5.12.3.2.1 Name

userProfileId

##### 5.12.3.2.2 Type

🔹 Guid

##### 5.12.3.2.3 Is Required

✅ Yes

##### 5.12.3.2.4 Is Primary Key

❌ No

##### 5.12.3.2.5 Size

0

##### 5.12.3.2.6 Is Unique

❌ No

##### 5.12.3.2.7 Constraints

*No items available*

##### 5.12.3.2.8 Precision

0

##### 5.12.3.2.9 Scale

0

##### 5.12.3.2.10 Is Foreign Key

✅ Yes

#### 5.12.3.3.0 skillId

##### 5.12.3.3.1 Name

skillId

##### 5.12.3.3.2 Type

🔹 Guid

##### 5.12.3.3.3 Is Required

✅ Yes

##### 5.12.3.3.4 Is Primary Key

❌ No

##### 5.12.3.3.5 Size

0

##### 5.12.3.3.6 Is Unique

❌ No

##### 5.12.3.3.7 Constraints

*No items available*

##### 5.12.3.3.8 Precision

0

##### 5.12.3.3.9 Scale

0

##### 5.12.3.3.10 Is Foreign Key

✅ Yes

#### 5.12.3.4.0 endorserUserId

##### 5.12.3.4.1 Name

endorserUserId

##### 5.12.3.4.2 Type

🔹 Guid

##### 5.12.3.4.3 Is Required

✅ Yes

##### 5.12.3.4.4 Is Primary Key

❌ No

##### 5.12.3.4.5 Size

0

##### 5.12.3.4.6 Is Unique

❌ No

##### 5.12.3.4.7 Constraints

*No items available*

##### 5.12.3.4.8 Precision

0

##### 5.12.3.4.9 Scale

0

##### 5.12.3.4.10 Is Foreign Key

✅ Yes

#### 5.12.3.5.0 createdAt

##### 5.12.3.5.1 Name

createdAt

##### 5.12.3.5.2 Type

🔹 DateTime

##### 5.12.3.5.3 Is Required

✅ Yes

##### 5.12.3.5.4 Is Primary Key

❌ No

##### 5.12.3.5.5 Size

0

##### 5.12.3.5.6 Is Unique

❌ No

##### 5.12.3.5.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.12.3.5.8 Precision

0

##### 5.12.3.5.9 Scale

0

##### 5.12.3.5.10 Is Foreign Key

❌ No

### 5.12.4.0.0 Primary Keys

- skillEndorsementId

### 5.12.5.0.0 Unique Constraints

- {'name': 'UC_SkillEndorsement_Profile_Skill_Endorser', 'columns': ['userProfileId', 'skillId', 'endorserUserId']}

### 5.12.6.0.0 Indexes

- {'name': 'IX_SkillEndorsement_Profile_Skill', 'columns': ['userProfileId', 'skillId'], 'type': 'BTree'}

## 5.13.0.0.0 Connection

### 5.13.1.0.0 Name

Connection

### 5.13.2.0.0 Description

Owner: Connections Service. Represents the relationship between two users. This is the write model and source of truth for connections. The graph database is updated from this table.

### 5.13.3.0.0 Attributes

#### 5.13.3.1.0 requesterId

##### 5.13.3.1.1 Name

requesterId

##### 5.13.3.1.2 Type

🔹 Guid

##### 5.13.3.1.3 Is Required

✅ Yes

##### 5.13.3.1.4 Is Primary Key

✅ Yes

##### 5.13.3.1.5 Size

0

##### 5.13.3.1.6 Is Unique

❌ No

##### 5.13.3.1.7 Constraints

*No items available*

##### 5.13.3.1.8 Precision

0

##### 5.13.3.1.9 Scale

0

##### 5.13.3.1.10 Is Foreign Key

✅ Yes

#### 5.13.3.2.0 addresseeId

##### 5.13.3.2.1 Name

addresseeId

##### 5.13.3.2.2 Type

🔹 Guid

##### 5.13.3.2.3 Is Required

✅ Yes

##### 5.13.3.2.4 Is Primary Key

✅ Yes

##### 5.13.3.2.5 Size

0

##### 5.13.3.2.6 Is Unique

❌ No

##### 5.13.3.2.7 Constraints

*No items available*

##### 5.13.3.2.8 Precision

0

##### 5.13.3.2.9 Scale

0

##### 5.13.3.2.10 Is Foreign Key

✅ Yes

#### 5.13.3.3.0 status

##### 5.13.3.3.1 Name

status

##### 5.13.3.3.2 Type

🔹 VARCHAR

##### 5.13.3.3.3 Is Required

✅ Yes

##### 5.13.3.3.4 Is Primary Key

❌ No

##### 5.13.3.3.5 Size

50

##### 5.13.3.3.6 Is Unique

❌ No

##### 5.13.3.3.7 Constraints

- ENUM('pending', 'accepted')
- DEFAULT 'pending'

##### 5.13.3.3.8 Precision

0

##### 5.13.3.3.9 Scale

0

##### 5.13.3.3.10 Is Foreign Key

❌ No

#### 5.13.3.4.0 personalizedMessage

##### 5.13.3.4.1 Name

personalizedMessage

##### 5.13.3.4.2 Type

🔹 VARCHAR

##### 5.13.3.4.3 Is Required

❌ No

##### 5.13.3.4.4 Is Primary Key

❌ No

##### 5.13.3.4.5 Size

300

##### 5.13.3.4.6 Is Unique

❌ No

##### 5.13.3.4.7 Constraints

*No items available*

##### 5.13.3.4.8 Precision

0

##### 5.13.3.4.9 Scale

0

##### 5.13.3.4.10 Is Foreign Key

❌ No

#### 5.13.3.5.0 createdAt

##### 5.13.3.5.1 Name

createdAt

##### 5.13.3.5.2 Type

🔹 DateTime

##### 5.13.3.5.3 Is Required

✅ Yes

##### 5.13.3.5.4 Is Primary Key

❌ No

##### 5.13.3.5.5 Size

0

##### 5.13.3.5.6 Is Unique

❌ No

##### 5.13.3.5.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.13.3.5.8 Precision

0

##### 5.13.3.5.9 Scale

0

##### 5.13.3.5.10 Is Foreign Key

❌ No

#### 5.13.3.6.0 updatedAt

##### 5.13.3.6.1 Name

updatedAt

##### 5.13.3.6.2 Type

🔹 DateTime

##### 5.13.3.6.3 Is Required

✅ Yes

##### 5.13.3.6.4 Is Primary Key

❌ No

##### 5.13.3.6.5 Size

0

##### 5.13.3.6.6 Is Unique

❌ No

##### 5.13.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.13.3.6.8 Precision

0

##### 5.13.3.6.9 Scale

0

##### 5.13.3.6.10 Is Foreign Key

❌ No

### 5.13.4.0.0 Primary Keys

- requesterId
- addresseeId

### 5.13.5.0.0 Unique Constraints

*No items available*

### 5.13.6.0.0 Indexes

#### 5.13.6.1.0 IX_Connection_AddresseeId_Status

##### 5.13.6.1.1 Name

IX_Connection_AddresseeId_Status

##### 5.13.6.1.2 Columns

- addresseeId
- status

##### 5.13.6.1.3 Type

🔹 BTree

#### 5.13.6.2.0 IX_Connection_Requester_Status

##### 5.13.6.2.1 Name

IX_Connection_Requester_Status

##### 5.13.6.2.2 Columns

- requesterId
- status

##### 5.13.6.2.3 Type

🔹 BTree

## 5.14.0.0.0 Post

### 5.14.1.0.0 Name

Post

### 5.14.2.0.0 Description

Owner: Posts Service. Represents a single post created by a user. This is the write model for posts. Upon creation, an event is published for the Feed and Search services.

### 5.14.3.0.0 Attributes

#### 5.14.3.1.0 postId

##### 5.14.3.1.1 Name

postId

##### 5.14.3.1.2 Type

🔹 Guid

##### 5.14.3.1.3 Is Required

✅ Yes

##### 5.14.3.1.4 Is Primary Key

✅ Yes

##### 5.14.3.1.5 Size

0

##### 5.14.3.1.6 Is Unique

✅ Yes

##### 5.14.3.1.7 Constraints

*No items available*

##### 5.14.3.1.8 Precision

0

##### 5.14.3.1.9 Scale

0

##### 5.14.3.1.10 Is Foreign Key

❌ No

#### 5.14.3.2.0 authorId

##### 5.14.3.2.1 Name

authorId

##### 5.14.3.2.2 Type

🔹 Guid

##### 5.14.3.2.3 Is Required

✅ Yes

##### 5.14.3.2.4 Is Primary Key

❌ No

##### 5.14.3.2.5 Size

0

##### 5.14.3.2.6 Is Unique

❌ No

##### 5.14.3.2.7 Constraints

*No items available*

##### 5.14.3.2.8 Precision

0

##### 5.14.3.2.9 Scale

0

##### 5.14.3.2.10 Is Foreign Key

✅ Yes

#### 5.14.3.3.0 authorFullName

##### 5.14.3.3.1 Name

authorFullName

##### 5.14.3.3.2 Type

🔹 VARCHAR

##### 5.14.3.3.3 Is Required

✅ Yes

##### 5.14.3.3.4 Is Primary Key

❌ No

##### 5.14.3.3.5 Size

100

##### 5.14.3.3.6 Is Unique

❌ No

##### 5.14.3.3.7 Constraints

*No items available*

##### 5.14.3.3.8 Precision

0

##### 5.14.3.3.9 Scale

0

##### 5.14.3.3.10 Is Foreign Key

❌ No

#### 5.14.3.4.0 authorHeadline

##### 5.14.3.4.1 Name

authorHeadline

##### 5.14.3.4.2 Type

🔹 VARCHAR

##### 5.14.3.4.3 Is Required

❌ No

##### 5.14.3.4.4 Is Primary Key

❌ No

##### 5.14.3.4.5 Size

220

##### 5.14.3.4.6 Is Unique

❌ No

##### 5.14.3.4.7 Constraints

*No items available*

##### 5.14.3.4.8 Precision

0

##### 5.14.3.4.9 Scale

0

##### 5.14.3.4.10 Is Foreign Key

❌ No

#### 5.14.3.5.0 authorProfilePictureUrl

##### 5.14.3.5.1 Name

authorProfilePictureUrl

##### 5.14.3.5.2 Type

🔹 VARCHAR

##### 5.14.3.5.3 Is Required

❌ No

##### 5.14.3.5.4 Is Primary Key

❌ No

##### 5.14.3.5.5 Size

2,048

##### 5.14.3.5.6 Is Unique

❌ No

##### 5.14.3.5.7 Constraints

*No items available*

##### 5.14.3.5.8 Precision

0

##### 5.14.3.5.9 Scale

0

##### 5.14.3.5.10 Is Foreign Key

❌ No

#### 5.14.3.6.0 textContent

##### 5.14.3.6.1 Name

textContent

##### 5.14.3.6.2 Type

🔹 TEXT

##### 5.14.3.6.3 Is Required

❌ No

##### 5.14.3.6.4 Is Primary Key

❌ No

##### 5.14.3.6.5 Size

3,000

##### 5.14.3.6.6 Is Unique

❌ No

##### 5.14.3.6.7 Constraints

- MAX_LENGTH(3000)

##### 5.14.3.6.8 Precision

0

##### 5.14.3.6.9 Scale

0

##### 5.14.3.6.10 Is Foreign Key

❌ No

#### 5.14.3.7.0 linkPreviewData

##### 5.14.3.7.1 Name

linkPreviewData

##### 5.14.3.7.2 Type

🔹 JSONB

##### 5.14.3.7.3 Is Required

❌ No

##### 5.14.3.7.4 Is Primary Key

❌ No

##### 5.14.3.7.5 Size

0

##### 5.14.3.7.6 Is Unique

❌ No

##### 5.14.3.7.7 Constraints

*No items available*

##### 5.14.3.7.8 Precision

0

##### 5.14.3.7.9 Scale

0

##### 5.14.3.7.10 Is Foreign Key

❌ No

#### 5.14.3.8.0 reactionCount

##### 5.14.3.8.1 Name

reactionCount

##### 5.14.3.8.2 Type

🔹 INT

##### 5.14.3.8.3 Is Required

✅ Yes

##### 5.14.3.8.4 Is Primary Key

❌ No

##### 5.14.3.8.5 Size

0

##### 5.14.3.8.6 Is Unique

❌ No

##### 5.14.3.8.7 Constraints

- DEFAULT 0

##### 5.14.3.8.8 Precision

0

##### 5.14.3.8.9 Scale

0

##### 5.14.3.8.10 Is Foreign Key

❌ No

#### 5.14.3.9.0 commentCount

##### 5.14.3.9.1 Name

commentCount

##### 5.14.3.9.2 Type

🔹 INT

##### 5.14.3.9.3 Is Required

✅ Yes

##### 5.14.3.9.4 Is Primary Key

❌ No

##### 5.14.3.9.5 Size

0

##### 5.14.3.9.6 Is Unique

❌ No

##### 5.14.3.9.7 Constraints

- DEFAULT 0

##### 5.14.3.9.8 Precision

0

##### 5.14.3.9.9 Scale

0

##### 5.14.3.9.10 Is Foreign Key

❌ No

#### 5.14.3.10.0 createdAt

##### 5.14.3.10.1 Name

createdAt

##### 5.14.3.10.2 Type

🔹 DateTime

##### 5.14.3.10.3 Is Required

✅ Yes

##### 5.14.3.10.4 Is Primary Key

❌ No

##### 5.14.3.10.5 Size

0

##### 5.14.3.10.6 Is Unique

❌ No

##### 5.14.3.10.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.14.3.10.8 Precision

0

##### 5.14.3.10.9 Scale

0

##### 5.14.3.10.10 Is Foreign Key

❌ No

#### 5.14.3.11.0 updatedAt

##### 5.14.3.11.1 Name

updatedAt

##### 5.14.3.11.2 Type

🔹 DateTime

##### 5.14.3.11.3 Is Required

✅ Yes

##### 5.14.3.11.4 Is Primary Key

❌ No

##### 5.14.3.11.5 Size

0

##### 5.14.3.11.6 Is Unique

❌ No

##### 5.14.3.11.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.14.3.11.8 Precision

0

##### 5.14.3.11.9 Scale

0

##### 5.14.3.11.10 Is Foreign Key

❌ No

#### 5.14.3.12.0 deletedAt

##### 5.14.3.12.1 Name

deletedAt

##### 5.14.3.12.2 Type

🔹 DateTime

##### 5.14.3.12.3 Is Required

❌ No

##### 5.14.3.12.4 Is Primary Key

❌ No

##### 5.14.3.12.5 Size

0

##### 5.14.3.12.6 Is Unique

❌ No

##### 5.14.3.12.7 Constraints

*No items available*

##### 5.14.3.12.8 Precision

0

##### 5.14.3.12.9 Scale

0

##### 5.14.3.12.10 Is Foreign Key

❌ No

### 5.14.4.0.0 Primary Keys

- postId

### 5.14.5.0.0 Unique Constraints

*No items available*

### 5.14.6.0.0 Indexes

- {'name': 'IX_Post_Author_Active_CreatedAt', 'columns': ['authorId', 'createdAt DESC'], 'type': 'BTree'}

## 5.15.0.0.0 Media

### 5.15.1.0.0 Name

Media

### 5.15.2.0.0 Description

Owner: Posts Service. Stores metadata about user-uploaded files, such as images for posts. The actual files are stored in AWS S3.

### 5.15.3.0.0 Attributes

#### 5.15.3.1.0 mediaId

##### 5.15.3.1.1 Name

mediaId

##### 5.15.3.1.2 Type

🔹 Guid

##### 5.15.3.1.3 Is Required

✅ Yes

##### 5.15.3.1.4 Is Primary Key

✅ Yes

##### 5.15.3.1.5 Size

0

##### 5.15.3.1.6 Is Unique

✅ Yes

##### 5.15.3.1.7 Constraints

*No items available*

##### 5.15.3.1.8 Precision

0

##### 5.15.3.1.9 Scale

0

##### 5.15.3.1.10 Is Foreign Key

❌ No

#### 5.15.3.2.0 uploaderId

##### 5.15.3.2.1 Name

uploaderId

##### 5.15.3.2.2 Type

🔹 Guid

##### 5.15.3.2.3 Is Required

✅ Yes

##### 5.15.3.2.4 Is Primary Key

❌ No

##### 5.15.3.2.5 Size

0

##### 5.15.3.2.6 Is Unique

❌ No

##### 5.15.3.2.7 Constraints

*No items available*

##### 5.15.3.2.8 Precision

0

##### 5.15.3.2.9 Scale

0

##### 5.15.3.2.10 Is Foreign Key

✅ Yes

#### 5.15.3.3.0 mediaType

##### 5.15.3.3.1 Name

mediaType

##### 5.15.3.3.2 Type

🔹 VARCHAR

##### 5.15.3.3.3 Is Required

✅ Yes

##### 5.15.3.3.4 Is Primary Key

❌ No

##### 5.15.3.3.5 Size

50

##### 5.15.3.3.6 Is Unique

❌ No

##### 5.15.3.3.7 Constraints

- ENUM('image')

##### 5.15.3.3.8 Precision

0

##### 5.15.3.3.9 Scale

0

##### 5.15.3.3.10 Is Foreign Key

❌ No

#### 5.15.3.4.0 fileFormat

##### 5.15.3.4.1 Name

fileFormat

##### 5.15.3.4.2 Type

🔹 VARCHAR

##### 5.15.3.4.3 Is Required

✅ Yes

##### 5.15.3.4.4 Is Primary Key

❌ No

##### 5.15.3.4.5 Size

10

##### 5.15.3.4.6 Is Unique

❌ No

##### 5.15.3.4.7 Constraints

- ENUM('jpeg', 'png')

##### 5.15.3.4.8 Precision

0

##### 5.15.3.4.9 Scale

0

##### 5.15.3.4.10 Is Foreign Key

❌ No

#### 5.15.3.5.0 fileSizeBytes

##### 5.15.3.5.1 Name

fileSizeBytes

##### 5.15.3.5.2 Type

🔹 INT

##### 5.15.3.5.3 Is Required

✅ Yes

##### 5.15.3.5.4 Is Primary Key

❌ No

##### 5.15.3.5.5 Size

0

##### 5.15.3.5.6 Is Unique

❌ No

##### 5.15.3.5.7 Constraints

- DEFAULT 0

##### 5.15.3.5.8 Precision

0

##### 5.15.3.5.9 Scale

0

##### 5.15.3.5.10 Is Foreign Key

❌ No

#### 5.15.3.6.0 storageUrl

##### 5.15.3.6.1 Name

storageUrl

##### 5.15.3.6.2 Type

🔹 VARCHAR

##### 5.15.3.6.3 Is Required

✅ Yes

##### 5.15.3.6.4 Is Primary Key

❌ No

##### 5.15.3.6.5 Size

2,048

##### 5.15.3.6.6 Is Unique

❌ No

##### 5.15.3.6.7 Constraints

*No items available*

##### 5.15.3.6.8 Precision

0

##### 5.15.3.6.9 Scale

0

##### 5.15.3.6.10 Is Foreign Key

❌ No

#### 5.15.3.7.0 createdAt

##### 5.15.3.7.1 Name

createdAt

##### 5.15.3.7.2 Type

🔹 DateTime

##### 5.15.3.7.3 Is Required

✅ Yes

##### 5.15.3.7.4 Is Primary Key

❌ No

##### 5.15.3.7.5 Size

0

##### 5.15.3.7.6 Is Unique

❌ No

##### 5.15.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.15.3.7.8 Precision

0

##### 5.15.3.7.9 Scale

0

##### 5.15.3.7.10 Is Foreign Key

❌ No

### 5.15.4.0.0 Primary Keys

- mediaId

### 5.15.5.0.0 Unique Constraints

*No items available*

### 5.15.6.0.0 Indexes

- {'name': 'IX_Media_UploaderId', 'columns': ['uploaderId'], 'type': 'BTree'}

## 5.16.0.0.0 PostMedia

### 5.16.1.0.0 Name

PostMedia

### 5.16.2.0.0 Description

Owner: Posts Service. Join table to link multiple Media items to a single Post.

### 5.16.3.0.0 Attributes

#### 5.16.3.1.0 postMediaId

##### 5.16.3.1.1 Name

postMediaId

##### 5.16.3.1.2 Type

🔹 Guid

##### 5.16.3.1.3 Is Required

✅ Yes

##### 5.16.3.1.4 Is Primary Key

✅ Yes

##### 5.16.3.1.5 Size

0

##### 5.16.3.1.6 Is Unique

✅ Yes

##### 5.16.3.1.7 Constraints

*No items available*

##### 5.16.3.1.8 Precision

0

##### 5.16.3.1.9 Scale

0

##### 5.16.3.1.10 Is Foreign Key

❌ No

#### 5.16.3.2.0 postId

##### 5.16.3.2.1 Name

postId

##### 5.16.3.2.2 Type

🔹 Guid

##### 5.16.3.2.3 Is Required

✅ Yes

##### 5.16.3.2.4 Is Primary Key

❌ No

##### 5.16.3.2.5 Size

0

##### 5.16.3.2.6 Is Unique

❌ No

##### 5.16.3.2.7 Constraints

*No items available*

##### 5.16.3.2.8 Precision

0

##### 5.16.3.2.9 Scale

0

##### 5.16.3.2.10 Is Foreign Key

✅ Yes

#### 5.16.3.3.0 mediaId

##### 5.16.3.3.1 Name

mediaId

##### 5.16.3.3.2 Type

🔹 Guid

##### 5.16.3.3.3 Is Required

✅ Yes

##### 5.16.3.3.4 Is Primary Key

❌ No

##### 5.16.3.3.5 Size

0

##### 5.16.3.3.6 Is Unique

❌ No

##### 5.16.3.3.7 Constraints

*No items available*

##### 5.16.3.3.8 Precision

0

##### 5.16.3.3.9 Scale

0

##### 5.16.3.3.10 Is Foreign Key

✅ Yes

#### 5.16.3.4.0 displayOrder

##### 5.16.3.4.1 Name

displayOrder

##### 5.16.3.4.2 Type

🔹 INT

##### 5.16.3.4.3 Is Required

✅ Yes

##### 5.16.3.4.4 Is Primary Key

❌ No

##### 5.16.3.4.5 Size

0

##### 5.16.3.4.6 Is Unique

❌ No

##### 5.16.3.4.7 Constraints

- DEFAULT 0

##### 5.16.3.4.8 Precision

0

##### 5.16.3.4.9 Scale

0

##### 5.16.3.4.10 Is Foreign Key

❌ No

### 5.16.4.0.0 Primary Keys

- postMediaId

### 5.16.5.0.0 Unique Constraints

*No items available*

### 5.16.6.0.0 Indexes

- {'name': 'IX_PostMedia_PostId_DisplayOrder', 'columns': ['postId', 'displayOrder'], 'type': 'BTree'}

## 5.17.0.0.0 Comment

### 5.17.1.0.0 Name

Comment

### 5.17.2.0.0 Description

Owner: Posts Service. Represents a single comment made by a user on a post. This is the write model for comments.

### 5.17.3.0.0 Attributes

#### 5.17.3.1.0 commentId

##### 5.17.3.1.1 Name

commentId

##### 5.17.3.1.2 Type

🔹 Guid

##### 5.17.3.1.3 Is Required

✅ Yes

##### 5.17.3.1.4 Is Primary Key

✅ Yes

##### 5.17.3.1.5 Size

0

##### 5.17.3.1.6 Is Unique

✅ Yes

##### 5.17.3.1.7 Constraints

*No items available*

##### 5.17.3.1.8 Precision

0

##### 5.17.3.1.9 Scale

0

##### 5.17.3.1.10 Is Foreign Key

❌ No

#### 5.17.3.2.0 postId

##### 5.17.3.2.1 Name

postId

##### 5.17.3.2.2 Type

🔹 Guid

##### 5.17.3.2.3 Is Required

✅ Yes

##### 5.17.3.2.4 Is Primary Key

❌ No

##### 5.17.3.2.5 Size

0

##### 5.17.3.2.6 Is Unique

❌ No

##### 5.17.3.2.7 Constraints

*No items available*

##### 5.17.3.2.8 Precision

0

##### 5.17.3.2.9 Scale

0

##### 5.17.3.2.10 Is Foreign Key

✅ Yes

#### 5.17.3.3.0 authorId

##### 5.17.3.3.1 Name

authorId

##### 5.17.3.3.2 Type

🔹 Guid

##### 5.17.3.3.3 Is Required

✅ Yes

##### 5.17.3.3.4 Is Primary Key

❌ No

##### 5.17.3.3.5 Size

0

##### 5.17.3.3.6 Is Unique

❌ No

##### 5.17.3.3.7 Constraints

*No items available*

##### 5.17.3.3.8 Precision

0

##### 5.17.3.3.9 Scale

0

##### 5.17.3.3.10 Is Foreign Key

✅ Yes

#### 5.17.3.4.0 textContent

##### 5.17.3.4.1 Name

textContent

##### 5.17.3.4.2 Type

🔹 TEXT

##### 5.17.3.4.3 Is Required

✅ Yes

##### 5.17.3.4.4 Is Primary Key

❌ No

##### 5.17.3.4.5 Size

1,500

##### 5.17.3.4.6 Is Unique

❌ No

##### 5.17.3.4.7 Constraints

- MAX_LENGTH(1500)

##### 5.17.3.4.8 Precision

0

##### 5.17.3.4.9 Scale

0

##### 5.17.3.4.10 Is Foreign Key

❌ No

#### 5.17.3.5.0 authorFullName

##### 5.17.3.5.1 Name

authorFullName

##### 5.17.3.5.2 Type

🔹 VARCHAR

##### 5.17.3.5.3 Is Required

✅ Yes

##### 5.17.3.5.4 Is Primary Key

❌ No

##### 5.17.3.5.5 Size

100

##### 5.17.3.5.6 Is Unique

❌ No

##### 5.17.3.5.7 Constraints

*No items available*

##### 5.17.3.5.8 Precision

0

##### 5.17.3.5.9 Scale

0

##### 5.17.3.5.10 Is Foreign Key

❌ No

#### 5.17.3.6.0 authorProfilePictureUrl

##### 5.17.3.6.1 Name

authorProfilePictureUrl

##### 5.17.3.6.2 Type

🔹 VARCHAR

##### 5.17.3.6.3 Is Required

❌ No

##### 5.17.3.6.4 Is Primary Key

❌ No

##### 5.17.3.6.5 Size

2,048

##### 5.17.3.6.6 Is Unique

❌ No

##### 5.17.3.6.7 Constraints

*No items available*

##### 5.17.3.6.8 Precision

0

##### 5.17.3.6.9 Scale

0

##### 5.17.3.6.10 Is Foreign Key

❌ No

#### 5.17.3.7.0 createdAt

##### 5.17.3.7.1 Name

createdAt

##### 5.17.3.7.2 Type

🔹 DateTime

##### 5.17.3.7.3 Is Required

✅ Yes

##### 5.17.3.7.4 Is Primary Key

❌ No

##### 5.17.3.7.5 Size

0

##### 5.17.3.7.6 Is Unique

❌ No

##### 5.17.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.17.3.7.8 Precision

0

##### 5.17.3.7.9 Scale

0

##### 5.17.3.7.10 Is Foreign Key

❌ No

#### 5.17.3.8.0 updatedAt

##### 5.17.3.8.1 Name

updatedAt

##### 5.17.3.8.2 Type

🔹 DateTime

##### 5.17.3.8.3 Is Required

✅ Yes

##### 5.17.3.8.4 Is Primary Key

❌ No

##### 5.17.3.8.5 Size

0

##### 5.17.3.8.6 Is Unique

❌ No

##### 5.17.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.17.3.8.8 Precision

0

##### 5.17.3.8.9 Scale

0

##### 5.17.3.8.10 Is Foreign Key

❌ No

#### 5.17.3.9.0 deletedAt

##### 5.17.3.9.1 Name

deletedAt

##### 5.17.3.9.2 Type

🔹 DateTime

##### 5.17.3.9.3 Is Required

❌ No

##### 5.17.3.9.4 Is Primary Key

❌ No

##### 5.17.3.9.5 Size

0

##### 5.17.3.9.6 Is Unique

❌ No

##### 5.17.3.9.7 Constraints

*No items available*

##### 5.17.3.9.8 Precision

0

##### 5.17.3.9.9 Scale

0

##### 5.17.3.9.10 Is Foreign Key

❌ No

### 5.17.4.0.0 Primary Keys

- commentId

### 5.17.5.0.0 Unique Constraints

*No items available*

### 5.17.6.0.0 Indexes

#### 5.17.6.1.0 IX_Comment_PostId_CreatedAt

##### 5.17.6.1.1 Name

IX_Comment_PostId_CreatedAt

##### 5.17.6.1.2 Columns

- postId
- createdAt

##### 5.17.6.1.3 Type

🔹 BTree

#### 5.17.6.2.0 IX_Comment_AuthorId

##### 5.17.6.2.1 Name

IX_Comment_AuthorId

##### 5.17.6.2.2 Columns

- authorId

##### 5.17.6.2.3 Type

🔹 BTree

## 5.18.0.0.0 PostReaction

### 5.18.1.0.0 Name

PostReaction

### 5.18.2.0.0 Description

Owner: Engagement Service. Records a reaction (e.g., 'Like') from a user on a specific post. High-write table. This service is responsible for updating the reactionCount on the Post entity via an event.

### 5.18.3.0.0 Attributes

#### 5.18.3.1.0 postId

##### 5.18.3.1.1 Name

postId

##### 5.18.3.1.2 Type

🔹 Guid

##### 5.18.3.1.3 Is Required

✅ Yes

##### 5.18.3.1.4 Is Primary Key

✅ Yes

##### 5.18.3.1.5 Size

0

##### 5.18.3.1.6 Is Unique

❌ No

##### 5.18.3.1.7 Constraints

*No items available*

##### 5.18.3.1.8 Precision

0

##### 5.18.3.1.9 Scale

0

##### 5.18.3.1.10 Is Foreign Key

✅ Yes

#### 5.18.3.2.0 userId

##### 5.18.3.2.1 Name

userId

##### 5.18.3.2.2 Type

🔹 Guid

##### 5.18.3.2.3 Is Required

✅ Yes

##### 5.18.3.2.4 Is Primary Key

✅ Yes

##### 5.18.3.2.5 Size

0

##### 5.18.3.2.6 Is Unique

❌ No

##### 5.18.3.2.7 Constraints

*No items available*

##### 5.18.3.2.8 Precision

0

##### 5.18.3.2.9 Scale

0

##### 5.18.3.2.10 Is Foreign Key

✅ Yes

#### 5.18.3.3.0 reactionType

##### 5.18.3.3.1 Name

reactionType

##### 5.18.3.3.2 Type

🔹 VARCHAR

##### 5.18.3.3.3 Is Required

✅ Yes

##### 5.18.3.3.4 Is Primary Key

❌ No

##### 5.18.3.3.5 Size

50

##### 5.18.3.3.6 Is Unique

❌ No

##### 5.18.3.3.7 Constraints

- DEFAULT 'like'

##### 5.18.3.3.8 Precision

0

##### 5.18.3.3.9 Scale

0

##### 5.18.3.3.10 Is Foreign Key

❌ No

#### 5.18.3.4.0 createdAt

##### 5.18.3.4.1 Name

createdAt

##### 5.18.3.4.2 Type

🔹 DateTime

##### 5.18.3.4.3 Is Required

✅ Yes

##### 5.18.3.4.4 Is Primary Key

❌ No

##### 5.18.3.4.5 Size

0

##### 5.18.3.4.6 Is Unique

❌ No

##### 5.18.3.4.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.18.3.4.8 Precision

0

##### 5.18.3.4.9 Scale

0

##### 5.18.3.4.10 Is Foreign Key

❌ No

### 5.18.4.0.0 Primary Keys

- postId
- userId

### 5.18.5.0.0 Unique Constraints

*No items available*

### 5.18.6.0.0 Indexes

- {'name': 'IX_PostReaction_UserId', 'columns': ['userId'], 'type': 'BTree'}

## 5.19.0.0.0 Conversation

### 5.19.1.0.0 Name

Conversation

### 5.19.2.0.0 Description

Owner: Messaging Service. Represents a distinct messaging thread between two or more users.

### 5.19.3.0.0 Attributes

#### 5.19.3.1.0 conversationId

##### 5.19.3.1.1 Name

conversationId

##### 5.19.3.1.2 Type

🔹 Guid

##### 5.19.3.1.3 Is Required

✅ Yes

##### 5.19.3.1.4 Is Primary Key

✅ Yes

##### 5.19.3.1.5 Size

0

##### 5.19.3.1.6 Is Unique

✅ Yes

##### 5.19.3.1.7 Constraints

*No items available*

##### 5.19.3.1.8 Precision

0

##### 5.19.3.1.9 Scale

0

##### 5.19.3.1.10 Is Foreign Key

❌ No

#### 5.19.3.2.0 createdAt

##### 5.19.3.2.1 Name

createdAt

##### 5.19.3.2.2 Type

🔹 DateTime

##### 5.19.3.2.3 Is Required

✅ Yes

##### 5.19.3.2.4 Is Primary Key

❌ No

##### 5.19.3.2.5 Size

0

##### 5.19.3.2.6 Is Unique

❌ No

##### 5.19.3.2.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.19.3.2.8 Precision

0

##### 5.19.3.2.9 Scale

0

##### 5.19.3.2.10 Is Foreign Key

❌ No

### 5.19.4.0.0 Primary Keys

- conversationId

### 5.19.5.0.0 Unique Constraints

*No items available*

### 5.19.6.0.0 Indexes

*No items available*

## 5.20.0.0.0 ConversationParticipant

### 5.20.1.0.0 Name

ConversationParticipant

### 5.20.2.0.0 Description

Owner: Messaging Service. Join table linking users to the conversations they are a part of.

### 5.20.3.0.0 Attributes

#### 5.20.3.1.0 conversationId

##### 5.20.3.1.1 Name

conversationId

##### 5.20.3.1.2 Type

🔹 Guid

##### 5.20.3.1.3 Is Required

✅ Yes

##### 5.20.3.1.4 Is Primary Key

✅ Yes

##### 5.20.3.1.5 Size

0

##### 5.20.3.1.6 Is Unique

❌ No

##### 5.20.3.1.7 Constraints

*No items available*

##### 5.20.3.1.8 Precision

0

##### 5.20.3.1.9 Scale

0

##### 5.20.3.1.10 Is Foreign Key

✅ Yes

#### 5.20.3.2.0 userId

##### 5.20.3.2.1 Name

userId

##### 5.20.3.2.2 Type

🔹 Guid

##### 5.20.3.2.3 Is Required

✅ Yes

##### 5.20.3.2.4 Is Primary Key

✅ Yes

##### 5.20.3.2.5 Size

0

##### 5.20.3.2.6 Is Unique

❌ No

##### 5.20.3.2.7 Constraints

*No items available*

##### 5.20.3.2.8 Precision

0

##### 5.20.3.2.9 Scale

0

##### 5.20.3.2.10 Is Foreign Key

✅ Yes

#### 5.20.3.3.0 joinedAt

##### 5.20.3.3.1 Name

joinedAt

##### 5.20.3.3.2 Type

🔹 DateTime

##### 5.20.3.3.3 Is Required

✅ Yes

##### 5.20.3.3.4 Is Primary Key

❌ No

##### 5.20.3.3.5 Size

0

##### 5.20.3.3.6 Is Unique

❌ No

##### 5.20.3.3.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.20.3.3.8 Precision

0

##### 5.20.3.3.9 Scale

0

##### 5.20.3.3.10 Is Foreign Key

❌ No

### 5.20.4.0.0 Primary Keys

- conversationId
- userId

### 5.20.5.0.0 Unique Constraints

*No items available*

### 5.20.6.0.0 Indexes

- {'name': 'IX_ConversationParticipant_UserId', 'columns': ['userId'], 'type': 'BTree'}

## 5.21.0.0.0 Message

### 5.21.1.0.0 Name

Message

### 5.21.2.0.0 Description

Owner: Messaging Service. Represents a single message sent within a conversation. Partitioned by RANGE on createdAt (monthly) to improve query performance and simplify archival of old data.

### 5.21.3.0.0 Attributes

#### 5.21.3.1.0 messageId

##### 5.21.3.1.1 Name

messageId

##### 5.21.3.1.2 Type

🔹 Guid

##### 5.21.3.1.3 Is Required

✅ Yes

##### 5.21.3.1.4 Is Primary Key

✅ Yes

##### 5.21.3.1.5 Size

0

##### 5.21.3.1.6 Is Unique

✅ Yes

##### 5.21.3.1.7 Constraints

*No items available*

##### 5.21.3.1.8 Precision

0

##### 5.21.3.1.9 Scale

0

##### 5.21.3.1.10 Is Foreign Key

❌ No

#### 5.21.3.2.0 conversationId

##### 5.21.3.2.1 Name

conversationId

##### 5.21.3.2.2 Type

🔹 Guid

##### 5.21.3.2.3 Is Required

✅ Yes

##### 5.21.3.2.4 Is Primary Key

❌ No

##### 5.21.3.2.5 Size

0

##### 5.21.3.2.6 Is Unique

❌ No

##### 5.21.3.2.7 Constraints

*No items available*

##### 5.21.3.2.8 Precision

0

##### 5.21.3.2.9 Scale

0

##### 5.21.3.2.10 Is Foreign Key

✅ Yes

#### 5.21.3.3.0 senderId

##### 5.21.3.3.1 Name

senderId

##### 5.21.3.3.2 Type

🔹 Guid

##### 5.21.3.3.3 Is Required

✅ Yes

##### 5.21.3.3.4 Is Primary Key

❌ No

##### 5.21.3.3.5 Size

0

##### 5.21.3.3.6 Is Unique

❌ No

##### 5.21.3.3.7 Constraints

*No items available*

##### 5.21.3.3.8 Precision

0

##### 5.21.3.3.9 Scale

0

##### 5.21.3.3.10 Is Foreign Key

✅ Yes

#### 5.21.3.4.0 textContent

##### 5.21.3.4.1 Name

textContent

##### 5.21.3.4.2 Type

🔹 TEXT

##### 5.21.3.4.3 Is Required

✅ Yes

##### 5.21.3.4.4 Is Primary Key

❌ No

##### 5.21.3.4.5 Size

0

##### 5.21.3.4.6 Is Unique

❌ No

##### 5.21.3.4.7 Constraints

*No items available*

##### 5.21.3.4.8 Precision

0

##### 5.21.3.4.9 Scale

0

##### 5.21.3.4.10 Is Foreign Key

❌ No

#### 5.21.3.5.0 createdAt

##### 5.21.3.5.1 Name

createdAt

##### 5.21.3.5.2 Type

🔹 DateTime

##### 5.21.3.5.3 Is Required

✅ Yes

##### 5.21.3.5.4 Is Primary Key

❌ No

##### 5.21.3.5.5 Size

0

##### 5.21.3.5.6 Is Unique

❌ No

##### 5.21.3.5.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.21.3.5.8 Precision

0

##### 5.21.3.5.9 Scale

0

##### 5.21.3.5.10 Is Foreign Key

❌ No

### 5.21.4.0.0 Primary Keys

- messageId

### 5.21.5.0.0 Unique Constraints

*No items available*

### 5.21.6.0.0 Indexes

- {'name': 'IX_Message_ConversationId_CreatedAt', 'columns': ['conversationId', 'createdAt'], 'type': 'BTree'}

## 5.22.0.0.0 MessageStatus

### 5.22.1.0.0 Name

MessageStatus

### 5.22.2.0.0 Description

Owner: Messaging Service. Tracks the delivered and read status of a message for each recipient in a conversation.

### 5.22.3.0.0 Attributes

#### 5.22.3.1.0 messageId

##### 5.22.3.1.1 Name

messageId

##### 5.22.3.1.2 Type

🔹 Guid

##### 5.22.3.1.3 Is Required

✅ Yes

##### 5.22.3.1.4 Is Primary Key

✅ Yes

##### 5.22.3.1.5 Size

0

##### 5.22.3.1.6 Is Unique

❌ No

##### 5.22.3.1.7 Constraints

*No items available*

##### 5.22.3.1.8 Precision

0

##### 5.22.3.1.9 Scale

0

##### 5.22.3.1.10 Is Foreign Key

✅ Yes

#### 5.22.3.2.0 userId

##### 5.22.3.2.1 Name

userId

##### 5.22.3.2.2 Type

🔹 Guid

##### 5.22.3.2.3 Is Required

✅ Yes

##### 5.22.3.2.4 Is Primary Key

✅ Yes

##### 5.22.3.2.5 Size

0

##### 5.22.3.2.6 Is Unique

❌ No

##### 5.22.3.2.7 Constraints

*No items available*

##### 5.22.3.2.8 Precision

0

##### 5.22.3.2.9 Scale

0

##### 5.22.3.2.10 Is Foreign Key

✅ Yes

#### 5.22.3.3.0 status

##### 5.22.3.3.1 Name

status

##### 5.22.3.3.2 Type

🔹 VARCHAR

##### 5.22.3.3.3 Is Required

✅ Yes

##### 5.22.3.3.4 Is Primary Key

❌ No

##### 5.22.3.3.5 Size

50

##### 5.22.3.3.6 Is Unique

❌ No

##### 5.22.3.3.7 Constraints

- ENUM('delivered', 'read')
- DEFAULT 'delivered'

##### 5.22.3.3.8 Precision

0

##### 5.22.3.3.9 Scale

0

##### 5.22.3.3.10 Is Foreign Key

❌ No

#### 5.22.3.4.0 updatedAt

##### 5.22.3.4.1 Name

updatedAt

##### 5.22.3.4.2 Type

🔹 DateTime

##### 5.22.3.4.3 Is Required

✅ Yes

##### 5.22.3.4.4 Is Primary Key

❌ No

##### 5.22.3.4.5 Size

0

##### 5.22.3.4.6 Is Unique

❌ No

##### 5.22.3.4.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.22.3.4.8 Precision

0

##### 5.22.3.4.9 Scale

0

##### 5.22.3.4.10 Is Foreign Key

❌ No

### 5.22.4.0.0 Primary Keys

- messageId
- userId

### 5.22.5.0.0 Unique Constraints

*No items available*

### 5.22.6.0.0 Indexes

- {'name': 'IX_MessageStatus_UserId_Status', 'columns': ['userId', 'status'], 'type': 'BTree'}

## 5.23.0.0.0 Notification

### 5.23.1.0.0 Name

Notification

### 5.23.2.0.0 Description

Owner: Notifications Service. Stores notifications generated by system events to be displayed to users. Partitioned by RANGE on createdAt (weekly or monthly) to ensure fast queries for recent notifications and efficient data purging.

### 5.23.3.0.0 Attributes

#### 5.23.3.1.0 notificationId

##### 5.23.3.1.1 Name

notificationId

##### 5.23.3.1.2 Type

🔹 Guid

##### 5.23.3.1.3 Is Required

✅ Yes

##### 5.23.3.1.4 Is Primary Key

✅ Yes

##### 5.23.3.1.5 Size

0

##### 5.23.3.1.6 Is Unique

✅ Yes

##### 5.23.3.1.7 Constraints

*No items available*

##### 5.23.3.1.8 Precision

0

##### 5.23.3.1.9 Scale

0

##### 5.23.3.1.10 Is Foreign Key

❌ No

#### 5.23.3.2.0 recipientId

##### 5.23.3.2.1 Name

recipientId

##### 5.23.3.2.2 Type

🔹 Guid

##### 5.23.3.2.3 Is Required

✅ Yes

##### 5.23.3.2.4 Is Primary Key

❌ No

##### 5.23.3.2.5 Size

0

##### 5.23.3.2.6 Is Unique

❌ No

##### 5.23.3.2.7 Constraints

*No items available*

##### 5.23.3.2.8 Precision

0

##### 5.23.3.2.9 Scale

0

##### 5.23.3.2.10 Is Foreign Key

✅ Yes

#### 5.23.3.3.0 actorId

##### 5.23.3.3.1 Name

actorId

##### 5.23.3.3.2 Type

🔹 Guid

##### 5.23.3.3.3 Is Required

❌ No

##### 5.23.3.3.4 Is Primary Key

❌ No

##### 5.23.3.3.5 Size

0

##### 5.23.3.3.6 Is Unique

❌ No

##### 5.23.3.3.7 Constraints

*No items available*

##### 5.23.3.3.8 Precision

0

##### 5.23.3.3.9 Scale

0

##### 5.23.3.3.10 Is Foreign Key

✅ Yes

#### 5.23.3.4.0 notificationType

##### 5.23.3.4.1 Name

notificationType

##### 5.23.3.4.2 Type

🔹 VARCHAR

##### 5.23.3.4.3 Is Required

✅ Yes

##### 5.23.3.4.4 Is Primary Key

❌ No

##### 5.23.3.4.5 Size

100

##### 5.23.3.4.6 Is Unique

❌ No

##### 5.23.3.4.7 Constraints

*No items available*

##### 5.23.3.4.8 Precision

0

##### 5.23.3.4.9 Scale

0

##### 5.23.3.4.10 Is Foreign Key

❌ No

#### 5.23.3.5.0 targetEntityId

##### 5.23.3.5.1 Name

targetEntityId

##### 5.23.3.5.2 Type

🔹 Guid

##### 5.23.3.5.3 Is Required

❌ No

##### 5.23.3.5.4 Is Primary Key

❌ No

##### 5.23.3.5.5 Size

0

##### 5.23.3.5.6 Is Unique

❌ No

##### 5.23.3.5.7 Constraints

*No items available*

##### 5.23.3.5.8 Precision

0

##### 5.23.3.5.9 Scale

0

##### 5.23.3.5.10 Is Foreign Key

❌ No

#### 5.23.3.6.0 targetEntityType

##### 5.23.3.6.1 Name

targetEntityType

##### 5.23.3.6.2 Type

🔹 VARCHAR

##### 5.23.3.6.3 Is Required

❌ No

##### 5.23.3.6.4 Is Primary Key

❌ No

##### 5.23.3.6.5 Size

100

##### 5.23.3.6.6 Is Unique

❌ No

##### 5.23.3.6.7 Constraints

*No items available*

##### 5.23.3.6.8 Precision

0

##### 5.23.3.6.9 Scale

0

##### 5.23.3.6.10 Is Foreign Key

❌ No

#### 5.23.3.7.0 isRead

##### 5.23.3.7.1 Name

isRead

##### 5.23.3.7.2 Type

🔹 BOOLEAN

##### 5.23.3.7.3 Is Required

✅ Yes

##### 5.23.3.7.4 Is Primary Key

❌ No

##### 5.23.3.7.5 Size

0

##### 5.23.3.7.6 Is Unique

❌ No

##### 5.23.3.7.7 Constraints

- DEFAULT false

##### 5.23.3.7.8 Precision

0

##### 5.23.3.7.9 Scale

0

##### 5.23.3.7.10 Is Foreign Key

❌ No

#### 5.23.3.8.0 aggregatedCount

##### 5.23.3.8.1 Name

aggregatedCount

##### 5.23.3.8.2 Type

🔹 INT

##### 5.23.3.8.3 Is Required

✅ Yes

##### 5.23.3.8.4 Is Primary Key

❌ No

##### 5.23.3.8.5 Size

0

##### 5.23.3.8.6 Is Unique

❌ No

##### 5.23.3.8.7 Constraints

- DEFAULT 1

##### 5.23.3.8.8 Precision

0

##### 5.23.3.8.9 Scale

0

##### 5.23.3.8.10 Is Foreign Key

❌ No

#### 5.23.3.9.0 createdAt

##### 5.23.3.9.1 Name

createdAt

##### 5.23.3.9.2 Type

🔹 DateTime

##### 5.23.3.9.3 Is Required

✅ Yes

##### 5.23.3.9.4 Is Primary Key

❌ No

##### 5.23.3.9.5 Size

0

##### 5.23.3.9.6 Is Unique

❌ No

##### 5.23.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.23.3.9.8 Precision

0

##### 5.23.3.9.9 Scale

0

##### 5.23.3.9.10 Is Foreign Key

❌ No

#### 5.23.3.10.0 updatedAt

##### 5.23.3.10.1 Name

updatedAt

##### 5.23.3.10.2 Type

🔹 DateTime

##### 5.23.3.10.3 Is Required

✅ Yes

##### 5.23.3.10.4 Is Primary Key

❌ No

##### 5.23.3.10.5 Size

0

##### 5.23.3.10.6 Is Unique

❌ No

##### 5.23.3.10.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.23.3.10.8 Precision

0

##### 5.23.3.10.9 Scale

0

##### 5.23.3.10.10 Is Foreign Key

❌ No

### 5.23.4.0.0 Primary Keys

- notificationId

### 5.23.5.0.0 Unique Constraints

*No items available*

### 5.23.6.0.0 Indexes

- {'name': 'IX_Notification_Recipient_IsRead_CreatedAt', 'columns': ['recipientId', 'isRead', 'createdAt'], 'type': 'BTree'}

## 5.24.0.0.0 UserNotificationSetting

### 5.24.1.0.0 Name

UserNotificationSetting

### 5.24.2.0.0 Description

Owner: Notifications Service. Stores user-specific preferences for receiving different types of notifications.

### 5.24.3.0.0 Attributes

#### 5.24.3.1.0 userId

##### 5.24.3.1.1 Name

userId

##### 5.24.3.1.2 Type

🔹 Guid

##### 5.24.3.1.3 Is Required

✅ Yes

##### 5.24.3.1.4 Is Primary Key

✅ Yes

##### 5.24.3.1.5 Size

0

##### 5.24.3.1.6 Is Unique

❌ No

##### 5.24.3.1.7 Constraints

*No items available*

##### 5.24.3.1.8 Precision

0

##### 5.24.3.1.9 Scale

0

##### 5.24.3.1.10 Is Foreign Key

✅ Yes

#### 5.24.3.2.0 notificationType

##### 5.24.3.2.1 Name

notificationType

##### 5.24.3.2.2 Type

🔹 VARCHAR

##### 5.24.3.2.3 Is Required

✅ Yes

##### 5.24.3.2.4 Is Primary Key

✅ Yes

##### 5.24.3.2.5 Size

100

##### 5.24.3.2.6 Is Unique

❌ No

##### 5.24.3.2.7 Constraints

*No items available*

##### 5.24.3.2.8 Precision

0

##### 5.24.3.2.9 Scale

0

##### 5.24.3.2.10 Is Foreign Key

❌ No

#### 5.24.3.3.0 inAppEnabled

##### 5.24.3.3.1 Name

inAppEnabled

##### 5.24.3.3.2 Type

🔹 BOOLEAN

##### 5.24.3.3.3 Is Required

✅ Yes

##### 5.24.3.3.4 Is Primary Key

❌ No

##### 5.24.3.3.5 Size

0

##### 5.24.3.3.6 Is Unique

❌ No

##### 5.24.3.3.7 Constraints

- DEFAULT true

##### 5.24.3.3.8 Precision

0

##### 5.24.3.3.9 Scale

0

##### 5.24.3.3.10 Is Foreign Key

❌ No

#### 5.24.3.4.0 emailEnabled

##### 5.24.3.4.1 Name

emailEnabled

##### 5.24.3.4.2 Type

🔹 BOOLEAN

##### 5.24.3.4.3 Is Required

✅ Yes

##### 5.24.3.4.4 Is Primary Key

❌ No

##### 5.24.3.4.5 Size

0

##### 5.24.3.4.6 Is Unique

❌ No

##### 5.24.3.4.7 Constraints

- DEFAULT true

##### 5.24.3.4.8 Precision

0

##### 5.24.3.4.9 Scale

0

##### 5.24.3.4.10 Is Foreign Key

❌ No

### 5.24.4.0.0 Primary Keys

- userId
- notificationType

### 5.24.5.0.0 Unique Constraints

*No items available*

### 5.24.6.0.0 Indexes

*No items available*

## 5.25.0.0.0 ContentReport

### 5.25.1.0.0 Name

ContentReport

### 5.25.2.0.0 Description

Owner: Admin Service. Stores reports made by users against content like posts or comments, for moderation.

### 5.25.3.0.0 Attributes

#### 5.25.3.1.0 contentReportId

##### 5.25.3.1.1 Name

contentReportId

##### 5.25.3.1.2 Type

🔹 Guid

##### 5.25.3.1.3 Is Required

✅ Yes

##### 5.25.3.1.4 Is Primary Key

✅ Yes

##### 5.25.3.1.5 Size

0

##### 5.25.3.1.6 Is Unique

✅ Yes

##### 5.25.3.1.7 Constraints

*No items available*

##### 5.25.3.1.8 Precision

0

##### 5.25.3.1.9 Scale

0

##### 5.25.3.1.10 Is Foreign Key

❌ No

#### 5.25.3.2.0 reporterId

##### 5.25.3.2.1 Name

reporterId

##### 5.25.3.2.2 Type

🔹 Guid

##### 5.25.3.2.3 Is Required

✅ Yes

##### 5.25.3.2.4 Is Primary Key

❌ No

##### 5.25.3.2.5 Size

0

##### 5.25.3.2.6 Is Unique

❌ No

##### 5.25.3.2.7 Constraints

*No items available*

##### 5.25.3.2.8 Precision

0

##### 5.25.3.2.9 Scale

0

##### 5.25.3.2.10 Is Foreign Key

✅ Yes

#### 5.25.3.3.0 reportedPostId

##### 5.25.3.3.1 Name

reportedPostId

##### 5.25.3.3.2 Type

🔹 Guid

##### 5.25.3.3.3 Is Required

❌ No

##### 5.25.3.3.4 Is Primary Key

❌ No

##### 5.25.3.3.5 Size

0

##### 5.25.3.3.6 Is Unique

❌ No

##### 5.25.3.3.7 Constraints

*No items available*

##### 5.25.3.3.8 Precision

0

##### 5.25.3.3.9 Scale

0

##### 5.25.3.3.10 Is Foreign Key

✅ Yes

#### 5.25.3.4.0 reportedCommentId

##### 5.25.3.4.1 Name

reportedCommentId

##### 5.25.3.4.2 Type

🔹 Guid

##### 5.25.3.4.3 Is Required

❌ No

##### 5.25.3.4.4 Is Primary Key

❌ No

##### 5.25.3.4.5 Size

0

##### 5.25.3.4.6 Is Unique

❌ No

##### 5.25.3.4.7 Constraints

*No items available*

##### 5.25.3.4.8 Precision

0

##### 5.25.3.4.9 Scale

0

##### 5.25.3.4.10 Is Foreign Key

✅ Yes

#### 5.25.3.5.0 reason

##### 5.25.3.5.1 Name

reason

##### 5.25.3.5.2 Type

🔹 TEXT

##### 5.25.3.5.3 Is Required

✅ Yes

##### 5.25.3.5.4 Is Primary Key

❌ No

##### 5.25.3.5.5 Size

0

##### 5.25.3.5.6 Is Unique

❌ No

##### 5.25.3.5.7 Constraints

*No items available*

##### 5.25.3.5.8 Precision

0

##### 5.25.3.5.9 Scale

0

##### 5.25.3.5.10 Is Foreign Key

❌ No

#### 5.25.3.6.0 status

##### 5.25.3.6.1 Name

status

##### 5.25.3.6.2 Type

🔹 VARCHAR

##### 5.25.3.6.3 Is Required

✅ Yes

##### 5.25.3.6.4 Is Primary Key

❌ No

##### 5.25.3.6.5 Size

50

##### 5.25.3.6.6 Is Unique

❌ No

##### 5.25.3.6.7 Constraints

- ENUM('pending', 'dismissed', 'action_taken')
- DEFAULT 'pending'

##### 5.25.3.6.8 Precision

0

##### 5.25.3.6.9 Scale

0

##### 5.25.3.6.10 Is Foreign Key

❌ No

#### 5.25.3.7.0 createdAt

##### 5.25.3.7.1 Name

createdAt

##### 5.25.3.7.2 Type

🔹 DateTime

##### 5.25.3.7.3 Is Required

✅ Yes

##### 5.25.3.7.4 Is Primary Key

❌ No

##### 5.25.3.7.5 Size

0

##### 5.25.3.7.6 Is Unique

❌ No

##### 5.25.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.25.3.7.8 Precision

0

##### 5.25.3.7.9 Scale

0

##### 5.25.3.7.10 Is Foreign Key

❌ No

#### 5.25.3.8.0 updatedAt

##### 5.25.3.8.1 Name

updatedAt

##### 5.25.3.8.2 Type

🔹 DateTime

##### 5.25.3.8.3 Is Required

✅ Yes

##### 5.25.3.8.4 Is Primary Key

❌ No

##### 5.25.3.8.5 Size

0

##### 5.25.3.8.6 Is Unique

❌ No

##### 5.25.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.25.3.8.8 Precision

0

##### 5.25.3.8.9 Scale

0

##### 5.25.3.8.10 Is Foreign Key

❌ No

### 5.25.4.0.0 Primary Keys

- contentReportId

### 5.25.5.0.0 Unique Constraints

*No items available*

### 5.25.6.0.0 Indexes

- {'name': 'IX_ContentReport_Status_CreatedAt', 'columns': ['status', 'createdAt'], 'type': 'BTree'}

## 5.26.0.0.0 AdminAuditLog

### 5.26.1.0.0 Name

AdminAuditLog

### 5.26.2.0.0 Description

Owner: Admin Service. An immutable log of all actions performed by administrators in the Admin Dashboard.

### 5.26.3.0.0 Attributes

#### 5.26.3.1.0 logId

##### 5.26.3.1.1 Name

logId

##### 5.26.3.1.2 Type

🔹 Guid

##### 5.26.3.1.3 Is Required

✅ Yes

##### 5.26.3.1.4 Is Primary Key

✅ Yes

##### 5.26.3.1.5 Size

0

##### 5.26.3.1.6 Is Unique

✅ Yes

##### 5.26.3.1.7 Constraints

*No items available*

##### 5.26.3.1.8 Precision

0

##### 5.26.3.1.9 Scale

0

##### 5.26.3.1.10 Is Foreign Key

❌ No

#### 5.26.3.2.0 adminUserId

##### 5.26.3.2.1 Name

adminUserId

##### 5.26.3.2.2 Type

🔹 Guid

##### 5.26.3.2.3 Is Required

✅ Yes

##### 5.26.3.2.4 Is Primary Key

❌ No

##### 5.26.3.2.5 Size

0

##### 5.26.3.2.6 Is Unique

❌ No

##### 5.26.3.2.7 Constraints

*No items available*

##### 5.26.3.2.8 Precision

0

##### 5.26.3.2.9 Scale

0

##### 5.26.3.2.10 Is Foreign Key

✅ Yes

#### 5.26.3.3.0 action

##### 5.26.3.3.1 Name

action

##### 5.26.3.3.2 Type

🔹 VARCHAR

##### 5.26.3.3.3 Is Required

✅ Yes

##### 5.26.3.3.4 Is Primary Key

❌ No

##### 5.26.3.3.5 Size

255

##### 5.26.3.3.6 Is Unique

❌ No

##### 5.26.3.3.7 Constraints

*No items available*

##### 5.26.3.3.8 Precision

0

##### 5.26.3.3.9 Scale

0

##### 5.26.3.3.10 Is Foreign Key

❌ No

#### 5.26.3.4.0 targetEntityType

##### 5.26.3.4.1 Name

targetEntityType

##### 5.26.3.4.2 Type

🔹 VARCHAR

##### 5.26.3.4.3 Is Required

❌ No

##### 5.26.3.4.4 Is Primary Key

❌ No

##### 5.26.3.4.5 Size

100

##### 5.26.3.4.6 Is Unique

❌ No

##### 5.26.3.4.7 Constraints

*No items available*

##### 5.26.3.4.8 Precision

0

##### 5.26.3.4.9 Scale

0

##### 5.26.3.4.10 Is Foreign Key

❌ No

#### 5.26.3.5.0 targetEntityId

##### 5.26.3.5.1 Name

targetEntityId

##### 5.26.3.5.2 Type

🔹 VARCHAR

##### 5.26.3.5.3 Is Required

❌ No

##### 5.26.3.5.4 Is Primary Key

❌ No

##### 5.26.3.5.5 Size

255

##### 5.26.3.5.6 Is Unique

❌ No

##### 5.26.3.5.7 Constraints

*No items available*

##### 5.26.3.5.8 Precision

0

##### 5.26.3.5.9 Scale

0

##### 5.26.3.5.10 Is Foreign Key

❌ No

#### 5.26.3.6.0 details

##### 5.26.3.6.1 Name

details

##### 5.26.3.6.2 Type

🔹 JSONB

##### 5.26.3.6.3 Is Required

❌ No

##### 5.26.3.6.4 Is Primary Key

❌ No

##### 5.26.3.6.5 Size

0

##### 5.26.3.6.6 Is Unique

❌ No

##### 5.26.3.6.7 Constraints

*No items available*

##### 5.26.3.6.8 Precision

0

##### 5.26.3.6.9 Scale

0

##### 5.26.3.6.10 Is Foreign Key

❌ No

#### 5.26.3.7.0 createdAt

##### 5.26.3.7.1 Name

createdAt

##### 5.26.3.7.2 Type

🔹 DateTime

##### 5.26.3.7.3 Is Required

✅ Yes

##### 5.26.3.7.4 Is Primary Key

❌ No

##### 5.26.3.7.5 Size

0

##### 5.26.3.7.6 Is Unique

❌ No

##### 5.26.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.26.3.7.8 Precision

0

##### 5.26.3.7.9 Scale

0

##### 5.26.3.7.10 Is Foreign Key

❌ No

### 5.26.4.0.0 Primary Keys

- logId

### 5.26.5.0.0 Unique Constraints

*No items available*

### 5.26.6.0.0 Indexes

#### 5.26.6.1.0 IX_AdminAuditLog_TargetEntity

##### 5.26.6.1.1 Name

IX_AdminAuditLog_TargetEntity

##### 5.26.6.1.2 Columns

- targetEntityType
- targetEntityId

##### 5.26.6.1.3 Type

🔹 BTree

#### 5.26.6.2.0 IX_AdminAuditLog_AdminUserId_CreatedAt

##### 5.26.6.2.1 Name

IX_AdminAuditLog_AdminUserId_CreatedAt

##### 5.26.6.2.2 Columns

- adminUserId
- createdAt

##### 5.26.6.2.3 Type

🔹 BTree

