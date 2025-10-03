"use client";

import { ApolloLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { makeClient } from "./client";
import type { FC, ReactNode } from "react";

/**
 * ApolloWrapper component to provide the Apollo Client to the React component tree.
 *
 * This wrapper is essential for integrating Apollo Client with the Next.js App Router,
 * handling both Server-Side Rendering (SSR) and Client-Side Rendering (CSR) scenarios.
 * It uses `@apollo/experimental-nextjs-app-support` to correctly manage the client
 * instance across server and client environments.
 *
 * @see {@link https://www.apollographql.com/docs/react/integrations/nextjs/} for official guidance.
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The Apollo Client provider wrapping the application.
 */
export const ApolloProvider: FC<{ children: ReactNode }> = ({ children }) => {
  function makeClientWrapper() {
    // The makeClient function from client.ts is reused here.
    // It is designed to be called on every request on the server,
    // and once on the client.
    return makeClient();
  }

  return (
    <ApolloNextAppProvider makeClient={makeClientWrapper}>
      {children}
    </ApolloNextAppProvider>
  );
};