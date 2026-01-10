// src/hooks/useAuth.tsx
// Simple auth context that lets the app know whether the user
// is in guest mode or has logged in / registered with the backend.
// This does not yet handle tokens – it just stores the returned user.

import * as React from 'react';
import type { User } from '@/services/auth';
import { apiLogin, apiRegister } from '@/services/auth';

type AuthMode = 'guest' | 'account';

interface AuthContextValue {
    mode: AuthMode;
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    /**
     * Attempt to log in. Returns { success, error } where error contains
     * backend validation messages if present.
     */
    login: (params: { email: string; password: string }) => Promise<{
        success: boolean;
        error?: string;
        fieldErrors?: Record<string, string[]>;
    }>;
    /**
     * Attempt to register a new account.
     */
    register: (params: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) => Promise<{
        success: boolean;
        error?: string;
        fieldErrors?: Record<string, string[]>;
    }>;
    /**
     * Explicitly switch back to guest mode (e.g. "use app without account").
     */
    logoutToGuest: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
    undefined,
);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [mode, setMode] = React.useState<AuthMode>('guest');
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const login: AuthContextValue['login'] = async ({ email, password }) => {
        setIsLoading(true);
        try {
            const result = await apiLogin({ email, password });

            if (result.error || !result.data) {
                if (result.status === 429) {
                    return {
                        success: false,
                        error:
                            'Too many login attempts. Please wait a minute and try again.',
                    };
                }
                return {
                    success: false,
                    error: result.error?.message ?? 'Login failed',
                    fieldErrors: result.error?.errors,
                };
            }

            setUser(result.data.user);
            setMode('account');

            return { success: true };
        } catch (e) {
            console.log('[Auth] login error', e);
            return {
                success: false,
                error: 'Unexpected error during login. Please try again.',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const register: AuthContextValue['register'] = async (params) => {
        setIsLoading(true);
        try {
            const result = await apiRegister(params);

            if (result.error || !result.data) {
                if (result.status === 429) {
                    return {
                        success: false,
                        error:
                            'Too many sign-up attempts. Please wait a minute and try again.',
                    };
                }
                return {
                    success: false,
                    error: result.error?.message ?? 'Registration failed',
                    fieldErrors: result.error?.errors,
                };
            }

            // Automatically treat a newly registered user as logged in.
            setUser(result.data.user);
            setMode('account');

            return { success: true };
        } catch (e) {
            console.log('[Auth] register error', e);
            return {
                success: false,
                error:
                    'Unexpected error during registration. Please try again.',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logoutToGuest = () => {
        setUser(null);
        setMode('guest');
    };

    const value: AuthContextValue = {
        mode,
        user,
        isLoggedIn: mode === 'account' && !!user,
        isLoading,
        login,
        register,
        logoutToGuest,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export function useAuth(): AuthContextValue {
    const ctx = React.useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}


