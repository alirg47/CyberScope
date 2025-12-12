import { User as ContextUser } from '@/context/UserContext';
import { User as ProfileUser, mockUsers } from '@/data/mockUsers';

/**
 * Maps a UserContext user to the full profile user data structure
 * by matching against mockUsers and enriching with additional fields
 */
export function mapToProfileUser(contextUser: ContextUser): ProfileUser {
    // Convert role format: 'SOC Lead' -> 'Lead', 'SOC L1' -> 'L1', etc.
    const roleMap: Record<string, ProfileUser['role']> = {
        'SOC Lead': 'Lead',
        'SOC L1': 'L1',
        'SOC L2': 'L2',
        'SOC L3': 'L3',
    };

    const profileRole = roleMap[contextUser.role] || 'L1';

    const matchedUser = mockUsers.find(
        (user) => user.email.toLowerCase() === contextUser.email.toLowerCase()
    ) || mockUsers.find(
        (user) => user.nameEn.toLowerCase() === contextUser.fullName.toLowerCase()
    );

    // If we found a match, return it
    if (matchedUser) {
        return matchedUser;
    }

    // Otherwise, create a synthetic user with the context data
    // and role-appropriate statistics
    // FIX: Use deterministic values to avoid hydration errors
    const now = '2024-12-12T09:00:00Z';

    // Generate role-appropriate statistics (deterministic)
    let statistics: ProfileUser['statistics'];
    switch (profileRole) {
        case 'L1':
            statistics = {
                alertsProcessed: 1245,
                avgResponseTime: 2.5,
            };
            break;
        case 'L2':
            statistics = {
                incidentsHandled: 320,
                threatsConfirmed: 85,
                avgResponseTime: 40,
            };
            break;
        case 'L3':
            statistics = {
                threatsConfirmed: 42,
                avgResponseTime: 115,
            };
            break;
        case 'Lead':
        default:
            statistics = {
                incidentsHandled: 150,
                threatsConfirmed: 50,
                avgResponseTime: 35,
            };
            break;
    }

    // Determine department based on role
    const departmentMap: Record<ProfileUser['role'], string> = {
        'L1': 'Security Operations',
        'L2': 'Incident Response',
        'L3': 'Threat Hunting',
        'Lead': 'Security Operations',
    };

    // Generate user ID based on context user ID or create one deterministically
    const userId = contextUser.id || 'USR-SYNTHETIC';

    return {
        id: userId,
        name: contextUser.fullName,
        nameEn: contextUser.fullName,
        role: profileRole,
        email: contextUser.email,
        department: departmentMap[profileRole],
        lastLogin: now,
        statistics,
    };
}
