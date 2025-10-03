import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch the user's personalized news feed.
 * This query is designed for the homepage feed (REQ-1-020, US-053).
 *
 * Features:
 * - Pagination: Uses a cursor-based approach for efficient infinite scrolling.
 * - Fragments: Leverages the `PostDetails` fragment to ensure all necessary data
 *   for rendering a PostCard is fetched consistently. This includes author information,
 *   content, and interaction counts.
 * - Returns a `PaginatedFeed` object containing the list of posts and pagination info.
 */
export const GET_FEED = gql`
  query GetFeed($limit: Int, $cursor: String) {
    feed(limit: $limit, cursor: $cursor) {
      posts {
        ...PostDetails
        # Additional fields needed for feed context can be added here
      }
      hasNextPage
      cursor
    }
  }
`;

// Note: The `PostDetails` fragment must be defined in the same file or imported
// if using a tool like `graphql-codegen` with fragment colocation.
// For this generated file structure, we assume a tool combines fragments.
// Let's define it here for clarity, though in a real codegen setup it would be in graphql.ts.

const PostDetailsFragment = gql`
  fragment PostDetails on Post {
    id
    content
    imageUrls
    createdAt
    updatedAt
    reactionCount
    commentCount
    author {
      id
      profile {
        name
        headline
        pictureUrl
        customUrlSlug
      }
    }
    linkPreview {
        url
        title
        description
        image
    }
  }
`;

// A more complete GET_FEED query including the fragment definition
export const GET_FEED_WITH_FRAGMENT = gql`
    query GetFeed($limit: Int, $cursor: String) {
        feed(limit: $limit, cursor: $cursor) {
            posts {
                ...PostDetails
            }
            hasNextPage
            cursor
        }
    }
    ${PostDetailsFragment}
`;