'use client';

import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import { LinearProgress } from '@mui/material';

// The props interface is designed to be generic and reusable.
// It accepts typed data, column definitions, and state from a custom hook.
export interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  getRowId: (row: T) => React.Key;
  emptyStateMessage?: string;
}

/**
 * A reusable DataTable component built on top of MUI's DataGrid.
 * It's designed for server-side pagination and sorting, handling loading
 * and empty states gracefully.
 * This is a core organism component for displaying lists of data in the admin dashboard.
 */
export function DataTable<T extends { id: React.Key }>({
  rows,
  columns,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  getRowId,
  emptyStateMessage = 'No data to display.',
}: DataTableProps<T>) {

  // Custom component to show when there are no rows.
  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant="body2">{emptyStateMessage}</Typography>
    </Box>
  );

  return (
    <Paper sx={{ height: '75vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        sortingMode={onSortModelChange ? "server" : "client"}
        getRowId={getRowId}
        slots={{
          loadingOverlay: LinearProgress,
          noRowsOverlay: NoRowsOverlay,
        }}
        sx={{
          // Removes the border around the DataGrid itself
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
        initialState={{
            pagination: {
                paginationModel: {
                    pageSize: paginationModel.pageSize,
                }
            }
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

export default DataTable;