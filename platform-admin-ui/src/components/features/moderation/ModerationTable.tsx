'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
} from '@mui/material';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GavelIcon from '@mui/icons-material/Gavel';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BlockIcon from '@mui/icons-material/Block';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ApolloQueryResult } from '@apollo/client';

import DataTable, { IPaginationProps } from '@/components/ui/DataTable';
import { ModerationQueueItem, ModerationActionType, GetModerationQueueQuery } from '@/graphql/generated';
import ConfirmationModal from '../shared/ConfirmationModal';
import ReportedContentViewer from './ReportedContentViewer';

interface ModerationTableProps {
  items: ModerationQueueItem[];
  pagination: IPaginationProps;
  onTakeAction: (variables: {
    reportId: string;
    action: ModerationActionType;
    reason?: string;
    duration?: number;
  }) => Promise<any>;
  refetch: () => Promise<ApolloQueryResult<GetModerationQueueQuery>>;
  loading: boolean;
}

interface ActionMenuProps {
  reportId: string;
  onAction: (reportId: string, action: ModerationActionType) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ reportId, onAction }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleActionClick = (action: ModerationActionType) => {
    onAction(reportId, action);
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleActionClick(ModerationActionType.Dismiss)}>
          <ListItemIcon><DoNotDisturbOnIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Dismiss Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionClick(ModerationActionType.RemoveContent)}>
          <ListItemIcon><RemoveCircleOutlineIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>Remove Content</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionClick(ModerationActionType.IssueWarning)}>
          <ListItemIcon><ReportProblemIcon fontSize="small" color="warning" /></ListItemIcon>
          <ListItemText>Issue Warning</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionClick(ModerationActionType.BanUser)}>
          <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>Ban User</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};


export default function ModerationTable({ items, pagination, onTakeAction, refetch, loading }: ModerationTableProps) {
    const [actionToConfirm, setActionToConfirm] = useState<{ reportId: string; action: ModerationActionType; } | null>(null);
    const [selectedItem, setSelectedItem] = useState<ModerationQueueItem | null>(null);
  
    const handleActionInitiate = (reportId: string, action: ModerationActionType) => {
      setActionToConfirm({ reportId, action });
    };
  
    const handleConfirmAction = async () => {
      if (actionToConfirm) {
        await onTakeAction({
          reportId: actionToConfirm.reportId,
          action: actionToConfirm.action,
        });
        await refetch();
      }
      setActionToConfirm(null);
    };

    const handleRowClick = (params: GridRowParams) => {
        setSelectedItem(params.row as ModerationQueueItem);
    };

    const columns: GridColDef<ModerationQueueItem>[] = [
    {
        field: 'content',
        headerName: 'Reported Content',
        flex: 2,
        renderCell: (params) => (
        <Typography variant="body2" noWrap>
            {params.row.content.textSnippet}
        </Typography>
        ),
    },
    {
        field: 'contentType',
        headerName: 'Type',
        width: 100,
        renderCell: (params) => <Chip label={params.row.contentType} size="small" />,
    },
    {
        field: 'reason',
        headerName: 'Reason',
        flex: 1,
    },
    {
        field: 'reporter',
        headerName: 'Reporter',
        flex: 1,
        renderCell: (params) => (
            <Typography variant="body2">{params.row.reporter.name}</Typography>
        ),
    },
    {
        field: 'createdAt',
        headerName: 'Reported At',
        width: 180,
        valueGetter: (value) => value ? new Date(value).toLocaleString() : 'N/A',
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        sortable: false,
        renderCell: (params) => <ActionMenu reportId={params.row.id} onAction={handleActionInitiate} />,
    },
    ];

  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <DataTable
        rows={items}
        columns={columns}
        pagination={pagination}
        loading={loading}
        rowCount={pagination.totalCount}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
      />
      <ConfirmationModal
        open={!!actionToConfirm}
        onClose={() => setActionToConfirm(null)}
        onConfirm={handleConfirmAction}
        title={`Confirm Action: ${actionToConfirm?.action.replace(/_/g, ' ')}`}
        description={`Are you sure you want to perform this action? This may be irreversible.`}
        confirmText="Confirm"
        isDestructive={
          actionToConfirm?.action === ModerationActionType.RemoveContent ||
          actionToConfirm?.action === ModerationActionType.BanUser
        }
      />
       <Dialog 
        open={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogContent>
            {selectedItem && (
                <ReportedContentViewer 
                    item={selectedItem}
                    onAction={handleActionInitiate}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}