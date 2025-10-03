'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  Paper,
} from '@mui/material';

import { useFeatureFlags } from '@/app-services/settings/useFeatureFlags';
import PageHeader from '@/components/ui/PageHeader';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ConfirmationModal from '@/components/features/shared/ConfirmationModal';
import { FeatureFlag } from '@/graphql/generated';

/**
 * Renders the feature flag management page.
 * This page allows administrators to enable or disable system features in real-time.
 * Implements REQ-1-045.
 *
 * @returns {React.ReactElement} The rendered feature flags page.
 */
export default function FeatureFlagsPage() {
  const { data, loading, error, updateFlag } = useFeatureFlags();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);

  const handleToggleInitiate = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (selectedFlag) {
      await updateFlag({
        variables: {
          name: selectedFlag.name,
          isEnabled: !selectedFlag.isEnabled,
        },
      });
    }
    setModalOpen(false);
    setSelectedFlag(null);
  };
  
  const handleCancelToggle = () => {
    setModalOpen(false);
    setSelectedFlag(null);
  };
  
  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader variant="rectangular" height={300} />;
    }
    if (error) {
      return <Alert severity="error">Failed to load feature flags: {error.message}</Alert>;
    }
    if (!data?.featureFlags || data.featureFlags.length === 0) {
      return <Alert severity="info">No feature flags are configured.</Alert>;
    }

    return (
      <Paper>
        <List>
          {data.featureFlags.map((flag, index) => (
            <ListItem key={flag.name} divider={index < data.featureFlags.length - 1}>
              <ListItemText
                primary={flag.name}
                secondary={flag.description}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <Switch
                edge="end"
                onChange={() => handleToggleInitiate(flag)}
                checked={flag.isEnabled}
                inputProps={{
                  'aria-labelledby': `switch-list-label-${flag.name}`,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Feature Flags"
        subtitle="Enable or disable platform features in real-time without a new deployment."
      />
      <Box sx={{ width: '100%', mt: 3 }}>
        {renderContent()}
      </Box>
      <ConfirmationModal
        open={modalOpen}
        onClose={handleCancelToggle}
        onConfirm={handleConfirmToggle}
        title="Confirm Feature Flag Change"
        description={`Are you sure you want to ${selectedFlag?.isEnabled ? 'disable' : 'enable'} the "${selectedFlag?.name}" feature? This will take effect immediately.`}
        confirmText={selectedFlag?.isEnabled ? 'Disable' : 'Enable'}
        isDestructive={selectedFlag?.isEnabled}
      />
    </Container>
  );
}