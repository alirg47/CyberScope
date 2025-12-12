'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { ChevronDown, User as UserIcon, Home, Shield, AlertTriangle, Search, Settings } from 'lucide-react';

export default function TopNav() {
    const { currentUser, switchUser, allUsers } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home Dashboard', icon: Home },
        { href: '/l1', label: 'Alerts Triage (L1)', icon: AlertTriangle },
        { href: '/l2', label: 'Incidents Investigation (L2)', icon: Shield },
        { href: '/l3', label: 'Threat Hunting (L3)', icon: Search },
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/profile', label: 'User Profile', icon: UserIcon },
    ];

    return (
        <nav className="top-nav">
            {/* Logo Section - SOAx Branding */}
            <div className="nav-logo">
                <div className="logo-icon">
                    <Shield size={28} strokeWidth={2.5} />
                </div>
                <div className="logo-content">
                    <div className="logo-text">SOAx</div>
                    <div className="logo-subtitle">
                        SOC Operations Assistant<br />
                        Powered by CyberScope
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="nav-links">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Section */}
            <div className="nav-user">
                <div className="user-info">
                    <span className="user-name">{currentUser.fullName}</span>
                    <span className="user-role-badge">{currentUser.role}</span>
                </div>

                {/* Account Switcher Dropdown */}
                <div className="account-switcher">
                    <button
                        className="switcher-button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-label="Switch account"
                    >
                        <UserIcon size={20} />
                        <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div
                                className="dropdown-overlay"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="switcher-dropdown">
                                <div className="dropdown-header">Switch Account</div>
                                {allUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        className={`dropdown-item ${currentUser.id === user.id ? 'active' : ''}`}
                                        onClick={() => {
                                            switchUser(user.id);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <div className="dropdown-item-content">
                                            <div className="dropdown-item-name">{user.fullName}</div>
                                            <div className="dropdown-item-role">{user.role}</div>
                                        </div>
                                        {currentUser.id === user.id && (
                                            <div className="dropdown-item-check">✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
