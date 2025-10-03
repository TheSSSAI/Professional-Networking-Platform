import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { theme } from '@/theme';
import ApolloProviderWrapper from '@/lib/apollo/ApolloProvider';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Provides a minimal layout for authentication pages (Login, MFA).
 * It centers the content vertically and horizontally without the main admin
 * header or sidebar. It also wraps the content in the necessary theme and
 * Apollo providers.
 *
 * @param {AuthLayoutProps} props The component props.
 * @returns {React.ReactElement} The rendered layout.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProviderWrapper>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => theme.palette.grey[50],
                }}
              >
                <Container component="main" maxWidth="xs">
                  {children}
                </Container>
              </Box>
            </ApolloProviderWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}