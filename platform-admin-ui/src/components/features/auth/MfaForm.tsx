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

const mfaSchema = z.object({
  totpCode: z
    .string()
    .min(6, 'Code must be 6 digits.')
    .max(6, 'Code must be 6 digits.')
    .regex(/^\d{6}$/, 'Code must be a 6-digit number.'),
});

type MfaFormValues = z.infer<typeof mfaSchema>;

export const MfaForm: React.FC = () => {
  const { verifyMfa, verifyMfaState } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    mode: 'onChange',
    defaultValues: {
      totpCode: '',
    },
  });

  const onSubmit = (data: MfaFormValues) => {
    verifyMfa(data.totpCode);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1, width: '100%' }}
    >
      <Typography component="h1" variant="h5">
        Two-Factor Authentication
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={2}>
        Enter the 6-digit code from your authenticator app.
      </Typography>
      <Stack spacing={2} mt={3}>
        {verifyMfaState.error && (
          <Alert severity="error">{verifyMfaState.error.message}</Alert>
        )}

        <Controller
          name="totpCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="totpCode"
              label="Verification Code"
              autoComplete="one-time-code"
              autoFocus
              error={!!errors.totpCode}
              helperText={errors.totpCode?.message}
              disabled={verifyMfaState.loading}
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isValid || verifyMfaState.loading}
          startIcon={verifyMfaState.loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {verifyMfaState.loading ? 'Verifying...' : 'Verify'}
        </Button>
      </Stack>
    </Box>
  );
};