import { PaletteOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

/**
 * Defines the color palette for the application's MUI theme.
 * This configuration centralizes all color definitions, ensuring a consistent
 * look and feel across the platform, adhering to professional branding.
 *
 * - Primary: A professional blue, used for primary actions, links, and branding.
 * - Secondary: A neutral grey, for secondary actions and borders.
 * - Background: Differentiates between the default page background and paper/card backgrounds.
 * - Text: Defines primary and secondary text colors for readability.
 */
const palette: PaletteOptions = {
  primary: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
    contrastText: '#fff',
  },
  secondary: {
    light: '#E0E0E0',
    main: '#9E9E9E',
    dark: '#616161',
    contrastText: '#fff',
  },
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
    contrastText: '#fff',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    light: '#4FC3F7',
    main: '#03A9F4',
    dark: '#0288D1',
    contrastText: '#fff',
  },
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  grey: {
    ...grey,
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  background: {
    default: '#F4F6F8', // A very light grey for the main background
    paper: '#FFFFFF',    // White for cards, modals, etc.
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

export default palette;