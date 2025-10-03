'use client';

import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuth from '@/app-services/auth/hooks/useAuth';
import NextLink from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm'; // Assuming a RegisterForm component exists

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Redirect if user is already authenticated
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (loading || isAuthenticated) {
     return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Redirecting...
                </Typography>
            </Box>
        </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Your Account
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <RegisterForm />
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={NextLink} href="/auth/login" variant="body2">
                Already have an account? Sign in
            </MuiLink>
        </Box>
      </Box>
    </Container>
  );
}