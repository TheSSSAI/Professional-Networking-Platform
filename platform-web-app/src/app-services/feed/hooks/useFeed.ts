import { useState, useCallback } from 'react';
import { useQuery, FetchMoreQueryOptions, OperationVariables } from '@apollo/client';
import { Post, GetFeedQuery, GetFeedQueryVariables, useGetFeedQuery } from '@/graphql/generated/graphql';

interface UseFeedResult {
  posts: Post[];
  loading: boolean;
  error: any;
  fetchMorePosts: () => void;
  hasNextPage: boolean;
  refetch: () => void;
}

const FEED_PAGE_LIMIT = 10;

export const useFeed = (): UseFeedResult => {
  const { data, loading, error, fetchMore, refetch } = useGetFeedQuery({
    variables: {
      first: FEED_PAGE_LIMIT,
    },
    notifyOnNetworkStatusChange: true, // Important for loading states on fetchMore
  });

  const posts = (data?.feed?.edges?.map(edge => edge?.node).filter(Boolean) as Post[]) || [];
  const pageInfo = data?.feed?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;

  const fetchMorePosts = useCallback(() => {
    if (!hasNextPage || !pageInfo?.endCursor) {
      return;
    }

    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: FEED_PAGE_LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        
        const newEdges = fetchMoreResult.feed?.edges || [];
        const prevEdges = prev.feed?.edges || [];
        const allEdges = [...prevEdges, ...newEdges];

        // Deduplicate edges to handle potential overlaps, although cursor-based pagination should prevent this.
        const uniqueEdges = allEdges.filter((edge, index, self) =>
            index === self.findIndex((e) => (
                e?.node?.id === edge?.node?.id
            ))
        );

        return {
          ...prev,
          feed: {
            ...prev.feed,
            ...fetchMoreResult.feed,
            edges: uniqueEdges,
            pageInfo: fetchMoreResult.feed.pageInfo,
          },
        };
      },
    } as FetchMoreQueryOptions<GetFeedQueryVariables, GetFeedQuery> & OperationVariables);
  }, [hasNextPage, pageInfo, fetchMore]);

  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (e) {
      console.error("Failed to refetch feed:", e);
    }
  }, [refetch]);

  return {
    posts,
    loading,
    error,
    fetchMorePosts,
    hasNextPage,
    refetch: handleRefetch,
  };
};