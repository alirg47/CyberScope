'use client';

import { KillChain } from '@/data/mockIncidents';

interface KillChainViewProps {
    killChain: KillChain;
}

const KillChainView: React.FC<KillChainViewProps> = ({ killChain }) => {
    if (!killChain) return null;

    const stages = [
        { key: 'reconnaissance' as keyof KillChain, label: 'Reconnaissance', icon: '🔍' },
        { key: 'weaponization' as keyof KillChain, label: 'Weaponization', icon: '⚙️' },
        { key: 'delivery' as keyof KillChain, label: 'Delivery', icon: '📧' },
        { key: 'exploitation' as keyof KillChain, label: 'Exploitation', icon: '💥' },
        { key: 'installation' as keyof KillChain, label: 'Installation', icon: '📥' },
        { key: 'commandControl' as keyof KillChain, label: 'Command & Control', icon: '📡' },
        { key: 'actionsObjectives' as keyof KillChain, label: 'Actions on Objectives', icon: '🎯' }
    ];

    return (
        <div className="glass-card">
            <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                Cyber Kill Chain
            </h4>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
            }}>
                {stages.map((stage, index) => {
                    const isActive = killChain[stage.key];

                    return (
                        <div key={stage.key}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: isActive
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(100, 100, 100, 0.1)',
                                border: isActive
                                    ? '1px solid var(--danger)'
                                    : '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.3s ease',
                                opacity: isActive ? 1 : 0.5
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    filter: isActive ? 'none' : 'grayscale(100%)'
                                }}>
                                    {stage.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}>
                                        {stage.label}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: isActive ? 'var(--danger)' : 'var(--glass-bg)',
                                    color: isActive ? 'white' : 'var(--text-muted)'
                                }}>
                                    {isActive ? 'Detected' : 'Not Detected'}
                                </div>
                            </div>

                            {index < stages.length - 1 && (
                                <div style={{
                                    width: '2px',
                                    height: '12px',
                                    background: isActive
                                        ? 'var(--danger)'
                                        : 'var(--glass-border)',
                                    margin: '0 auto',
                                    marginLeft: '2rem'
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KillChainView;
