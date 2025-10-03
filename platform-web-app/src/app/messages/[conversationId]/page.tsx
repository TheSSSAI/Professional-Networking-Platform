'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import useAuth from '@/app-services/auth/hooks/useAuth';
import useMessaging from '@/app-services/messaging/hooks/useMessaging';
import ChatWindow from '@/components/messaging/ChatWindow';
import { Message } from '@/graphql/generated/graphql';

interface MessagesPageProps {
  params: {
    conversationId: string;
  };
}

export default function MessagesPage({ params }: MessagesPageProps) {
  const { conversationId } = params;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const {
    messages,
    sendMessage,
    loading: messagesLoading,
    error: messagesError,
  } = useMessaging(conversationId);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);


  if (authLoading || messagesLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // or a redirect component
  }
  
  if (messagesError) {
      return (
          <Container maxWidth="md" sx={{ py: 4 }}>
              <Alert severity="error">
                Failed to load conversation: {messagesError.message}
              </Alert>
          </Container>
      )
  }

  const handleSendMessage = (content: string) => {
    sendMessage({ conversationId, content });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: 'calc(100vh - 64px)', // Assuming a 64px header
        display: 'flex',
        flexDirection: 'column',
        py: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Conversation {/* In a real app, you'd fetch and show the other user's name */}
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <ChatWindow
          messages={messages as Message[]}
          onSendMessage={handleSendMessage}
          // Assuming `useAuth` provides the current user's ID
          currentUserId={useAuth().user?.id || ''}
        />
      </Box>
    </Container>
  );
}