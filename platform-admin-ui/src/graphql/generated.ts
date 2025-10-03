import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
};

export type ActionResponse = {
  __typename?: 'ActionResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AdminUser = {
  __typename?: 'AdminUser';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  status: UserAccountStatus;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  adminUserId: Scalars['ID']['output'];
  adminUserName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  details?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['ID']['output'];
  targetId?: Maybe<Scalars['String']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
};

export type AuditLogPayload = {
  __typename?: 'AuditLogPayload';
  logs: Array<AuditLog>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ContentType {
  Comment = 'COMMENT',
  Post = 'POST'
}

export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  mfaRequired: Scalars['Boolean']['output'];
  mfaSessionToken?: Maybe<Scalars['String']['output']>;
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean']['output'];
};

export type MfaResponse = {
  __typename?: 'MfaResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type ModerationActionInput = {
  actionType: ModerationActionType;
  reason?: InputMaybe<Scalars['String']['input']>;
  reportId: Scalars['ID']['input'];
  suspensionDurationDays?: InputMaybe<Scalars['Int']['input']>;
};

export enum ModerationActionType {
  BanUser = 'BAN_USER',
  DismissReport = 'DISMISS_REPORT',
  IssueWarning = 'ISSUE_WARNING',
  RemoveContent = 'REMOVE_CONTENT',
  SuspendUser = 'SUSPEND_USER'
}

export type ModerationQueuePayload = {
  __typename?: 'ModerationQueuePayload';
  items: Array<ReportedItem>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  logout: LogoutResponse;
  takeModerationAction: ActionResponse;
  triggerPasswordResetAdmin: ActionResponse;
  updateFeatureFlag: FeatureFlag;
  verifyMfa: MfaResponse;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationTakeModerationActionArgs = {
  input: ModerationActionInput;
};


export type MutationTriggerPasswordResetAdminArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdateFeatureFlagArgs = {
  input: UpdateFeatureFlagInput;
};


export type MutationVerifyMfaArgs = {
  input: VerifyMfaInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  auditLogs: AuditLogPayload;
  featureFlags: Array<FeatureFlag>;
  moderationQueue: ModerationQueuePayload;
  searchUsersAdmin: UserSearchPayload;
};


export type QueryAuditLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryModerationQueueArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchUsersAdminArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export enum ReportStatus {
  ActionTaken = 'ACTION_TAKEN',
  ContentDeleted = 'CONTENT_DELETED',
  Dismissed = 'DISMISSED',
  Pending = 'PENDING'
}

export type ReportedItem = {
  __typename?: 'ReportedItem';
  author: ReportedUser;
  contentId: Scalars['ID']['output'];
  contentPreview: Scalars['String']['output'];
  contentType: ContentType;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  reportCount: Scalars['Int']['output'];
  reporter: ReportedUser;
  status: ReportStatus;
};

export type ReportedUser = {
  __typename?: 'ReportedUser';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UpdateFeatureFlagInput = {
  id: Scalars['ID']['input'];
  isEnabled: Scalars['Boolean']['input'];
};

export enum UserAccountStatus {
  Active = 'ACTIVE',
  Banned = 'BANNED',
  Deactivated = 'DEACTIVATED',
  Inactive = 'INACTIVE',
  PendingDeletion = 'PENDING_DELETION',
  Suspended = 'SUSPENDED'
}

export type UserFilterInput = {
  status?: InputMaybe<UserAccountStatus>;
};

export type UserSearchPayload = {
  __typename?: 'UserSearchPayload';
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
  users: Array<AdminUser>;
};

export type VerifyMfaInput = {
  mfaSessionToken: Scalars['String']['input'];
  totpCode: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', mfaRequired: boolean, mfaSessionToken?: string | null } };

export type VerifyMfaMutationVariables = Exact<{
  input: VerifyMfaInput;
}>;


export type VerifyMfaMutation = { __typename?: 'Mutation', verifyMfa: { __typename?: 'MfaResponse', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', success: boolean } };

export type GetModerationQueueQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetModerationQueueQuery = { __typename?: 'Query', moderationQueue: { __typename?: 'ModerationQueuePayload', totalCount: number, items: Array<{ __typename?: 'ReportedItem', id: string, contentId: string, contentType: ContentType, contentPreview: string, reason: string, status: ReportStatus, reportCount: number, createdAt: any, reporter: { __typename?: 'ReportedUser', id: string, name: string }, author: { __typename?: 'ReportedUser', id: string, name: string } }>, pageInfo: { __typename?: 'PageInfo', currentPage: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type TakeModerationActionMutationVariables = Exact<{
  input: ModerationActionInput;
}>;


export type TakeModerationActionMutation = { __typename?: 'Mutation', takeModerationAction: { __typename?: 'ActionResponse', success: boolean, message?: string | null } };

export type SearchUsersAdminQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<UserFilterInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchUsersAdminQuery = { __typename?: 'Query', searchUsersAdmin: { __typename?: 'UserSearchPayload', totalCount: number, users: Array<{ __typename?: 'AdminUser', id: string, name: string, email: string, status: UserAccountStatus, createdAt: any, lastLoginAt?: any | null }>, pageInfo: { __typename?: 'PageInfo', currentPage: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type TriggerPasswordResetAdminMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type TriggerPasswordResetAdminMutation = { __typename?: 'Mutation', triggerPasswordResetAdmin: { __typename?: 'ActionResponse', success: boolean, message?: string | null } };

export type GetAuditLogsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditLogPayload', totalCount: number, logs: Array<{ __typename?: 'AuditLog', id: string, adminUserId: string, adminUserName: string, action: string, targetId?: string | null, targetType?: string | null, createdAt: any, details?: any | null }>, pageInfo: { __typename?: 'PageInfo', currentPage: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetFeatureFlagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFeatureFlagsQuery = { __typename?: 'Query', featureFlags: Array<{ __typename?: 'FeatureFlag', id: string, name: string, description: string, isEnabled: boolean }> };

export type UpdateFeatureFlagMutationVariables = Exact<{
  input: UpdateFeatureFlagInput;
}>;


export type UpdateFeatureFlagMutation = { __typename?: 'Mutation', updateFeatureFlag: { __typename?: 'FeatureFlag', id: string, name: string, description: string, isEnabled: boolean } };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    mfaRequired
    mfaSessionToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const VerifyMfaDocument = gql`
    mutation VerifyMfa($input: VerifyMfaInput!) {
  verifyMfa(input: $input) {
    accessToken
    refreshToken
  }
}
    `;
export type VerifyMfaMutationFn = Apollo.MutationFunction<VerifyMfaMutation, VerifyMfaMutationVariables>;

/**
 * __useVerifyMfaMutation__
 *
 * To run a mutation, you first call `useVerifyMfaMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyMfaMutation, { data, loading, error }] = useVerifyMfaMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyMfaMutation(baseOptions?: Apollo.MutationHookOptions<VerifyMfaMutation, VerifyMfaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyMfaMutation, VerifyMfaMutationVariables>(VerifyMfaDocument, options);
      }
export type VerifyMfaMutationHookResult = ReturnType<typeof useVerifyMfaMutation>;
export type VerifyMfaMutationResult = Apollo.MutationResult<VerifyMfaMutation>;
export type VerifyMfaMutationOptions = Apollo.BaseMutationOptions<VerifyMfaMutation, VerifyMfaMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetModerationQueueDocument = gql`
    query GetModerationQueue($page: Int = 1, $limit: Int = 25, $sortBy: String = "createdAt", $sortOrder: String = "DESC") {
  moderationQueue(
    page: $page
    limit: $limit
    sortBy: $sortBy
    sortOrder: $sortOrder
  ) {
    items {
      id
      contentId
      contentType
      contentPreview
      reason
      status
      reporter {
        id
        name
      }
      author {
        id
        name
      }
      reportCount
      createdAt
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useGetModerationQueueQuery__
 *
 * To run a query within a React component, call `useGetModerationQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModerationQueueQuery` returns an object from Apollo Client that contains `loading`, `error`, and `data` properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModerationQueueQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useGetModerationQueueQuery(baseOptions?: Apollo.QueryHookOptions<GetModerationQueueQuery, GetModerationQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModerationQueueQuery, GetModerationQueueQueryVariables>(GetModerationQueueDocument, options);
      }
export function useGetModerationQueueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModerationQueueQuery, GetModerationQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModerationQueueQuery, GetModerationQueueQueryVariables>(GetModerationQueueDocument, options);
        }
export function useGetModerationQueueSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetModerationQueueQuery, GetModerationQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModerationQueueQuery, GetModerationQueueQueryVariables>(GetModerationQueueDocument, options);
        }
export type GetModerationQueueQueryHookResult = ReturnType<typeof useGetModerationQueueQuery>;
export type GetModerationQueueLazyQueryHookResult = ReturnType<typeof useGetModerationQueueLazyQuery>;
export type GetModerationQueueSuspenseQueryHookResult = ReturnType<typeof useGetModerationQueueSuspenseQuery>;
export type GetModerationQueueQueryResult = Apollo.QueryResult<GetModerationQueueQuery, GetModerationQueueQueryVariables>;
export const TakeModerationActionDocument = gql`
    mutation TakeModerationAction($input: ModerationActionInput!) {
  takeModerationAction(input: $input) {
    success
    message
  }
}
    `;
export type TakeModerationActionMutationFn = Apollo.MutationFunction<TakeModerationActionMutation, TakeModerationActionMutationVariables>;

/**
 * __useTakeModerationActionMutation__
 *
 * To run a mutation, you first call `useTakeModerationActionMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [takeModerationActionMutation, { data, loading, error }] = useTakeModerationActionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTakeModerationActionMutation(baseOptions?: Apollo.MutationHookOptions<TakeModerationActionMutation, TakeModerationActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TakeModerationActionMutation, TakeModerationActionMutationVariables>(TakeModerationActionDocument, options);
      }
export type TakeModerationActionMutationHookResult = ReturnType<typeof useTakeModerationActionMutation>;
export type TakeModerationActionMutationResult = Apollo.MutationResult<TakeModerationActionMutation>;
export type TakeModerationActionMutationOptions = Apollo.BaseMutationOptions<TakeModerationActionMutation, TakeModerationActionMutationVariables>;
export const SearchUsersAdminDocument = gql`
    query SearchUsersAdmin($query: String, $filter: UserFilterInput, $page: Int = 1, $limit: Int = 25) {
  searchUsersAdmin(query: $query, filter: $filter, page: $page, limit: $limit) {
    users {
      id
      name
      email
      status
      createdAt
      lastLoginAt
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useSearchUsersAdminQuery__
 *
 * To run a query within a React component, call `useSearchUsersAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersAdminQuery` returns an object from Apollo Client that contains `loading`, `error`, and `data` properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersAdminQuery({
 *   variables: {
 *      query: // value for 'query'
 *      filter: // value for 'filter'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchUsersAdminQuery(baseOptions?: Apollo.QueryHookOptions<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>(SearchUsersAdminDocument, options);
      }
export function useSearchUsersAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>(SearchUsersAdminDocument, options);
        }
export function useSearchUsersAdminSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>(SearchUsersAdminDocument, options);
        }
export type SearchUsersAdminQueryHookResult = ReturnType<typeof useSearchUsersAdminQuery>;
export type SearchUsersAdminLazyQueryHookResult = ReturnType<typeof useSearchUsersAdminLazyQuery>;
export type SearchUsersAdminSuspenseQueryHookResult = ReturnType<typeof useSearchUsersAdminSuspenseQuery>;
export type SearchUsersAdminQueryResult = Apollo.QueryResult<SearchUsersAdminQuery, SearchUsersAdminQueryVariables>;
export const TriggerPasswordResetAdminDocument = gql`
    mutation TriggerPasswordResetAdmin($userId: ID!) {
  triggerPasswordResetAdmin(userId: $userId) {
    success
    message
  }
}
    `;
export type TriggerPasswordResetAdminMutationFn = Apollo.MutationFunction<TriggerPasswordResetAdminMutation, TriggerPasswordResetAdminMutationVariables>;

/**
 * __useTriggerPasswordResetAdminMutation__
 *
 * To run a mutation, you first call `useTriggerPasswordResetAdminMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [triggerPasswordResetAdminMutation, { data, loading, error }] = useTriggerPasswordResetAdminMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useTriggerPasswordResetAdminMutation(baseOptions?: Apollo.MutationHookOptions<TriggerPasswordResetAdminMutation, TriggerPasswordResetAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TriggerPasswordResetAdminMutation, TriggerPasswordResetAdminMutationVariables>(TriggerPasswordResetAdminDocument, options);
      }
export type TriggerPasswordResetAdminMutationHookResult = ReturnType<typeof useTriggerPasswordResetAdminMutation>;
export type TriggerPasswordResetAdminMutationResult = Apollo.MutationResult<TriggerPasswordResetAdminMutation>;
export type TriggerPasswordResetAdminMutationOptions = Apollo.BaseMutationOptions<TriggerPasswordResetAdminMutation, TriggerPasswordResetAdminMutationVariables>;
export const GetAuditLogsDocument = gql`
    query GetAuditLogs($page: Int = 1, $limit: Int = 50, $sortBy: String = "createdAt", $sortOrder: String = "DESC") {
  auditLogs(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
    logs {
      id
      adminUserId
      adminUserName
      action
      targetId
      targetType
      details
      createdAt
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useGetAuditLogsQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsQuery` returns an object from Apollo Client that contains `loading`, `error`, and `data` properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useGetAuditLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
      }
export function useGetAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export type GetAuditLogsQueryHookResult = ReturnType<typeof useGetAuditLogsQuery>;
export type GetAuditLogsLazyQueryHookResult = ReturnType<typeof useGetAuditLogsLazyQuery>;
export type GetAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsSuspenseQuery>;
export type GetAuditLogsQueryResult = Apollo.QueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetFeatureFlagsDocument = gql`
    query GetFeatureFlags {
  featureFlags {
    id
    name
    description
    isEnabled
  }
}
    `;

/**
 * __useGetFeatureFlagsQuery__
 *
 * To run a query within a React component, call `useGetFeatureFlagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeatureFlagsQuery` returns an object from Apollo Client that contains `loading`, `error`, and `data` properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeatureFlagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFeatureFlagsQuery(baseOptions?: Apollo.QueryHookOptions<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>(GetFeatureFlagsDocument, options);
      }
export function useGetFeatureFlagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>(GetFeatureFlagsDocument, options);
        }
export function useGetFeatureFlagsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>(GetFeatureFlagsDocument, options);
        }
export type GetFeatureFlagsQueryHookResult = ReturnType<typeof useGetFeatureFlagsQuery>;
export type GetFeatureFlagsLazyQueryHookResult = ReturnType<typeof useGetFeatureFlagsLazyQuery>;
export type GetFeatureFlagsSuspenseQueryHookResult = ReturnType<typeof useGetFeatureFlagsSuspenseQuery>;
export type GetFeatureFlagsQueryResult = Apollo.QueryResult<GetFeatureFlagsQuery, GetFeatureFlagsQueryVariables>;
export const UpdateFeatureFlagDocument = gql`
    mutation UpdateFeatureFlag($input: UpdateFeatureFlagInput!) {
  updateFeatureFlag(input: $input) {
    id
    name
    description
    isEnabled
  }
}
    `;
export type UpdateFeatureFlagMutationFn = Apollo.MutationFunction<UpdateFeatureFlagMutation, UpdateFeatureFlagMutationVariables>;

/**
 * __useUpdateFeatureFlagMutation__
 *
 * To run a mutation, you first call `useUpdateFeatureFlagMutation` with an options object and receive back a tuple that includes:
 * - a `mutate` function that you can call at any time to execute the mutation
 * - an object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeatureFlagMutation, { data, loading, error }] = useUpdateFeatureFlagMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFeatureFlagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFeatureFlagMutation, UpdateFeatureFlagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFeatureFlagMutation, UpdateFeatureFlagMutationVariables>(UpdateFeatureFlagDocument, options);
      }
export type UpdateFeatureFlagMutationHookResult = ReturnType<typeof useUpdateFeatureFlagMutation>;
export type UpdateFeatureFlagMutationResult = Apollo.MutationResult<UpdateFeatureFlagMutation>;
export type UpdateFeatureFlagMutationOptions = Apollo.BaseMutationOptions<UpdateFeatureFlagMutation, UpdateFeatureFlagMutationVariables>;