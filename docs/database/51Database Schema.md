# 1 Title

Professional Networking Platform - Feed Service Cache

# 2 Name

professional_network_feed_cache_db

# 3 Db Type

- keyvalue
- inmemory

# 4 Db Technology

Redis

# 5 Entities

## 5.1 UserFeed

### 5.1.1 Name

UserFeed

### 5.1.2 Description

Owner: Feed Service. Implements the fan-out-on-write news feed. Stores a sorted list of post IDs for each user. Key: 'feed:{userId}'

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

- Format: feed:{userId}

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

🔹 Sorted Set

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

0

##### 5.1.3.2.6 Is Unique

❌ No

##### 5.1.3.2.7 Constraints

- Member: postId
- Score: timestamp
- Capped at ~1000 entries per user

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

## 5.2.0.0.0 PostCache

### 5.2.1.0.0 Name

PostCache

### 5.2.2.0.0 Description

Owner: Feed Service. Read-aside cache for denormalized Post objects, populated on-demand when feeds are read. Key: 'post:{postId}'

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

- Format: post:{postId}

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

🔹 String (JSON)

##### 5.2.3.2.3 Is Required

✅ Yes

##### 5.2.3.2.4 Is Primary Key

❌ No

##### 5.2.3.2.5 Size

0

##### 5.2.3.2.6 Is Unique

❌ No

##### 5.2.3.2.7 Constraints

- TTL: 24 hours

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

