import { ApolloError } from '@apollo/client';
import { User } from '@/graphql/generated/graphql';
import { LoginInput, RegisterInput } from '../validators/schemas';

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context provided to the application.
 * This interface serves as the contract for the `useAuth` hook, abstracting the authentication
 * logic from the UI components. It provides access to the current user's state, authentication
 * status, and methods to perform authentication actions like login, logout, and registration.
 *
 * @property {User | null} user - The currently authenticated user object, or null if no user is logged in.
 * @property {boolean} isAuthenticated - A boolean flag indicating if the user is currently authenticated.
 * @property {boolean} isLoading - A boolean flag indicating if an authentication operation (e.g., login, register, or initial session check) is in progress.
 * @property {ApolloError | undefined} error - An ApolloError object if the last authentication operation failed, otherwise undefined.
 * @property {() => Promise<void>} checkSession - A function to verify the user's session on application load, typically by using the refresh token.
 * @property {(input: LoginInput) => Promise<void>} login - An async function to perform user login. Takes login credentials and handles token storage.
 * @property {() => Promise<void>} logout - An async function to perform user logout. Handles token invalidation and clears local session data.
 * @property {(input: RegisterInput) => Promise<void>} register - An async function to perform new user registration.
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApolloError | undefined;
  checkSession: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
}