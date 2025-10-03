import { gql } from '@apollo/client';

// REQ-1-008, US-021
export const UPDATE_BASIC_PROFILE = gql`
  mutation UpdateBasicProfile($name: String, $headline: String, $location: String) {
    updateBasicProfile(name: $name, headline: $headline, location: $location) {
      id
      name
      headline
      location
    }
  }
`;

// REQ-1-012, US-030
export const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($file: Upload!) {
    updateProfilePicture(file: $file) {
      id
      pictureUrl
    }
  }
`;

// REQ-1-012, US-031
export const UPDATE_PROFILE_BANNER = gql`
  mutation UpdateProfileBanner($file: Upload!) {
    updateProfileBanner(file: $file) {
      id
      bannerUrl
    }
  }
`;

// REQ-1-009, US-022
export const ADD_WORK_EXPERIENCE = gql`
  mutation AddWorkExperience($company: String!, $title: String!, $startDate: DateTime!, $endDate: DateTime, $description: String) {
    addWorkExperience(company: $company, title: $title, startDate: $startDate, endDate: $endDate, description: $description) {
      id
      company
      title
      startDate
      endDate
      description
    }
  }
`;

// REQ-1-009, US-023
export const UPDATE_WORK_EXPERIENCE = gql`
  mutation UpdateWorkExperience($workExperienceId: ID!, $company: String, $title: String, $startDate: DateTime, $endDate: DateTime, $description: String) {
    updateWorkExperience(workExperienceId: $workExperienceId, company: $company, title: $title, startDate: $startDate, endDate: $endDate, description: $description) {
      id
      company
      title
      startDate
      endDate
      description
    }
  }
`;

// REQ-1-009, US-024
export const DELETE_WORK_EXPERIENCE = gql`
  mutation DeleteWorkExperience($workExperienceId: ID!) {
    deleteWorkExperience(workExperienceId: $workExperienceId)
  }
`;

// REQ-1-010, US-025
export const ADD_EDUCATION = gql`
  mutation AddEducation($institution: String!, $degree: String!, $fieldOfStudy: String!, $startDate: DateTime!, $endDate: DateTime) {
    addEducation(institution: $institution, degree: $degree, fieldOfStudy: $fieldOfStudy, startDate: $startDate, endDate: $endDate) {
      id
      institution
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`;

// REQ-1-010, US-026
export const UPDATE_EDUCATION = gql`
  mutation UpdateEducation($educationId: ID!, $institution: String, $degree: String, $fieldOfStudy: String, $startDate: DateTime, $endDate: DateTime) {
    updateEducation(educationId: $educationId, institution: $institution, degree: $degree, fieldOfStudy: $fieldOfStudy, startDate: $startDate, endDate: $endDate) {
      id
      institution
      degree
      fieldOfStudy
      startDate
      endDate
    }
  }
`;

// REQ-1-010, US-027
export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($educationId: ID!) {
    deleteEducation(educationId: $educationId)
  }
`;

// REQ-1-011, US-028
export const ADD_SKILL = gql`
  mutation AddSkill($name: String!) {
    addSkill(name: $name) {
      id
      name
      endorsementCount
    }
  }
`;

// REQ-1-011, US-029
export const DELETE_SKILL = gql`
  mutation DeleteSkill($skillId: ID!) {
    deleteSkill(skillId: $skillId)
  }
`;

// REQ-1-013, US-032
export const UPDATE_CUSTOM_URL = gql`
  mutation UpdateCustomUrl($slug: String!) {
    updateCustomUrl(slug: $slug) {
      id
      customUrlSlug
    }
  }
`;

// REQ-1-014, US-034
export const UPDATE_PROFILE_VISIBILITY = gql`
  mutation UpdateProfileVisibility($visibility: ProfileVisibility!) {
    updateProfileVisibility(visibility: $visibility) {
      id
      visibility
    }
  }
`;