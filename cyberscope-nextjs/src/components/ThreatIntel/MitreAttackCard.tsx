'use client';

import { MitreAttackData } from '@/data/mockAlerts';
import { ExternalLink, Shield, Target, AlertTriangle } from 'lucide-react';

interface MitreAttackCardProps {
    mitre: MitreAttackData;
}

const MitreAttackCard = ({ mitre }: MitreAttackCardProps) => {
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 70) return '#10b981';
        if (confidence >= 40) return '#f59e0b';
        return '#ef4444';
    };

    const confidenceColor = getConfidenceColor(mitre.confidence);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                    }}>
                        <Shield size={20} color="white" />
                    </div>
                    <div>
                        <h3 style={{
                            margin: 0,
                            color: 'var(--text-primary)',
                            fontSize: '1.125rem',
                            fontWeight: 700
                        }}>
                            MITRE ATT&CK Technique
                        </h3>
                        <p style={{
                            margin: 0,
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            Threat Intelligence Framework
                        </p>
                    </div>
                </div>

                <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: `${confidenceColor}22`,
                    border: `1px solid ${confidenceColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Target size={16} style={{ color: confidenceColor }} />
                    <span style={{
                        color: confidenceColor,
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}>
                        {mitre.confidence}% Confidence
                    </span>
                </div>
            </div>

            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                }}>
                    <span style={{
                        padding: '4px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        fontFamily: 'monospace'
                    }}>
                        {mitre.id}
                    </span>
                    <h4 style={{
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}>
                        {mitre.name}
                    </h4>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                    <span style={{
                        color: '#f59e0b',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}>
                        Tactic: {mitre.tactic}
                    </span>
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <h5 style={{
                    margin: '0 0 8px 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Description
                </h5>
                <p style={{
                    margin: 0,
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    maxHeight: '120px',
                    overflow: 'auto',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px'
                }}>
                    {mitre.description.substring(0, 400)}...
                </p>
            </div>

            {mitre.references && mitre.references.length > 0 && (
                <div>
                    <h5 style={{
                        margin: '0 0 8px 0',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        References
                    </h5>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {mitre.references.slice(0, 3).map((ref, index) => (
                            <a
                                key={index}
                                href={ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    border: '1px solid rgba(59, 130, 246, 0.4)',
                                    borderRadius: '6px',
                                    color: '#60a5fa',
                                    fontSize: '0.75rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <ExternalLink size={12} />
                                Reference {index + 1}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MitreAttackCard;
