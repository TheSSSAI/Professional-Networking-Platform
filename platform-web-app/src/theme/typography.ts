import { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Defines the typography settings for the application's MUI theme.
 * This establishes a consistent and readable typographic scale, crucial for a professional
 * and accessible user interface.
 *
 * - Font Family: Specifies 'Inter' as the primary font, with system fallbacks.
 * - Variants: Configures font size, weight, and line height for all standard
 *   typographic elements from H1 to captions, creating a clear visual hierarchy.
 */
const typography: TypographyOptions = {
  fontFamily: [
    'Inter',
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem', // 40px
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem', // 32px
    lineHeight: 1.25,
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem', // 28px
    lineHeight: 1.3,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem', // 24px
    lineHeight: 1.35,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem', // 20px
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.125rem', // 18px
    lineHeight: 1.45,
  },
  subtitle1: {
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.57,
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.43,
  },
  button: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.75,
    textTransform: 'none', // Buttons will not be all-caps
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    lineHeight: 1.66,
  },
  overline: {
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 2.66,
    textTransform: 'uppercase',
  },
};

export default typography;