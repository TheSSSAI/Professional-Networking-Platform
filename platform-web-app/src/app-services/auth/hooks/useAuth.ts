import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  LoginInput,
  RegisterInput,
  User,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useMeLazyQuery,
} from '@/graphql/generated/graphql';
import { AuthState, UseAuth } from '../types';

// This would typically live in a separate context file, but for dependency level purposes, it's co-located.
const AuthContext = createContext<UseAuth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  const apolloClient = useApolloClient();
  const router = useRouter();

  const [loginMutation, { loading: loginLoading, error: loginError }] = useLoginMutation();
  const [registerMutation, { loading: registerLoading, error: registerError }] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const [getMe, { data: meData, loading: meLoading }] = useMeLazyQuery();

  const handleAuthSuccess = (user: User) => {
    setAuthState({ user, isAuthenticated: true, loading: false });
  };

  const handleLogoutCleanup = useCallback(async () => {
    setAuthState({ user: null, isAuthenticated: false, loading: false });
    // This is critical to clear any cached data from the previous user
    await apolloClient.clearStore();
    // Redirect to login page
    router.push('/auth/login');
  }, [apolloClient, router]);

  const login = useCallback(async (credentials: LoginInput) => {
    try {
      const { data } = await loginMutation({ variables: { loginInput: credentials } });
      if (data?.login?.user) {
        handleAuthSuccess(data.login.user as User);
        router.push('/');
        return { success: true, error: null };
      }
      return { success: false, error: new Error('Login failed: No user data returned.') };
    } catch (e: any) {
      return { success: false, error: e };
    }
  }, [loginMutation, router]);

  const register = useCallback(async (registerData: RegisterInput) => {
    try {
      const { data } = await registerMutation({ variables: { registerInput: registerData } });
      if (data?.register?.id) {
        return { success: true, error: null };
      }
      return { success: false, error: new Error('Registration failed.') };
    } catch (e: any) {
      return { success: false, error: e };
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Logout mutation failed:', error);
    } finally {
      await handleLogoutCleanup();
    }
  }, [logoutMutation, handleLogoutCleanup]);

  // Effect for initializing auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await refreshTokenMutation();
        if (data?.refreshToken?.accessToken) {
          // Token refreshed successfully, now fetch user data
          await getMe();
        } else {
          setAuthState({ user: null, isAuthenticated: false, loading: false });
        }
      } catch (error) {
        console.log('No valid refresh token found or refresh failed.');
        setAuthState({ user: null, isAuthenticated: false, loading: false });
      }
    };
    initializeAuth();
  }, [refreshTokenMutation, getMe]);

  // Effect to update user state after 'getMe' query completes
  useEffect(() => {
    if (meData?.me) {
      handleAuthSuccess(meData.me as User);
    }
  }, [meData]);

  const value: UseAuth = {
    ...authState,
    loading: authState.loading || loginLoading || registerLoading || meLoading,
    error: loginError || registerError,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): UseAuth => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};