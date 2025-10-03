import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import {
  GetProfileBySlugDocument,
  GetProfileBySlugQuery,
  User,
} from '@/graphql/generated/graphql';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { cookies } from 'next/headers';

interface ProfilePageProps {
  params: {
    slug: string;
  };
}

// Dummy components for layout purposes
const BasicInfoSection = ({ user }: { user: User }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Basic Information</Typography>
        <Typography>Name: {user.profile?.name}</Typography>
        <Typography>Headline: {user.profile?.headline}</Typography>
    </Paper>
);

const ExperienceSection = ({ user }: { user: User }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Work Experience</Typography>
        {user.profile?.workExperiences?.length ? (
            user.profile.workExperiences.map(exp => (
                <Box key={exp.id} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">{exp.title} at {exp.company}</Typography>
                </Box>
            ))
        ) : (
            <Typography>No work experience added.</Typography>
        )}
    </Paper>
);

// This page is a Server Component, fetching data on the server.
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = params;
  const { client } = getClient();
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  try {
    const { data } = await client.query<GetProfileBySlugQuery>({
      query: GetProfileBySlugDocument,
      variables: { slug },
      context: {
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        },
      },
      fetchPolicy: 'no-cache',
    });

    const user = data?.getProfileBySlug;

    if (!user) {
      notFound();
    }

    // Based on privacy rules, the backend GraphQL resolver will return
    // either the full profile or a minimal one. This component just renders what it gets.
    const isMinimalProfile = !user.profile?.workExperiences;

    return (
      <main>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <ProfileHeader user={user as User} />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              {isMinimalProfile ? (
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography>
                        This profile is private. Connect with {user.profile?.name} to see their full profile.
                    </Typography>
                </Paper>
              ) : (
                <>
                  <BasicInfoSection user={user as User} />
                  <ExperienceSection user={user as User} />
                  {/* Other sections like Education, Skills would go here */}
                </>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {/* Sidebar content, e.g., 'People you may know' */}
            </Grid>
          </Grid>
        </Container>
      </main>
    );
  } catch (error) {
    console.error(`Failed to fetch profile for slug: ${slug}`, error);
    // You could render a specific error component here
    // For simplicity, we'll treat it as not found.
    notFound();
  }
}