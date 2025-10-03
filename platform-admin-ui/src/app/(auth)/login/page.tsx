'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import { useAuth } from '@/app-services/auth/useAuth';
import LoginForm from '@/components/features/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Renders the administrator login page.
 * This page serves as the entry point for the admin dashboard, presenting the
 * LoginForm component and handling the authentication flow via the useAuth hook.
 *
 * @returns {React.ReactElement} The rendered login page.
 */
const LoginPage = () => {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (values: any) => {
    const result = await login(values.email, values.password);
    if (result?.mfaRequired && result.mfaSessionToken) {
      // The useAuth hook stores the token, so we just need to navigate.
      router.push('/mfa');
    } else if (result?.accessToken) {
      router.push('/dashboard');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <LockOutlined sx={{ fontSize: 40, mb: 1 }} color="primary" />
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Admin Dashboard Login
      </Typography>
      <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
    </Paper>
  );
};


/**
 * Wrapper component to provide the AuthContext to the LoginPage.
 * This is necessary because the `useAuth` hook depends on the context provider.
 */
export default function LoginPageWithProvider() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}