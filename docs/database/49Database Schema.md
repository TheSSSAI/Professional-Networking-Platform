# 1 Title

Professional Networking Platform - Search Database

# 2 Name

professional_network_search_db

# 3 Db Type

- search

# 4 Db Technology

OpenSearch

# 5 Entities

- {'name': 'UserProfileIndex', 'description': 'Owner: Search Service. A denormalized document index for fast, full-text search of user profiles. Data is synchronized from the User Profile service via events.', 'attributes': [{'name': 'userId', 'type': 'keyword', 'isRequired': True, 'isPrimaryKey': True, 'size': 0, 'isUnique': True, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'fullName', 'type': 'text', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'headline', 'type': 'text', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'location', 'type': 'text', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'profilePictureUrl', 'type': 'keyword', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['indexed: false'], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'customUrlSlug', 'type': 'keyword', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'visibility', 'type': 'keyword', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'skills', 'type': 'text', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'workExperience', 'type': 'nested', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ["properties: { title: 'text', companyName: 'text' }"], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'education', 'type': 'nested', 'isRequired': False, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ["properties: { institutionName: 'text', degree: 'text', fieldOfStudy: 'text' }"], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'updatedAt', 'type': 'date', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}], 'primaryKeys': ['userId'], 'uniqueConstraints': [], 'indexes': []}

