import { useLoginMutation, useVerifyMfaMutation, useLogoutMutation, LoginInput } from '@/graphql/generated';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface AuthState {
  loading: boolean;
  error: ApolloError | null;
}

const initialAuthState: AuthState = {
  loading: false,
  error: null,
};

export function useAuth() {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [loginState, setLoginState] = useState<AuthState>(initialAuthState);
  const [verifyMfaState, setVerifyMfaState] = useState<AuthState>(initialAuthState);
  const [logoutState, setLogoutState] = useState<AuthState>(initialAuthState);

  const [loginMutation] = useLoginMutation();
  const [verifyMfaMutation] = useVerifyMfaMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async (credentials: LoginInput): Promise<boolean> => {
    setLoginState({ loading: true, error: null });
    try {
      const { data } = await loginMutation({ variables: { input: credentials } });

      if (data?.login?.mfaRequired && data.login.mfaSessionToken) {
        sessionStorage.setItem('mfa_token', data.login.mfaSessionToken);
        router.push('/mfa');
        setLoginState({ loading: false, error: null });
        return true;
      }
      
      // If login is successful without MFA (not expected for admin but handled)
      if (data?.login?.accessToken) {
        // In a real app, tokens would be stored securely (e.g., HttpOnly cookies)
        // For this example, we assume a mechanism is in place.
        await apolloClient.resetStore();
        router.push('/dashboard');
        setLoginState({ loading: false, error: null });
        return true;
      }

      // Should not happen if API is correct, but handle defensively
      throw new Error("Invalid response from server during login.");

    } catch (error) {
      if (error instanceof ApolloError) {
        setLoginState({ loading: false, error });
      } else {
        const unknownError = new ApolloError({ errorMessage: 'An unexpected error occurred.' });
        setLoginState({ loading: false, error: unknownError });
      }
      return false;
    }
  }, [loginMutation, router, apolloClient]);

  const verifyMfa = useCallback(async (totpCode: string): Promise<boolean> => {
    const mfaSessionToken = sessionStorage.getItem('mfa_token');
    if (!mfaSessionToken) {
      const sessionError = new ApolloError({ errorMessage: 'MFA session not found. Please log in again.' });
      setVerifyMfaState({ loading: false, error: sessionError });
      router.push('/login');
      return false;
    }

    setVerifyMfaState({ loading: true, error: null });
    try {
      const { data } = await verifyMfaMutation({
        variables: { input: { mfaSessionToken, totpCode } },
      });

      if (data?.verifyMfa?.accessToken) {
        sessionStorage.removeItem('mfa_token');
        // Again, assuming secure token storage is handled elsewhere
        await apolloClient.resetStore();
        router.push('/dashboard');
        toast.success("Login successful!");
        setVerifyMfaState({ loading: false, error: null });
        return true;
      }
      
      throw new Error("Invalid response from server during MFA verification.");

    } catch (error) {
       if (error instanceof ApolloError) {
        setVerifyMfaState({ loading: false, error });
      } else {
        const unknownError = new ApolloError({ errorMessage: 'An unexpected error occurred.' });
        setVerifyMfaState({ loading: false, error: unknownError });
      }
      return false;
    }
  }, [verifyMfaMutation, router, apolloClient]);

  const logout = useCallback(async () => {
    setLogoutState({ loading: true, error: null });
    try {
      await logoutMutation();
    } catch (error) {
      // Log the error but proceed with client-side cleanup regardless
      console.error("Logout mutation failed:", error);
       if (error instanceof ApolloError) {
        setLogoutState({ loading: false, error });
      }
    } finally {
      // Clear all client-side session data
      sessionStorage.clear();
      localStorage.clear();
      await apolloClient.resetStore();
      setLogoutState({ loading: false, error: null });
      // Use window.location to ensure a full page reload and state clearing
      window.location.href = '/login';
    }
  }, [logoutMutation, apolloClient]);

  return {
    login,
    verifyMfa,
    logout,
    loginState,
    verifyMfaState,
    logoutState,
  };
}