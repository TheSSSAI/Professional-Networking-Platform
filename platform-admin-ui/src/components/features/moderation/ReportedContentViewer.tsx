import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Divider,
  Chip,
  Link,
  Paper,
} from '@mui/material';
import { useGetReportedItemDetailQuery } from '@/graphql/generated'; // Assuming this query exists
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { Alert } from '@mui/material';
import NextLink from 'next/link';

interface ReportedContentViewerProps {
  reportId: string;
}

export const ReportedContentViewer: React.FC<ReportedContentViewerProps> = ({ reportId }) => {
    // NOTE: This assumes a `getReportedItemDetail` query is defined in moderation.graphql
    // and generated. If not, this component would need to adapt to the available data source.
    const { data, loading, error } = useGetReportedItemDetailQuery({
        variables: { reportId },
    });
    
    if (loading) {
        return <SkeletonLoader count={5} />;
    }
    
    if (error) {
        return <Alert severity="error">Error loading report details: {error.message}</Alert>;
    }

    const reportDetail = data?.getReportedItemDetail;

    if (!reportDetail) {
        return <Alert severity="info">Report details could not be found.</Alert>;
    }

    const { content, author, reports } = reportDetail;

    return (
        <Stack spacing={3}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Reported Content</Typography>
                    <Divider sx={{ my: 1 }} />
                    
                    {content ? (
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                           <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                               <Avatar src={author.profilePictureUrl || undefined} />
                               <Box>
                                   <Link component={NextLink} href={`/users/${author.id}`} passHref>
                                       <Typography variant="subtitle1" component="span" fontWeight="bold">{author.name}</Typography>
                                   </Link>
                                   <Typography variant="body2" color="text.secondary">{author.headline}</Typography>
                               </Box>
                           </Stack>
                           <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                               {content.body}
                           </Typography>
                           {/* Render images if they exist */}
                           {content.imageUrls && content.imageUrls.length > 0 && (
                               <Box mt={2} display="flex" gap={1}>
                                   {content.imageUrls.map((url: string) => <img key={url} src={url} alt="Reported content" style={{ maxWidth: '150px', maxHeight: '150px' }} />)}
                               </Box>
                           )}
                        </Paper>
                    ) : (
                        <Alert severity="warning">The original content has been deleted.</Alert>
                    )}
                </CardContent>
            </Card>

            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Reports ({reports.length})</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={2}>
                        {reports.map((report) => (
                            <Box key={report.id}>
                               <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                   <Stack direction="row" spacing={1} alignItems="center">
                                       <Avatar src={report.reporter.profilePictureUrl || undefined} sx={{ width: 32, height: 32 }}/>
                                       <Link component={NextLink} href={`/users/${report.reporter.id}`} passHref>
                                            <Typography variant="body2" component="span" fontWeight="bold">{report.reporter.name}</Typography>
                                       </Link>
                                   </Stack>
                                   <Typography variant="caption" color="text.secondary">
                                       {new Date(report.createdAt).toLocaleString()}
                                   </Typography>
                               </Stack>
                               <Chip label={report.reason} color="error" size="small" sx={{ my: 1 }}/>
                               {report.details && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
                                    "{report.details}"
                                </Typography>
                               )}
                           </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};