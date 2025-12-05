'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import { Shield, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
    const { currentUser, allUsers, switchUser } = useUser();
    const [isOpen, setIsOpen] = React.useState(false);

    // Get unique roles from all users
    const availableRoles = Array.from(new Set(allUsers.map(u => u.role)));

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(0, 243, 255, 0.1)',
                    border: '1px solid var(--primary-accent)',
                    borderRadius: '6px',
                    color: 'var(--primary-accent)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600
                }}
            >
                <Shield size={16} />
                <span>{currentUser.role}</span>
                <ChevronDown size={14} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '4px',
                    minWidth: '160px',
                    zIndex: 100,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)'
                }}>
                    {availableRoles.map((role) => {
                        // Find first user with this role
                        const userWithRole = allUsers.find(u => u.role === role);
                        if (!userWithRole) return null;

                        return (
                            <button
                                key={role}
                                onClick={() => {
                                    switchUser(userWithRole.id);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    background: currentUser.role === role ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                    color: currentUser.role === role ? 'var(--primary-accent)' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    marginBottom: '2px'
                                }}
                            >
                                {role}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
