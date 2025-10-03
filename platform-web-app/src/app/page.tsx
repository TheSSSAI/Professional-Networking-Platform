import { Box, Container, Typography } from '@mui/material';
import { getClient } from '@/lib/apollo-client';
import { GetFeedDocument, Post } from '@/graphql/generated/graphql';
import { cookies } from 'next/headers';
import PostCard from '@/components/feed/PostCard';
import CreatePostModal from '@/components/feed/CreatePostModal';

// This is a placeholder for a more sophisticated feed component
// that would handle client-side interactions and infinite scrolling.
// For SSR, we just render the initial list.
const NewsFeed = ({ initialPosts }: { initialPosts: Post[] }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {initialPosts.length > 0 ? (
        initialPosts.map((post) => <PostCard key={post.id} post={post as Post} />)
      ) : (
        <Typography>
          Your feed is empty. Start by connecting with other professionals!
        </Typography>
      )}
    </Box>
  );
};

// This page will be server-rendered.
export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value; // Assuming token is stored in a cookie
  const { client } = getClient();
  let posts: Post[] = [];
  let error: string | null = null;
  let isAuthenticated = !!token;

  if (isAuthenticated) {
    try {
      const { data } = await client.query({
        query: GetFeedDocument,
        // In a real app, context would be set up to automatically include auth headers
        // For this server component example, we might need to pass it explicitly
        // or ensure the server-side client is configured to read cookies.
        context: {
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        },
        fetchPolicy: 'no-cache', // Ensure fresh data on server render
      });
      posts = (data.getFeed?.posts as Post[]) || [];
    } catch (e: any) {
      console.error('Failed to fetch feed:', e);
      error = 'Could not load your feed. Please try again later.';
    }
  }

  return (
    <main>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {!isAuthenticated ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to the Professional Networking Platform
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Please log in or register to connect with your network.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
                {/* A real component would manage its own state */}
                <CreatePostModal />
            </Box>
            
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <NewsFeed initialPosts={posts} />
            )}
          </>
        )}
      </Container>
    </main>
  );
}