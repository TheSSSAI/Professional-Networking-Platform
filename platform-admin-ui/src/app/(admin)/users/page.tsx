'use client';

import React from 'react';
import { Container, Box, Alert, Avatar, Chip, Typography, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { debounce } from 'lodash';

import { useUserManagement } from '@/app-services/users/useUserManagement';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { User, UserStatus } from '@/graphql/generated';

const statusMap: Record<UserStatus, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  [UserStatus.Active]: { label: 'Active', color: 'success' },
  [UserStatus.Inactive]: { label: 'Inactive', color: 'default' },
  [UserStatus.Deactivated]: { label: 'Deactivated', color: 'warning' },
  [UserStatus.Banned]: { label: 'Banned', color: 'error' },
  [UserStatus.PendingDeletion]: { label: 'Pending Deletion', color: 'error' },
};

/**
 * Renders the user management page.
 * This page allows administrators to search, view, and manage user accounts.
 * Implements REQ-1-043.
 *
 * @returns {React.ReactElement} The rendered user management page.
 */
export default function UsersPage() {
  const {
    data,
    loading,
    error,
    pagination,
    setSearchTerm,
  } = useUserManagement();
  
  const debouncedSetSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 500);

  const columns: GridColDef<Partial<User>>[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={params.row.profile?.profilePictureUrl ?? ''} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {params.row.profile?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const statusInfo = statusMap[params.value as UserStatus] ?? { label: 'Unknown', color: 'default' };
        return <Chip label={statusInfo.label} color={statusInfo.color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Registration Date',
      width: 200,
      valueGetter: (value) => value ? new Date(value).toLocaleString() : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        // Action menu for banning, suspending, etc. will be implemented here
        // For now, it's a placeholder.
        <Typography variant="caption" color="text.secondary">
          More actions...
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="User Management"
        subtitle="Search, view, and manage user accounts on the platform."
      />
      <Box sx={{ my: 3 }}>
        <TextField
          fullWidth
          label="Search by name or email"
          variant="outlined"
          onChange={(e) => debouncedSetSearch(e.target.value)}
        />
      </Box>
      <Box sx={{ width: '100%', height: '70vh' }}>
        {error && <Alert severity="error">Failed to load users: {error.message}</Alert>}
        <DataTable
          rows={data?.users.items ?? []}
          columns={columns}
          loading={loading}
          pagination={pagination}
          rowCount={data?.users.totalCount ?? 0}
          getRowId={(row) => row.id}
        />
      </Box>
    </Container>
  );
}