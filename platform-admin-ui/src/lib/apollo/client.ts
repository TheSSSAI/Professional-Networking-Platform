import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// This function creates a new Apollo Client instance.
// It's designed to be a singleton in the browser but recreated for each server-side render.
const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  });

  // Middleware to attach the JWT token to every request
  const authLink = setContext((_, { headers }) => {
    // In a real application, the token would be retrieved from a secure source
    // like HttpOnly cookies or secure client-side storage.
    // For this example, we'll assume it might be in localStorage for simplicity,
    // though this is not recommended for production without extra security measures.
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Link to handle errors, specifically for authentication failures
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          // Apollo Server sends this code for authentication errors
          case 'UNAUTHENTICATED':
            // This case handles expired tokens or invalid sessions.
            // When this happens, we want to log the user out and redirect to login.
            if (typeof window !== 'undefined') {
              // Clear any existing session data
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              
              // Redirect to the login page
              // Using window.location.replace to prevent going back to the protected page
              window.location.replace('/login');
            }
            break;
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      // Potentially show a global notification for network issues
    }
  });

  // Chain the links together: error -> auth -> http
  // Requests will flow from right to left, responses from left to right.
  const link = from([errorLink, authLink, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    // SSR mode should be true on the server and false on the client
    ssrMode: typeof window === "undefined", 
  });
};

// Singleton instance for the client-side
let apolloClient: ApolloClient<any> | undefined;

export const getClient = () => {
  // If we are on the client, reuse the same instance.
  // If on the server, create a new instance for each request.
  const client = apolloClient ?? createApolloClient();

  if (typeof window === "undefined") {
    // On the server, we always create a new client
    return client;
  }
  
  // On the client, we initialize the singleton
  if (!apolloClient) {
    apolloClient = client;
  }

  return apolloClient;
};