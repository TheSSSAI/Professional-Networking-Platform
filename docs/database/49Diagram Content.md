erDiagram
    UserProfileIndex {
        keyword userId PK
        text fullName
        text headline
        text location
        keyword profilePictureUrl "indexed: false"
        keyword customUrlSlug
        keyword visibility
        text skills
        nested workExperience "properties: { title: 'text', companyName: 'text' }"
        nested education "properties: { institutionName: 'text', degree: 'text', fieldOfStudy: 'text' }"
        date updatedAt
    }