import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Professional Networking Platform',
    default: 'Professional Networking Platform',
  },
  description:
    'A modern professional networking platform to connect with colleagues and grow your career.',
};

export const viewport: Viewport = {
  themeColor: '#1976d2', // Example MUI primary color
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </Providers>
      </body>
    </html>
  );
}