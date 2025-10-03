# 1 Title

Professional Networking Platform - Caching Layer

# 2 Name

professional_network_cache_db

# 3 Db Type

- keyvalue
- inmemory

# 4 Db Technology

Redis

# 5 Entities

## 5.1 UserProfileCache

### 5.1.1 Name

UserProfileCache

### 5.1.2 Description

Owner: User Profile Service. Write-through/aside cache for full UserProfile objects to reduce database load for profile views. Key: 'profile:{userId}'

### 5.1.3 Attributes

#### 5.1.3.1 key

##### 5.1.3.1.1 Name

key

##### 5.1.3.1.2 Type

🔹 String

##### 5.1.3.1.3 Is Required

✅ Yes

##### 5.1.3.1.4 Is Primary Key

✅ Yes

##### 5.1.3.1.5 Size

0

##### 5.1.3.1.6 Is Unique

✅ Yes

##### 5.1.3.1.7 Constraints

- Format: profile:{userId}

##### 5.1.3.1.8 Precision

0

##### 5.1.3.1.9 Scale

0

##### 5.1.3.1.10 Is Foreign Key

❌ No

#### 5.1.3.2.0 value

##### 5.1.3.2.1 Name

value

##### 5.1.3.2.2 Type

🔹 String (JSON)

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

0

##### 5.1.3.2.6 Is Unique

❌ No

##### 5.1.3.2.7 Constraints

- TTL: 24 hours

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- key

### 5.1.5.0.0 Unique Constraints

*No items available*

### 5.1.6.0.0 Indexes

*No items available*

## 5.2.0.0.0 JwtBlocklist

### 5.2.1.0.0 Name

JwtBlocklist

### 5.2.2.0.0 Description

Owner: Identity & Access Service. Stores revoked JWT IDs to prevent their reuse after logout or security events. Key: 'blocklist:jwt:{jti}'

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 key

##### 5.2.3.1.1 Name

key

##### 5.2.3.1.2 Type

🔹 String

##### 5.2.3.1.3 Is Required

✅ Yes

##### 5.2.3.1.4 Is Primary Key

✅ Yes

##### 5.2.3.1.5 Size

0

##### 5.2.3.1.6 Is Unique

✅ Yes

##### 5.2.3.1.7 Constraints

- Format: blocklist:jwt:{jti}

##### 5.2.3.1.8 Precision

0

##### 5.2.3.1.9 Scale

0

##### 5.2.3.1.10 Is Foreign Key

❌ No

#### 5.2.3.2.0 value

##### 5.2.3.2.1 Name

value

##### 5.2.3.2.2 Type

🔹 String

##### 5.2.3.2.3 Is Required

✅ Yes

##### 5.2.3.2.4 Is Primary Key

❌ No

##### 5.2.3.2.5 Size

0

##### 5.2.3.2.6 Is Unique

❌ No

##### 5.2.3.2.7 Constraints

- Value: 'revoked'
- TTL: Same as original token expiry

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- key

### 5.2.5.0.0 Unique Constraints

*No items available*

### 5.2.6.0.0 Indexes

*No items available*

## 5.3.0.0.0 ConnectionSet

### 5.3.1.0.0 Name

ConnectionSet

### 5.3.2.0.0 Description

Owner: Connections Service. Caches the set of a user's first-degree connection IDs for extremely fast authorization checks. Key: 'connections:set:{userId}'

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 key

##### 5.3.3.1.1 Name

key

##### 5.3.3.1.2 Type

🔹 String

##### 5.3.3.1.3 Is Required

✅ Yes

##### 5.3.3.1.4 Is Primary Key

✅ Yes

##### 5.3.3.1.5 Size

0

##### 5.3.3.1.6 Is Unique

✅ Yes

##### 5.3.3.1.7 Constraints

- Format: connections:set:{userId}

##### 5.3.3.1.8 Precision

0

##### 5.3.3.1.9 Scale

0

##### 5.3.3.1.10 Is Foreign Key

❌ No

#### 5.3.3.2.0 value

##### 5.3.3.2.1 Name

value

##### 5.3.3.2.2 Type

🔹 Set

##### 5.3.3.2.3 Is Required

✅ Yes

##### 5.3.3.2.4 Is Primary Key

❌ No

##### 5.3.3.2.5 Size

0

##### 5.3.3.2.6 Is Unique

❌ No

##### 5.3.3.2.7 Constraints

- Members are user IDs

##### 5.3.3.2.8 Precision

0

##### 5.3.3.2.9 Scale

0

##### 5.3.3.2.10 Is Foreign Key

❌ No

### 5.3.4.0.0 Primary Keys

- key

### 5.3.5.0.0 Unique Constraints

*No items available*

### 5.3.6.0.0 Indexes

*No items available*

