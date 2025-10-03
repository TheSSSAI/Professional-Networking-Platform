import { useState, useCallback, useMemo } from 'react';
import {
  useGetFeatureFlagsQuery,
  useUpdateFeatureFlagMutation,
  FeatureFlag,
  UpdateFeatureFlagInput,
} from '@/graphql/generated';
import { ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';

export const useFeatureFlags = () => {
  const { data, loading, error, refetch } = useGetFeatureFlagsQuery();
  const [updateFeatureFlagMutation] = useUpdateFeatureFlagMutation();
  const [updateState, setUpdateState] = useState<{ loading: boolean; error: ApolloError | null }>({
    loading: false,
    error: null,
  });

  const featureFlags = useMemo(() => data?.getFeatureFlags as FeatureFlag[] || [], [data]);

  const updateFeatureFlag = useCallback(
    async (input: UpdateFeatureFlagInput): Promise<boolean> => {
      setUpdateState({ loading: true, error: null });
      try {
        const { data: mutationData } = await updateFeatureFlagMutation({
          variables: { input },
          optimisticResponse: {
            updateFeatureFlag: {
              __typename: 'FeatureFlag',
              name: input.name,
              description: featureFlags.find(f => f.name === input.name)?.description || '',
              isEnabled: input.isEnabled,
            },
          },
        });

        if (mutationData?.updateFeatureFlag) {
          toast.success(`Feature flag '${input.name}' updated successfully.`);
          setUpdateState({ loading: false, error: null });
          // No need to refetch due to optimistic response and cache update
          return true;
        } else {
          throw new Error('Failed to update feature flag.');
        }
      } catch (e) {
        const errorMessage = e instanceof ApolloError ? e.message : 'An unexpected error occurred.';
        toast.error(errorMessage);
        setUpdateState({ loading: false, error: e instanceof ApolloError ? e : new ApolloError({ errorMessage }) });
        refetch(); // Refetch to revert optimistic update on error
        return false;
      }
    },
    [updateFeatureFlagMutation, featureFlags, refetch]
  );

  return {
    featureFlags,
    loading,
    error,
    updateState,
    updateFeatureFlag,
    refetchFeatureFlags: refetch,
  };
};