'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
} from '@mui/material';
import useAuth from '@/app-services/auth/hooks/useAuth';
import { useState } from 'react';

// Placeholder components for different settings sections
const AccountSettings = () => (
    <Box p={3}>
        <Typography variant="h6">Account Settings</Typography>
        <Typography>Manage your account details, password, and MFA settings here.</Typography>
    </Box>
);

const ProfileSettings = () => (
    <Box p={3}>
        <Typography variant="h6">Profile Settings</Typography>
        <Typography>Update your profile visibility and other details here.</Typography>
    </Box>
);

const NotificationSettings = () => (
    <Box p={3}>
        <Typography variant="h6">Notification Settings</Typography>
        <Typography>Control your in-app and email notifications.</Typography>
    </Box>
);


export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="Account" />
            <Tab label="Profile" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>
        {currentTab === 0 && <AccountSettings />}
        {currentTab === 1 && <ProfileSettings />}
        {currentTab === 2 && <NotificationSettings />}
      </Paper>
    </Container>
  );
}