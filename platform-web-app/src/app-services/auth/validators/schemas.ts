import { z } from 'zod';

// Corresponds to REQ-1-002 and US-006 for user login.
export const loginSchema = z.object({
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export type LoginInput = z.infer<typeof loginSchema>;


// Corresponds to REQ-1-001, US-001 and US-004 for user registration.
// Enforces strong password complexity rules.
export const registerSchema = z.object({
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long.')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must include at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character.'),
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;


// Corresponds to REQ-1-003 and US-010 for forgotten password flow.
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;


// Corresponds to REQ-1-003 and US-012 for the password reset form.
// Re-enforces the same strong password complexity rules.
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long.')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must include at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character.'),
  confirmPassword: z.string().min(1, 'Please confirm your new password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;