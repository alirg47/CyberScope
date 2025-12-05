'use client';

import React, { createContext, useContext } from 'react';
import { useUser, User } from './UserContext';

export type UserRole = 'SOC Lead' | 'SOC L1' | 'SOC L2' | 'SOC L3';

interface AuthContextType {
    user: User;
    role: UserRole;
    canAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useUser();

    const canAccess = (path: string): boolean => {
        // SOC Lead has access to everything
        if (currentUser.role === 'SOC Lead') return true;

        // Home page is accessible by all
        if (path === '/' || path === '') return true;

        // L1 Analyst can access L1 dashboard
        if (path.startsWith('/l1')) {
            return currentUser.role === 'SOC L1' || currentUser.role === 'SOC Lead';
        }

        // L2 Analyst can access L2 dashboard
        if (path.startsWith('/l2')) {
            return currentUser.role === 'SOC L2' || currentUser.role === 'SOC Lead';
        }

        // L3 Analyst can access L3 dashboard
        if (path.startsWith('/l3')) {
            return currentUser.role === 'SOC L3' || currentUser.role === 'SOC Lead';
        }

        // Common pages (alerts, incidents, settings, user-profile) accessible by all
        if (path.startsWith('/alerts') ||
            path.startsWith('/incidents') ||
            path.startsWith('/threat-hunting') ||
            path.startsWith('/settings') ||
            path.startsWith('/user-profile')) {
            return true;
        }

        // Default: deny access
        return false;
    };

    return (
        <AuthContext.Provider value={{ user: currentUser, role: currentUser.role, canAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
