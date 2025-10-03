# 1 Entities

## 1.1 User

### 1.1.1 Name

User

### 1.1.2 Description

Stores user account credentials, status, and security settings. This is the core authentication entity.

### 1.1.3 Attributes

#### 1.1.3.1 userId

##### 1.1.3.1.1 Name

userId

##### 1.1.3.1.2 Type

🔹 Guid

##### 1.1.3.1.3 Is Required

✅ Yes

##### 1.1.3.1.4 Is Primary Key

✅ Yes

##### 1.1.3.1.5 Is Unique

✅ Yes

##### 1.1.3.1.6 Index Type

UniqueIndex

##### 1.1.3.1.7 Size

0

##### 1.1.3.1.8 Constraints

*No items available*

##### 1.1.3.1.9 Default Value

null

##### 1.1.3.1.10 Is Foreign Key

❌ No

##### 1.1.3.1.11 Precision

0

##### 1.1.3.1.12 Scale

0

#### 1.1.3.2.0 email

##### 1.1.3.2.1 Name

email

##### 1.1.3.2.2 Type

🔹 VARCHAR

##### 1.1.3.2.3 Is Required

✅ Yes

##### 1.1.3.2.4 Is Primary Key

❌ No

##### 1.1.3.2.5 Is Unique

✅ Yes

##### 1.1.3.2.6 Index Type

UniqueIndex

##### 1.1.3.2.7 Size

255

##### 1.1.3.2.8 Constraints

- EMAIL_FORMAT

##### 1.1.3.2.9 Default Value

null

##### 1.1.3.2.10 Is Foreign Key

❌ No

##### 1.1.3.2.11 Precision

0

##### 1.1.3.2.12 Scale

0

#### 1.1.3.3.0 passwordHash

##### 1.1.3.3.1 Name

passwordHash

##### 1.1.3.3.2 Type

🔹 VARCHAR

##### 1.1.3.3.3 Is Required

✅ Yes

##### 1.1.3.3.4 Is Primary Key

❌ No

##### 1.1.3.3.5 Is Unique

❌ No

##### 1.1.3.3.6 Index Type

None

##### 1.1.3.3.7 Size

255

##### 1.1.3.3.8 Constraints

*No items available*

##### 1.1.3.3.9 Default Value

null

##### 1.1.3.3.10 Is Foreign Key

❌ No

##### 1.1.3.3.11 Precision

0

##### 1.1.3.3.12 Scale

0

#### 1.1.3.4.0 dateOfBirth

##### 1.1.3.4.1 Name

dateOfBirth

##### 1.1.3.4.2 Type

🔹 DATE

##### 1.1.3.4.3 Is Required

✅ Yes

##### 1.1.3.4.4 Is Primary Key

❌ No

##### 1.1.3.4.5 Is Unique

❌ No

##### 1.1.3.4.6 Index Type

None

##### 1.1.3.4.7 Size

0

##### 1.1.3.4.8 Constraints

*No items available*

##### 1.1.3.4.9 Default Value

null

##### 1.1.3.4.10 Is Foreign Key

❌ No

##### 1.1.3.4.11 Precision

0

##### 1.1.3.4.12 Scale

0

#### 1.1.3.5.0 status

##### 1.1.3.5.1 Name

status

##### 1.1.3.5.2 Type

🔹 VARCHAR

##### 1.1.3.5.3 Is Required

✅ Yes

##### 1.1.3.5.4 Is Primary Key

❌ No

##### 1.1.3.5.5 Is Unique

❌ No

##### 1.1.3.5.6 Index Type

Index

##### 1.1.3.5.7 Size

50

##### 1.1.3.5.8 Constraints

- ENUM('inactive', 'active', 'deactivated', 'suspended', 'banned')

##### 1.1.3.5.9 Default Value

inactive

##### 1.1.3.5.10 Is Foreign Key

❌ No

##### 1.1.3.5.11 Precision

0

##### 1.1.3.5.12 Scale

0

#### 1.1.3.6.0 mfaSecret

##### 1.1.3.6.1 Name

mfaSecret

##### 1.1.3.6.2 Type

🔹 VARCHAR

##### 1.1.3.6.3 Is Required

❌ No

##### 1.1.3.6.4 Is Primary Key

❌ No

##### 1.1.3.6.5 Is Unique

❌ No

##### 1.1.3.6.6 Index Type

None

##### 1.1.3.6.7 Size

255

##### 1.1.3.6.8 Constraints

*No items available*

##### 1.1.3.6.9 Default Value

null

##### 1.1.3.6.10 Is Foreign Key

❌ No

##### 1.1.3.6.11 Precision

0

##### 1.1.3.6.12 Scale

0

#### 1.1.3.7.0 mfaEnabled

##### 1.1.3.7.1 Name

mfaEnabled

##### 1.1.3.7.2 Type

🔹 BOOLEAN

##### 1.1.3.7.3 Is Required

✅ Yes

##### 1.1.3.7.4 Is Primary Key

❌ No

##### 1.1.3.7.5 Is Unique

❌ No

##### 1.1.3.7.6 Index Type

None

##### 1.1.3.7.7 Size

0

##### 1.1.3.7.8 Constraints

*No items available*

##### 1.1.3.7.9 Default Value

false

##### 1.1.3.7.10 Is Foreign Key

❌ No

##### 1.1.3.7.11 Precision

0

##### 1.1.3.7.12 Scale

0

#### 1.1.3.8.0 createdAt

##### 1.1.3.8.1 Name

createdAt

##### 1.1.3.8.2 Type

🔹 DateTime

##### 1.1.3.8.3 Is Required

✅ Yes

##### 1.1.3.8.4 Is Primary Key

❌ No

##### 1.1.3.8.5 Is Unique

❌ No

##### 1.1.3.8.6 Index Type

Index

##### 1.1.3.8.7 Size

0

##### 1.1.3.8.8 Constraints

*No items available*

##### 1.1.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.1.3.8.10 Is Foreign Key

❌ No

##### 1.1.3.8.11 Precision

0

##### 1.1.3.8.12 Scale

0

#### 1.1.3.9.0 updatedAt

##### 1.1.3.9.1 Name

updatedAt

##### 1.1.3.9.2 Type

🔹 DateTime

##### 1.1.3.9.3 Is Required

✅ Yes

##### 1.1.3.9.4 Is Primary Key

❌ No

##### 1.1.3.9.5 Is Unique

❌ No

##### 1.1.3.9.6 Index Type

None

##### 1.1.3.9.7 Size

0

##### 1.1.3.9.8 Constraints

*No items available*

##### 1.1.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.1.3.9.10 Is Foreign Key

❌ No

##### 1.1.3.9.11 Precision

0

##### 1.1.3.9.12 Scale

0

### 1.1.4.0.0 Primary Keys

- userId

### 1.1.5.0.0 Unique Constraints

- {'name': 'UC_User_Email', 'columns': ['email']}

### 1.1.6.0.0 Indexes

#### 1.1.6.1.0 IX_User_Status

##### 1.1.6.1.1 Name

IX_User_Status

##### 1.1.6.1.2 Columns

- status

##### 1.1.6.1.3 Type

🔹 BTree

#### 1.1.6.2.0 IX_User_CreatedAt

##### 1.1.6.2.1 Name

IX_User_CreatedAt

##### 1.1.6.2.2 Columns

- createdAt

##### 1.1.6.2.3 Type

🔹 BTree

## 1.2.0.0.0 UserProfile

### 1.2.1.0.0 Name

UserProfile

### 1.2.2.0.0 Description

Stores detailed, publicly-visible information about a user. Linked one-to-one with the User entity. Cached in Redis to reduce database load. Full profile objects are stored using a write-through strategy.

### 1.2.3.0.0 Attributes

#### 1.2.3.1.0 userProfileId

##### 1.2.3.1.1 Name

userProfileId

##### 1.2.3.1.2 Type

🔹 Guid

##### 1.2.3.1.3 Is Required

✅ Yes

##### 1.2.3.1.4 Is Primary Key

✅ Yes

##### 1.2.3.1.5 Is Unique

✅ Yes

##### 1.2.3.1.6 Index Type

UniqueIndex

##### 1.2.3.1.7 Size

0

##### 1.2.3.1.8 Constraints

*No items available*

##### 1.2.3.1.9 Default Value

null

##### 1.2.3.1.10 Is Foreign Key

❌ No

##### 1.2.3.1.11 Precision

0

##### 1.2.3.1.12 Scale

0

#### 1.2.3.2.0 userId

##### 1.2.3.2.1 Name

userId

##### 1.2.3.2.2 Type

🔹 Guid

##### 1.2.3.2.3 Is Required

✅ Yes

##### 1.2.3.2.4 Is Primary Key

❌ No

##### 1.2.3.2.5 Is Unique

✅ Yes

##### 1.2.3.2.6 Index Type

UniqueIndex

##### 1.2.3.2.7 Size

0

##### 1.2.3.2.8 Constraints

*No items available*

##### 1.2.3.2.9 Default Value

null

##### 1.2.3.2.10 Is Foreign Key

✅ Yes

##### 1.2.3.2.11 Precision

0

##### 1.2.3.2.12 Scale

0

#### 1.2.3.3.0 fullName

##### 1.2.3.3.1 Name

fullName

##### 1.2.3.3.2 Type

🔹 VARCHAR

##### 1.2.3.3.3 Is Required

✅ Yes

##### 1.2.3.3.4 Is Primary Key

❌ No

##### 1.2.3.3.5 Is Unique

❌ No

##### 1.2.3.3.6 Index Type

Index

##### 1.2.3.3.7 Size

100

##### 1.2.3.3.8 Constraints

*No items available*

##### 1.2.3.3.9 Default Value

null

##### 1.2.3.3.10 Is Foreign Key

❌ No

##### 1.2.3.3.11 Precision

0

##### 1.2.3.3.12 Scale

0

#### 1.2.3.4.0 headline

##### 1.2.3.4.1 Name

headline

##### 1.2.3.4.2 Type

🔹 VARCHAR

##### 1.2.3.4.3 Is Required

❌ No

##### 1.2.3.4.4 Is Primary Key

❌ No

##### 1.2.3.4.5 Is Unique

❌ No

##### 1.2.3.4.6 Index Type

None

##### 1.2.3.4.7 Size

220

##### 1.2.3.4.8 Constraints

*No items available*

##### 1.2.3.4.9 Default Value

null

##### 1.2.3.4.10 Is Foreign Key

❌ No

##### 1.2.3.4.11 Precision

0

##### 1.2.3.4.12 Scale

0

#### 1.2.3.5.0 location

##### 1.2.3.5.1 Name

location

##### 1.2.3.5.2 Type

🔹 VARCHAR

##### 1.2.3.5.3 Is Required

❌ No

##### 1.2.3.5.4 Is Primary Key

❌ No

##### 1.2.3.5.5 Is Unique

❌ No

##### 1.2.3.5.6 Index Type

Index

##### 1.2.3.5.7 Size

255

##### 1.2.3.5.8 Constraints

*No items available*

##### 1.2.3.5.9 Default Value

null

##### 1.2.3.5.10 Is Foreign Key

❌ No

##### 1.2.3.5.11 Precision

0

##### 1.2.3.5.12 Scale

0

#### 1.2.3.6.0 contactInfoVisibility

##### 1.2.3.6.1 Name

contactInfoVisibility

##### 1.2.3.6.2 Type

🔹 JSONB

##### 1.2.3.6.3 Is Required

❌ No

##### 1.2.3.6.4 Is Primary Key

❌ No

##### 1.2.3.6.5 Is Unique

❌ No

##### 1.2.3.6.6 Index Type

None

##### 1.2.3.6.7 Size

0

##### 1.2.3.6.8 Constraints

*No items available*

##### 1.2.3.6.9 Default Value

null

##### 1.2.3.6.10 Is Foreign Key

❌ No

##### 1.2.3.6.11 Precision

0

##### 1.2.3.6.12 Scale

0

#### 1.2.3.7.0 profilePictureUrl

##### 1.2.3.7.1 Name

profilePictureUrl

##### 1.2.3.7.2 Type

🔹 VARCHAR

##### 1.2.3.7.3 Is Required

❌ No

##### 1.2.3.7.4 Is Primary Key

❌ No

##### 1.2.3.7.5 Is Unique

❌ No

##### 1.2.3.7.6 Index Type

None

##### 1.2.3.7.7 Size

2,048

##### 1.2.3.7.8 Constraints

*No items available*

##### 1.2.3.7.9 Default Value

null

##### 1.2.3.7.10 Is Foreign Key

❌ No

##### 1.2.3.7.11 Precision

0

##### 1.2.3.7.12 Scale

0

#### 1.2.3.8.0 bannerImageUrl

##### 1.2.3.8.1 Name

bannerImageUrl

##### 1.2.3.8.2 Type

🔹 VARCHAR

##### 1.2.3.8.3 Is Required

❌ No

##### 1.2.3.8.4 Is Primary Key

❌ No

##### 1.2.3.8.5 Is Unique

❌ No

##### 1.2.3.8.6 Index Type

None

##### 1.2.3.8.7 Size

2,048

##### 1.2.3.8.8 Constraints

*No items available*

##### 1.2.3.8.9 Default Value

null

##### 1.2.3.8.10 Is Foreign Key

❌ No

##### 1.2.3.8.11 Precision

0

##### 1.2.3.8.12 Scale

0

#### 1.2.3.9.0 customUrlSlug

##### 1.2.3.9.1 Name

customUrlSlug

##### 1.2.3.9.2 Type

🔹 VARCHAR

##### 1.2.3.9.3 Is Required

❌ No

##### 1.2.3.9.4 Is Primary Key

❌ No

##### 1.2.3.9.5 Is Unique

✅ Yes

##### 1.2.3.9.6 Index Type

UniqueIndex

##### 1.2.3.9.7 Size

100

##### 1.2.3.9.8 Constraints

*No items available*

##### 1.2.3.9.9 Default Value

null

##### 1.2.3.9.10 Is Foreign Key

❌ No

##### 1.2.3.9.11 Precision

0

##### 1.2.3.9.12 Scale

0

#### 1.2.3.10.0 visibility

##### 1.2.3.10.1 Name

visibility

##### 1.2.3.10.2 Type

🔹 VARCHAR

##### 1.2.3.10.3 Is Required

✅ Yes

##### 1.2.3.10.4 Is Primary Key

❌ No

##### 1.2.3.10.5 Is Unique

❌ No

##### 1.2.3.10.6 Index Type

Index

##### 1.2.3.10.7 Size

50

##### 1.2.3.10.8 Constraints

- ENUM('public', 'private')

##### 1.2.3.10.9 Default Value

public

##### 1.2.3.10.10 Is Foreign Key

❌ No

##### 1.2.3.10.11 Precision

0

##### 1.2.3.10.12 Scale

0

#### 1.2.3.11.0 createdAt

##### 1.2.3.11.1 Name

createdAt

##### 1.2.3.11.2 Type

🔹 DateTime

##### 1.2.3.11.3 Is Required

✅ Yes

##### 1.2.3.11.4 Is Primary Key

❌ No

##### 1.2.3.11.5 Is Unique

❌ No

##### 1.2.3.11.6 Index Type

None

##### 1.2.3.11.7 Size

0

##### 1.2.3.11.8 Constraints

*No items available*

##### 1.2.3.11.9 Default Value

CURRENT_TIMESTAMP

##### 1.2.3.11.10 Is Foreign Key

❌ No

##### 1.2.3.11.11 Precision

0

##### 1.2.3.11.12 Scale

0

#### 1.2.3.12.0 updatedAt

##### 1.2.3.12.1 Name

updatedAt

##### 1.2.3.12.2 Type

🔹 DateTime

##### 1.2.3.12.3 Is Required

✅ Yes

##### 1.2.3.12.4 Is Primary Key

❌ No

##### 1.2.3.12.5 Is Unique

❌ No

##### 1.2.3.12.6 Index Type

None

##### 1.2.3.12.7 Size

0

##### 1.2.3.12.8 Constraints

*No items available*

##### 1.2.3.12.9 Default Value

CURRENT_TIMESTAMP

##### 1.2.3.12.10 Is Foreign Key

❌ No

##### 1.2.3.12.11 Precision

0

##### 1.2.3.12.12 Scale

0

### 1.2.4.0.0 Primary Keys

- userProfileId

### 1.2.5.0.0 Unique Constraints

#### 1.2.5.1.0 UC_UserProfile_UserId

##### 1.2.5.1.1 Name

UC_UserProfile_UserId

##### 1.2.5.1.2 Columns

- userId

#### 1.2.5.2.0 UC_UserProfile_CustomUrlSlug

##### 1.2.5.2.1 Name

UC_UserProfile_CustomUrlSlug

##### 1.2.5.2.2 Columns

- customUrlSlug

### 1.2.6.0.0 Indexes

#### 1.2.6.1.0 IX_UserProfile_FullName

##### 1.2.6.1.1 Name

IX_UserProfile_FullName

##### 1.2.6.1.2 Columns

- fullName

##### 1.2.6.1.3 Type

🔹 BTree

#### 1.2.6.2.0 IX_UserProfile_Location

##### 1.2.6.2.1 Name

IX_UserProfile_Location

##### 1.2.6.2.2 Columns

- location

##### 1.2.6.2.3 Type

🔹 BTree

#### 1.2.6.3.0 IX_UserProfile_ContactInfo_GIN

##### 1.2.6.3.1 Name

IX_UserProfile_ContactInfo_GIN

##### 1.2.6.3.2 Columns

- contactInfoVisibility

##### 1.2.6.3.3 Type

🔹 GIN

## 1.3.0.0.0 WorkExperience

### 1.3.1.0.0 Name

WorkExperience

### 1.3.2.0.0 Description

Represents a single work experience entry on a user's profile.

### 1.3.3.0.0 Attributes

#### 1.3.3.1.0 workExperienceId

##### 1.3.3.1.1 Name

workExperienceId

##### 1.3.3.1.2 Type

🔹 Guid

##### 1.3.3.1.3 Is Required

✅ Yes

##### 1.3.3.1.4 Is Primary Key

✅ Yes

##### 1.3.3.1.5 Is Unique

✅ Yes

##### 1.3.3.1.6 Index Type

UniqueIndex

##### 1.3.3.1.7 Size

0

##### 1.3.3.1.8 Constraints

*No items available*

##### 1.3.3.1.9 Default Value

null

##### 1.3.3.1.10 Is Foreign Key

❌ No

##### 1.3.3.1.11 Precision

0

##### 1.3.3.1.12 Scale

0

#### 1.3.3.2.0 userProfileId

##### 1.3.3.2.1 Name

userProfileId

##### 1.3.3.2.2 Type

🔹 Guid

##### 1.3.3.2.3 Is Required

✅ Yes

##### 1.3.3.2.4 Is Primary Key

❌ No

##### 1.3.3.2.5 Is Unique

❌ No

##### 1.3.3.2.6 Index Type

Index

##### 1.3.3.2.7 Size

0

##### 1.3.3.2.8 Constraints

*No items available*

##### 1.3.3.2.9 Default Value

null

##### 1.3.3.2.10 Is Foreign Key

✅ Yes

##### 1.3.3.2.11 Precision

0

##### 1.3.3.2.12 Scale

0

#### 1.3.3.3.0 companyName

##### 1.3.3.3.1 Name

companyName

##### 1.3.3.3.2 Type

🔹 VARCHAR

##### 1.3.3.3.3 Is Required

✅ Yes

##### 1.3.3.3.4 Is Primary Key

❌ No

##### 1.3.3.3.5 Is Unique

❌ No

##### 1.3.3.3.6 Index Type

Index

##### 1.3.3.3.7 Size

255

##### 1.3.3.3.8 Constraints

*No items available*

##### 1.3.3.3.9 Default Value

null

##### 1.3.3.3.10 Is Foreign Key

❌ No

##### 1.3.3.3.11 Precision

0

##### 1.3.3.3.12 Scale

0

#### 1.3.3.4.0 title

##### 1.3.3.4.1 Name

title

##### 1.3.3.4.2 Type

🔹 VARCHAR

##### 1.3.3.4.3 Is Required

✅ Yes

##### 1.3.3.4.4 Is Primary Key

❌ No

##### 1.3.3.4.5 Is Unique

❌ No

##### 1.3.3.4.6 Index Type

Index

##### 1.3.3.4.7 Size

255

##### 1.3.3.4.8 Constraints

*No items available*

##### 1.3.3.4.9 Default Value

null

##### 1.3.3.4.10 Is Foreign Key

❌ No

##### 1.3.3.4.11 Precision

0

##### 1.3.3.4.12 Scale

0

#### 1.3.3.5.0 startDate

##### 1.3.3.5.1 Name

startDate

##### 1.3.3.5.2 Type

🔹 DATE

##### 1.3.3.5.3 Is Required

✅ Yes

##### 1.3.3.5.4 Is Primary Key

❌ No

##### 1.3.3.5.5 Is Unique

❌ No

##### 1.3.3.5.6 Index Type

None

##### 1.3.3.5.7 Size

0

##### 1.3.3.5.8 Constraints

*No items available*

##### 1.3.3.5.9 Default Value

null

##### 1.3.3.5.10 Is Foreign Key

❌ No

##### 1.3.3.5.11 Precision

0

##### 1.3.3.5.12 Scale

0

#### 1.3.3.6.0 endDate

##### 1.3.3.6.1 Name

endDate

##### 1.3.3.6.2 Type

🔹 DATE

##### 1.3.3.6.3 Is Required

❌ No

##### 1.3.3.6.4 Is Primary Key

❌ No

##### 1.3.3.6.5 Is Unique

❌ No

##### 1.3.3.6.6 Index Type

None

##### 1.3.3.6.7 Size

0

##### 1.3.3.6.8 Constraints

*No items available*

##### 1.3.3.6.9 Default Value

null

##### 1.3.3.6.10 Is Foreign Key

❌ No

##### 1.3.3.6.11 Precision

0

##### 1.3.3.6.12 Scale

0

#### 1.3.3.7.0 description

##### 1.3.3.7.1 Name

description

##### 1.3.3.7.2 Type

🔹 TEXT

##### 1.3.3.7.3 Is Required

❌ No

##### 1.3.3.7.4 Is Primary Key

❌ No

##### 1.3.3.7.5 Is Unique

❌ No

##### 1.3.3.7.6 Index Type

None

##### 1.3.3.7.7 Size

0

##### 1.3.3.7.8 Constraints

*No items available*

##### 1.3.3.7.9 Default Value

null

##### 1.3.3.7.10 Is Foreign Key

❌ No

##### 1.3.3.7.11 Precision

0

##### 1.3.3.7.12 Scale

0

#### 1.3.3.8.0 createdAt

##### 1.3.3.8.1 Name

createdAt

##### 1.3.3.8.2 Type

🔹 DateTime

##### 1.3.3.8.3 Is Required

✅ Yes

##### 1.3.3.8.4 Is Primary Key

❌ No

##### 1.3.3.8.5 Is Unique

❌ No

##### 1.3.3.8.6 Index Type

None

##### 1.3.3.8.7 Size

0

##### 1.3.3.8.8 Constraints

*No items available*

##### 1.3.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.3.3.8.10 Is Foreign Key

❌ No

##### 1.3.3.8.11 Precision

0

##### 1.3.3.8.12 Scale

0

#### 1.3.3.9.0 updatedAt

##### 1.3.3.9.1 Name

updatedAt

##### 1.3.3.9.2 Type

🔹 DateTime

##### 1.3.3.9.3 Is Required

✅ Yes

##### 1.3.3.9.4 Is Primary Key

❌ No

##### 1.3.3.9.5 Is Unique

❌ No

##### 1.3.3.9.6 Index Type

None

##### 1.3.3.9.7 Size

0

##### 1.3.3.9.8 Constraints

*No items available*

##### 1.3.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.3.3.9.10 Is Foreign Key

❌ No

##### 1.3.3.9.11 Precision

0

##### 1.3.3.9.12 Scale

0

### 1.3.4.0.0 Primary Keys

- workExperienceId

### 1.3.5.0.0 Unique Constraints

*No items available*

### 1.3.6.0.0 Indexes

- {'name': 'IX_WorkExperience_Profile_StartDate', 'columns': ['userProfileId', 'startDate DESC'], 'type': 'BTree'}

## 1.4.0.0.0 Education

### 1.4.1.0.0 Name

Education

### 1.4.2.0.0 Description

Represents a single education entry on a user's profile.

### 1.4.3.0.0 Attributes

#### 1.4.3.1.0 educationId

##### 1.4.3.1.1 Name

educationId

##### 1.4.3.1.2 Type

🔹 Guid

##### 1.4.3.1.3 Is Required

✅ Yes

##### 1.4.3.1.4 Is Primary Key

✅ Yes

##### 1.4.3.1.5 Is Unique

✅ Yes

##### 1.4.3.1.6 Index Type

UniqueIndex

##### 1.4.3.1.7 Size

0

##### 1.4.3.1.8 Constraints

*No items available*

##### 1.4.3.1.9 Default Value

null

##### 1.4.3.1.10 Is Foreign Key

❌ No

##### 1.4.3.1.11 Precision

0

##### 1.4.3.1.12 Scale

0

#### 1.4.3.2.0 userProfileId

##### 1.4.3.2.1 Name

userProfileId

##### 1.4.3.2.2 Type

🔹 Guid

##### 1.4.3.2.3 Is Required

✅ Yes

##### 1.4.3.2.4 Is Primary Key

❌ No

##### 1.4.3.2.5 Is Unique

❌ No

##### 1.4.3.2.6 Index Type

Index

##### 1.4.3.2.7 Size

0

##### 1.4.3.2.8 Constraints

*No items available*

##### 1.4.3.2.9 Default Value

null

##### 1.4.3.2.10 Is Foreign Key

✅ Yes

##### 1.4.3.2.11 Precision

0

##### 1.4.3.2.12 Scale

0

#### 1.4.3.3.0 institutionName

##### 1.4.3.3.1 Name

institutionName

##### 1.4.3.3.2 Type

🔹 VARCHAR

##### 1.4.3.3.3 Is Required

✅ Yes

##### 1.4.3.3.4 Is Primary Key

❌ No

##### 1.4.3.3.5 Is Unique

❌ No

##### 1.4.3.3.6 Index Type

Index

##### 1.4.3.3.7 Size

255

##### 1.4.3.3.8 Constraints

*No items available*

##### 1.4.3.3.9 Default Value

null

##### 1.4.3.3.10 Is Foreign Key

❌ No

##### 1.4.3.3.11 Precision

0

##### 1.4.3.3.12 Scale

0

#### 1.4.3.4.0 degree

##### 1.4.3.4.1 Name

degree

##### 1.4.3.4.2 Type

🔹 VARCHAR

##### 1.4.3.4.3 Is Required

❌ No

##### 1.4.3.4.4 Is Primary Key

❌ No

##### 1.4.3.4.5 Is Unique

❌ No

##### 1.4.3.4.6 Index Type

None

##### 1.4.3.4.7 Size

255

##### 1.4.3.4.8 Constraints

*No items available*

##### 1.4.3.4.9 Default Value

null

##### 1.4.3.4.10 Is Foreign Key

❌ No

##### 1.4.3.4.11 Precision

0

##### 1.4.3.4.12 Scale

0

#### 1.4.3.5.0 fieldOfStudy

##### 1.4.3.5.1 Name

fieldOfStudy

##### 1.4.3.5.2 Type

🔹 VARCHAR

##### 1.4.3.5.3 Is Required

❌ No

##### 1.4.3.5.4 Is Primary Key

❌ No

##### 1.4.3.5.5 Is Unique

❌ No

##### 1.4.3.5.6 Index Type

None

##### 1.4.3.5.7 Size

255

##### 1.4.3.5.8 Constraints

*No items available*

##### 1.4.3.5.9 Default Value

null

##### 1.4.3.5.10 Is Foreign Key

❌ No

##### 1.4.3.5.11 Precision

0

##### 1.4.3.5.12 Scale

0

#### 1.4.3.6.0 startDate

##### 1.4.3.6.1 Name

startDate

##### 1.4.3.6.2 Type

🔹 DATE

##### 1.4.3.6.3 Is Required

✅ Yes

##### 1.4.3.6.4 Is Primary Key

❌ No

##### 1.4.3.6.5 Is Unique

❌ No

##### 1.4.3.6.6 Index Type

None

##### 1.4.3.6.7 Size

0

##### 1.4.3.6.8 Constraints

*No items available*

##### 1.4.3.6.9 Default Value

null

##### 1.4.3.6.10 Is Foreign Key

❌ No

##### 1.4.3.6.11 Precision

0

##### 1.4.3.6.12 Scale

0

#### 1.4.3.7.0 endDate

##### 1.4.3.7.1 Name

endDate

##### 1.4.3.7.2 Type

🔹 DATE

##### 1.4.3.7.3 Is Required

❌ No

##### 1.4.3.7.4 Is Primary Key

❌ No

##### 1.4.3.7.5 Is Unique

❌ No

##### 1.4.3.7.6 Index Type

None

##### 1.4.3.7.7 Size

0

##### 1.4.3.7.8 Constraints

*No items available*

##### 1.4.3.7.9 Default Value

null

##### 1.4.3.7.10 Is Foreign Key

❌ No

##### 1.4.3.7.11 Precision

0

##### 1.4.3.7.12 Scale

0

#### 1.4.3.8.0 createdAt

##### 1.4.3.8.1 Name

createdAt

##### 1.4.3.8.2 Type

🔹 DateTime

##### 1.4.3.8.3 Is Required

✅ Yes

##### 1.4.3.8.4 Is Primary Key

❌ No

##### 1.4.3.8.5 Is Unique

❌ No

##### 1.4.3.8.6 Index Type

None

##### 1.4.3.8.7 Size

0

##### 1.4.3.8.8 Constraints

*No items available*

##### 1.4.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.4.3.8.10 Is Foreign Key

❌ No

##### 1.4.3.8.11 Precision

0

##### 1.4.3.8.12 Scale

0

#### 1.4.3.9.0 updatedAt

##### 1.4.3.9.1 Name

updatedAt

##### 1.4.3.9.2 Type

🔹 DateTime

##### 1.4.3.9.3 Is Required

✅ Yes

##### 1.4.3.9.4 Is Primary Key

❌ No

##### 1.4.3.9.5 Is Unique

❌ No

##### 1.4.3.9.6 Index Type

None

##### 1.4.3.9.7 Size

0

##### 1.4.3.9.8 Constraints

*No items available*

##### 1.4.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.4.3.9.10 Is Foreign Key

❌ No

##### 1.4.3.9.11 Precision

0

##### 1.4.3.9.12 Scale

0

### 1.4.4.0.0 Primary Keys

- educationId

### 1.4.5.0.0 Unique Constraints

*No items available*

### 1.4.6.0.0 Indexes

- {'name': 'IX_Education_UserProfileId', 'columns': ['userProfileId'], 'type': 'BTree'}

## 1.5.0.0.0 Skill

### 1.5.1.0.0 Name

Skill

### 1.5.2.0.0 Description

A master table of all unique professional skills that can be added to profiles.

### 1.5.3.0.0 Attributes

#### 1.5.3.1.0 skillId

##### 1.5.3.1.1 Name

skillId

##### 1.5.3.1.2 Type

🔹 Guid

##### 1.5.3.1.3 Is Required

✅ Yes

##### 1.5.3.1.4 Is Primary Key

✅ Yes

##### 1.5.3.1.5 Is Unique

✅ Yes

##### 1.5.3.1.6 Index Type

UniqueIndex

##### 1.5.3.1.7 Size

0

##### 1.5.3.1.8 Constraints

*No items available*

##### 1.5.3.1.9 Default Value

null

##### 1.5.3.1.10 Is Foreign Key

❌ No

##### 1.5.3.1.11 Precision

0

##### 1.5.3.1.12 Scale

0

#### 1.5.3.2.0 skillName

##### 1.5.3.2.1 Name

skillName

##### 1.5.3.2.2 Type

🔹 VARCHAR

##### 1.5.3.2.3 Is Required

✅ Yes

##### 1.5.3.2.4 Is Primary Key

❌ No

##### 1.5.3.2.5 Is Unique

✅ Yes

##### 1.5.3.2.6 Index Type

UniqueIndex

##### 1.5.3.2.7 Size

100

##### 1.5.3.2.8 Constraints

*No items available*

##### 1.5.3.2.9 Default Value

null

##### 1.5.3.2.10 Is Foreign Key

❌ No

##### 1.5.3.2.11 Precision

0

##### 1.5.3.2.12 Scale

0

#### 1.5.3.3.0 createdAt

##### 1.5.3.3.1 Name

createdAt

##### 1.5.3.3.2 Type

🔹 DateTime

##### 1.5.3.3.3 Is Required

✅ Yes

##### 1.5.3.3.4 Is Primary Key

❌ No

##### 1.5.3.3.5 Is Unique

❌ No

##### 1.5.3.3.6 Index Type

None

##### 1.5.3.3.7 Size

0

##### 1.5.3.3.8 Constraints

*No items available*

##### 1.5.3.3.9 Default Value

CURRENT_TIMESTAMP

##### 1.5.3.3.10 Is Foreign Key

❌ No

##### 1.5.3.3.11 Precision

0

##### 1.5.3.3.12 Scale

0

### 1.5.4.0.0 Primary Keys

- skillId

### 1.5.5.0.0 Unique Constraints

- {'name': 'UC_Skill_SkillName', 'columns': ['skillName']}

### 1.5.6.0.0 Indexes

*No items available*

## 1.6.0.0.0 UserProfileSkill

### 1.6.1.0.0 Name

UserProfileSkill

### 1.6.2.0.0 Description

Join table to create a many-to-many relationship between UserProfiles and Skills.

### 1.6.3.0.0 Attributes

#### 1.6.3.1.0 userProfileId

##### 1.6.3.1.1 Name

userProfileId

##### 1.6.3.1.2 Type

🔹 Guid

##### 1.6.3.1.3 Is Required

✅ Yes

##### 1.6.3.1.4 Is Primary Key

✅ Yes

##### 1.6.3.1.5 Is Unique

❌ No

##### 1.6.3.1.6 Index Type

Index

##### 1.6.3.1.7 Size

0

##### 1.6.3.1.8 Constraints

*No items available*

##### 1.6.3.1.9 Default Value

null

##### 1.6.3.1.10 Is Foreign Key

✅ Yes

##### 1.6.3.1.11 Precision

0

##### 1.6.3.1.12 Scale

0

#### 1.6.3.2.0 skillId

##### 1.6.3.2.1 Name

skillId

##### 1.6.3.2.2 Type

🔹 Guid

##### 1.6.3.2.3 Is Required

✅ Yes

##### 1.6.3.2.4 Is Primary Key

✅ Yes

##### 1.6.3.2.5 Is Unique

❌ No

##### 1.6.3.2.6 Index Type

Index

##### 1.6.3.2.7 Size

0

##### 1.6.3.2.8 Constraints

*No items available*

##### 1.6.3.2.9 Default Value

null

##### 1.6.3.2.10 Is Foreign Key

✅ Yes

##### 1.6.3.2.11 Precision

0

##### 1.6.3.2.12 Scale

0

#### 1.6.3.3.0 endorsementCount

##### 1.6.3.3.1 Name

endorsementCount

##### 1.6.3.3.2 Type

🔹 INT

##### 1.6.3.3.3 Is Required

✅ Yes

##### 1.6.3.3.4 Is Primary Key

❌ No

##### 1.6.3.3.5 Is Unique

❌ No

##### 1.6.3.3.6 Index Type

None

##### 1.6.3.3.7 Size

0

##### 1.6.3.3.8 Constraints

*No items available*

##### 1.6.3.3.9 Default Value

0

##### 1.6.3.3.10 Is Foreign Key

❌ No

##### 1.6.3.3.11 Precision

0

##### 1.6.3.3.12 Scale

0

#### 1.6.3.4.0 createdAt

##### 1.6.3.4.1 Name

createdAt

##### 1.6.3.4.2 Type

🔹 DateTime

##### 1.6.3.4.3 Is Required

✅ Yes

##### 1.6.3.4.4 Is Primary Key

❌ No

##### 1.6.3.4.5 Is Unique

❌ No

##### 1.6.3.4.6 Index Type

None

##### 1.6.3.4.7 Size

0

##### 1.6.3.4.8 Constraints

*No items available*

##### 1.6.3.4.9 Default Value

CURRENT_TIMESTAMP

##### 1.6.3.4.10 Is Foreign Key

❌ No

##### 1.6.3.4.11 Precision

0

##### 1.6.3.4.12 Scale

0

### 1.6.4.0.0 Primary Keys

- userProfileId
- skillId

### 1.6.5.0.0 Unique Constraints

*No items available*

### 1.6.6.0.0 Indexes

- {'name': 'IX_UserProfileSkill_SkillId', 'columns': ['skillId'], 'type': 'BTree'}

## 1.7.0.0.0 SkillEndorsement

### 1.7.1.0.0 Name

SkillEndorsement

### 1.7.2.0.0 Description

Records an endorsement given by one user for a specific skill on another user's profile.

### 1.7.3.0.0 Attributes

#### 1.7.3.1.0 skillEndorsementId

##### 1.7.3.1.1 Name

skillEndorsementId

##### 1.7.3.1.2 Type

🔹 Guid

##### 1.7.3.1.3 Is Required

✅ Yes

##### 1.7.3.1.4 Is Primary Key

✅ Yes

##### 1.7.3.1.5 Is Unique

✅ Yes

##### 1.7.3.1.6 Index Type

UniqueIndex

##### 1.7.3.1.7 Size

0

##### 1.7.3.1.8 Constraints

*No items available*

##### 1.7.3.1.9 Default Value

null

##### 1.7.3.1.10 Is Foreign Key

❌ No

##### 1.7.3.1.11 Precision

0

##### 1.7.3.1.12 Scale

0

#### 1.7.3.2.0 userProfileId

##### 1.7.3.2.1 Name

userProfileId

##### 1.7.3.2.2 Type

🔹 Guid

##### 1.7.3.2.3 Is Required

✅ Yes

##### 1.7.3.2.4 Is Primary Key

❌ No

##### 1.7.3.2.5 Is Unique

❌ No

##### 1.7.3.2.6 Index Type

Index

##### 1.7.3.2.7 Size

0

##### 1.7.3.2.8 Constraints

*No items available*

##### 1.7.3.2.9 Default Value

null

##### 1.7.3.2.10 Is Foreign Key

✅ Yes

##### 1.7.3.2.11 Precision

0

##### 1.7.3.2.12 Scale

0

#### 1.7.3.3.0 skillId

##### 1.7.3.3.1 Name

skillId

##### 1.7.3.3.2 Type

🔹 Guid

##### 1.7.3.3.3 Is Required

✅ Yes

##### 1.7.3.3.4 Is Primary Key

❌ No

##### 1.7.3.3.5 Is Unique

❌ No

##### 1.7.3.3.6 Index Type

Index

##### 1.7.3.3.7 Size

0

##### 1.7.3.3.8 Constraints

*No items available*

##### 1.7.3.3.9 Default Value

null

##### 1.7.3.3.10 Is Foreign Key

✅ Yes

##### 1.7.3.3.11 Precision

0

##### 1.7.3.3.12 Scale

0

#### 1.7.3.4.0 endorserUserId

##### 1.7.3.4.1 Name

endorserUserId

##### 1.7.3.4.2 Type

🔹 Guid

##### 1.7.3.4.3 Is Required

✅ Yes

##### 1.7.3.4.4 Is Primary Key

❌ No

##### 1.7.3.4.5 Is Unique

❌ No

##### 1.7.3.4.6 Index Type

Index

##### 1.7.3.4.7 Size

0

##### 1.7.3.4.8 Constraints

*No items available*

##### 1.7.3.4.9 Default Value

null

##### 1.7.3.4.10 Is Foreign Key

✅ Yes

##### 1.7.3.4.11 Precision

0

##### 1.7.3.4.12 Scale

0

#### 1.7.3.5.0 createdAt

##### 1.7.3.5.1 Name

createdAt

##### 1.7.3.5.2 Type

🔹 DateTime

##### 1.7.3.5.3 Is Required

✅ Yes

##### 1.7.3.5.4 Is Primary Key

❌ No

##### 1.7.3.5.5 Is Unique

❌ No

##### 1.7.3.5.6 Index Type

None

##### 1.7.3.5.7 Size

0

##### 1.7.3.5.8 Constraints

*No items available*

##### 1.7.3.5.9 Default Value

CURRENT_TIMESTAMP

##### 1.7.3.5.10 Is Foreign Key

❌ No

##### 1.7.3.5.11 Precision

0

##### 1.7.3.5.12 Scale

0

### 1.7.4.0.0 Primary Keys

- skillEndorsementId

### 1.7.5.0.0 Unique Constraints

- {'name': 'UC_SkillEndorsement_Profile_Skill_Endorser', 'columns': ['userProfileId', 'skillId', 'endorserUserId']}

### 1.7.6.0.0 Indexes

- {'name': 'IX_SkillEndorsement_Profile_Skill', 'columns': ['userProfileId', 'skillId'], 'type': 'BTree'}

## 1.8.0.0.0 Connection

### 1.8.1.0.0 Name

Connection

### 1.8.2.0.0 Description

Represents the relationship between two users. Design enforces that requesterId stores the smaller User ID and addresseeId the larger one to simplify lookups. A user's list of first-degree connection IDs is cached in a Redis Set for near-instantaneous authorization checks.

### 1.8.3.0.0 Attributes

#### 1.8.3.1.0 requesterId

##### 1.8.3.1.1 Name

requesterId

##### 1.8.3.1.2 Type

🔹 Guid

##### 1.8.3.1.3 Is Required

✅ Yes

##### 1.8.3.1.4 Is Primary Key

✅ Yes

##### 1.8.3.1.5 Is Unique

❌ No

##### 1.8.3.1.6 Index Type

Index

##### 1.8.3.1.7 Size

0

##### 1.8.3.1.8 Constraints

*No items available*

##### 1.8.3.1.9 Default Value

null

##### 1.8.3.1.10 Is Foreign Key

✅ Yes

##### 1.8.3.1.11 Precision

0

##### 1.8.3.1.12 Scale

0

#### 1.8.3.2.0 addresseeId

##### 1.8.3.2.1 Name

addresseeId

##### 1.8.3.2.2 Type

🔹 Guid

##### 1.8.3.2.3 Is Required

✅ Yes

##### 1.8.3.2.4 Is Primary Key

✅ Yes

##### 1.8.3.2.5 Is Unique

❌ No

##### 1.8.3.2.6 Index Type

Index

##### 1.8.3.2.7 Size

0

##### 1.8.3.2.8 Constraints

*No items available*

##### 1.8.3.2.9 Default Value

null

##### 1.8.3.2.10 Is Foreign Key

✅ Yes

##### 1.8.3.2.11 Precision

0

##### 1.8.3.2.12 Scale

0

#### 1.8.3.3.0 status

##### 1.8.3.3.1 Name

status

##### 1.8.3.3.2 Type

🔹 VARCHAR

##### 1.8.3.3.3 Is Required

✅ Yes

##### 1.8.3.3.4 Is Primary Key

❌ No

##### 1.8.3.3.5 Is Unique

❌ No

##### 1.8.3.3.6 Index Type

Index

##### 1.8.3.3.7 Size

50

##### 1.8.3.3.8 Constraints

- ENUM('pending', 'accepted')

##### 1.8.3.3.9 Default Value

pending

##### 1.8.3.3.10 Is Foreign Key

❌ No

##### 1.8.3.3.11 Precision

0

##### 1.8.3.3.12 Scale

0

#### 1.8.3.4.0 personalizedMessage

##### 1.8.3.4.1 Name

personalizedMessage

##### 1.8.3.4.2 Type

🔹 VARCHAR

##### 1.8.3.4.3 Is Required

❌ No

##### 1.8.3.4.4 Is Primary Key

❌ No

##### 1.8.3.4.5 Is Unique

❌ No

##### 1.8.3.4.6 Index Type

None

##### 1.8.3.4.7 Size

300

##### 1.8.3.4.8 Constraints

*No items available*

##### 1.8.3.4.9 Default Value

null

##### 1.8.3.4.10 Is Foreign Key

❌ No

##### 1.8.3.4.11 Precision

0

##### 1.8.3.4.12 Scale

0

#### 1.8.3.5.0 createdAt

##### 1.8.3.5.1 Name

createdAt

##### 1.8.3.5.2 Type

🔹 DateTime

##### 1.8.3.5.3 Is Required

✅ Yes

##### 1.8.3.5.4 Is Primary Key

❌ No

##### 1.8.3.5.5 Is Unique

❌ No

##### 1.8.3.5.6 Index Type

None

##### 1.8.3.5.7 Size

0

##### 1.8.3.5.8 Constraints

*No items available*

##### 1.8.3.5.9 Default Value

CURRENT_TIMESTAMP

##### 1.8.3.5.10 Is Foreign Key

❌ No

##### 1.8.3.5.11 Precision

0

##### 1.8.3.5.12 Scale

0

#### 1.8.3.6.0 updatedAt

##### 1.8.3.6.1 Name

updatedAt

##### 1.8.3.6.2 Type

🔹 DateTime

##### 1.8.3.6.3 Is Required

✅ Yes

##### 1.8.3.6.4 Is Primary Key

❌ No

##### 1.8.3.6.5 Is Unique

❌ No

##### 1.8.3.6.6 Index Type

None

##### 1.8.3.6.7 Size

0

##### 1.8.3.6.8 Constraints

*No items available*

##### 1.8.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.8.3.6.10 Is Foreign Key

❌ No

##### 1.8.3.6.11 Precision

0

##### 1.8.3.6.12 Scale

0

### 1.8.4.0.0 Primary Keys

- requesterId
- addresseeId

### 1.8.5.0.0 Unique Constraints

*No items available*

### 1.8.6.0.0 Indexes

#### 1.8.6.1.0 IX_Connection_AddresseeId_Status

##### 1.8.6.1.1 Name

IX_Connection_AddresseeId_Status

##### 1.8.6.1.2 Columns

- addresseeId
- status

##### 1.8.6.1.3 Type

🔹 BTree

#### 1.8.6.2.0 IX_Connection_Requester_Status

##### 1.8.6.2.1 Name

IX_Connection_Requester_Status

##### 1.8.6.2.2 Columns

- requesterId
- status

##### 1.8.6.2.3 Type

🔹 BTree

## 1.9.0.0.0 Post

### 1.9.1.0.0 Name

Post

### 1.9.2.0.0 Description

Represents a single post created by a user, containing text and other media.

### 1.9.3.0.0 Attributes

#### 1.9.3.1.0 postId

##### 1.9.3.1.1 Name

postId

##### 1.9.3.1.2 Type

🔹 Guid

##### 1.9.3.1.3 Is Required

✅ Yes

##### 1.9.3.1.4 Is Primary Key

✅ Yes

##### 1.9.3.1.5 Is Unique

✅ Yes

##### 1.9.3.1.6 Index Type

UniqueIndex

##### 1.9.3.1.7 Size

0

##### 1.9.3.1.8 Constraints

*No items available*

##### 1.9.3.1.9 Default Value

null

##### 1.9.3.1.10 Is Foreign Key

❌ No

##### 1.9.3.1.11 Precision

0

##### 1.9.3.1.12 Scale

0

#### 1.9.3.2.0 authorId

##### 1.9.3.2.1 Name

authorId

##### 1.9.3.2.2 Type

🔹 Guid

##### 1.9.3.2.3 Is Required

✅ Yes

##### 1.9.3.2.4 Is Primary Key

❌ No

##### 1.9.3.2.5 Is Unique

❌ No

##### 1.9.3.2.6 Index Type

Index

##### 1.9.3.2.7 Size

0

##### 1.9.3.2.8 Constraints

*No items available*

##### 1.9.3.2.9 Default Value

null

##### 1.9.3.2.10 Is Foreign Key

✅ Yes

##### 1.9.3.2.11 Precision

0

##### 1.9.3.2.12 Scale

0

#### 1.9.3.3.0 textContent

##### 1.9.3.3.1 Name

textContent

##### 1.9.3.3.2 Type

🔹 TEXT

##### 1.9.3.3.3 Is Required

❌ No

##### 1.9.3.3.4 Is Primary Key

❌ No

##### 1.9.3.3.5 Is Unique

❌ No

##### 1.9.3.3.6 Index Type

None

##### 1.9.3.3.7 Size

0

##### 1.9.3.3.8 Constraints

- MAX_LENGTH(3000)

##### 1.9.3.3.9 Default Value

null

##### 1.9.3.3.10 Is Foreign Key

❌ No

##### 1.9.3.3.11 Precision

0

##### 1.9.3.3.12 Scale

0

#### 1.9.3.4.0 linkPreviewData

##### 1.9.3.4.1 Name

linkPreviewData

##### 1.9.3.4.2 Type

🔹 JSONB

##### 1.9.3.4.3 Is Required

❌ No

##### 1.9.3.4.4 Is Primary Key

❌ No

##### 1.9.3.4.5 Is Unique

❌ No

##### 1.9.3.4.6 Index Type

None

##### 1.9.3.4.7 Size

0

##### 1.9.3.4.8 Constraints

*No items available*

##### 1.9.3.4.9 Default Value

null

##### 1.9.3.4.10 Is Foreign Key

❌ No

##### 1.9.3.4.11 Precision

0

##### 1.9.3.4.12 Scale

0

#### 1.9.3.5.0 reactionCount

##### 1.9.3.5.1 Name

reactionCount

##### 1.9.3.5.2 Type

🔹 INT

##### 1.9.3.5.3 Is Required

✅ Yes

##### 1.9.3.5.4 Is Primary Key

❌ No

##### 1.9.3.5.5 Is Unique

❌ No

##### 1.9.3.5.6 Index Type

None

##### 1.9.3.5.7 Size

0

##### 1.9.3.5.8 Constraints

*No items available*

##### 1.9.3.5.9 Default Value

0

##### 1.9.3.5.10 Is Foreign Key

❌ No

##### 1.9.3.5.11 Precision

0

##### 1.9.3.5.12 Scale

0

#### 1.9.3.6.0 commentCount

##### 1.9.3.6.1 Name

commentCount

##### 1.9.3.6.2 Type

🔹 INT

##### 1.9.3.6.3 Is Required

✅ Yes

##### 1.9.3.6.4 Is Primary Key

❌ No

##### 1.9.3.6.5 Is Unique

❌ No

##### 1.9.3.6.6 Index Type

None

##### 1.9.3.6.7 Size

0

##### 1.9.3.6.8 Constraints

*No items available*

##### 1.9.3.6.9 Default Value

0

##### 1.9.3.6.10 Is Foreign Key

❌ No

##### 1.9.3.6.11 Precision

0

##### 1.9.3.6.12 Scale

0

#### 1.9.3.7.0 createdAt

##### 1.9.3.7.1 Name

createdAt

##### 1.9.3.7.2 Type

🔹 DateTime

##### 1.9.3.7.3 Is Required

✅ Yes

##### 1.9.3.7.4 Is Primary Key

❌ No

##### 1.9.3.7.5 Is Unique

❌ No

##### 1.9.3.7.6 Index Type

Index

##### 1.9.3.7.7 Size

0

##### 1.9.3.7.8 Constraints

*No items available*

##### 1.9.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.9.3.7.10 Is Foreign Key

❌ No

##### 1.9.3.7.11 Precision

0

##### 1.9.3.7.12 Scale

0

#### 1.9.3.8.0 updatedAt

##### 1.9.3.8.1 Name

updatedAt

##### 1.9.3.8.2 Type

🔹 DateTime

##### 1.9.3.8.3 Is Required

✅ Yes

##### 1.9.3.8.4 Is Primary Key

❌ No

##### 1.9.3.8.5 Is Unique

❌ No

##### 1.9.3.8.6 Index Type

None

##### 1.9.3.8.7 Size

0

##### 1.9.3.8.8 Constraints

*No items available*

##### 1.9.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.9.3.8.10 Is Foreign Key

❌ No

##### 1.9.3.8.11 Precision

0

##### 1.9.3.8.12 Scale

0

#### 1.9.3.9.0 deletedAt

##### 1.9.3.9.1 Name

deletedAt

##### 1.9.3.9.2 Type

🔹 DateTime

##### 1.9.3.9.3 Is Required

❌ No

##### 1.9.3.9.4 Is Primary Key

❌ No

##### 1.9.3.9.5 Is Unique

❌ No

##### 1.9.3.9.6 Index Type

Index

##### 1.9.3.9.7 Size

0

##### 1.9.3.9.8 Constraints

*No items available*

##### 1.9.3.9.9 Default Value

null

##### 1.9.3.9.10 Is Foreign Key

❌ No

##### 1.9.3.9.11 Precision

0

##### 1.9.3.9.12 Scale

0

### 1.9.4.0.0 Primary Keys

- postId

### 1.9.5.0.0 Unique Constraints

*No items available*

### 1.9.6.0.0 Indexes

- {'name': 'IX_Post_Author_Active_CreatedAt', 'columns': ['authorId', 'createdAt DESC'], 'type': 'BTree', 'condition': 'WHERE deletedAt IS NULL'}

## 1.10.0.0.0 Media

### 1.10.1.0.0 Name

Media

### 1.10.2.0.0 Description

Stores metadata about user-uploaded files, such as images for posts.

### 1.10.3.0.0 Attributes

#### 1.10.3.1.0 mediaId

##### 1.10.3.1.1 Name

mediaId

##### 1.10.3.1.2 Type

🔹 Guid

##### 1.10.3.1.3 Is Required

✅ Yes

##### 1.10.3.1.4 Is Primary Key

✅ Yes

##### 1.10.3.1.5 Is Unique

✅ Yes

##### 1.10.3.1.6 Index Type

UniqueIndex

##### 1.10.3.1.7 Size

0

##### 1.10.3.1.8 Constraints

*No items available*

##### 1.10.3.1.9 Default Value

null

##### 1.10.3.1.10 Is Foreign Key

❌ No

##### 1.10.3.1.11 Precision

0

##### 1.10.3.1.12 Scale

0

#### 1.10.3.2.0 uploaderId

##### 1.10.3.2.1 Name

uploaderId

##### 1.10.3.2.2 Type

🔹 Guid

##### 1.10.3.2.3 Is Required

✅ Yes

##### 1.10.3.2.4 Is Primary Key

❌ No

##### 1.10.3.2.5 Is Unique

❌ No

##### 1.10.3.2.6 Index Type

Index

##### 1.10.3.2.7 Size

0

##### 1.10.3.2.8 Constraints

*No items available*

##### 1.10.3.2.9 Default Value

null

##### 1.10.3.2.10 Is Foreign Key

✅ Yes

##### 1.10.3.2.11 Precision

0

##### 1.10.3.2.12 Scale

0

#### 1.10.3.3.0 mediaType

##### 1.10.3.3.1 Name

mediaType

##### 1.10.3.3.2 Type

🔹 VARCHAR

##### 1.10.3.3.3 Is Required

✅ Yes

##### 1.10.3.3.4 Is Primary Key

❌ No

##### 1.10.3.3.5 Is Unique

❌ No

##### 1.10.3.3.6 Index Type

None

##### 1.10.3.3.7 Size

50

##### 1.10.3.3.8 Constraints

- ENUM('image')

##### 1.10.3.3.9 Default Value

image

##### 1.10.3.3.10 Is Foreign Key

❌ No

##### 1.10.3.3.11 Precision

0

##### 1.10.3.3.12 Scale

0

#### 1.10.3.4.0 fileFormat

##### 1.10.3.4.1 Name

fileFormat

##### 1.10.3.4.2 Type

🔹 VARCHAR

##### 1.10.3.4.3 Is Required

✅ Yes

##### 1.10.3.4.4 Is Primary Key

❌ No

##### 1.10.3.4.5 Is Unique

❌ No

##### 1.10.3.4.6 Index Type

None

##### 1.10.3.4.7 Size

10

##### 1.10.3.4.8 Constraints

- ENUM('jpeg', 'png')

##### 1.10.3.4.9 Default Value

null

##### 1.10.3.4.10 Is Foreign Key

❌ No

##### 1.10.3.4.11 Precision

0

##### 1.10.3.4.12 Scale

0

#### 1.10.3.5.0 fileSizeBytes

##### 1.10.3.5.1 Name

fileSizeBytes

##### 1.10.3.5.2 Type

🔹 INT

##### 1.10.3.5.3 Is Required

✅ Yes

##### 1.10.3.5.4 Is Primary Key

❌ No

##### 1.10.3.5.5 Is Unique

❌ No

##### 1.10.3.5.6 Index Type

None

##### 1.10.3.5.7 Size

0

##### 1.10.3.5.8 Constraints

*No items available*

##### 1.10.3.5.9 Default Value

0

##### 1.10.3.5.10 Is Foreign Key

❌ No

##### 1.10.3.5.11 Precision

0

##### 1.10.3.5.12 Scale

0

#### 1.10.3.6.0 storageUrl

##### 1.10.3.6.1 Name

storageUrl

##### 1.10.3.6.2 Type

🔹 VARCHAR

##### 1.10.3.6.3 Is Required

✅ Yes

##### 1.10.3.6.4 Is Primary Key

❌ No

##### 1.10.3.6.5 Is Unique

❌ No

##### 1.10.3.6.6 Index Type

None

##### 1.10.3.6.7 Size

2,048

##### 1.10.3.6.8 Constraints

*No items available*

##### 1.10.3.6.9 Default Value

null

##### 1.10.3.6.10 Is Foreign Key

❌ No

##### 1.10.3.6.11 Precision

0

##### 1.10.3.6.12 Scale

0

#### 1.10.3.7.0 createdAt

##### 1.10.3.7.1 Name

createdAt

##### 1.10.3.7.2 Type

🔹 DateTime

##### 1.10.3.7.3 Is Required

✅ Yes

##### 1.10.3.7.4 Is Primary Key

❌ No

##### 1.10.3.7.5 Is Unique

❌ No

##### 1.10.3.7.6 Index Type

None

##### 1.10.3.7.7 Size

0

##### 1.10.3.7.8 Constraints

*No items available*

##### 1.10.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.10.3.7.10 Is Foreign Key

❌ No

##### 1.10.3.7.11 Precision

0

##### 1.10.3.7.12 Scale

0

### 1.10.4.0.0 Primary Keys

- mediaId

### 1.10.5.0.0 Unique Constraints

*No items available*

### 1.10.6.0.0 Indexes

- {'name': 'IX_Media_UploaderId', 'columns': ['uploaderId'], 'type': 'BTree'}

## 1.11.0.0.0 PostMedia

### 1.11.1.0.0 Name

PostMedia

### 1.11.2.0.0 Description

Join table to link multiple Media items to a single Post.

### 1.11.3.0.0 Attributes

#### 1.11.3.1.0 postMediaId

##### 1.11.3.1.1 Name

postMediaId

##### 1.11.3.1.2 Type

🔹 Guid

##### 1.11.3.1.3 Is Required

✅ Yes

##### 1.11.3.1.4 Is Primary Key

✅ Yes

##### 1.11.3.1.5 Is Unique

✅ Yes

##### 1.11.3.1.6 Index Type

UniqueIndex

##### 1.11.3.1.7 Size

0

##### 1.11.3.1.8 Constraints

*No items available*

##### 1.11.3.1.9 Default Value

null

##### 1.11.3.1.10 Is Foreign Key

❌ No

##### 1.11.3.1.11 Precision

0

##### 1.11.3.1.12 Scale

0

#### 1.11.3.2.0 postId

##### 1.11.3.2.1 Name

postId

##### 1.11.3.2.2 Type

🔹 Guid

##### 1.11.3.2.3 Is Required

✅ Yes

##### 1.11.3.2.4 Is Primary Key

❌ No

##### 1.11.3.2.5 Is Unique

❌ No

##### 1.11.3.2.6 Index Type

Index

##### 1.11.3.2.7 Size

0

##### 1.11.3.2.8 Constraints

*No items available*

##### 1.11.3.2.9 Default Value

null

##### 1.11.3.2.10 Is Foreign Key

✅ Yes

##### 1.11.3.2.11 Precision

0

##### 1.11.3.2.12 Scale

0

#### 1.11.3.3.0 mediaId

##### 1.11.3.3.1 Name

mediaId

##### 1.11.3.3.2 Type

🔹 Guid

##### 1.11.3.3.3 Is Required

✅ Yes

##### 1.11.3.3.4 Is Primary Key

❌ No

##### 1.11.3.3.5 Is Unique

❌ No

##### 1.11.3.3.6 Index Type

Index

##### 1.11.3.3.7 Size

0

##### 1.11.3.3.8 Constraints

*No items available*

##### 1.11.3.3.9 Default Value

null

##### 1.11.3.3.10 Is Foreign Key

✅ Yes

##### 1.11.3.3.11 Precision

0

##### 1.11.3.3.12 Scale

0

#### 1.11.3.4.0 displayOrder

##### 1.11.3.4.1 Name

displayOrder

##### 1.11.3.4.2 Type

🔹 INT

##### 1.11.3.4.3 Is Required

✅ Yes

##### 1.11.3.4.4 Is Primary Key

❌ No

##### 1.11.3.4.5 Is Unique

❌ No

##### 1.11.3.4.6 Index Type

None

##### 1.11.3.4.7 Size

0

##### 1.11.3.4.8 Constraints

*No items available*

##### 1.11.3.4.9 Default Value

0

##### 1.11.3.4.10 Is Foreign Key

❌ No

##### 1.11.3.4.11 Precision

0

##### 1.11.3.4.12 Scale

0

### 1.11.4.0.0 Primary Keys

- postMediaId

### 1.11.5.0.0 Unique Constraints

*No items available*

### 1.11.6.0.0 Indexes

- {'name': 'IX_PostMedia_PostId_DisplayOrder', 'columns': ['postId', 'displayOrder'], 'type': 'BTree'}

## 1.12.0.0.0 PostReaction

### 1.12.1.0.0 Name

PostReaction

### 1.12.2.0.0 Description

Records a reaction (e.g., 'Like') from a user on a specific post. At very high scale, this table can be partitioned by HASH on postId to mitigate hotspots for viral posts.

### 1.12.3.0.0 Attributes

#### 1.12.3.1.0 postId

##### 1.12.3.1.1 Name

postId

##### 1.12.3.1.2 Type

🔹 Guid

##### 1.12.3.1.3 Is Required

✅ Yes

##### 1.12.3.1.4 Is Primary Key

✅ Yes

##### 1.12.3.1.5 Is Unique

❌ No

##### 1.12.3.1.6 Index Type

Index

##### 1.12.3.1.7 Size

0

##### 1.12.3.1.8 Constraints

*No items available*

##### 1.12.3.1.9 Default Value

null

##### 1.12.3.1.10 Is Foreign Key

✅ Yes

##### 1.12.3.1.11 Precision

0

##### 1.12.3.1.12 Scale

0

#### 1.12.3.2.0 userId

##### 1.12.3.2.1 Name

userId

##### 1.12.3.2.2 Type

🔹 Guid

##### 1.12.3.2.3 Is Required

✅ Yes

##### 1.12.3.2.4 Is Primary Key

✅ Yes

##### 1.12.3.2.5 Is Unique

❌ No

##### 1.12.3.2.6 Index Type

Index

##### 1.12.3.2.7 Size

0

##### 1.12.3.2.8 Constraints

*No items available*

##### 1.12.3.2.9 Default Value

null

##### 1.12.3.2.10 Is Foreign Key

✅ Yes

##### 1.12.3.2.11 Precision

0

##### 1.12.3.2.12 Scale

0

#### 1.12.3.3.0 reactionType

##### 1.12.3.3.1 Name

reactionType

##### 1.12.3.3.2 Type

🔹 VARCHAR

##### 1.12.3.3.3 Is Required

✅ Yes

##### 1.12.3.3.4 Is Primary Key

❌ No

##### 1.12.3.3.5 Is Unique

❌ No

##### 1.12.3.3.6 Index Type

None

##### 1.12.3.3.7 Size

50

##### 1.12.3.3.8 Constraints

*No items available*

##### 1.12.3.3.9 Default Value

like

##### 1.12.3.3.10 Is Foreign Key

❌ No

##### 1.12.3.3.11 Precision

0

##### 1.12.3.3.12 Scale

0

#### 1.12.3.4.0 createdAt

##### 1.12.3.4.1 Name

createdAt

##### 1.12.3.4.2 Type

🔹 DateTime

##### 1.12.3.4.3 Is Required

✅ Yes

##### 1.12.3.4.4 Is Primary Key

❌ No

##### 1.12.3.4.5 Is Unique

❌ No

##### 1.12.3.4.6 Index Type

None

##### 1.12.3.4.7 Size

0

##### 1.12.3.4.8 Constraints

*No items available*

##### 1.12.3.4.9 Default Value

CURRENT_TIMESTAMP

##### 1.12.3.4.10 Is Foreign Key

❌ No

##### 1.12.3.4.11 Precision

0

##### 1.12.3.4.12 Scale

0

### 1.12.4.0.0 Primary Keys

- postId
- userId

### 1.12.5.0.0 Unique Constraints

*No items available*

### 1.12.6.0.0 Indexes

- {'name': 'IX_PostReaction_UserId', 'columns': ['userId'], 'type': 'BTree'}

## 1.13.0.0.0 Comment

### 1.13.1.0.0 Name

Comment

### 1.13.2.0.0 Description

Represents a single comment made by a user on a post.

### 1.13.3.0.0 Attributes

#### 1.13.3.1.0 commentId

##### 1.13.3.1.1 Name

commentId

##### 1.13.3.1.2 Type

🔹 Guid

##### 1.13.3.1.3 Is Required

✅ Yes

##### 1.13.3.1.4 Is Primary Key

✅ Yes

##### 1.13.3.1.5 Is Unique

✅ Yes

##### 1.13.3.1.6 Index Type

UniqueIndex

##### 1.13.3.1.7 Size

0

##### 1.13.3.1.8 Constraints

*No items available*

##### 1.13.3.1.9 Default Value

null

##### 1.13.3.1.10 Is Foreign Key

❌ No

##### 1.13.3.1.11 Precision

0

##### 1.13.3.1.12 Scale

0

#### 1.13.3.2.0 postId

##### 1.13.3.2.1 Name

postId

##### 1.13.3.2.2 Type

🔹 Guid

##### 1.13.3.2.3 Is Required

✅ Yes

##### 1.13.3.2.4 Is Primary Key

❌ No

##### 1.13.3.2.5 Is Unique

❌ No

##### 1.13.3.2.6 Index Type

Index

##### 1.13.3.2.7 Size

0

##### 1.13.3.2.8 Constraints

*No items available*

##### 1.13.3.2.9 Default Value

null

##### 1.13.3.2.10 Is Foreign Key

✅ Yes

##### 1.13.3.2.11 Precision

0

##### 1.13.3.2.12 Scale

0

#### 1.13.3.3.0 authorId

##### 1.13.3.3.1 Name

authorId

##### 1.13.3.3.2 Type

🔹 Guid

##### 1.13.3.3.3 Is Required

✅ Yes

##### 1.13.3.3.4 Is Primary Key

❌ No

##### 1.13.3.3.5 Is Unique

❌ No

##### 1.13.3.3.6 Index Type

Index

##### 1.13.3.3.7 Size

0

##### 1.13.3.3.8 Constraints

*No items available*

##### 1.13.3.3.9 Default Value

null

##### 1.13.3.3.10 Is Foreign Key

✅ Yes

##### 1.13.3.3.11 Precision

0

##### 1.13.3.3.12 Scale

0

#### 1.13.3.4.0 textContent

##### 1.13.3.4.1 Name

textContent

##### 1.13.3.4.2 Type

🔹 TEXT

##### 1.13.3.4.3 Is Required

✅ Yes

##### 1.13.3.4.4 Is Primary Key

❌ No

##### 1.13.3.4.5 Is Unique

❌ No

##### 1.13.3.4.6 Index Type

None

##### 1.13.3.4.7 Size

0

##### 1.13.3.4.8 Constraints

- MAX_LENGTH(1500)

##### 1.13.3.4.9 Default Value

null

##### 1.13.3.4.10 Is Foreign Key

❌ No

##### 1.13.3.4.11 Precision

0

##### 1.13.3.4.12 Scale

0

#### 1.13.3.5.0 authorFullName

##### 1.13.3.5.1 Name

authorFullName

##### 1.13.3.5.2 Type

🔹 VARCHAR

##### 1.13.3.5.3 Is Required

✅ Yes

##### 1.13.3.5.4 Is Primary Key

❌ No

##### 1.13.3.5.5 Is Unique

❌ No

##### 1.13.3.5.6 Index Type

None

##### 1.13.3.5.7 Size

100

##### 1.13.3.5.8 Constraints

*No items available*

##### 1.13.3.5.9 Default Value

null

##### 1.13.3.5.10 Is Foreign Key

❌ No

##### 1.13.3.5.11 Precision

0

##### 1.13.3.5.12 Scale

0

#### 1.13.3.6.0 authorProfilePictureUrl

##### 1.13.3.6.1 Name

authorProfilePictureUrl

##### 1.13.3.6.2 Type

🔹 VARCHAR

##### 1.13.3.6.3 Is Required

❌ No

##### 1.13.3.6.4 Is Primary Key

❌ No

##### 1.13.3.6.5 Is Unique

❌ No

##### 1.13.3.6.6 Index Type

None

##### 1.13.3.6.7 Size

2,048

##### 1.13.3.6.8 Constraints

*No items available*

##### 1.13.3.6.9 Default Value

null

##### 1.13.3.6.10 Is Foreign Key

❌ No

##### 1.13.3.6.11 Precision

0

##### 1.13.3.6.12 Scale

0

#### 1.13.3.7.0 createdAt

##### 1.13.3.7.1 Name

createdAt

##### 1.13.3.7.2 Type

🔹 DateTime

##### 1.13.3.7.3 Is Required

✅ Yes

##### 1.13.3.7.4 Is Primary Key

❌ No

##### 1.13.3.7.5 Is Unique

❌ No

##### 1.13.3.7.6 Index Type

Index

##### 1.13.3.7.7 Size

0

##### 1.13.3.7.8 Constraints

*No items available*

##### 1.13.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.13.3.7.10 Is Foreign Key

❌ No

##### 1.13.3.7.11 Precision

0

##### 1.13.3.7.12 Scale

0

#### 1.13.3.8.0 updatedAt

##### 1.13.3.8.1 Name

updatedAt

##### 1.13.3.8.2 Type

🔹 DateTime

##### 1.13.3.8.3 Is Required

✅ Yes

##### 1.13.3.8.4 Is Primary Key

❌ No

##### 1.13.3.8.5 Is Unique

❌ No

##### 1.13.3.8.6 Index Type

None

##### 1.13.3.8.7 Size

0

##### 1.13.3.8.8 Constraints

*No items available*

##### 1.13.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.13.3.8.10 Is Foreign Key

❌ No

##### 1.13.3.8.11 Precision

0

##### 1.13.3.8.12 Scale

0

#### 1.13.3.9.0 deletedAt

##### 1.13.3.9.1 Name

deletedAt

##### 1.13.3.9.2 Type

🔹 DateTime

##### 1.13.3.9.3 Is Required

❌ No

##### 1.13.3.9.4 Is Primary Key

❌ No

##### 1.13.3.9.5 Is Unique

❌ No

##### 1.13.3.9.6 Index Type

Index

##### 1.13.3.9.7 Size

0

##### 1.13.3.9.8 Constraints

*No items available*

##### 1.13.3.9.9 Default Value

null

##### 1.13.3.9.10 Is Foreign Key

❌ No

##### 1.13.3.9.11 Precision

0

##### 1.13.3.9.12 Scale

0

### 1.13.4.0.0 Primary Keys

- commentId

### 1.13.5.0.0 Unique Constraints

*No items available*

### 1.13.6.0.0 Indexes

- {'name': 'IX_Comment_PostId_CreatedAt', 'columns': ['postId', 'createdAt'], 'type': 'BTree'}

## 1.14.0.0.0 ContentReport

### 1.14.1.0.0 Name

ContentReport

### 1.14.2.0.0 Description

Stores reports made by users against content like posts or comments, for moderation.

### 1.14.3.0.0 Attributes

#### 1.14.3.1.0 contentReportId

##### 1.14.3.1.1 Name

contentReportId

##### 1.14.3.1.2 Type

🔹 Guid

##### 1.14.3.1.3 Is Required

✅ Yes

##### 1.14.3.1.4 Is Primary Key

✅ Yes

##### 1.14.3.1.5 Is Unique

✅ Yes

##### 1.14.3.1.6 Index Type

UniqueIndex

##### 1.14.3.1.7 Size

0

##### 1.14.3.1.8 Constraints

*No items available*

##### 1.14.3.1.9 Default Value

null

##### 1.14.3.1.10 Is Foreign Key

❌ No

##### 1.14.3.1.11 Precision

0

##### 1.14.3.1.12 Scale

0

#### 1.14.3.2.0 reporterId

##### 1.14.3.2.1 Name

reporterId

##### 1.14.3.2.2 Type

🔹 Guid

##### 1.14.3.2.3 Is Required

✅ Yes

##### 1.14.3.2.4 Is Primary Key

❌ No

##### 1.14.3.2.5 Is Unique

❌ No

##### 1.14.3.2.6 Index Type

Index

##### 1.14.3.2.7 Size

0

##### 1.14.3.2.8 Constraints

*No items available*

##### 1.14.3.2.9 Default Value

null

##### 1.14.3.2.10 Is Foreign Key

✅ Yes

##### 1.14.3.2.11 Precision

0

##### 1.14.3.2.12 Scale

0

#### 1.14.3.3.0 reportedPostId

##### 1.14.3.3.1 Name

reportedPostId

##### 1.14.3.3.2 Type

🔹 Guid

##### 1.14.3.3.3 Is Required

❌ No

##### 1.14.3.3.4 Is Primary Key

❌ No

##### 1.14.3.3.5 Is Unique

❌ No

##### 1.14.3.3.6 Index Type

Index

##### 1.14.3.3.7 Size

0

##### 1.14.3.3.8 Constraints

*No items available*

##### 1.14.3.3.9 Default Value

null

##### 1.14.3.3.10 Is Foreign Key

✅ Yes

##### 1.14.3.3.11 Precision

0

##### 1.14.3.3.12 Scale

0

#### 1.14.3.4.0 reportedCommentId

##### 1.14.3.4.1 Name

reportedCommentId

##### 1.14.3.4.2 Type

🔹 Guid

##### 1.14.3.4.3 Is Required

❌ No

##### 1.14.3.4.4 Is Primary Key

❌ No

##### 1.14.3.4.5 Is Unique

❌ No

##### 1.14.3.4.6 Index Type

Index

##### 1.14.3.4.7 Size

0

##### 1.14.3.4.8 Constraints

*No items available*

##### 1.14.3.4.9 Default Value

null

##### 1.14.3.4.10 Is Foreign Key

✅ Yes

##### 1.14.3.4.11 Precision

0

##### 1.14.3.4.12 Scale

0

#### 1.14.3.5.0 reason

##### 1.14.3.5.1 Name

reason

##### 1.14.3.5.2 Type

🔹 TEXT

##### 1.14.3.5.3 Is Required

✅ Yes

##### 1.14.3.5.4 Is Primary Key

❌ No

##### 1.14.3.5.5 Is Unique

❌ No

##### 1.14.3.5.6 Index Type

None

##### 1.14.3.5.7 Size

0

##### 1.14.3.5.8 Constraints

*No items available*

##### 1.14.3.5.9 Default Value

null

##### 1.14.3.5.10 Is Foreign Key

❌ No

##### 1.14.3.5.11 Precision

0

##### 1.14.3.5.12 Scale

0

#### 1.14.3.6.0 status

##### 1.14.3.6.1 Name

status

##### 1.14.3.6.2 Type

🔹 VARCHAR

##### 1.14.3.6.3 Is Required

✅ Yes

##### 1.14.3.6.4 Is Primary Key

❌ No

##### 1.14.3.6.5 Is Unique

❌ No

##### 1.14.3.6.6 Index Type

Index

##### 1.14.3.6.7 Size

50

##### 1.14.3.6.8 Constraints

- ENUM('pending', 'dismissed', 'action_taken')

##### 1.14.3.6.9 Default Value

pending

##### 1.14.3.6.10 Is Foreign Key

❌ No

##### 1.14.3.6.11 Precision

0

##### 1.14.3.6.12 Scale

0

#### 1.14.3.7.0 createdAt

##### 1.14.3.7.1 Name

createdAt

##### 1.14.3.7.2 Type

🔹 DateTime

##### 1.14.3.7.3 Is Required

✅ Yes

##### 1.14.3.7.4 Is Primary Key

❌ No

##### 1.14.3.7.5 Is Unique

❌ No

##### 1.14.3.7.6 Index Type

Index

##### 1.14.3.7.7 Size

0

##### 1.14.3.7.8 Constraints

*No items available*

##### 1.14.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.14.3.7.10 Is Foreign Key

❌ No

##### 1.14.3.7.11 Precision

0

##### 1.14.3.7.12 Scale

0

#### 1.14.3.8.0 updatedAt

##### 1.14.3.8.1 Name

updatedAt

##### 1.14.3.8.2 Type

🔹 DateTime

##### 1.14.3.8.3 Is Required

✅ Yes

##### 1.14.3.8.4 Is Primary Key

❌ No

##### 1.14.3.8.5 Is Unique

❌ No

##### 1.14.3.8.6 Index Type

None

##### 1.14.3.8.7 Size

0

##### 1.14.3.8.8 Constraints

*No items available*

##### 1.14.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.14.3.8.10 Is Foreign Key

❌ No

##### 1.14.3.8.11 Precision

0

##### 1.14.3.8.12 Scale

0

### 1.14.4.0.0 Primary Keys

- contentReportId

### 1.14.5.0.0 Unique Constraints

*No items available*

### 1.14.6.0.0 Indexes

- {'name': 'IX_ContentReport_Status_CreatedAt', 'columns': ['status', 'createdAt'], 'type': 'BTree'}

## 1.15.0.0.0 Conversation

### 1.15.1.0.0 Name

Conversation

### 1.15.2.0.0 Description

Represents a distinct messaging thread between two or more users.

### 1.15.3.0.0 Attributes

#### 1.15.3.1.0 conversationId

##### 1.15.3.1.1 Name

conversationId

##### 1.15.3.1.2 Type

🔹 Guid

##### 1.15.3.1.3 Is Required

✅ Yes

##### 1.15.3.1.4 Is Primary Key

✅ Yes

##### 1.15.3.1.5 Is Unique

✅ Yes

##### 1.15.3.1.6 Index Type

UniqueIndex

##### 1.15.3.1.7 Size

0

##### 1.15.3.1.8 Constraints

*No items available*

##### 1.15.3.1.9 Default Value

null

##### 1.15.3.1.10 Is Foreign Key

❌ No

##### 1.15.3.1.11 Precision

0

##### 1.15.3.1.12 Scale

0

#### 1.15.3.2.0 createdAt

##### 1.15.3.2.1 Name

createdAt

##### 1.15.3.2.2 Type

🔹 DateTime

##### 1.15.3.2.3 Is Required

✅ Yes

##### 1.15.3.2.4 Is Primary Key

❌ No

##### 1.15.3.2.5 Is Unique

❌ No

##### 1.15.3.2.6 Index Type

None

##### 1.15.3.2.7 Size

0

##### 1.15.3.2.8 Constraints

*No items available*

##### 1.15.3.2.9 Default Value

CURRENT_TIMESTAMP

##### 1.15.3.2.10 Is Foreign Key

❌ No

##### 1.15.3.2.11 Precision

0

##### 1.15.3.2.12 Scale

0

### 1.15.4.0.0 Primary Keys

- conversationId

### 1.15.5.0.0 Unique Constraints

*No items available*

### 1.15.6.0.0 Indexes

*No items available*

## 1.16.0.0.0 ConversationParticipant

### 1.16.1.0.0 Name

ConversationParticipant

### 1.16.2.0.0 Description

Join table linking users to the conversations they are a part of.

### 1.16.3.0.0 Attributes

#### 1.16.3.1.0 conversationId

##### 1.16.3.1.1 Name

conversationId

##### 1.16.3.1.2 Type

🔹 Guid

##### 1.16.3.1.3 Is Required

✅ Yes

##### 1.16.3.1.4 Is Primary Key

✅ Yes

##### 1.16.3.1.5 Is Unique

❌ No

##### 1.16.3.1.6 Index Type

Index

##### 1.16.3.1.7 Size

0

##### 1.16.3.1.8 Constraints

*No items available*

##### 1.16.3.1.9 Default Value

null

##### 1.16.3.1.10 Is Foreign Key

✅ Yes

##### 1.16.3.1.11 Precision

0

##### 1.16.3.1.12 Scale

0

#### 1.16.3.2.0 userId

##### 1.16.3.2.1 Name

userId

##### 1.16.3.2.2 Type

🔹 Guid

##### 1.16.3.2.3 Is Required

✅ Yes

##### 1.16.3.2.4 Is Primary Key

✅ Yes

##### 1.16.3.2.5 Is Unique

❌ No

##### 1.16.3.2.6 Index Type

Index

##### 1.16.3.2.7 Size

0

##### 1.16.3.2.8 Constraints

*No items available*

##### 1.16.3.2.9 Default Value

null

##### 1.16.3.2.10 Is Foreign Key

✅ Yes

##### 1.16.3.2.11 Precision

0

##### 1.16.3.2.12 Scale

0

#### 1.16.3.3.0 joinedAt

##### 1.16.3.3.1 Name

joinedAt

##### 1.16.3.3.2 Type

🔹 DateTime

##### 1.16.3.3.3 Is Required

✅ Yes

##### 1.16.3.3.4 Is Primary Key

❌ No

##### 1.16.3.3.5 Is Unique

❌ No

##### 1.16.3.3.6 Index Type

None

##### 1.16.3.3.7 Size

0

##### 1.16.3.3.8 Constraints

*No items available*

##### 1.16.3.3.9 Default Value

CURRENT_TIMESTAMP

##### 1.16.3.3.10 Is Foreign Key

❌ No

##### 1.16.3.3.11 Precision

0

##### 1.16.3.3.12 Scale

0

### 1.16.4.0.0 Primary Keys

- conversationId
- userId

### 1.16.5.0.0 Unique Constraints

*No items available*

### 1.16.6.0.0 Indexes

- {'name': 'IX_ConversationParticipant_UserId', 'columns': ['userId'], 'type': 'BTree'}

## 1.17.0.0.0 Message

### 1.17.1.0.0 Name

Message

### 1.17.2.0.0 Description

Represents a single message sent within a conversation. Partitioned by RANGE on createdAt (monthly) to improve query performance and simplify archival of old data.

### 1.17.3.0.0 Attributes

#### 1.17.3.1.0 messageId

##### 1.17.3.1.1 Name

messageId

##### 1.17.3.1.2 Type

🔹 Guid

##### 1.17.3.1.3 Is Required

✅ Yes

##### 1.17.3.1.4 Is Primary Key

✅ Yes

##### 1.17.3.1.5 Is Unique

✅ Yes

##### 1.17.3.1.6 Index Type

UniqueIndex

##### 1.17.3.1.7 Size

0

##### 1.17.3.1.8 Constraints

*No items available*

##### 1.17.3.1.9 Default Value

null

##### 1.17.3.1.10 Is Foreign Key

❌ No

##### 1.17.3.1.11 Precision

0

##### 1.17.3.1.12 Scale

0

#### 1.17.3.2.0 conversationId

##### 1.17.3.2.1 Name

conversationId

##### 1.17.3.2.2 Type

🔹 Guid

##### 1.17.3.2.3 Is Required

✅ Yes

##### 1.17.3.2.4 Is Primary Key

❌ No

##### 1.17.3.2.5 Is Unique

❌ No

##### 1.17.3.2.6 Index Type

Index

##### 1.17.3.2.7 Size

0

##### 1.17.3.2.8 Constraints

*No items available*

##### 1.17.3.2.9 Default Value

null

##### 1.17.3.2.10 Is Foreign Key

✅ Yes

##### 1.17.3.2.11 Precision

0

##### 1.17.3.2.12 Scale

0

#### 1.17.3.3.0 senderId

##### 1.17.3.3.1 Name

senderId

##### 1.17.3.3.2 Type

🔹 Guid

##### 1.17.3.3.3 Is Required

✅ Yes

##### 1.17.3.3.4 Is Primary Key

❌ No

##### 1.17.3.3.5 Is Unique

❌ No

##### 1.17.3.3.6 Index Type

Index

##### 1.17.3.3.7 Size

0

##### 1.17.3.3.8 Constraints

*No items available*

##### 1.17.3.3.9 Default Value

null

##### 1.17.3.3.10 Is Foreign Key

✅ Yes

##### 1.17.3.3.11 Precision

0

##### 1.17.3.3.12 Scale

0

#### 1.17.3.4.0 textContent

##### 1.17.3.4.1 Name

textContent

##### 1.17.3.4.2 Type

🔹 TEXT

##### 1.17.3.4.3 Is Required

✅ Yes

##### 1.17.3.4.4 Is Primary Key

❌ No

##### 1.17.3.4.5 Is Unique

❌ No

##### 1.17.3.4.6 Index Type

None

##### 1.17.3.4.7 Size

0

##### 1.17.3.4.8 Constraints

*No items available*

##### 1.17.3.4.9 Default Value

null

##### 1.17.3.4.10 Is Foreign Key

❌ No

##### 1.17.3.4.11 Precision

0

##### 1.17.3.4.12 Scale

0

#### 1.17.3.5.0 createdAt

##### 1.17.3.5.1 Name

createdAt

##### 1.17.3.5.2 Type

🔹 DateTime

##### 1.17.3.5.3 Is Required

✅ Yes

##### 1.17.3.5.4 Is Primary Key

❌ No

##### 1.17.3.5.5 Is Unique

❌ No

##### 1.17.3.5.6 Index Type

Index

##### 1.17.3.5.7 Size

0

##### 1.17.3.5.8 Constraints

*No items available*

##### 1.17.3.5.9 Default Value

CURRENT_TIMESTAMP

##### 1.17.3.5.10 Is Foreign Key

❌ No

##### 1.17.3.5.11 Precision

0

##### 1.17.3.5.12 Scale

0

### 1.17.4.0.0 Primary Keys

- messageId

### 1.17.5.0.0 Unique Constraints

*No items available*

### 1.17.6.0.0 Indexes

- {'name': 'IX_Message_ConversationId_CreatedAt', 'columns': ['conversationId', 'createdAt'], 'type': 'BTree'}

## 1.18.0.0.0 MessageStatus

### 1.18.1.0.0 Name

MessageStatus

### 1.18.2.0.0 Description

Tracks the delivered and read status of a message for each recipient in a conversation.

### 1.18.3.0.0 Attributes

#### 1.18.3.1.0 messageId

##### 1.18.3.1.1 Name

messageId

##### 1.18.3.1.2 Type

🔹 Guid

##### 1.18.3.1.3 Is Required

✅ Yes

##### 1.18.3.1.4 Is Primary Key

✅ Yes

##### 1.18.3.1.5 Is Unique

❌ No

##### 1.18.3.1.6 Index Type

Index

##### 1.18.3.1.7 Size

0

##### 1.18.3.1.8 Constraints

*No items available*

##### 1.18.3.1.9 Default Value

null

##### 1.18.3.1.10 Is Foreign Key

✅ Yes

##### 1.18.3.1.11 Precision

0

##### 1.18.3.1.12 Scale

0

#### 1.18.3.2.0 userId

##### 1.18.3.2.1 Name

userId

##### 1.18.3.2.2 Type

🔹 Guid

##### 1.18.3.2.3 Is Required

✅ Yes

##### 1.18.3.2.4 Is Primary Key

✅ Yes

##### 1.18.3.2.5 Is Unique

❌ No

##### 1.18.3.2.6 Index Type

Index

##### 1.18.3.2.7 Size

0

##### 1.18.3.2.8 Constraints

*No items available*

##### 1.18.3.2.9 Default Value

null

##### 1.18.3.2.10 Is Foreign Key

✅ Yes

##### 1.18.3.2.11 Precision

0

##### 1.18.3.2.12 Scale

0

#### 1.18.3.3.0 status

##### 1.18.3.3.1 Name

status

##### 1.18.3.3.2 Type

🔹 VARCHAR

##### 1.18.3.3.3 Is Required

✅ Yes

##### 1.18.3.3.4 Is Primary Key

❌ No

##### 1.18.3.3.5 Is Unique

❌ No

##### 1.18.3.3.6 Index Type

Index

##### 1.18.3.3.7 Size

50

##### 1.18.3.3.8 Constraints

- ENUM('delivered', 'read')

##### 1.18.3.3.9 Default Value

delivered

##### 1.18.3.3.10 Is Foreign Key

❌ No

##### 1.18.3.3.11 Precision

0

##### 1.18.3.3.12 Scale

0

#### 1.18.3.4.0 updatedAt

##### 1.18.3.4.1 Name

updatedAt

##### 1.18.3.4.2 Type

🔹 DateTime

##### 1.18.3.4.3 Is Required

✅ Yes

##### 1.18.3.4.4 Is Primary Key

❌ No

##### 1.18.3.4.5 Is Unique

❌ No

##### 1.18.3.4.6 Index Type

None

##### 1.18.3.4.7 Size

0

##### 1.18.3.4.8 Constraints

*No items available*

##### 1.18.3.4.9 Default Value

CURRENT_TIMESTAMP

##### 1.18.3.4.10 Is Foreign Key

❌ No

##### 1.18.3.4.11 Precision

0

##### 1.18.3.4.12 Scale

0

### 1.18.4.0.0 Primary Keys

- messageId
- userId

### 1.18.5.0.0 Unique Constraints

*No items available*

### 1.18.6.0.0 Indexes

- {'name': 'IX_MessageStatus_UserId_Status', 'columns': ['userId', 'status'], 'type': 'BTree'}

## 1.19.0.0.0 Notification

### 1.19.1.0.0 Name

Notification

### 1.19.2.0.0 Description

Stores notifications generated by system events to be displayed to users. Partitioned by RANGE on createdAt (weekly or monthly) to ensure fast queries for recent notifications and efficient data purging.

### 1.19.3.0.0 Attributes

#### 1.19.3.1.0 notificationId

##### 1.19.3.1.1 Name

notificationId

##### 1.19.3.1.2 Type

🔹 Guid

##### 1.19.3.1.3 Is Required

✅ Yes

##### 1.19.3.1.4 Is Primary Key

✅ Yes

##### 1.19.3.1.5 Is Unique

✅ Yes

##### 1.19.3.1.6 Index Type

UniqueIndex

##### 1.19.3.1.7 Size

0

##### 1.19.3.1.8 Constraints

*No items available*

##### 1.19.3.1.9 Default Value

null

##### 1.19.3.1.10 Is Foreign Key

❌ No

##### 1.19.3.1.11 Precision

0

##### 1.19.3.1.12 Scale

0

#### 1.19.3.2.0 recipientId

##### 1.19.3.2.1 Name

recipientId

##### 1.19.3.2.2 Type

🔹 Guid

##### 1.19.3.2.3 Is Required

✅ Yes

##### 1.19.3.2.4 Is Primary Key

❌ No

##### 1.19.3.2.5 Is Unique

❌ No

##### 1.19.3.2.6 Index Type

Index

##### 1.19.3.2.7 Size

0

##### 1.19.3.2.8 Constraints

*No items available*

##### 1.19.3.2.9 Default Value

null

##### 1.19.3.2.10 Is Foreign Key

✅ Yes

##### 1.19.3.2.11 Precision

0

##### 1.19.3.2.12 Scale

0

#### 1.19.3.3.0 actorId

##### 1.19.3.3.1 Name

actorId

##### 1.19.3.3.2 Type

🔹 Guid

##### 1.19.3.3.3 Is Required

❌ No

##### 1.19.3.3.4 Is Primary Key

❌ No

##### 1.19.3.3.5 Is Unique

❌ No

##### 1.19.3.3.6 Index Type

Index

##### 1.19.3.3.7 Size

0

##### 1.19.3.3.8 Constraints

*No items available*

##### 1.19.3.3.9 Default Value

null

##### 1.19.3.3.10 Is Foreign Key

✅ Yes

##### 1.19.3.3.11 Precision

0

##### 1.19.3.3.12 Scale

0

#### 1.19.3.4.0 notificationType

##### 1.19.3.4.1 Name

notificationType

##### 1.19.3.4.2 Type

🔹 VARCHAR

##### 1.19.3.4.3 Is Required

✅ Yes

##### 1.19.3.4.4 Is Primary Key

❌ No

##### 1.19.3.4.5 Is Unique

❌ No

##### 1.19.3.4.6 Index Type

Index

##### 1.19.3.4.7 Size

100

##### 1.19.3.4.8 Constraints

*No items available*

##### 1.19.3.4.9 Default Value

null

##### 1.19.3.4.10 Is Foreign Key

❌ No

##### 1.19.3.4.11 Precision

0

##### 1.19.3.4.12 Scale

0

#### 1.19.3.5.0 targetEntityId

##### 1.19.3.5.1 Name

targetEntityId

##### 1.19.3.5.2 Type

🔹 Guid

##### 1.19.3.5.3 Is Required

❌ No

##### 1.19.3.5.4 Is Primary Key

❌ No

##### 1.19.3.5.5 Is Unique

❌ No

##### 1.19.3.5.6 Index Type

Index

##### 1.19.3.5.7 Size

0

##### 1.19.3.5.8 Constraints

*No items available*

##### 1.19.3.5.9 Default Value

null

##### 1.19.3.5.10 Is Foreign Key

❌ No

##### 1.19.3.5.11 Precision

0

##### 1.19.3.5.12 Scale

0

#### 1.19.3.6.0 targetEntityType

##### 1.19.3.6.1 Name

targetEntityType

##### 1.19.3.6.2 Type

🔹 VARCHAR

##### 1.19.3.6.3 Is Required

❌ No

##### 1.19.3.6.4 Is Primary Key

❌ No

##### 1.19.3.6.5 Is Unique

❌ No

##### 1.19.3.6.6 Index Type

Index

##### 1.19.3.6.7 Size

100

##### 1.19.3.6.8 Constraints

*No items available*

##### 1.19.3.6.9 Default Value

null

##### 1.19.3.6.10 Is Foreign Key

❌ No

##### 1.19.3.6.11 Precision

0

##### 1.19.3.6.12 Scale

0

#### 1.19.3.7.0 isRead

##### 1.19.3.7.1 Name

isRead

##### 1.19.3.7.2 Type

🔹 BOOLEAN

##### 1.19.3.7.3 Is Required

✅ Yes

##### 1.19.3.7.4 Is Primary Key

❌ No

##### 1.19.3.7.5 Is Unique

❌ No

##### 1.19.3.7.6 Index Type

Index

##### 1.19.3.7.7 Size

0

##### 1.19.3.7.8 Constraints

*No items available*

##### 1.19.3.7.9 Default Value

false

##### 1.19.3.7.10 Is Foreign Key

❌ No

##### 1.19.3.7.11 Precision

0

##### 1.19.3.7.12 Scale

0

#### 1.19.3.8.0 aggregatedCount

##### 1.19.3.8.1 Name

aggregatedCount

##### 1.19.3.8.2 Type

🔹 INT

##### 1.19.3.8.3 Is Required

✅ Yes

##### 1.19.3.8.4 Is Primary Key

❌ No

##### 1.19.3.8.5 Is Unique

❌ No

##### 1.19.3.8.6 Index Type

None

##### 1.19.3.8.7 Size

0

##### 1.19.3.8.8 Constraints

*No items available*

##### 1.19.3.8.9 Default Value

1

##### 1.19.3.8.10 Is Foreign Key

❌ No

##### 1.19.3.8.11 Precision

0

##### 1.19.3.8.12 Scale

0

#### 1.19.3.9.0 createdAt

##### 1.19.3.9.1 Name

createdAt

##### 1.19.3.9.2 Type

🔹 DateTime

##### 1.19.3.9.3 Is Required

✅ Yes

##### 1.19.3.9.4 Is Primary Key

❌ No

##### 1.19.3.9.5 Is Unique

❌ No

##### 1.19.3.9.6 Index Type

Index

##### 1.19.3.9.7 Size

0

##### 1.19.3.9.8 Constraints

*No items available*

##### 1.19.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.19.3.9.10 Is Foreign Key

❌ No

##### 1.19.3.9.11 Precision

0

##### 1.19.3.9.12 Scale

0

#### 1.19.3.10.0 updatedAt

##### 1.19.3.10.1 Name

updatedAt

##### 1.19.3.10.2 Type

🔹 DateTime

##### 1.19.3.10.3 Is Required

✅ Yes

##### 1.19.3.10.4 Is Primary Key

❌ No

##### 1.19.3.10.5 Is Unique

❌ No

##### 1.19.3.10.6 Index Type

None

##### 1.19.3.10.7 Size

0

##### 1.19.3.10.8 Constraints

*No items available*

##### 1.19.3.10.9 Default Value

CURRENT_TIMESTAMP

##### 1.19.3.10.10 Is Foreign Key

❌ No

##### 1.19.3.10.11 Precision

0

##### 1.19.3.10.12 Scale

0

### 1.19.4.0.0 Primary Keys

- notificationId

### 1.19.5.0.0 Unique Constraints

*No items available*

### 1.19.6.0.0 Indexes

- {'name': 'IX_Notification_Recipient_IsRead_CreatedAt', 'columns': ['recipientId', 'isRead', 'createdAt'], 'type': 'BTree'}

## 1.20.0.0.0 UserNotificationSetting

### 1.20.1.0.0 Name

UserNotificationSetting

### 1.20.2.0.0 Description

Stores user-specific preferences for receiving different types of notifications.

### 1.20.3.0.0 Attributes

#### 1.20.3.1.0 userId

##### 1.20.3.1.1 Name

userId

##### 1.20.3.1.2 Type

🔹 Guid

##### 1.20.3.1.3 Is Required

✅ Yes

##### 1.20.3.1.4 Is Primary Key

✅ Yes

##### 1.20.3.1.5 Is Unique

❌ No

##### 1.20.3.1.6 Index Type

Index

##### 1.20.3.1.7 Size

0

##### 1.20.3.1.8 Constraints

*No items available*

##### 1.20.3.1.9 Default Value

null

##### 1.20.3.1.10 Is Foreign Key

✅ Yes

##### 1.20.3.1.11 Precision

0

##### 1.20.3.1.12 Scale

0

#### 1.20.3.2.0 notificationType

##### 1.20.3.2.1 Name

notificationType

##### 1.20.3.2.2 Type

🔹 VARCHAR

##### 1.20.3.2.3 Is Required

✅ Yes

##### 1.20.3.2.4 Is Primary Key

✅ Yes

##### 1.20.3.2.5 Is Unique

❌ No

##### 1.20.3.2.6 Index Type

Index

##### 1.20.3.2.7 Size

100

##### 1.20.3.2.8 Constraints

*No items available*

##### 1.20.3.2.9 Default Value

null

##### 1.20.3.2.10 Is Foreign Key

❌ No

##### 1.20.3.2.11 Precision

0

##### 1.20.3.2.12 Scale

0

#### 1.20.3.3.0 inAppEnabled

##### 1.20.3.3.1 Name

inAppEnabled

##### 1.20.3.3.2 Type

🔹 BOOLEAN

##### 1.20.3.3.3 Is Required

✅ Yes

##### 1.20.3.3.4 Is Primary Key

❌ No

##### 1.20.3.3.5 Is Unique

❌ No

##### 1.20.3.3.6 Index Type

None

##### 1.20.3.3.7 Size

0

##### 1.20.3.3.8 Constraints

*No items available*

##### 1.20.3.3.9 Default Value

true

##### 1.20.3.3.10 Is Foreign Key

❌ No

##### 1.20.3.3.11 Precision

0

##### 1.20.3.3.12 Scale

0

#### 1.20.3.4.0 emailEnabled

##### 1.20.3.4.1 Name

emailEnabled

##### 1.20.3.4.2 Type

🔹 BOOLEAN

##### 1.20.3.4.3 Is Required

✅ Yes

##### 1.20.3.4.4 Is Primary Key

❌ No

##### 1.20.3.4.5 Is Unique

❌ No

##### 1.20.3.4.6 Index Type

None

##### 1.20.3.4.7 Size

0

##### 1.20.3.4.8 Constraints

*No items available*

##### 1.20.3.4.9 Default Value

true

##### 1.20.3.4.10 Is Foreign Key

❌ No

##### 1.20.3.4.11 Precision

0

##### 1.20.3.4.12 Scale

0

### 1.20.4.0.0 Primary Keys

- userId
- notificationType

### 1.20.5.0.0 Unique Constraints

*No items available*

### 1.20.6.0.0 Indexes

*No items available*

## 1.21.0.0.0 UserToken

### 1.21.1.0.0 Name

UserToken

### 1.21.2.0.0 Description

Stores secure, single-use tokens for actions like email verification and password reset.

### 1.21.3.0.0 Attributes

#### 1.21.3.1.0 tokenId

##### 1.21.3.1.1 Name

tokenId

##### 1.21.3.1.2 Type

🔹 Guid

##### 1.21.3.1.3 Is Required

✅ Yes

##### 1.21.3.1.4 Is Primary Key

✅ Yes

##### 1.21.3.1.5 Is Unique

✅ Yes

##### 1.21.3.1.6 Index Type

UniqueIndex

##### 1.21.3.1.7 Size

0

##### 1.21.3.1.8 Constraints

*No items available*

##### 1.21.3.1.9 Default Value

null

##### 1.21.3.1.10 Is Foreign Key

❌ No

##### 1.21.3.1.11 Precision

0

##### 1.21.3.1.12 Scale

0

#### 1.21.3.2.0 userId

##### 1.21.3.2.1 Name

userId

##### 1.21.3.2.2 Type

🔹 Guid

##### 1.21.3.2.3 Is Required

✅ Yes

##### 1.21.3.2.4 Is Primary Key

❌ No

##### 1.21.3.2.5 Is Unique

❌ No

##### 1.21.3.2.6 Index Type

Index

##### 1.21.3.2.7 Size

0

##### 1.21.3.2.8 Constraints

*No items available*

##### 1.21.3.2.9 Default Value

null

##### 1.21.3.2.10 Is Foreign Key

✅ Yes

##### 1.21.3.2.11 Precision

0

##### 1.21.3.2.12 Scale

0

#### 1.21.3.3.0 tokenHash

##### 1.21.3.3.1 Name

tokenHash

##### 1.21.3.3.2 Type

🔹 VARCHAR

##### 1.21.3.3.3 Is Required

✅ Yes

##### 1.21.3.3.4 Is Primary Key

❌ No

##### 1.21.3.3.5 Is Unique

✅ Yes

##### 1.21.3.3.6 Index Type

UniqueIndex

##### 1.21.3.3.7 Size

255

##### 1.21.3.3.8 Constraints

*No items available*

##### 1.21.3.3.9 Default Value

null

##### 1.21.3.3.10 Is Foreign Key

❌ No

##### 1.21.3.3.11 Precision

0

##### 1.21.3.3.12 Scale

0

#### 1.21.3.4.0 tokenType

##### 1.21.3.4.1 Name

tokenType

##### 1.21.3.4.2 Type

🔹 VARCHAR

##### 1.21.3.4.3 Is Required

✅ Yes

##### 1.21.3.4.4 Is Primary Key

❌ No

##### 1.21.3.4.5 Is Unique

❌ No

##### 1.21.3.4.6 Index Type

Index

##### 1.21.3.4.7 Size

50

##### 1.21.3.4.8 Constraints

- ENUM('email_verification', 'password_reset')

##### 1.21.3.4.9 Default Value

null

##### 1.21.3.4.10 Is Foreign Key

❌ No

##### 1.21.3.4.11 Precision

0

##### 1.21.3.4.12 Scale

0

#### 1.21.3.5.0 expiresAt

##### 1.21.3.5.1 Name

expiresAt

##### 1.21.3.5.2 Type

🔹 DateTime

##### 1.21.3.5.3 Is Required

✅ Yes

##### 1.21.3.5.4 Is Primary Key

❌ No

##### 1.21.3.5.5 Is Unique

❌ No

##### 1.21.3.5.6 Index Type

Index

##### 1.21.3.5.7 Size

0

##### 1.21.3.5.8 Constraints

*No items available*

##### 1.21.3.5.9 Default Value

null

##### 1.21.3.5.10 Is Foreign Key

❌ No

##### 1.21.3.5.11 Precision

0

##### 1.21.3.5.12 Scale

0

#### 1.21.3.6.0 createdAt

##### 1.21.3.6.1 Name

createdAt

##### 1.21.3.6.2 Type

🔹 DateTime

##### 1.21.3.6.3 Is Required

✅ Yes

##### 1.21.3.6.4 Is Primary Key

❌ No

##### 1.21.3.6.5 Is Unique

❌ No

##### 1.21.3.6.6 Index Type

None

##### 1.21.3.6.7 Size

0

##### 1.21.3.6.8 Constraints

*No items available*

##### 1.21.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.21.3.6.10 Is Foreign Key

❌ No

##### 1.21.3.6.11 Precision

0

##### 1.21.3.6.12 Scale

0

### 1.21.4.0.0 Primary Keys

- tokenId

### 1.21.5.0.0 Unique Constraints

- {'name': 'UC_UserToken_TokenHash', 'columns': ['tokenHash']}

### 1.21.6.0.0 Indexes

#### 1.21.6.1.0 IX_UserToken_UserId_TokenType

##### 1.21.6.1.1 Name

IX_UserToken_UserId_TokenType

##### 1.21.6.1.2 Columns

- userId
- tokenType

##### 1.21.6.1.3 Type

🔹 BTree

#### 1.21.6.2.0 IX_UserToken_ExpiresAt

##### 1.21.6.2.1 Name

IX_UserToken_ExpiresAt

##### 1.21.6.2.2 Columns

- expiresAt

##### 1.21.6.2.3 Type

🔹 BTree

## 1.22.0.0.0 AccountDeletionRequest

### 1.22.1.0.0 Name

AccountDeletionRequest

### 1.22.2.0.0 Description

Logs user requests for account deletion, managing the grace period and final purge.

### 1.22.3.0.0 Attributes

#### 1.22.3.1.0 requestId

##### 1.22.3.1.1 Name

requestId

##### 1.22.3.1.2 Type

🔹 Guid

##### 1.22.3.1.3 Is Required

✅ Yes

##### 1.22.3.1.4 Is Primary Key

✅ Yes

##### 1.22.3.1.5 Is Unique

✅ Yes

##### 1.22.3.1.6 Index Type

UniqueIndex

##### 1.22.3.1.7 Size

0

##### 1.22.3.1.8 Constraints

*No items available*

##### 1.22.3.1.9 Default Value

null

##### 1.22.3.1.10 Is Foreign Key

❌ No

##### 1.22.3.1.11 Precision

0

##### 1.22.3.1.12 Scale

0

#### 1.22.3.2.0 userId

##### 1.22.3.2.1 Name

userId

##### 1.22.3.2.2 Type

🔹 Guid

##### 1.22.3.2.3 Is Required

✅ Yes

##### 1.22.3.2.4 Is Primary Key

❌ No

##### 1.22.3.2.5 Is Unique

✅ Yes

##### 1.22.3.2.6 Index Type

UniqueIndex

##### 1.22.3.2.7 Size

0

##### 1.22.3.2.8 Constraints

*No items available*

##### 1.22.3.2.9 Default Value

null

##### 1.22.3.2.10 Is Foreign Key

✅ Yes

##### 1.22.3.2.11 Precision

0

##### 1.22.3.2.12 Scale

0

#### 1.22.3.3.0 status

##### 1.22.3.3.1 Name

status

##### 1.22.3.3.2 Type

🔹 VARCHAR

##### 1.22.3.3.3 Is Required

✅ Yes

##### 1.22.3.3.4 Is Primary Key

❌ No

##### 1.22.3.3.5 Is Unique

❌ No

##### 1.22.3.3.6 Index Type

Index

##### 1.22.3.3.7 Size

50

##### 1.22.3.3.8 Constraints

- ENUM('pending_grace_period', 'cancelled', 'purged')

##### 1.22.3.3.9 Default Value

pending_grace_period

##### 1.22.3.3.10 Is Foreign Key

❌ No

##### 1.22.3.3.11 Precision

0

##### 1.22.3.3.12 Scale

0

#### 1.22.3.4.0 scheduledPurgeAt

##### 1.22.3.4.1 Name

scheduledPurgeAt

##### 1.22.3.4.2 Type

🔹 DateTime

##### 1.22.3.4.3 Is Required

✅ Yes

##### 1.22.3.4.4 Is Primary Key

❌ No

##### 1.22.3.4.5 Is Unique

❌ No

##### 1.22.3.4.6 Index Type

Index

##### 1.22.3.4.7 Size

0

##### 1.22.3.4.8 Constraints

*No items available*

##### 1.22.3.4.9 Default Value

null

##### 1.22.3.4.10 Is Foreign Key

❌ No

##### 1.22.3.4.11 Precision

0

##### 1.22.3.4.12 Scale

0

#### 1.22.3.5.0 finalPurgeAt

##### 1.22.3.5.1 Name

finalPurgeAt

##### 1.22.3.5.2 Type

🔹 DateTime

##### 1.22.3.5.3 Is Required

❌ No

##### 1.22.3.5.4 Is Primary Key

❌ No

##### 1.22.3.5.5 Is Unique

❌ No

##### 1.22.3.5.6 Index Type

None

##### 1.22.3.5.7 Size

0

##### 1.22.3.5.8 Constraints

*No items available*

##### 1.22.3.5.9 Default Value

null

##### 1.22.3.5.10 Is Foreign Key

❌ No

##### 1.22.3.5.11 Precision

0

##### 1.22.3.5.12 Scale

0

#### 1.22.3.6.0 createdAt

##### 1.22.3.6.1 Name

createdAt

##### 1.22.3.6.2 Type

🔹 DateTime

##### 1.22.3.6.3 Is Required

✅ Yes

##### 1.22.3.6.4 Is Primary Key

❌ No

##### 1.22.3.6.5 Is Unique

❌ No

##### 1.22.3.6.6 Index Type

None

##### 1.22.3.6.7 Size

0

##### 1.22.3.6.8 Constraints

*No items available*

##### 1.22.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.22.3.6.10 Is Foreign Key

❌ No

##### 1.22.3.6.11 Precision

0

##### 1.22.3.6.12 Scale

0

#### 1.22.3.7.0 updatedAt

##### 1.22.3.7.1 Name

updatedAt

##### 1.22.3.7.2 Type

🔹 DateTime

##### 1.22.3.7.3 Is Required

✅ Yes

##### 1.22.3.7.4 Is Primary Key

❌ No

##### 1.22.3.7.5 Is Unique

❌ No

##### 1.22.3.7.6 Index Type

None

##### 1.22.3.7.7 Size

0

##### 1.22.3.7.8 Constraints

*No items available*

##### 1.22.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.22.3.7.10 Is Foreign Key

❌ No

##### 1.22.3.7.11 Precision

0

##### 1.22.3.7.12 Scale

0

### 1.22.4.0.0 Primary Keys

- requestId

### 1.22.5.0.0 Unique Constraints

- {'name': 'UC_AccountDeletionRequest_UserId', 'columns': ['userId']}

### 1.22.6.0.0 Indexes

- {'name': 'IX_AccountDeletionRequest_Status_ScheduledPurgeAt', 'columns': ['status', 'scheduledPurgeAt'], 'type': 'BTree'}

## 1.23.0.0.0 Role

### 1.23.1.0.0 Name

Role

### 1.23.2.0.0 Description

Defines the roles a user can have within the system, such as 'User' or 'Administrator'.

### 1.23.3.0.0 Attributes

#### 1.23.3.1.0 roleId

##### 1.23.3.1.1 Name

roleId

##### 1.23.3.1.2 Type

🔹 INT

##### 1.23.3.1.3 Is Required

✅ Yes

##### 1.23.3.1.4 Is Primary Key

✅ Yes

##### 1.23.3.1.5 Is Unique

✅ Yes

##### 1.23.3.1.6 Index Type

UniqueIndex

##### 1.23.3.1.7 Size

0

##### 1.23.3.1.8 Constraints

*No items available*

##### 1.23.3.1.9 Default Value

null

##### 1.23.3.1.10 Is Foreign Key

❌ No

##### 1.23.3.1.11 Precision

0

##### 1.23.3.1.12 Scale

0

#### 1.23.3.2.0 roleName

##### 1.23.3.2.1 Name

roleName

##### 1.23.3.2.2 Type

🔹 VARCHAR

##### 1.23.3.2.3 Is Required

✅ Yes

##### 1.23.3.2.4 Is Primary Key

❌ No

##### 1.23.3.2.5 Is Unique

✅ Yes

##### 1.23.3.2.6 Index Type

UniqueIndex

##### 1.23.3.2.7 Size

50

##### 1.23.3.2.8 Constraints

*No items available*

##### 1.23.3.2.9 Default Value

null

##### 1.23.3.2.10 Is Foreign Key

❌ No

##### 1.23.3.2.11 Precision

0

##### 1.23.3.2.12 Scale

0

### 1.23.4.0.0 Primary Keys

- roleId

### 1.23.5.0.0 Unique Constraints

- {'name': 'UC_Role_RoleName', 'columns': ['roleName']}

### 1.23.6.0.0 Indexes

*No items available*

## 1.24.0.0.0 UserRole

### 1.24.1.0.0 Name

UserRole

### 1.24.2.0.0 Description

Join table to assign Roles to Users, creating a many-to-many relationship.

### 1.24.3.0.0 Attributes

#### 1.24.3.1.0 userId

##### 1.24.3.1.1 Name

userId

##### 1.24.3.1.2 Type

🔹 Guid

##### 1.24.3.1.3 Is Required

✅ Yes

##### 1.24.3.1.4 Is Primary Key

✅ Yes

##### 1.24.3.1.5 Is Unique

❌ No

##### 1.24.3.1.6 Index Type

Index

##### 1.24.3.1.7 Size

0

##### 1.24.3.1.8 Constraints

*No items available*

##### 1.24.3.1.9 Default Value

null

##### 1.24.3.1.10 Is Foreign Key

✅ Yes

##### 1.24.3.1.11 Precision

0

##### 1.24.3.1.12 Scale

0

#### 1.24.3.2.0 roleId

##### 1.24.3.2.1 Name

roleId

##### 1.24.3.2.2 Type

🔹 INT

##### 1.24.3.2.3 Is Required

✅ Yes

##### 1.24.3.2.4 Is Primary Key

✅ Yes

##### 1.24.3.2.5 Is Unique

❌ No

##### 1.24.3.2.6 Index Type

Index

##### 1.24.3.2.7 Size

0

##### 1.24.3.2.8 Constraints

*No items available*

##### 1.24.3.2.9 Default Value

null

##### 1.24.3.2.10 Is Foreign Key

✅ Yes

##### 1.24.3.2.11 Precision

0

##### 1.24.3.2.12 Scale

0

### 1.24.4.0.0 Primary Keys

- userId
- roleId

### 1.24.5.0.0 Unique Constraints

*No items available*

### 1.24.6.0.0 Indexes

- {'name': 'IX_UserRole_RoleId', 'columns': ['roleId'], 'type': 'BTree'}

## 1.25.0.0.0 AdminAuditLog

### 1.25.1.0.0 Name

AdminAuditLog

### 1.25.2.0.0 Description

An immutable log of all actions performed by administrators in the Admin Dashboard.

### 1.25.3.0.0 Attributes

#### 1.25.3.1.0 logId

##### 1.25.3.1.1 Name

logId

##### 1.25.3.1.2 Type

🔹 Guid

##### 1.25.3.1.3 Is Required

✅ Yes

##### 1.25.3.1.4 Is Primary Key

✅ Yes

##### 1.25.3.1.5 Is Unique

✅ Yes

##### 1.25.3.1.6 Index Type

UniqueIndex

##### 1.25.3.1.7 Size

0

##### 1.25.3.1.8 Constraints

*No items available*

##### 1.25.3.1.9 Default Value

null

##### 1.25.3.1.10 Is Foreign Key

❌ No

##### 1.25.3.1.11 Precision

0

##### 1.25.3.1.12 Scale

0

#### 1.25.3.2.0 adminUserId

##### 1.25.3.2.1 Name

adminUserId

##### 1.25.3.2.2 Type

🔹 Guid

##### 1.25.3.2.3 Is Required

✅ Yes

##### 1.25.3.2.4 Is Primary Key

❌ No

##### 1.25.3.2.5 Is Unique

❌ No

##### 1.25.3.2.6 Index Type

Index

##### 1.25.3.2.7 Size

0

##### 1.25.3.2.8 Constraints

*No items available*

##### 1.25.3.2.9 Default Value

null

##### 1.25.3.2.10 Is Foreign Key

✅ Yes

##### 1.25.3.2.11 Precision

0

##### 1.25.3.2.12 Scale

0

#### 1.25.3.3.0 action

##### 1.25.3.3.1 Name

action

##### 1.25.3.3.2 Type

🔹 VARCHAR

##### 1.25.3.3.3 Is Required

✅ Yes

##### 1.25.3.3.4 Is Primary Key

❌ No

##### 1.25.3.3.5 Is Unique

❌ No

##### 1.25.3.3.6 Index Type

Index

##### 1.25.3.3.7 Size

255

##### 1.25.3.3.8 Constraints

*No items available*

##### 1.25.3.3.9 Default Value

null

##### 1.25.3.3.10 Is Foreign Key

❌ No

##### 1.25.3.3.11 Precision

0

##### 1.25.3.3.12 Scale

0

#### 1.25.3.4.0 targetEntityType

##### 1.25.3.4.1 Name

targetEntityType

##### 1.25.3.4.2 Type

🔹 VARCHAR

##### 1.25.3.4.3 Is Required

❌ No

##### 1.25.3.4.4 Is Primary Key

❌ No

##### 1.25.3.4.5 Is Unique

❌ No

##### 1.25.3.4.6 Index Type

Index

##### 1.25.3.4.7 Size

100

##### 1.25.3.4.8 Constraints

*No items available*

##### 1.25.3.4.9 Default Value

null

##### 1.25.3.4.10 Is Foreign Key

❌ No

##### 1.25.3.4.11 Precision

0

##### 1.25.3.4.12 Scale

0

#### 1.25.3.5.0 targetEntityId

##### 1.25.3.5.1 Name

targetEntityId

##### 1.25.3.5.2 Type

🔹 VARCHAR

##### 1.25.3.5.3 Is Required

❌ No

##### 1.25.3.5.4 Is Primary Key

❌ No

##### 1.25.3.5.5 Is Unique

❌ No

##### 1.25.3.5.6 Index Type

Index

##### 1.25.3.5.7 Size

255

##### 1.25.3.5.8 Constraints

*No items available*

##### 1.25.3.5.9 Default Value

null

##### 1.25.3.5.10 Is Foreign Key

❌ No

##### 1.25.3.5.11 Precision

0

##### 1.25.3.5.12 Scale

0

#### 1.25.3.6.0 details

##### 1.25.3.6.1 Name

details

##### 1.25.3.6.2 Type

🔹 JSONB

##### 1.25.3.6.3 Is Required

❌ No

##### 1.25.3.6.4 Is Primary Key

❌ No

##### 1.25.3.6.5 Is Unique

❌ No

##### 1.25.3.6.6 Index Type

None

##### 1.25.3.6.7 Size

0

##### 1.25.3.6.8 Constraints

*No items available*

##### 1.25.3.6.9 Default Value

null

##### 1.25.3.6.10 Is Foreign Key

❌ No

##### 1.25.3.6.11 Precision

0

##### 1.25.3.6.12 Scale

0

#### 1.25.3.7.0 createdAt

##### 1.25.3.7.1 Name

createdAt

##### 1.25.3.7.2 Type

🔹 DateTime

##### 1.25.3.7.3 Is Required

✅ Yes

##### 1.25.3.7.4 Is Primary Key

❌ No

##### 1.25.3.7.5 Is Unique

❌ No

##### 1.25.3.7.6 Index Type

Index

##### 1.25.3.7.7 Size

0

##### 1.25.3.7.8 Constraints

*No items available*

##### 1.25.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.25.3.7.10 Is Foreign Key

❌ No

##### 1.25.3.7.11 Precision

0

##### 1.25.3.7.12 Scale

0

### 1.25.4.0.0 Primary Keys

- logId

### 1.25.5.0.0 Unique Constraints

*No items available*

### 1.25.6.0.0 Indexes

#### 1.25.6.1.0 IX_AdminAuditLog_TargetEntity

##### 1.25.6.1.1 Name

IX_AdminAuditLog_TargetEntity

##### 1.25.6.1.2 Columns

- targetEntityType
- targetEntityId

##### 1.25.6.1.3 Type

🔹 BTree

#### 1.25.6.2.0 IX_AdminAuditLog_AdminUserId_CreatedAt

##### 1.25.6.2.1 Name

IX_AdminAuditLog_AdminUserId_CreatedAt

##### 1.25.6.2.2 Columns

- adminUserId
- createdAt

##### 1.25.6.2.3 Type

🔹 BTree

## 1.26.0.0.0 UserSecurityAuditLog

### 1.26.1.0.0 Name

UserSecurityAuditLog

### 1.26.2.0.0 Description

An immutable log of security-sensitive events related to a user's account. Partitioned by RANGE on createdAt (monthly or quarterly) for efficient data retention and time-bounded queries.

### 1.26.3.0.0 Attributes

#### 1.26.3.1.0 logId

##### 1.26.3.1.1 Name

logId

##### 1.26.3.1.2 Type

🔹 Guid

##### 1.26.3.1.3 Is Required

✅ Yes

##### 1.26.3.1.4 Is Primary Key

✅ Yes

##### 1.26.3.1.5 Is Unique

✅ Yes

##### 1.26.3.1.6 Index Type

UniqueIndex

##### 1.26.3.1.7 Size

0

##### 1.26.3.1.8 Constraints

*No items available*

##### 1.26.3.1.9 Default Value

null

##### 1.26.3.1.10 Is Foreign Key

❌ No

##### 1.26.3.1.11 Precision

0

##### 1.26.3.1.12 Scale

0

#### 1.26.3.2.0 userId

##### 1.26.3.2.1 Name

userId

##### 1.26.3.2.2 Type

🔹 Guid

##### 1.26.3.2.3 Is Required

✅ Yes

##### 1.26.3.2.4 Is Primary Key

❌ No

##### 1.26.3.2.5 Is Unique

❌ No

##### 1.26.3.2.6 Index Type

Index

##### 1.26.3.2.7 Size

0

##### 1.26.3.2.8 Constraints

*No items available*

##### 1.26.3.2.9 Default Value

null

##### 1.26.3.2.10 Is Foreign Key

✅ Yes

##### 1.26.3.2.11 Precision

0

##### 1.26.3.2.12 Scale

0

#### 1.26.3.3.0 action

##### 1.26.3.3.1 Name

action

##### 1.26.3.3.2 Type

🔹 VARCHAR

##### 1.26.3.3.3 Is Required

✅ Yes

##### 1.26.3.3.4 Is Primary Key

❌ No

##### 1.26.3.3.5 Is Unique

❌ No

##### 1.26.3.3.6 Index Type

Index

##### 1.26.3.3.7 Size

255

##### 1.26.3.3.8 Constraints

*No items available*

##### 1.26.3.3.9 Default Value

null

##### 1.26.3.3.10 Is Foreign Key

❌ No

##### 1.26.3.3.11 Precision

0

##### 1.26.3.3.12 Scale

0

#### 1.26.3.4.0 sourceIpAddress

##### 1.26.3.4.1 Name

sourceIpAddress

##### 1.26.3.4.2 Type

🔹 VARCHAR

##### 1.26.3.4.3 Is Required

❌ No

##### 1.26.3.4.4 Is Primary Key

❌ No

##### 1.26.3.4.5 Is Unique

❌ No

##### 1.26.3.4.6 Index Type

Index

##### 1.26.3.4.7 Size

45

##### 1.26.3.4.8 Constraints

*No items available*

##### 1.26.3.4.9 Default Value

null

##### 1.26.3.4.10 Is Foreign Key

❌ No

##### 1.26.3.4.11 Precision

0

##### 1.26.3.4.12 Scale

0

#### 1.26.3.5.0 details

##### 1.26.3.5.1 Name

details

##### 1.26.3.5.2 Type

🔹 JSONB

##### 1.26.3.5.3 Is Required

❌ No

##### 1.26.3.5.4 Is Primary Key

❌ No

##### 1.26.3.5.5 Is Unique

❌ No

##### 1.26.3.5.6 Index Type

None

##### 1.26.3.5.7 Size

0

##### 1.26.3.5.8 Constraints

*No items available*

##### 1.26.3.5.9 Default Value

null

##### 1.26.3.5.10 Is Foreign Key

❌ No

##### 1.26.3.5.11 Precision

0

##### 1.26.3.5.12 Scale

0

#### 1.26.3.6.0 createdAt

##### 1.26.3.6.1 Name

createdAt

##### 1.26.3.6.2 Type

🔹 DateTime

##### 1.26.3.6.3 Is Required

✅ Yes

##### 1.26.3.6.4 Is Primary Key

❌ No

##### 1.26.3.6.5 Is Unique

❌ No

##### 1.26.3.6.6 Index Type

Index

##### 1.26.3.6.7 Size

0

##### 1.26.3.6.8 Constraints

*No items available*

##### 1.26.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.26.3.6.10 Is Foreign Key

❌ No

##### 1.26.3.6.11 Precision

0

##### 1.26.3.6.12 Scale

0

### 1.26.4.0.0 Primary Keys

- logId

### 1.26.5.0.0 Unique Constraints

*No items available*

### 1.26.6.0.0 Indexes

- {'name': 'IX_UserSecurityAuditLog_UserId_CreatedAt', 'columns': ['userId', 'createdAt'], 'type': 'BTree'}

# 2.0.0.0.0 Relations

## 2.1.0.0.0 REL_USER_USERPROFILE_001

### 2.1.1.0.0 Name

UserHasOneProfile

### 2.1.2.0.0 Id

REL_USER_USERPROFILE_001

### 2.1.3.0.0 Source Entity

User

### 2.1.4.0.0 Target Entity

UserProfile

### 2.1.5.0.0 Type

🔹 OneToOne

### 2.1.6.0.0 Source Multiplicity

1

### 2.1.7.0.0 Target Multiplicity

1

### 2.1.8.0.0 Cascade Delete

✅ Yes

### 2.1.9.0.0 Is Identifying

✅ Yes

### 2.1.10.0.0 On Delete

Cascade

### 2.1.11.0.0 On Update

Cascade

### 2.1.12.0.0 Join Table

#### 2.1.12.1.0 Name

UserProfile

#### 2.1.12.2.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

## 2.2.0.0.0 REL_USERPROFILE_WORKEXPERIENCE_001

### 2.2.1.0.0 Name

ProfileHasManyWorkExperiences

### 2.2.2.0.0 Id

REL_USERPROFILE_WORKEXPERIENCE_001

### 2.2.3.0.0 Source Entity

UserProfile

### 2.2.4.0.0 Target Entity

WorkExperience

### 2.2.5.0.0 Type

🔹 OneToMany

### 2.2.6.0.0 Source Multiplicity

1

### 2.2.7.0.0 Target Multiplicity

0..*

### 2.2.8.0.0 Cascade Delete

✅ Yes

### 2.2.9.0.0 Is Identifying

✅ Yes

### 2.2.10.0.0 On Delete

Cascade

### 2.2.11.0.0 On Update

Cascade

### 2.2.12.0.0 Join Table

#### 2.2.12.1.0 Name

WorkExperience

#### 2.2.12.2.0 Columns

- {'name': 'userProfileId', 'type': 'Guid', 'references': 'UserProfile.userProfileId'}

## 2.3.0.0.0 REL_USERPROFILE_EDUCATION_001

### 2.3.1.0.0 Name

ProfileHasManyEducationEntries

### 2.3.2.0.0 Id

REL_USERPROFILE_EDUCATION_001

### 2.3.3.0.0 Source Entity

UserProfile

### 2.3.4.0.0 Target Entity

Education

### 2.3.5.0.0 Type

🔹 OneToMany

### 2.3.6.0.0 Source Multiplicity

1

### 2.3.7.0.0 Target Multiplicity

0..*

### 2.3.8.0.0 Cascade Delete

✅ Yes

### 2.3.9.0.0 Is Identifying

✅ Yes

### 2.3.10.0.0 On Delete

Cascade

### 2.3.11.0.0 On Update

Cascade

### 2.3.12.0.0 Join Table

#### 2.3.12.1.0 Name

Education

#### 2.3.12.2.0 Columns

- {'name': 'userProfileId', 'type': 'Guid', 'references': 'UserProfile.userProfileId'}

## 2.4.0.0.0 REL_USERPROFILE_SKILL_001

### 2.4.1.0.0 Name

ProfileHasManySkills

### 2.4.2.0.0 Id

REL_USERPROFILE_SKILL_001

### 2.4.3.0.0 Source Entity

UserProfile

### 2.4.4.0.0 Target Entity

Skill

### 2.4.5.0.0 Type

🔹 ManyToMany

### 2.4.6.0.0 Source Multiplicity

0..*

### 2.4.7.0.0 Target Multiplicity

0..*

### 2.4.8.0.0 Cascade Delete

❌ No

### 2.4.9.0.0 Is Identifying

❌ No

### 2.4.10.0.0 On Delete

Cascade

### 2.4.11.0.0 On Update

Cascade

### 2.4.12.0.0 Join Table

#### 2.4.12.1.0 Name

UserProfileSkill

#### 2.4.12.2.0 Columns

##### 2.4.12.2.1 userProfileId

###### 2.4.12.2.1.1 Name

userProfileId

###### 2.4.12.2.1.2 Type

🔹 Guid

###### 2.4.12.2.1.3 References

UserProfile.userProfileId

##### 2.4.12.2.2.0 skillId

###### 2.4.12.2.2.1 Name

skillId

###### 2.4.12.2.2.2 Type

🔹 Guid

###### 2.4.12.2.2.3 References

Skill.skillId

## 2.5.0.0.0.0 REL_USERPROFILE_SKILLENDORSEMENT_001

### 2.5.1.0.0.0 Name

ProfileReceivesManySkillEndorsements

### 2.5.2.0.0.0 Id

REL_USERPROFILE_SKILLENDORSEMENT_001

### 2.5.3.0.0.0 Source Entity

UserProfile

### 2.5.4.0.0.0 Target Entity

SkillEndorsement

### 2.5.5.0.0.0 Type

🔹 OneToMany

### 2.5.6.0.0.0 Source Multiplicity

1

### 2.5.7.0.0.0 Target Multiplicity

0..*

### 2.5.8.0.0.0 Cascade Delete

✅ Yes

### 2.5.9.0.0.0 Is Identifying

❌ No

### 2.5.10.0.0.0 On Delete

Cascade

### 2.5.11.0.0.0 On Update

Cascade

### 2.5.12.0.0.0 Join Table

#### 2.5.12.1.0.0 Name

SkillEndorsement

#### 2.5.12.2.0.0 Columns

- {'name': 'userProfileId', 'type': 'Guid', 'references': 'UserProfile.userProfileId'}

## 2.6.0.0.0.0 REL_SKILL_SKILLENDORSEMENT_001

### 2.6.1.0.0.0 Name

SkillHasManyEndorsements

### 2.6.2.0.0.0 Id

REL_SKILL_SKILLENDORSEMENT_001

### 2.6.3.0.0.0 Source Entity

Skill

### 2.6.4.0.0.0 Target Entity

SkillEndorsement

### 2.6.5.0.0.0 Type

🔹 OneToMany

### 2.6.6.0.0.0 Source Multiplicity

1

### 2.6.7.0.0.0 Target Multiplicity

0..*

### 2.6.8.0.0.0 Cascade Delete

✅ Yes

### 2.6.9.0.0.0 Is Identifying

❌ No

### 2.6.10.0.0.0 On Delete

Cascade

### 2.6.11.0.0.0 On Update

Cascade

### 2.6.12.0.0.0 Join Table

#### 2.6.12.1.0.0 Name

SkillEndorsement

#### 2.6.12.2.0.0 Columns

- {'name': 'skillId', 'type': 'Guid', 'references': 'Skill.skillId'}

## 2.7.0.0.0.0 REL_USER_SKILLENDORSEMENT_001

### 2.7.1.0.0.0 Name

UserGivesManySkillEndorsements

### 2.7.2.0.0.0 Id

REL_USER_SKILLENDORSEMENT_001

### 2.7.3.0.0.0 Source Entity

User

### 2.7.4.0.0.0 Target Entity

SkillEndorsement

### 2.7.5.0.0.0 Type

🔹 OneToMany

### 2.7.6.0.0.0 Source Multiplicity

1

### 2.7.7.0.0.0 Target Multiplicity

0..*

### 2.7.8.0.0.0 Cascade Delete

✅ Yes

### 2.7.9.0.0.0 Is Identifying

❌ No

### 2.7.10.0.0.0 On Delete

Cascade

### 2.7.11.0.0.0 On Update

Cascade

### 2.7.12.0.0.0 Join Table

#### 2.7.12.1.0.0 Name

SkillEndorsement

#### 2.7.12.2.0.0 Columns

- {'name': 'endorserUserId', 'type': 'Guid', 'references': 'User.userId'}

## 2.8.0.0.0.0 REL_USER_CONNECTION_REQUESTER_001

### 2.8.1.0.0.0 Name

UserSendsManyConnectionRequests

### 2.8.2.0.0.0 Id

REL_USER_CONNECTION_REQUESTER_001

### 2.8.3.0.0.0 Source Entity

User

### 2.8.4.0.0.0 Target Entity

Connection

### 2.8.5.0.0.0 Type

🔹 OneToMany

### 2.8.6.0.0.0 Source Multiplicity

1

### 2.8.7.0.0.0 Target Multiplicity

0..*

### 2.8.8.0.0.0 Cascade Delete

✅ Yes

### 2.8.9.0.0.0 Is Identifying

❌ No

### 2.8.10.0.0.0 On Delete

Cascade

### 2.8.11.0.0.0 On Update

Cascade

### 2.8.12.0.0.0 Join Table

#### 2.8.12.1.0.0 Name

Connection

#### 2.8.12.2.0.0 Columns

- {'name': 'requesterId', 'type': 'Guid', 'references': 'User.userId'}

## 2.9.0.0.0.0 REL_USER_CONNECTION_ADDRESSEE_001

### 2.9.1.0.0.0 Name

UserReceivesManyConnectionRequests

### 2.9.2.0.0.0 Id

REL_USER_CONNECTION_ADDRESSEE_001

### 2.9.3.0.0.0 Source Entity

User

### 2.9.4.0.0.0 Target Entity

Connection

### 2.9.5.0.0.0 Type

🔹 OneToMany

### 2.9.6.0.0.0 Source Multiplicity

1

### 2.9.7.0.0.0 Target Multiplicity

0..*

### 2.9.8.0.0.0 Cascade Delete

✅ Yes

### 2.9.9.0.0.0 Is Identifying

❌ No

### 2.9.10.0.0.0 On Delete

Cascade

### 2.9.11.0.0.0 On Update

Cascade

### 2.9.12.0.0.0 Join Table

#### 2.9.12.1.0.0 Name

Connection

#### 2.9.12.2.0.0 Columns

- {'name': 'addresseeId', 'type': 'Guid', 'references': 'User.userId'}

## 2.10.0.0.0.0 REL_USER_POST_001

### 2.10.1.0.0.0 Name

UserAuthorsManyPosts

### 2.10.2.0.0.0 Id

REL_USER_POST_001

### 2.10.3.0.0.0 Source Entity

User

### 2.10.4.0.0.0 Target Entity

Post

### 2.10.5.0.0.0 Type

🔹 OneToMany

### 2.10.6.0.0.0 Source Multiplicity

1

### 2.10.7.0.0.0 Target Multiplicity

0..*

### 2.10.8.0.0.0 Cascade Delete

✅ Yes

### 2.10.9.0.0.0 Is Identifying

❌ No

### 2.10.10.0.0.0 On Delete

Cascade

### 2.10.11.0.0.0 On Update

Cascade

### 2.10.12.0.0.0 Join Table

#### 2.10.12.1.0.0 Name

Post

#### 2.10.12.2.0.0 Columns

- {'name': 'authorId', 'type': 'Guid', 'references': 'User.userId'}

## 2.11.0.0.0.0 REL_POST_MEDIA_001

### 2.11.1.0.0.0 Name

PostHasManyMedia

### 2.11.2.0.0.0 Id

REL_POST_MEDIA_001

### 2.11.3.0.0.0 Source Entity

Post

### 2.11.4.0.0.0 Target Entity

Media

### 2.11.5.0.0.0 Type

🔹 ManyToMany

### 2.11.6.0.0.0 Source Multiplicity

0..*

### 2.11.7.0.0.0 Target Multiplicity

0..*

### 2.11.8.0.0.0 Cascade Delete

❌ No

### 2.11.9.0.0.0 Is Identifying

❌ No

### 2.11.10.0.0.0 On Delete

Cascade

### 2.11.11.0.0.0 On Update

Cascade

### 2.11.12.0.0.0 Join Table

#### 2.11.12.1.0.0 Name

PostMedia

#### 2.11.12.2.0.0 Columns

##### 2.11.12.2.1.0 postId

###### 2.11.12.2.1.1 Name

postId

###### 2.11.12.2.1.2 Type

🔹 Guid

###### 2.11.12.2.1.3 References

Post.postId

##### 2.11.12.2.2.0 mediaId

###### 2.11.12.2.2.1 Name

mediaId

###### 2.11.12.2.2.2 Type

🔹 Guid

###### 2.11.12.2.2.3 References

Media.mediaId

## 2.12.0.0.0.0 REL_USER_MEDIA_001

### 2.12.1.0.0.0 Name

UserUploadsManyMedia

### 2.12.2.0.0.0 Id

REL_USER_MEDIA_001

### 2.12.3.0.0.0 Source Entity

User

### 2.12.4.0.0.0 Target Entity

Media

### 2.12.5.0.0.0 Type

🔹 OneToMany

### 2.12.6.0.0.0 Source Multiplicity

1

### 2.12.7.0.0.0 Target Multiplicity

0..*

### 2.12.8.0.0.0 Cascade Delete

✅ Yes

### 2.12.9.0.0.0 Is Identifying

❌ No

### 2.12.10.0.0.0 On Delete

Cascade

### 2.12.11.0.0.0 On Update

Cascade

### 2.12.12.0.0.0 Join Table

#### 2.12.12.1.0.0 Name

Media

#### 2.12.12.2.0.0 Columns

- {'name': 'uploaderId', 'type': 'Guid', 'references': 'User.userId'}

## 2.13.0.0.0.0 REL_USER_POST_REACTION_001

### 2.13.1.0.0.0 Name

UserReactsToManyPosts

### 2.13.2.0.0.0 Id

REL_USER_POST_REACTION_001

### 2.13.3.0.0.0 Source Entity

User

### 2.13.4.0.0.0 Target Entity

Post

### 2.13.5.0.0.0 Type

🔹 ManyToMany

### 2.13.6.0.0.0 Source Multiplicity

0..*

### 2.13.7.0.0.0 Target Multiplicity

0..*

### 2.13.8.0.0.0 Cascade Delete

❌ No

### 2.13.9.0.0.0 Is Identifying

❌ No

### 2.13.10.0.0.0 On Delete

Cascade

### 2.13.11.0.0.0 On Update

Cascade

### 2.13.12.0.0.0 Join Table

#### 2.13.12.1.0.0 Name

PostReaction

#### 2.13.12.2.0.0 Columns

##### 2.13.12.2.1.0 userId

###### 2.13.12.2.1.1 Name

userId

###### 2.13.12.2.1.2 Type

🔹 Guid

###### 2.13.12.2.1.3 References

User.userId

##### 2.13.12.2.2.0 postId

###### 2.13.12.2.2.1 Name

postId

###### 2.13.12.2.2.2 Type

🔹 Guid

###### 2.13.12.2.2.3 References

Post.postId

## 2.14.0.0.0.0 REL_POST_COMMENT_001

### 2.14.1.0.0.0 Name

PostHasManyComments

### 2.14.2.0.0.0 Id

REL_POST_COMMENT_001

### 2.14.3.0.0.0 Source Entity

Post

### 2.14.4.0.0.0 Target Entity

Comment

### 2.14.5.0.0.0 Type

🔹 OneToMany

### 2.14.6.0.0.0 Source Multiplicity

1

### 2.14.7.0.0.0 Target Multiplicity

0..*

### 2.14.8.0.0.0 Cascade Delete

✅ Yes

### 2.14.9.0.0.0 Is Identifying

✅ Yes

### 2.14.10.0.0.0 On Delete

Cascade

### 2.14.11.0.0.0 On Update

Cascade

### 2.14.12.0.0.0 Join Table

#### 2.14.12.1.0.0 Name

Comment

#### 2.14.12.2.0.0 Columns

- {'name': 'postId', 'type': 'Guid', 'references': 'Post.postId'}

## 2.15.0.0.0.0 REL_USER_COMMENT_001

### 2.15.1.0.0.0 Name

UserAuthorsManyComments

### 2.15.2.0.0.0 Id

REL_USER_COMMENT_001

### 2.15.3.0.0.0 Source Entity

User

### 2.15.4.0.0.0 Target Entity

Comment

### 2.15.5.0.0.0 Type

🔹 OneToMany

### 2.15.6.0.0.0 Source Multiplicity

1

### 2.15.7.0.0.0 Target Multiplicity

0..*

### 2.15.8.0.0.0 Cascade Delete

✅ Yes

### 2.15.9.0.0.0 Is Identifying

❌ No

### 2.15.10.0.0.0 On Delete

Cascade

### 2.15.11.0.0.0 On Update

Cascade

### 2.15.12.0.0.0 Join Table

#### 2.15.12.1.0.0 Name

Comment

#### 2.15.12.2.0.0 Columns

- {'name': 'authorId', 'type': 'Guid', 'references': 'User.userId'}

## 2.16.0.0.0.0 REL_USER_CONTENTREPORT_001

### 2.16.1.0.0.0 Name

UserCreatesManyContentReports

### 2.16.2.0.0.0 Id

REL_USER_CONTENTREPORT_001

### 2.16.3.0.0.0 Source Entity

User

### 2.16.4.0.0.0 Target Entity

ContentReport

### 2.16.5.0.0.0 Type

🔹 OneToMany

### 2.16.6.0.0.0 Source Multiplicity

1

### 2.16.7.0.0.0 Target Multiplicity

0..*

### 2.16.8.0.0.0 Cascade Delete

❌ No

### 2.16.9.0.0.0 Is Identifying

❌ No

### 2.16.10.0.0.0 On Delete

SetNull

### 2.16.11.0.0.0 On Update

Cascade

### 2.16.12.0.0.0 Join Table

#### 2.16.12.1.0.0 Name

ContentReport

#### 2.16.12.2.0.0 Columns

- {'name': 'reporterId', 'type': 'Guid', 'references': 'User.userId'}

## 2.17.0.0.0.0 REL_POST_CONTENTREPORT_001

### 2.17.1.0.0.0 Name

PostCanBeReported

### 2.17.2.0.0.0 Id

REL_POST_CONTENTREPORT_001

### 2.17.3.0.0.0 Source Entity

Post

### 2.17.4.0.0.0 Target Entity

ContentReport

### 2.17.5.0.0.0 Type

🔹 OneToMany

### 2.17.6.0.0.0 Source Multiplicity

1

### 2.17.7.0.0.0 Target Multiplicity

0..*

### 2.17.8.0.0.0 Cascade Delete

✅ Yes

### 2.17.9.0.0.0 Is Identifying

❌ No

### 2.17.10.0.0.0 On Delete

Cascade

### 2.17.11.0.0.0 On Update

Cascade

### 2.17.12.0.0.0 Join Table

#### 2.17.12.1.0.0 Name

ContentReport

#### 2.17.12.2.0.0 Columns

- {'name': 'reportedPostId', 'type': 'Guid', 'references': 'Post.postId'}

## 2.18.0.0.0.0 REL_COMMENT_CONTENTREPORT_001

### 2.18.1.0.0.0 Name

CommentCanBeReported

### 2.18.2.0.0.0 Id

REL_COMMENT_CONTENTREPORT_001

### 2.18.3.0.0.0 Source Entity

Comment

### 2.18.4.0.0.0 Target Entity

ContentReport

### 2.18.5.0.0.0 Type

🔹 OneToMany

### 2.18.6.0.0.0 Source Multiplicity

1

### 2.18.7.0.0.0 Target Multiplicity

0..*

### 2.18.8.0.0.0 Cascade Delete

✅ Yes

### 2.18.9.0.0.0 Is Identifying

❌ No

### 2.18.10.0.0.0 On Delete

Cascade

### 2.18.11.0.0.0 On Update

Cascade

### 2.18.12.0.0.0 Join Table

#### 2.18.12.1.0.0 Name

ContentReport

#### 2.18.12.2.0.0 Columns

- {'name': 'reportedCommentId', 'type': 'Guid', 'references': 'Comment.commentId'}

## 2.19.0.0.0.0 REL_USER_CONVERSATION_001

### 2.19.1.0.0.0 Name

UserParticipatesInManyConversations

### 2.19.2.0.0.0 Id

REL_USER_CONVERSATION_001

### 2.19.3.0.0.0 Source Entity

User

### 2.19.4.0.0.0 Target Entity

Conversation

### 2.19.5.0.0.0 Type

🔹 ManyToMany

### 2.19.6.0.0.0 Source Multiplicity

0..*

### 2.19.7.0.0.0 Target Multiplicity

0..*

### 2.19.8.0.0.0 Cascade Delete

❌ No

### 2.19.9.0.0.0 Is Identifying

❌ No

### 2.19.10.0.0.0 On Delete

Cascade

### 2.19.11.0.0.0 On Update

Cascade

### 2.19.12.0.0.0 Join Table

#### 2.19.12.1.0.0 Name

ConversationParticipant

#### 2.19.12.2.0.0 Columns

##### 2.19.12.2.1.0 userId

###### 2.19.12.2.1.1 Name

userId

###### 2.19.12.2.1.2 Type

🔹 Guid

###### 2.19.12.2.1.3 References

User.userId

##### 2.19.12.2.2.0 conversationId

###### 2.19.12.2.2.1 Name

conversationId

###### 2.19.12.2.2.2 Type

🔹 Guid

###### 2.19.12.2.2.3 References

Conversation.conversationId

## 2.20.0.0.0.0 REL_CONVERSATION_MESSAGE_001

### 2.20.1.0.0.0 Name

ConversationHasManyMessages

### 2.20.2.0.0.0 Id

REL_CONVERSATION_MESSAGE_001

### 2.20.3.0.0.0 Source Entity

Conversation

### 2.20.4.0.0.0 Target Entity

Message

### 2.20.5.0.0.0 Type

🔹 OneToMany

### 2.20.6.0.0.0 Source Multiplicity

1

### 2.20.7.0.0.0 Target Multiplicity

0..*

### 2.20.8.0.0.0 Cascade Delete

✅ Yes

### 2.20.9.0.0.0 Is Identifying

✅ Yes

### 2.20.10.0.0.0 On Delete

Cascade

### 2.20.11.0.0.0 On Update

Cascade

### 2.20.12.0.0.0 Join Table

#### 2.20.12.1.0.0 Name

Message

#### 2.20.12.2.0.0 Columns

- {'name': 'conversationId', 'type': 'Guid', 'references': 'Conversation.conversationId'}

## 2.21.0.0.0.0 REL_USER_MESSAGE_001

### 2.21.1.0.0.0 Name

UserSendsManyMessages

### 2.21.2.0.0.0 Id

REL_USER_MESSAGE_001

### 2.21.3.0.0.0 Source Entity

User

### 2.21.4.0.0.0 Target Entity

Message

### 2.21.5.0.0.0 Type

🔹 OneToMany

### 2.21.6.0.0.0 Source Multiplicity

1

### 2.21.7.0.0.0 Target Multiplicity

0..*

### 2.21.8.0.0.0 Cascade Delete

✅ Yes

### 2.21.9.0.0.0 Is Identifying

❌ No

### 2.21.10.0.0.0 On Delete

Cascade

### 2.21.11.0.0.0 On Update

Cascade

### 2.21.12.0.0.0 Join Table

#### 2.21.12.1.0.0 Name

Message

#### 2.21.12.2.0.0 Columns

- {'name': 'senderId', 'type': 'Guid', 'references': 'User.userId'}

## 2.22.0.0.0.0 REL_MESSAGE_MESSAGESTATUS_001

### 2.22.1.0.0.0 Name

MessageHasManyStatuses

### 2.22.2.0.0.0 Id

REL_MESSAGE_MESSAGESTATUS_001

### 2.22.3.0.0.0 Source Entity

Message

### 2.22.4.0.0.0 Target Entity

MessageStatus

### 2.22.5.0.0.0 Type

🔹 OneToMany

### 2.22.6.0.0.0 Source Multiplicity

1

### 2.22.7.0.0.0 Target Multiplicity

0..*

### 2.22.8.0.0.0 Cascade Delete

✅ Yes

### 2.22.9.0.0.0 Is Identifying

✅ Yes

### 2.22.10.0.0.0 On Delete

Cascade

### 2.22.11.0.0.0 On Update

Cascade

### 2.22.12.0.0.0 Join Table

#### 2.22.12.1.0.0 Name

MessageStatus

#### 2.22.12.2.0.0 Columns

- {'name': 'messageId', 'type': 'Guid', 'references': 'Message.messageId'}

## 2.23.0.0.0.0 REL_USER_MESSAGESTATUS_001

### 2.23.1.0.0.0 Name

UserHasManyMessageStatuses

### 2.23.2.0.0.0 Id

REL_USER_MESSAGESTATUS_001

### 2.23.3.0.0.0 Source Entity

User

### 2.23.4.0.0.0 Target Entity

MessageStatus

### 2.23.5.0.0.0 Type

🔹 OneToMany

### 2.23.6.0.0.0 Source Multiplicity

1

### 2.23.7.0.0.0 Target Multiplicity

0..*

### 2.23.8.0.0.0 Cascade Delete

✅ Yes

### 2.23.9.0.0.0 Is Identifying

❌ No

### 2.23.10.0.0.0 On Delete

Cascade

### 2.23.11.0.0.0 On Update

Cascade

### 2.23.12.0.0.0 Join Table

#### 2.23.12.1.0.0 Name

MessageStatus

#### 2.23.12.2.0.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

## 2.24.0.0.0.0 REL_USER_NOTIFICATION_RECIPIENT_001

### 2.24.1.0.0.0 Name

UserReceivesManyNotifications

### 2.24.2.0.0.0 Id

REL_USER_NOTIFICATION_RECIPIENT_001

### 2.24.3.0.0.0 Source Entity

User

### 2.24.4.0.0.0 Target Entity

Notification

### 2.24.5.0.0.0 Type

🔹 OneToMany

### 2.24.6.0.0.0 Source Multiplicity

1

### 2.24.7.0.0.0 Target Multiplicity

0..*

### 2.24.8.0.0.0 Cascade Delete

✅ Yes

### 2.24.9.0.0.0 Is Identifying

❌ No

### 2.24.10.0.0.0 On Delete

Cascade

### 2.24.11.0.0.0 On Update

Cascade

### 2.24.12.0.0.0 Join Table

#### 2.24.12.1.0.0 Name

Notification

#### 2.24.12.2.0.0 Columns

- {'name': 'recipientId', 'type': 'Guid', 'references': 'User.userId'}

## 2.25.0.0.0.0 REL_USER_NOTIFICATION_ACTOR_001

### 2.25.1.0.0.0 Name

UserCausesManyNotifications

### 2.25.2.0.0.0 Id

REL_USER_NOTIFICATION_ACTOR_001

### 2.25.3.0.0.0 Source Entity

User

### 2.25.4.0.0.0 Target Entity

Notification

### 2.25.5.0.0.0 Type

🔹 OneToMany

### 2.25.6.0.0.0 Source Multiplicity

1

### 2.25.7.0.0.0 Target Multiplicity

0..*

### 2.25.8.0.0.0 Cascade Delete

❌ No

### 2.25.9.0.0.0 Is Identifying

❌ No

### 2.25.10.0.0.0 On Delete

SetNull

### 2.25.11.0.0.0 On Update

Cascade

### 2.25.12.0.0.0 Join Table

#### 2.25.12.1.0.0 Name

Notification

#### 2.25.12.2.0.0 Columns

- {'name': 'actorId', 'type': 'Guid', 'references': 'User.userId'}

## 2.26.0.0.0.0 REL_USER_USERNOTIFICATIONSETTING_001

### 2.26.1.0.0.0 Name

UserHasManyNotificationSettings

### 2.26.2.0.0.0 Id

REL_USER_USERNOTIFICATIONSETTING_001

### 2.26.3.0.0.0 Source Entity

User

### 2.26.4.0.0.0 Target Entity

UserNotificationSetting

### 2.26.5.0.0.0 Type

🔹 OneToMany

### 2.26.6.0.0.0 Source Multiplicity

1

### 2.26.7.0.0.0 Target Multiplicity

0..*

### 2.26.8.0.0.0 Cascade Delete

✅ Yes

### 2.26.9.0.0.0 Is Identifying

✅ Yes

### 2.26.10.0.0.0 On Delete

Cascade

### 2.26.11.0.0.0 On Update

Cascade

### 2.26.12.0.0.0 Join Table

#### 2.26.12.1.0.0 Name

UserNotificationSetting

#### 2.26.12.2.0.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

## 2.27.0.0.0.0 REL_USER_USERTOKEN_001

### 2.27.1.0.0.0 Name

UserHasManyTokens

### 2.27.2.0.0.0 Id

REL_USER_USERTOKEN_001

### 2.27.3.0.0.0 Source Entity

User

### 2.27.4.0.0.0 Target Entity

UserToken

### 2.27.5.0.0.0 Type

🔹 OneToMany

### 2.27.6.0.0.0 Source Multiplicity

1

### 2.27.7.0.0.0 Target Multiplicity

0..*

### 2.27.8.0.0.0 Cascade Delete

✅ Yes

### 2.27.9.0.0.0 Is Identifying

❌ No

### 2.27.10.0.0.0 On Delete

Cascade

### 2.27.11.0.0.0 On Update

Cascade

### 2.27.12.0.0.0 Join Table

#### 2.27.12.1.0.0 Name

UserToken

#### 2.27.12.2.0.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

## 2.28.0.0.0.0 REL_USER_ACCOUNTDELETIONREQUEST_001

### 2.28.1.0.0.0 Name

UserHasOneAccountDeletionRequest

### 2.28.2.0.0.0 Id

REL_USER_ACCOUNTDELETIONREQUEST_001

### 2.28.3.0.0.0 Source Entity

User

### 2.28.4.0.0.0 Target Entity

AccountDeletionRequest

### 2.28.5.0.0.0 Type

🔹 OneToOne

### 2.28.6.0.0.0 Source Multiplicity

1

### 2.28.7.0.0.0 Target Multiplicity

0..1

### 2.28.8.0.0.0 Cascade Delete

✅ Yes

### 2.28.9.0.0.0 Is Identifying

✅ Yes

### 2.28.10.0.0.0 On Delete

Cascade

### 2.28.11.0.0.0 On Update

Cascade

### 2.28.12.0.0.0 Join Table

#### 2.28.12.1.0.0 Name

AccountDeletionRequest

#### 2.28.12.2.0.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

## 2.29.0.0.0.0 REL_USER_ROLE_001

### 2.29.1.0.0.0 Name

UserHasManyRoles

### 2.29.2.0.0.0 Id

REL_USER_ROLE_001

### 2.29.3.0.0.0 Source Entity

User

### 2.29.4.0.0.0 Target Entity

Role

### 2.29.5.0.0.0 Type

🔹 ManyToMany

### 2.29.6.0.0.0 Source Multiplicity

0..*

### 2.29.7.0.0.0 Target Multiplicity

0..*

### 2.29.8.0.0.0 Cascade Delete

❌ No

### 2.29.9.0.0.0 Is Identifying

❌ No

### 2.29.10.0.0.0 On Delete

Cascade

### 2.29.11.0.0.0 On Update

Cascade

### 2.29.12.0.0.0 Join Table

#### 2.29.12.1.0.0 Name

UserRole

#### 2.29.12.2.0.0 Columns

##### 2.29.12.2.1.0 userId

###### 2.29.12.2.1.1 Name

userId

###### 2.29.12.2.1.2 Type

🔹 Guid

###### 2.29.12.2.1.3 References

User.userId

##### 2.29.12.2.2.0 roleId

###### 2.29.12.2.2.1 Name

roleId

###### 2.29.12.2.2.2 Type

🔹 INT

###### 2.29.12.2.2.3 References

Role.roleId

## 2.30.0.0.0.0 REL_USER_ADMINAUDITLOG_001

### 2.30.1.0.0.0 Name

AdminUserCreatesManyAuditLogs

### 2.30.2.0.0.0 Id

REL_USER_ADMINAUDITLOG_001

### 2.30.3.0.0.0 Source Entity

User

### 2.30.4.0.0.0 Target Entity

AdminAuditLog

### 2.30.5.0.0.0 Type

🔹 OneToMany

### 2.30.6.0.0.0 Source Multiplicity

1

### 2.30.7.0.0.0 Target Multiplicity

0..*

### 2.30.8.0.0.0 Cascade Delete

❌ No

### 2.30.9.0.0.0 Is Identifying

❌ No

### 2.30.10.0.0.0 On Delete

Restrict

### 2.30.11.0.0.0 On Update

Cascade

### 2.30.12.0.0.0 Join Table

#### 2.30.12.1.0.0 Name

AdminAuditLog

#### 2.30.12.2.0.0 Columns

- {'name': 'adminUserId', 'type': 'Guid', 'references': 'User.userId'}

## 2.31.0.0.0.0 REL_USER_USERSECURITYAUDITLOG_001

### 2.31.1.0.0.0 Name

UserHasManySecurityAuditLogs

### 2.31.2.0.0.0 Id

REL_USER_USERSECURITYAUDITLOG_001

### 2.31.3.0.0.0 Source Entity

User

### 2.31.4.0.0.0 Target Entity

UserSecurityAuditLog

### 2.31.5.0.0.0 Type

🔹 OneToMany

### 2.31.6.0.0.0 Source Multiplicity

1

### 2.31.7.0.0.0 Target Multiplicity

0..*

### 2.31.8.0.0.0 Cascade Delete

✅ Yes

### 2.31.9.0.0.0 Is Identifying

❌ No

### 2.31.10.0.0.0 On Delete

Cascade

### 2.31.11.0.0.0 On Update

Cascade

### 2.31.12.0.0.0 Join Table

#### 2.31.12.1.0.0 Name

UserSecurityAuditLog

#### 2.31.12.2.0.0 Columns

- {'name': 'userId', 'type': 'Guid', 'references': 'User.userId'}

