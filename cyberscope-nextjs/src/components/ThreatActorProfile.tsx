'use client';

import { useState, useEffect } from 'react';
import { mockMISPData } from '@/data/mockMISP';

interface ThreatActorProfileProps {
    actorName: string;
}

interface ActorData {
    name: string;
    aliases: string[];
    origin: string;
    motivation: string;
    tools: string[];
    description: string;
    lastSeen?: string;
}

const ThreatActorProfile: React.FC<ThreatActorProfileProps> = ({ actorName }) => {
    const [actorData, setActorData] = useState<ActorData | null>(null);

    useEffect(() => {
        // Map from simple names to MISP data
        const actorMapping: Record<string, any> = {
            'TA505': mockMISPData.threatActors['TA505'],
            'APT28': mockMISPData.threatActors['APT28'],
            'APT29': mockMISPData.threatActors['APT29'],
            'Lazarus Group': mockMISPData.threatActors['Lazarus Group']
        };

        const data = actorMapping[actorName];
        if (data) {
            setActorData({
                name: data.name,
                aliases: data.aliases || [],
                origin: data.origin,
                motivation: data.motivation,
                tools: data.knownTools || data.tools || [],
                description: data.description || 'No description available',
                lastSeen: data.lastSeen || 'Unknown'
            });
        } else {
            setActorData(null);
        }
    }, [actorName]);

    if (!actorData) {
        return (
            <div className="glass-card">
                <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a threat actor to view profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card animate-fade-in">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: 'var(--spacing-md)'
            }}>
                <div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        {actorData.name}
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Aliases: {actorData.aliases.join(', ')}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-danger" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                        {actorData.origin}
                    </span>
                    {actorData.lastSeen && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Last Seen: {actorData.lastSeen}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                    Description
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {actorData.description}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        Motivation
                    </h4>
                    <div style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary-accent)',
                        fontSize: '0.875rem',
                        display: 'inline-block'
                    }}>
                        {actorData.motivation}
                    </div>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        Known Tools
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {actorData.tools.map(tool => (
                            <span key={tool} className="badge badge-warning">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatActorProfile;
