import { z } from 'zod';

/**
 * @file Defines validation schemas for User and Profile entities using Zod.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link REQ-1-001}
 * @see {@link REQ-1-008}
 * @see {@link REQ-1-013}
 */

// Regex for password complexity as per REQ-1-001
const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
const passwordErrorMessage =
  'Password must be at least 12 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

// Regex for custom URL slug as per REQ-1-013
const urlSlugRegex = /^[a-z0-9-]+$/;
const urlSlugErrorMessage =
  'URL slug can only contain lowercase letters, numbers, and dashes.';

/**
 * Schema for validating user registration input.
 * - `email`: Required, must be a valid email format.
 * - `password`: Required, must meet complexity rules.
 */
export const userRegistrationSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .trim()
    .toLowerCase(),
  password: z.string().regex(passwordComplexityRegex, {
    message: passwordErrorMessage,
  }),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

/**
 * Schema for validating user login input.
 */
export const userLoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

/**
 * Schema for validating the password reset request (forgot password).
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;

/**
 * Schema for validating the final password reset form.
 */
export const resetPasswordSchema = z
  .object({
    password: z.string().regex(passwordComplexityRegex, {
      message: passwordErrorMessage,
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'], // path of error
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Schema for validating the 'Basic Information' section of a user's profile.
 * See REQ-1-008.
 */
export const basicProfileInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name cannot be empty.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),
  headline: z
    .string()
    .trim()
    .max(220, { message: 'Headline cannot exceed 220 characters.' })
    .optional(),
  location: z.string().trim().optional(),
  contactDetails: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export type BasicProfileInfoInput = z.infer<typeof basicProfileInfoSchema>;

/**
 * Schema for validating the custom profile URL slug.
 * See REQ-1-013.
 */
export const customUrlSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(urlSlugRegex, { message: urlSlugErrorMessage }),
});

export type CustomUrlInput = z.infer<typeof customUrlSchema>;