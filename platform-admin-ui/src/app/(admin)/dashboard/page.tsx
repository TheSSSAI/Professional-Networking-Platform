'use client';

import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';

import PageHeader from '@/components/ui/PageHeader';
import { GetDashboardStatsDocument } from '@/graphql/generated';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface StatCardProps {
  title: string;
  value: number | string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, loading }) => (
  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    {loading ? (
      <SkeletonLoader variant="text" height={40} />
    ) : (
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    )}
  </Paper>
);

/**
 * The main dashboard page, serving as the landing page for authenticated administrators.
 * It displays high-level statistics about the platform's health and activity.
 *
 * @returns {React.ReactElement} The rendered dashboard page.
 */
export default function DashboardPage() {
  const { data, loading, error } = useQuery(GetDashboardStatsDocument);

  const stats = data?.dashboardStats;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of platform activity and moderation status."
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard
            title="Pending Moderation"
            value={stats?.pendingModerationCount ?? 0}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsersCount ?? 0}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard
            title="Active Users (24h)"
            value={stats?.activeUsersTodayCount ?? 0}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard
            title="Posts Today"
            value={stats?.postsTodayCount ?? 0}
            loading={loading}
          />
        </Grid>

        {/* Can add more components like charts or recent activity logs here */}
        <Grid item xs={12}>
           <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              Activity charts and recent audit log entries will be displayed here in a future update.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}