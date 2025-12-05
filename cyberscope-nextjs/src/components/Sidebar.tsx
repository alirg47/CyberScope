'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShieldAlert,
    FileSearch,
    Crosshair,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { role } = useAuth();

    const navItems = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/l1', label: 'L1 Alerts', icon: ShieldAlert },
        { href: '/l2', label: 'L2 Incidents', icon: FileSearch },
        { href: '/l3', label: 'L3 Hunting', icon: Crosshair },
        { href: '/profile', label: 'Profile', icon: Users },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            style={{
                width: collapsed ? '80px' : '260px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                background: 'var(--secondary-bg)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                zIndex: 50
            }}
        >
            {/* Branding Area */}
            <div style={{
                padding: '24px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between'
            }}>
                {!collapsed && (
                    <div>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'var(--primary-accent)',
                            letterSpacing: '1px'
                        }}>
                            SOAx
                        </h1>
                        <p style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            SOC Operations Assistant
                        </p>
                    </div>
                )}
                {collapsed && (
                    <h1 style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--primary-accent)'
                    }}>
                        S
                    </h1>
                )}
            </div>

            {/* Navigation Items */}
            <nav style={{ flex: 1, padding: '20px 12px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        color: isActive ? 'var(--primary-accent)' : 'var(--text-secondary)',
                                        background: isActive ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                        border: isActive ? '1px solid rgba(0, 243, 255, 0.2)' : '1px solid transparent',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        justifyContent: collapsed ? 'center' : 'flex-start'
                                    }}
                                    title={collapsed ? item.label : ''}
                                >
                                    <Icon size={20} />
                                    {!collapsed && (
                                        <span style={{ marginLeft: '12px', fontSize: '0.9rem', fontWeight: 500 }}>
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer / Collapse Toggle */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {collapsed ? <ChevronRight size={16} /> : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronLeft size={16} /> <span>Collapse</span></div>}
                </button>
            </div>
        </aside>
    );
}
