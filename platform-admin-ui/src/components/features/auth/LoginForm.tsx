'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useAuth } from '@/app-services/auth/useAuth';
import { LoginInput } from '@/graphql/generated';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, loginState } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const credentials: LoginInput = {
      email: data.email,
      password: data.password,
    };
    login(credentials);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1, width: '100%' }}
    >
      <Typography component="h1" variant="h5">
        Admin Sign In
      </Typography>
      <Stack spacing={2} mt={3}>
        {loginState.error && (
          <Alert severity="error">{loginState.error.message}</Alert>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loginState.loading}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loginState.loading}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isValid || loginState.loading}
          startIcon={loginState.loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loginState.loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Stack>
    </Box>
  );
};