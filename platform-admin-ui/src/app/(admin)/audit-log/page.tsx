'use client';

import React from 'react';
import { Container, Box, Alert, Chip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useAuditLog } from '@/app-services/audit/useAuditLog';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { AuditLog } from '@/graphql/generated';

/**
 * Renders the administrator audit log page.
 * This page displays a read-only, immutable log of all actions performed by administrators.
 * Implements REQ-1-044.
 *
 * @returns {React.ReactElement} The rendered audit log page.
 */
export default function AuditLogPage() {
  const { data, loading, error, pagination } = useAuditLog();

  const columns: GridColDef<Partial<AuditLog>>[] = [
    {
      field: 'timestamp',
      headerName: 'Timestamp (UTC)',
      width: 220,
      valueGetter: (value) => value ? new Date(value).toISOString() : 'N/A',
    },
    {
      field: 'administrator',
      headerName: 'Administrator',
      flex: 1,
      renderCell: (params) => (
        <Box>
            <Typography variant="body2" fontWeight="bold">
              {params.row.administrator?.profile?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.administrator?.email}
            </Typography>
          </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
       renderCell: (params) => <Chip label={params.value} color="primary" variant="outlined" size="small" />,
    },
    {
        field: 'targetEntity',
        headerName: 'Target Details',
        flex: 1,
        renderCell: (params) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {params.row.targetEntityType}: {params.row.targetEntityId}
            </Typography>
        ),
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Audit Log"
        subtitle="An immutable log of all administrative actions performed on the platform."
      />
      <Box sx={{ width: '100%', mt: 3, height: '70vh' }}>
        {error && <Alert severity="error">Failed to load audit logs: {error.message}</Alert>}
        <DataTable
          rows={data?.auditLogs.items ?? []}
          columns={columns}
          loading={loading}
          pagination={pagination}
          rowCount={data?.auditLogs.totalCount ?? 0}
          getRowId={(row) => row.id}
        />
      </Box>
    </Container>
  );
}