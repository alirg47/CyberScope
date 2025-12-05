'use client';

import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

export default function AccessDenied() {
    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'var(--text-primary)'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 0, 60, 0.1)',
                border: '2px solid #ff003c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 0 30px rgba(255, 0, 60, 0.2)'
            }}>
                <Lock size={40} color="#ff003c" />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '12px' }}>Access Denied</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.6' }}>
                You do not have permission to view this dashboard.
                Please contact your SOC Lead or switch to an authorized role.
            </p>
        </div>
    );
}
