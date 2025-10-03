'use client';

import React from 'react';
import { Container, Box, Alert } from '@mui/material';

import { useModerationQueue } from '@/app-services/moderation/useModerationQueue';
import PageHeader from '@/components/ui/PageHeader';
import ModerationTable from '@/components/features/moderation/ModerationTable';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

/**
 * Renders the content moderation queue page.
 * This page fetches and displays user-reported content that requires administrative review.
 * It utilizes the useModerationQueue hook for data and state management and the
 * ModerationTable component for rendering the data.
 * Implements REQ-1-041 and REQ-1-042.
 *
 * @returns {React.ReactElement} The rendered moderation queue page.
 */
export default function ModerationPage() {
  const {
    data,
    loading,
    error,
    pagination,
    handleTakeAction,
    refetch,
  } = useModerationQueue();

  const renderContent = () => {
    if (loading && !data) {
      return <SkeletonLoader variant="rectangular" height={500} />;
    }
    if (error) {
      return <Alert severity="error">Failed to load moderation queue: {error.message}</Alert>;
    }
    if (!data?.moderationQueue.items || data.moderationQueue.items.length === 0) {
        return <Alert severity="info">The moderation queue is empty.</Alert>;
    }
    return (
      <ModerationTable
        items={data.moderationQueue.items}
        pagination={pagination}
        onTakeAction={handleTakeAction}
        refetch={refetch}
        loading={loading}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Content Moderation"
        subtitle="Review user-reported content and take appropriate action."
      />
      <Box sx={{ width: '100%', mt: 3 }}>
        {renderContent()}
      </Box>
    </Container>
  );
}