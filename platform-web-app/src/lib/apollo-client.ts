import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from '@/app-services/auth/utils/token-storage'; // Assuming token storage utils exist at a lower level
import { REFRESH_TOKEN_MUTATION } from '@/app-services/auth/operations/mutations'; // Assuming mutation is defined in app-services

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

// Middleware to add the access token to requests
const authLink = setContext(async (_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Middleware for handling errors, especially for token refresh
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.extensions?.code === 'UNAUTHENTICATED' &&
          !operation.getContext().skipRefresh
        ) {
          // Token expired, attempt to refresh
          return new ApolloLink((op, fwd) => {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              clearTokens();
              window.location.href = '/auth/login';
              return fwd(op);
            }

            // Using a new client to avoid circular dependencies in links
            const refreshClient = new ApolloClient({
              link: httpLink,
              cache: new InMemoryCache(),
            });

            return fromPromise(
              refreshClient.mutate({
                mutation: REFRESH_TOKEN_MUTATION,
                variables: { refreshToken },
              })
            )
              .filter(Boolean)
              .flatMap((response) => {
                const newAccessToken = response.data?.refreshToken?.accessToken;

                if (!newAccessToken) {
                  clearTokens();
                  window.location.href = '/auth/login';
                  throw new Error('Could not refresh token');
                }

                setAccessToken(newAccessToken);

                // Retry the original operation with the new token
                const oldHeaders = op.getContext().headers;
                op.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });

                return fwd(op);
              });
          }).request(operation, forward);
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      // Potentially handle offline status here
    }
  }
);

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Example of field policy for paginated feed
            getFeed: {
              keyArgs: false, // Use a custom key if you have filters
              merge(existing = { posts: [] }, incoming) {
                return {
                  ...existing,
                  ...incoming,
                  posts: [...existing.posts, ...incoming.posts],
                };
              },
            },
            // Example for connections
            getConnections: {
              keyArgs: ['userId'],
              merge(existing = { connections: [] }, incoming) {
                return {
                  ...existing,
                  ...incoming,
                  connections: [...existing.connections, ...incoming.connections],
                };
              },
            },
          },
        },
      },
    }),
  });
};

export const initializeApollo = (initialState: any = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

// Helper to convert Promise to Observable for Apollo Link
const fromPromise = <T>(promise: Promise<T>): ApolloLink => {
  return new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        promise
          .then((result) => {
            operation.setContext({ response: result });
            observer.next(result);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      })
  );
};