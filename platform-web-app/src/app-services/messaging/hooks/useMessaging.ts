import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { Socket } from 'socket.io-client';
import {
  Message,
  Conversation,
  useGetConversationMessagesQuery,
} from '@/graphql/generated/graphql';
import { useAuth } from '../auth/hooks/useAuth';

// This would typically live in a separate context file.
// Assuming Socket is provided by a higher-level SocketProvider component.
export const SocketContext = createContext<Socket | null>(null);

interface UseMessagingResult {
  messages: Message[];
  conversation?: Conversation | null;
  isConnected: boolean;
  isTyping: boolean;
  loadingMessages: boolean;
  sendMessage: (content: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export const useMessaging = (conversationId: string): UseMessagingResult => {
  const socket = useContext(SocketContext);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(socket?.connected || false);

  const { data: initialData, loading: loadingMessages, error } = useGetConversationMessagesQuery({
    variables: { conversationId, first: 50 },
    skip: !conversationId,
    fetchPolicy: 'network-only',
  });

  // Populate initial messages from GraphQL query
  useEffect(() => {
    if (initialData?.conversation?.messages?.edges) {
      const initialMessages = initialData.conversation.messages.edges
        .map(edge => edge?.node)
        .filter(Boolean) as Message[];
      setMessages(initialMessages.reverse()); // Assuming messages are returned newest first
    }
  }, [initialData]);

  // Handle Socket.IO connection and event listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    const handleNewMessage = (newMessage: Message) => {
        if (newMessage.conversationId === conversationId) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };

    const handleTypingIndicator = (payload: { conversationId: string; isTyping: boolean; userId: string }) => {
        if (payload.conversationId === conversationId && payload.userId !== user?.id) {
            setIsTyping(payload.isTyping);
        }
    };
    
    const handleMessageStatus = (payload: { messageId: string; status: string; readAt?: string; conversationId: string }) => {
        if(payload.conversationId !== conversationId) return;
        setMessages(prev => prev.map(msg => msg.id === payload.messageId ? { ...msg, status: payload.status, readAt: payload.readAt || msg.readAt } : msg));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTypingIndicator);
    socket.on('messageStatusUpdate', handleMessageStatus);

    // Join the conversation room
    socket.emit('joinConversation', { conversationId });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('typing', handleTypingIndicator);
      socket.off('messageStatusUpdate', handleMessageStatus);
      socket.emit('leaveConversation', { conversationId });
    };
  }, [socket, conversationId, user?.id]);


  const sendMessage = useCallback((content: string) => {
    if (socket && conversationId && content.trim()) {
      const optimisticMessage: Partial<Message> = {
          id: `temp-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          authorId: user?.id || '',
          conversationId,
          status: 'sending'
      };
      
      setMessages(prev => [...prev, optimisticMessage as Message]);

      socket.emit('sendMessage', {
        conversationId,
        content,
        tempId: optimisticMessage.id
      });
    }
  }, [socket, conversationId, user?.id]);

  const startTyping = useCallback(() => {
    socket?.emit('startTyping', { conversationId });
  }, [socket, conversationId]);

  const stopTyping = useCallback(() => {
    socket?.emit('stopTyping', { conversationId });
  }, [socket, conversationId]);
  
  if (error) {
      console.error("Error fetching messages:", error);
  }

  return {
    messages,
    conversation: initialData?.conversation,
    isConnected,
    isTyping,
    loadingMessages,
    sendMessage,
    startTyping,
    stopTyping,
  };
};