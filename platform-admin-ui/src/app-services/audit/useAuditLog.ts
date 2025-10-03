import { useState, useCallback, useMemo } from 'react';
import { useGetAuditLogsQuery, GetAuditLogsQuery } from '@/graphql/generated';
import { ApolloError } from '@apollo/client';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const useAuditLog = (initialPageSize = 25) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: initialPageSize,
  });

  const { data, loading, error, refetch } = useGetAuditLogsQuery({
    variables: {
      pageInfo: {
        offset: pagination.page * pagination.pageSize,
        limit: pagination.pageSize,
      },
    },
    fetchPolicy: 'network-only',
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPagination({ page: 0, pageSize: newPageSize });
  }, []);

  const auditLogData = useMemo(() => data?.getAuditLogs, [data]);

  return {
    logs: (auditLogData?.logs as GetAuditLogsQuery['getAuditLogs']['logs']) || [],
    totalCount: auditLogData?.totalCount || 0,
    loading,
    error,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    refetchLogs: refetch,
  };
};