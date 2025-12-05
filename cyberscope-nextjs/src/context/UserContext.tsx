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

// Full SOC Team with English Names
const SOC_TEAM: User[] = [
    {
        id: '1',
        fullName: 'Fahad Al-Qahtani',
        email: 'fahad.alqahtani@cyberscope.sa',
        role: 'SOC Lead',
    },
    {
        id: '2',
        fullName: 'Adel Al-Khaldi',
        email: 'adel.alkhaldi@cyberscope.sa',
        role: 'SOC L1',
    },
    {
        id: '3',
        fullName: 'Sarah Al-Otaibi',
        email: 'sarah.alotaibi@cyberscope.sa',
        role: 'SOC L1',
    },
    {
        id: '4',
        fullName: 'Mohammed Al-Shamri',
        email: 'mohammed.alshamri@cyberscope.sa',
        role: 'SOC L2',
    },
    {
        id: '5',
        fullName: 'Noura Al-Dosari',
        email: 'noura.aldosari@cyberscope.sa',
        role: 'SOC L2',
    },
    {
        id: '6',
        fullName: 'Khaled Al-Mutairi',
        email: 'khaled.almutairi@cyberscope.sa',
        role: 'SOC L3',
    },
    {
        id: '7',
        fullName: 'Reem Al-Ghamdi',
        email: 'reem.alghamdi@cyberscope.sa',
        role: 'SOC L3',
    },
];

const STORAGE_KEY = 'soax_current_user_id';

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User>(() => {
        // Load from localStorage on mount
        if (typeof window !== 'undefined') {
            const savedUserId = localStorage.getItem(STORAGE_KEY);
            if (savedUserId) {
                const savedUser = SOC_TEAM.find(u => u.id === savedUserId);
                if (savedUser) return savedUser;
            }
        }
        // Default to SOC Lead
        return SOC_TEAM[0];
    });

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
