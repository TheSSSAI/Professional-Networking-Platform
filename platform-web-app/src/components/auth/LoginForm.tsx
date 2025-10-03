"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginInputSchema } from '@/app-services/auth/validators/schemas';
import { useAuth } from '@/app-services/auth/hooks/useAuth';
import Link from 'next/link';

type LoginFormInputs = z.infer<typeof LoginInputSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginInputSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await login(data);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const getErrorMessage = (): { message: string, resend?: boolean } | null => {
    if (!error) return null;

    if (error.graphQLErrors.length > 0) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError.extensions?.code === 'ACCOUNT_UNVERIFIED') {
        return { message: 'Your account has not been verified. Please check your email for a verification link.', resend: true };
      }
      return { message: gqlError.message || 'An unexpected error occurred.' };
    }

    if (error.networkError) {
      return { message: 'Network error. Please check your connection.' };
    }

    return { message: 'An unexpected error occurred.' };
  };
  
  const errorMessage = getErrorMessage();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1, width: '100%' }}
    >
      <Stack spacing={2}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {errorMessage && (
          <Alert severity="error">
            {errorMessage.message}
            {errorMessage.resend && (
                 <Typography variant="body2" sx={{ mt: 1 }}>
                    {/* This would trigger a resend mutation */}
                    <Link href="/auth/resend-verification">
                        Resend verification email
                    </Link>
                </Typography>
            )}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, height: 48 }}
          disabled={!isDirty || !isValid || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </Button>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
           <Typography variant="body2">
             <Link href="/auth/forgot-password">
                Forgot password?
             </Link>
           </Typography>
           <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/auth/register">
                Sign Up
              </Link>
           </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginForm;