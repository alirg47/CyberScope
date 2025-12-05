'use client';

import { useState, useEffect } from 'react';
import { enrichIOC, mockMISPData } from '@/data/mockMISP';

interface MISPPanelProps {
    iocValue: string;
    iocType?: 'ip' | 'domain' | 'hash' | 'email';
}

const MISPPanel: React.FC<MISPPanelProps> = ({ iocValue, iocType = 'ip' }) => {
    const [enrichmentData, setEnrichmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call delay
        setTimeout(() => {
            const data = enrichIOC(iocValue, iocType);
            setEnrichmentData(data);
            setLoading(false);
        }, 500);
    }, [iocValue, iocType]);

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <div style={{ margin: '0 auto', color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>
                    Enriching IOC with MISP data...
                </div>
            </div>
        );
    }

    if (!enrichmentData || !enrichmentData.found) {
        return (
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>ℹ️</div>
                <div style={{ color: 'var(--text-muted)' }}>
                    No threat intelligence available for this IOC
                </div>
            </div>
        );
    }

    const { malicious, confidence, threatActor, campaigns, tags, description, firstSeen, lastSeen } = enrichmentData;

    return (
        <div className="glass-card">
            <h4 style={{
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
            }}>
                <span>🔒</span> MISP Threat Intelligence
            </h4>

            {/* Malicious Status */}
            <div style={{
                padding: 'var(--spacing-md)',
                background: malicious ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: malicious ? '1px solid var(--danger)' : '1px solid var(--success)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{
                            color: malicious ? 'var(--danger)' : 'var(--success)',
                            fontWeight: 600,
                            fontSize: '1.125rem'
                        }}>
                            {malicious ? '⚠️ MALICIOUS' : '✅ BENIGN'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            Confidence: {confidence}%
                        </div>
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        color: malicious ? 'var(--danger)' : 'var(--success)',
                        fontWeight: 700
                    }}>
                        {confidence}%
                    </div>
                </div>
            </div>

            {/* IOC Information */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        First Seen
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                        {firstSeen}
                    </div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        Last Seen
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                        {lastSeen}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    Description
                </div>
                <div style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    padding: 'var(--spacing-md)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    {description}
                </div>
            </div>

            {/* Threat Actor */}
            {threatActor && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        Associated Threat Actor
                    </div>
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                        <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {threatActor}
                            </div>
                            {mockMISPData.threatActors[threatActor] && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    {mockMISPData.threatActors[threatActor].motivation}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Campaigns */}
            {campaigns && campaigns.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        Related Campaigns
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {campaigns.map((campaign: string, index: number) => (
                            <div key={index} style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid var(--warning)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)'
                            }}>
                                <span>🎯</span> {campaign}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        Tags
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                        {tags.map((tag: string, index: number) => (
                            <span key={index} className="badge badge-info">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MISPPanel;
