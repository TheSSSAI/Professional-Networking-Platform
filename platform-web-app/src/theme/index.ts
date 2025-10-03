import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

const themeOptions: ThemeOptions = {
  palette: palette,
  typography: typography,
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Corresponds to 8px, so spacing(2) = 16px
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background?.default,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: palette.background?.paper,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: palette.grey?.[400],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: palette.grey?.[500],
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 22px',
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
        outlinedPrimary: {
            borderWidth: '2px',
            '&:hover': {
                borderWidth: '2px',
            }
        }
      },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            fullWidth: true,
        },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
        },
    },
    MuiModal: {
        styleOverrides: {
            root: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none', // Disables MUI's default gradient on Paper
            }
        }
    },
    MuiLink: {
        defaultProps: {
            underline: 'hover',
        },
        styleOverrides: {
            root: {
                fontWeight: 500,
                color: palette.primary.main,
                cursor: 'pointer',
            },
        },
    },
  },
};

// Create a theme instance.
let theme = createTheme(themeOptions);

// Make typography responsive
theme = responsiveFontSizes(theme);

export default theme;