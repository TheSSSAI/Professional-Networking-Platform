import { z } from 'zod';

/**
 * @file Defines validation schemas for Post and Comment entities using Zod.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link REQ-1-019}
 * @see {@link REQ-1-022}
 */

/**
 * Schema for validating the content of a new post.
 * - `content`: Required, must be a string between 1 and 3000 characters.
 * - `mediaKeys`: Optional, an array of strings representing S3 object keys.
 */
export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Post content cannot be empty.' })
    .max(3000, { message: 'Post content cannot exceed 3000 characters.' }),
  mediaKeys: z.array(z.string()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

/**
 * Schema for validating the content when editing an existing post.
 * Same rules as creation.
 */
export const editPostSchema = createPostSchema;
export type EditPostInput = z.infer<typeof editPostSchema>;

/**
 * Schema for validating the content of a new comment.
 * - `content`: Required, must be a string between 1 and 1500 characters.
 * - `postId`: Required, must be a UUID.
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(1500, { message: 'Comment cannot exceed 1500 characters.' }),
  postId: z.string().uuid({ message: 'Invalid Post ID.' }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * Schema for validating the content when editing an existing comment.
 * - `content`: Same rules as creation.
 */
export const editCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(1500, { message: 'Comment cannot exceed 1500 characters.' }),
});

export type EditCommentInput = z.infer<typeof editCommentSchema>;

/**
 * Schema for validating a report content request.
 * - `reason`: Required, must be one of the predefined enum values.
 */
export const reportContentSchema = z.object({
  reason: z.enum([
    'SPAM',
    'HARASSMENT',
    'HATE_SPEECH',
    'MISINFORMATION',
    'INAPPROPRIATE_CONTENT',
    'OTHER',
  ]),
});

export type ReportContentInput = z.infer<typeof reportContentSchema>;