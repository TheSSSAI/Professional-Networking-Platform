'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Paper, Typography } from '@mui/material';
import { Https } from '@mui/icons-material';

import { useAuth } from '@/app-services/auth/useAuth';
import MfaForm from '@/components/features/auth/MfaForm';
import { AuthProvider } from '@/contexts/AuthContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

/**
 * Renders the Multi-Factor Authentication (MFA) page.
 * This is the second step in the login flow for administrators with MFA enabled.
 * It uses the MfaForm component and the useAuth hook to verify the TOTP code.
 *
 * @returns {React.ReactElement} The rendered MFA page.
 */
const MfaPage = () => {
  const router = useRouter();
  const { verifyMfa, mfaSessionToken, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect them away.
    if (isAuthenticated) {
      router.replace('/dashboard');
      return;
    }
    // If there's no MFA session token, the user shouldn't be here.
    // The loading check prevents redirection during initial state hydration.
    if (!loading && !mfaSessionToken) {
      router.replace('/login');
    }
  }, [mfaSessionToken, isAuthenticated, router, loading]);

  const handleSubmit = async (values: { code: string }) => {
    const success = await verifyMfa(values.code);
    if (success) {
      router.push('/dashboard');
    }
  };

  // Show a loader while checking for the session token to prevent flicker
  if (loading || !mfaSessionToken) {
    return <SkeletonLoader variant="rectangular" height={300} />;
  }
  
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
      <Https sx={{ fontSize: 40, mb: 1 }} color="primary" />
      <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
        Two-Factor Authentication
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Enter the 6-digit code from your authenticator app.
      </Typography>
      <MfaForm onSubmit={handleSubmit} loading={loading} error={error} />
    </Paper>
  );
};


/**
 * Wrapper component to provide the AuthContext to the MfaPage.
 */
export default function MfaPageWithProvider() {
  return (
    <AuthProvider>
      <MfaPage />
    </AuthProvider>
  );
}