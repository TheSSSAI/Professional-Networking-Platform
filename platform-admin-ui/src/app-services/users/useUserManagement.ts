import { useState, useCallback, useMemo } from 'react';
import {
  useSearchUsersAdminQuery,
  useTriggerPasswordResetAdminMutation,
  SortInput,
  UserFilterInput,
  SearchUsersAdminQuery,
} from '@/graphql/generated';
import { ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const useUserManagement = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortInput | undefined>(undefined);
  const [filters, setFilters] = useState<UserFilterInput | undefined>(undefined);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 500);

  const [actionState, setActionState] = useState<{ loading: boolean; error: ApolloError | null }>({
    loading: false,
    error: null,
  });

  const { data, loading, error, refetch } = useSearchUsersAdminQuery({
    variables: {
      query: debouncedQuery,
      filter: filters,
      pageInfo: {
        offset: pagination.page * pagination.pageSize,
        limit: pagination.pageSize,
      },
      // sortBy: sorting, // Assuming the GraphQL schema will support sorting
    },
    fetchPolicy: 'cache-and-network',
  });

  const [triggerPasswordResetMutation] = useTriggerPasswordResetAdminMutation();

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPagination({ page: 0, pageSize: newPageSize });
  }, []);

  const handleSortChange = useCallback((newSortModel: SortInput | undefined) => {
    setSorting(newSortModel);
  }, []);

  const handleFilterChange = useCallback((newFilters: UserFilterInput | undefined) => {
    setPagination(p => ({ ...p, page: 0 })); // Reset to first page on filter change
    setFilters(newFilters);
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    setPagination(p => ({ ...p, page: 0 })); // Reset to first page on query change
    setQuery(newQuery);
  }, []);
  
  const triggerPasswordReset = useCallback(
    async (userId: string): Promise<boolean> => {
      setActionState({ loading: true, error: null });
      try {
        const { data: mutationData } = await triggerPasswordResetMutation({
          variables: { userId },
        });

        if (mutationData?.triggerPasswordResetAdmin?.success) {
          toast.success('Password reset email sent successfully.');
          setActionState({ loading: false, error: null });
          return true;
        } else {
          throw new Error(mutationData?.triggerPasswordResetAdmin?.message || 'Failed to trigger password reset.');
        }
      } catch (e) {
        const errorMessage = e instanceof ApolloError ? e.message : 'An unexpected error occurred.';
        toast.error(errorMessage);
        setActionState({ loading: false, error: e instanceof ApolloError ? e : new ApolloError({ errorMessage }) });
        return false;
      }
    },
    [triggerPasswordResetMutation]
  );
  
  const usersData = useMemo(() => data?.searchUsersAdmin, [data]);

  return {
    users: (usersData?.users as SearchUsersAdminQuery['searchUsersAdmin']['users']) || [],
    totalCount: usersData?.totalCount || 0,
    loading,
    error,
    pagination,
    sorting,
    filters,
    query,
    actionState,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleFilterChange,
    handleQueryChange,
    triggerPasswordReset,
    refetchUsers: refetch,
  };
};