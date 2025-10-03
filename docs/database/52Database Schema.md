# 1 Title

Professional Networking Platform - Social Graph Database

# 2 Name

professional_network_graph_db

# 3 Db Type

- graph

# 4 Db Technology

AWS Neptune

# 5 Entities

## 5.1 UserNode

### 5.1.1 Name

UserNode

### 5.1.2 Description

Owner: Connections Service. Represents a user as a node (vertex) in the social graph.

### 5.1.3 Attributes

#### 5.1.3.1 nodeId

##### 5.1.3.1.1 Name

nodeId

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

- Corresponds to User.userId

##### 5.1.3.1.8 Precision

0

##### 5.1.3.1.9 Scale

0

##### 5.1.3.1.10 Is Foreign Key

❌ No

#### 5.1.3.2.0 label

##### 5.1.3.2.1 Name

label

##### 5.1.3.2.2 Type

🔹 String

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

0

##### 5.1.3.2.6 Is Unique

❌ No

##### 5.1.3.2.7 Constraints

- Value: 'User'

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- nodeId

### 5.1.5.0.0 Unique Constraints

*No items available*

### 5.1.6.0.0 Indexes

*No items available*

## 5.2.0.0.0 ConnectedToEdge

### 5.2.1.0.0 Name

ConnectedToEdge

### 5.2.2.0.0 Description

Owner: Connections Service. Represents a connection as a directed edge between two User nodes. A bidirectional connection is represented by two directed edges.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 sourceNode

##### 5.2.3.1.1 Name

sourceNode

##### 5.2.3.1.2 Type

🔹 Guid

##### 5.2.3.1.3 Is Required

✅ Yes

##### 5.2.3.1.4 Is Primary Key

✅ Yes

##### 5.2.3.1.5 Size

0

##### 5.2.3.1.6 Is Unique

❌ No

##### 5.2.3.1.7 Constraints

*No items available*

##### 5.2.3.1.8 Precision

0

##### 5.2.3.1.9 Scale

0

##### 5.2.3.1.10 Is Foreign Key

✅ Yes

#### 5.2.3.2.0 targetNode

##### 5.2.3.2.1 Name

targetNode

##### 5.2.3.2.2 Type

🔹 Guid

##### 5.2.3.2.3 Is Required

✅ Yes

##### 5.2.3.2.4 Is Primary Key

✅ Yes

##### 5.2.3.2.5 Size

0

##### 5.2.3.2.6 Is Unique

❌ No

##### 5.2.3.2.7 Constraints

*No items available*

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

✅ Yes

#### 5.2.3.3.0 label

##### 5.2.3.3.1 Name

label

##### 5.2.3.3.2 Type

🔹 String

##### 5.2.3.3.3 Is Required

✅ Yes

##### 5.2.3.3.4 Is Primary Key

❌ No

##### 5.2.3.3.5 Size

0

##### 5.2.3.3.6 Is Unique

❌ No

##### 5.2.3.3.7 Constraints

- Value: 'CONNECTED_TO'

##### 5.2.3.3.8 Precision

0

##### 5.2.3.3.9 Scale

0

##### 5.2.3.3.10 Is Foreign Key

❌ No

#### 5.2.3.4.0 connectedAt

##### 5.2.3.4.1 Name

connectedAt

##### 5.2.3.4.2 Type

🔹 DateTime

##### 5.2.3.4.3 Is Required

✅ Yes

##### 5.2.3.4.4 Is Primary Key

❌ No

##### 5.2.3.4.5 Size

0

##### 5.2.3.4.6 Is Unique

❌ No

##### 5.2.3.4.7 Constraints

*No items available*

##### 5.2.3.4.8 Precision

0

##### 5.2.3.4.9 Scale

0

##### 5.2.3.4.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- sourceNode
- targetNode

### 5.2.5.0.0 Unique Constraints

*No items available*

### 5.2.6.0.0 Indexes

*No items available*

