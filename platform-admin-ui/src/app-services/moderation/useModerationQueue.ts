import { useState, useCallback, useMemo } from 'react';
import {
  useGetModerationQueueQuery,
  useTakeModerationActionMutation,
  ModerationActionInput,
  SortInput,
  GetModerationQueueQuery,
} from '@/graphql/generated';
import { ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const useModerationQueue = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortInput | undefined>(undefined);
  const [actionState, setActionState] = useState<{ loading: boolean; error: ApolloError | null }>({
    loading: false,
    error: null,
  });

  const { data, loading, error, refetch } = useGetModerationQueueQuery({
    variables: {
      pageInfo: {
        offset: pagination.page * pagination.pageSize,
        limit: pagination.pageSize,
      },
      sortBy: sorting,
    },
    fetchPolicy: 'network-only', // Ensure we always have the latest queue
  });

  const [takeModerationActionMutation] = useTakeModerationActionMutation();

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPagination({ page: 0, pageSize: newPageSize });
  }, []);

  const handleSortChange = useCallback((newSortModel: SortInput | undefined) => {
    setSorting(newSortModel);
  }, []);

  const takeModerationAction = useCallback(
    async (input: ModerationActionInput): Promise<boolean> => {
      setActionState({ loading: true, error: null });
      try {
        const { data: mutationData } = await takeModerationActionMutation({
          variables: { input },
        });

        if (mutationData?.takeModerationAction?.success) {
          toast.success('Action completed successfully.');
          setActionState({ loading: false, error: null });
          refetch(); // Refetch the queue to show the updated list
          return true;
        } else {
          throw new Error(mutationData?.takeModerationAction?.message || 'Failed to perform moderation action.');
        }
      } catch (e) {
        const errorMessage = e instanceof ApolloError ? e.message : 'An unexpected error occurred.';
        toast.error(errorMessage);
        setActionState({ loading: false, error: e instanceof ApolloError ? e : new ApolloError({errorMessage}) });
        return false;
      }
    },
    [takeModerationActionMutation, refetch]
  );
  
  const queueData = useMemo(() => data?.getModerationQueue, [data]);

  return {
    queue: (queueData?.items as GetModerationQueueQuery['getModerationQueue']['items']) || [],
    totalCount: queueData?.totalCount || 0,
    loading,
    error,
    pagination,
    sorting,
    actionState,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    takeModerationAction,
    refetchQueue: refetch,
  };
};