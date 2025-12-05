'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    return (
        <header style={{
            height: '70px',
            background: 'var(--secondary-bg)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40
        }}>
            {/* Left Side - Breadcrumbs or Title (Optional) */}
            <div>
                {/* Can add breadcrumbs here later */}
            </div>

            {/* Right Side - Actions & Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

                <RoleSwitcher />

                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={20} color="var(--text-secondary)" />
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary-accent)',
                        boxShadow: '0 0 8px var(--primary-accent)'
                    }} />
                </div>

                <div style={{ height: '32px', width: '1px', background: 'var(--glass-border)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {user?.fullName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {user?.email}
                        </div>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        {user?.fullName.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
}
