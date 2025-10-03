import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  author: UserSummary;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  post: Post;
  updatedAt: Scalars['DateTime']['output'];
};

export type Connection = {
  __typename?: 'Connection';
  connectedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  user: User;
};

export enum ConnectionStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type Education = {
  __typename?: 'Education';
  degree: Scalars['String']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  fieldOfStudy: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptConnectionRequest: User;
  addComment: Comment;
  addEducation: Education;
  addReaction: Reaction;
  addSkill: Skill;
  addWorkExperience: WorkExperience;
  cancelAccountDeletion: User;
  deactivateAccount: User;
  declineConnectionRequest: User;
  deleteAccount: User;
  deleteEducation: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteSkill: Scalars['Boolean']['output'];
  deleteWorkExperience: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  reactivateAccount: AuthPayload;
  register: User;
  removeConnection: Scalars['Boolean']['output'];
  requestAccountDeletion: User;
  resetPassword: Scalars['Boolean']['output'];
  sendConnectionRequest: User;
  updateBasicProfile: Profile;
  updateCustomUrl: Profile;
  updateEducation: Education;
  updateProfileBanner: Profile;
  updateProfilePicture: Profile;
  updateProfileVisibility: Profile;
  updateWorkExperience: WorkExperience;
  verifyEmail: AuthPayload;
};


export type MutationAcceptConnectionRequestArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationAddCommentArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationAddEducationArgs = {
  degree: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  fieldOfStudy: Scalars['String']['input'];
  institution: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type MutationAddReactionArgs = {
  postId: Scalars['ID']['input'];
  reactionType: ReactionType;
};


export type MutationAddSkillArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddWorkExperienceArgs = {
  company: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};


export type MutationDeclineConnectionRequestArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationDeleteEducationArgs = {
  educationId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeleteSkillArgs = {
  skillId: Scalars['ID']['input'];
};


export type MutationDeleteWorkExperienceArgs = {
  workExperienceId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRemoveConnectionArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSendConnectionRequestArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationUpdateBasicProfileArgs = {
  headline?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCustomUrlArgs = {
  slug: Scalars['String']['input'];
};


export type MutationUpdateEducationArgs = {
  degree?: InputMaybe<Scalars['String']['input']>;
  educationId: Scalars['ID']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  fieldOfStudy?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationUpdateProfileBannerArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUpdateProfilePictureArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUpdateProfileVisibilityArgs = {
  visibility: ProfileVisibility;
};


export type MutationUpdateWorkExperienceArgs = {
  company?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  workExperienceId: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type PaginatedFeed = {
  __typename?: 'PaginatedFeed';
  cursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  author: UserSummary;
  commentCount: Scalars['Int']['output'];
  comments: Array<Comment>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrls: Array<Scalars['String']['output']>;
  linkPreview?: Maybe<PostLinkPreview>;
  reactionCount: Scalars['Int']['output'];
  reactions: Array<Reaction>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PostLinkPreview = {
  __typename?: 'PostLinkPreview';
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  customUrlSlug?: Maybe<Scalars['String']['output']>;
  education: Array<Education>;
  headline: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pictureUrl?: Maybe<Scalars['String']['output']>;
  skills: Array<Skill>;
  user: User;
  visibility: ProfileVisibility;
  workExperience: Array<WorkExperience>;
};

export enum ProfileVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Query = {
  __typename?: 'Query';
  feed: PaginatedFeed;
  me: User;
  userProfileBySlug: Profile;
};


export type QueryFeedArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserProfileBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type Reaction = {
  __typename?: 'Reaction';
  id: Scalars['ID']['output'];
  post: Post;
  reactionType: ReactionType;
  user: UserSummary;
};

export enum ReactionType {
  Celebrate = 'CELEBRATE',
  Funny = 'FUNNY',
  Insightful = 'INSIGHTFUL',
  Like = 'LIKE',
  Support = 'SUPPORT'
}

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Skill = {
  __typename?: 'Skill';
  endorsementCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  connections: Array<Connection>;
  connectionStatus?: Maybe<ConnectionStatus>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profile: Profile;
  status: UserStatus;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Banned = 'BANNED',
  Deactivated = 'DEACTIVATED',
  Inactive = 'INACTIVE',
  PendingDeletion = 'PENDING_DELETION'
}

export type UserSummary = {
  __typename?: 'UserSummary';
  id: Scalars['ID']['output'];
  profile: Profile;
};

export type WorkExperience = {
  __typename?: 'WorkExperience';
  company: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  startDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export const UserSummaryFragmentDoc = gql`
    fragment UserSummary on UserSummary {
  id
  profile {
    name
    headline
    pictureUrl
    customUrlSlug
  }
}
    `;
export const PostDetailsFragmentDoc = gql`
    fragment PostDetails on Post {
  id
  content
  imageUrls
  createdAt
  updatedAt
  reactionCount
  commentCount
  author {
    ...UserSummary
  }
}
    ${UserSummaryFragmentDoc}`;