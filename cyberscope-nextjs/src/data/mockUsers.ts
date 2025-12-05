export interface User {
    id: string;
    name: string;
    nameEn: string;
    role: 'L1' | 'L2' | 'L3' | 'Lead';
    email: string;
    department: string;
    lastLogin: string;
    statistics: {
        alertsProcessed?: number;
        incidentsHandled?: number;
        threatsConfirmed?: number;
        avgResponseTime: number;
    };
    avatar?: string;
}

export const mockUsers: User[] = [
    // L1 Analysts
    {
        id: 'USR-001',
        name: 'Mohammad Al-Ahmad',
        nameEn: 'Mohammad Al-Ahmad',
        role: 'L1',
        email: 'mohammad.ahmad@cyberscope.com',
        department: 'Security Operations',
        lastLogin: '2024-11-30T14:23:00Z',
        statistics: {
            alertsProcessed: 1247,
            avgResponseTime: 2.3
        }
    },
    {
        id: 'USR-002',
        name: 'Fatimah Al-Zahrani',
        nameEn: 'Fatimah Al-Zahrani',
        role: 'L1',
        email: 'fatimah.zahrani@cyberscope.com',
        department: 'Security Operations',
        lastLogin: '2024-11-30T15:12:00Z',
        statistics: {
            alertsProcessed: 982,
            avgResponseTime: 1.8
        }
    },
    {
        id: 'USR-003',
        name: 'Ali Al-Mutairi',
        nameEn: 'Ali Al-Mutairi',
        role: 'L1',
        email: 'ali.mutairi@cyberscope.com',
        department: 'Security Operations',
        lastLogin: '2024-11-30T13:45:00Z',
        statistics: {
            alertsProcessed: 1103,
            avgResponseTime: 2.1
        }
    },
    // L2 Analysts
    {
        id: 'USR-004',
        name: 'Ahmad Bin Saeed',
        nameEn: 'Ahmad Bin Saeed',
        role: 'L2',
        email: 'ahmad.saeed@cyberscope.com',
        department: 'Incident Response',
        lastLogin: '2024-11-30T14:50:00Z',
        statistics: {
            incidentsHandled: 342,
            threatsConfirmed: 87,
            avgResponseTime: 45
        }
    },
    {
        id: 'USR-005',
        name: 'Noor Al-Shamsi',
        nameEn: 'Noor Al-Shamsi',
        role: 'L2',
        email: 'noor.shamsi@cyberscope.com',
        department: 'Incident Response',
        lastLogin: '2024-11-30T15:30:00Z',
        statistics: {
            incidentsHandled: 298,
            threatsConfirmed: 73,
            avgResponseTime: 38
        }
    },
    {
        id: 'USR-006',
        name: 'Khalid Al-Harbi',
        nameEn: 'Khalid Al-Harbi',
        role: 'L2',
        email: 'khalid.harbi@cyberscope.com',
        department: 'Incident Response',
        lastLogin: '2024-11-30T12:15:00Z',
        statistics: {
            incidentsHandled: 315,
            threatsConfirmed: 91,
            avgResponseTime: 42
        }
    },
    // L3 Analysts
    {
        id: 'USR-007',
        name: 'Omar Al-Mansour',
        nameEn: 'Omar Al-Mansour',
        role: 'L3',
        email: 'omar.mansour@cyberscope.com',
        department: 'Threat Hunting',
        lastLogin: '2024-11-30T16:00:00Z',
        statistics: {
            threatsConfirmed: 45,
            avgResponseTime: 120
        }
    },
    {
        id: 'USR-008',
        name: 'Layla Al-Dosari',
        nameEn: 'Layla Al-Dosari',
        role: 'L3',
        email: 'layla.dosari@cyberscope.com',
        department: 'Threat Hunting',
        lastLogin: '2024-11-30T14:30:00Z',
        statistics: {
            threatsConfirmed: 38,
            avgResponseTime: 135
        }
    },
    // Lead
    {
        id: 'USR-009',
        name: 'Fahad Al-Qahtani',
        nameEn: 'Fahad Al-Qahtani',
        role: 'Lead',
        email: 'fahad.qahtani@cyberscope.com',
        department: 'Security Operations',
        lastLogin: '2024-11-30T15:45:00Z',
        statistics: {
            incidentsHandled: 156,
            threatsConfirmed: 52,
            avgResponseTime: 35
        }
    }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: User['role']): User[] => {
    return mockUsers.filter(user => user.role === role);
};

export const getCurrentUser = (): User => {
    // Return a default current user (you can change this logic)
    return mockUsers[8]; // Fahad Al-Qahtani (Lead)
};
