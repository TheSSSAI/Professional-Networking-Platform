"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

import { theme } from '@/theme';
import { client as apolloClient } from '@/lib/apollo-client';
import {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    User,
} from '@/graphql/generated/graphql';

// --- Auth Context ---

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading true for initial check
    const router = useRouter();

    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const [registerMutation] = useRegisterMutation();
    const [refreshTokenMutation] = useRefreshTokenMutation();

    const handleAuthSuccess = (accessToken: string, refreshedUser: User) => {
        localStorage.setItem('accessToken', accessToken);
        setUser(refreshedUser);
        setIsAuthenticated(true);
        apolloClient.resetStore();
    };
    
    const handleLogout = useCallback(async () => {
        try {
            await logoutMutation();
        } catch (error) {
            console.error('Logout mutation failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
            apolloClient.resetStore();
            router.push('/auth/login');
        }
    }, [logoutMutation, router]);


    const tryRefreshToken = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await refreshTokenMutation();
            if (data?.refreshToken) {
                const { accessToken, user: refreshedUser } = data.refreshToken;
                handleAuthSuccess(accessToken, refreshedUser as User);
            } else {
                await handleLogout();
            }
        } catch (error) {
            console.error('Failed to refresh token on load:', error);
            await handleLogout();
        } finally {
            setLoading(false);
        }
    }, [refreshTokenMutation, handleLogout]);

    useEffect(() => {
        tryRefreshToken();
    }, [tryRefreshToken]);


    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data } = await loginMutation({ variables: { email, password } });
            if (data?.login) {
                const { accessToken, user: loggedInUser } = data.login;
                handleAuthSuccess(accessToken, loggedInUser as User);
                router.push('/');
            } else {
                throw new Error('Login failed: No data returned from mutation.');
            }
        } catch (error) {
            console.error('Login error:', error);
            await handleLogout(); // Ensure clean state on login failure
            throw error; // Re-throw for the form to handle
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setLoading(true);
        try {
            await registerMutation({ variables: { email, password } });
            // After registration, redirect to a page that tells them to check their email
            router.push('/auth/check-email');
        } catch (error) {
            console.error('Registration error:', error);
            throw error; // Re-throw for the form to handle
        } finally {
            setLoading(false);
        }
    };


    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout: handleLogout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// --- Socket Context ---

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};


const SocketProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
                auth: {
                    token: localStorage.getItem('accessToken'),
                },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Socket.IO connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket.IO disconnected:', reason);
                setIsConnected(false);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket.IO connection error:', err.message);
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                console.log('Disconnecting Socket.IO...');
                newSocket.disconnect();
                setSocket(null);
                setIsConnected(false);
            };
        } else if (socket) {
            // If authentication is lost, disconnect existing socket
            socket.disconnect();
        }
    }, [isAuthenticated]); // Dependency on isAuthenticated handles login/logout

    const value = { socket, isConnected };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};


// --- Composed Providers ---

export const Providers: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
};