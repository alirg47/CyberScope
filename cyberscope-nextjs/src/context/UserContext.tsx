'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'SOC Lead' | 'SOC L1' | 'SOC L2' | 'SOC L3';
}

interface UserContextType {
    currentUser: User;
    allUsers: User[];
    switchUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Full SOC Team - 8 Users (2 per role)
const SOC_TEAM: User[] = [
    // SOC Leads (2)
    {
        id: '1',
        fullName: 'Wael Hawi',
        email: 'wael.hawi@cyberscope.com',
        role: 'SOC Lead',
    },
    {
        id: '2',
        fullName: 'Ali AL-Ghannam',
        email: 'ali.alghannam@soax.sa',
        role: 'SOC Lead',
    },
    // SOC L1 Analysts (2)
    {
        id: '3',
        fullName: 'Adel Al-Khaldi',
        email: 'adel.alkhaldi@soax.sa',
        role: 'SOC L1',
    },
    {
        id: '4',
        fullName: 'Sarah Al-Otaibi',
        email: 'sarah.alotaibi@soax.sa',
        role: 'SOC L1',
    },
    // SOC L2 Analysts (2)
    {
        id: '5',
        fullName: 'Mohammed Al-Shamri',
        email: 'mohammed.alshamri@soax.sa',
        role: 'SOC L2',
    },
    {
        id: '6',
        fullName: 'Noura Al-Dosari',
        email: 'noura.aldosari@soax.sa',
        role: 'SOC L2',
    },
    // SOC L3 Analysts (2)
    {
        id: '7',
        fullName: 'Khaled Al-Mutairi',
        email: 'khaled.almutairi@soax.sa',
        role: 'SOC L3',
    },
    {
        id: '8',
        fullName: 'Reem Al-Ghamdi',
        email: 'reem.alghamdi@soax.sa',
        role: 'SOC L3',
    },
];

const STORAGE_KEY = 'soax_current_user_id';

export function UserProvider({ children }: { children: ReactNode }) {
    // Fix: Initialize with default user to ensure server/client match during hydration
    const [currentUser, setCurrentUser] = useState<User>(SOC_TEAM[0]);

    // Load from localStorage after mount (client-only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUserId = localStorage.getItem(STORAGE_KEY);
            if (savedUserId) {
                const savedUser = SOC_TEAM.find(u => u.id === savedUserId);
                if (savedUser && savedUser.id !== currentUser.id) {
                    setCurrentUser(savedUser);
                }
            }
        }
    }, []);

    const switchUser = (userId: string) => {
        const user = SOC_TEAM.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, userId);
            }
        }
    };

    // Sync with localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, currentUser.id);
        }
    }, [currentUser.id]);

    return (
        <UserContext.Provider value={{ currentUser, allUsers: SOC_TEAM, switchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
