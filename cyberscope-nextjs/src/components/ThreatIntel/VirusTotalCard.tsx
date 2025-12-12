'use client';

import { VirusTotalData } from '@/data/mockAlerts';
import { Shield, AlertCircle, Globe, Server, MapPin } from 'lucide-react';

interface VirusTotalCardProps {
    vt: VirusTotalData;
}

const VirusTotalCard = ({ vt }: VirusTotalCardProps) => {
    const getThreatLevel = () => {
        if (vt.malicious > 0) return { level: 'Malicious', color: '#ef4444' };
        if (vt.suspicious > 0) return { level: 'Suspicious', color: '#f59e0b' };
        if (vt.clean > 0) return { level: 'Clean', color: '#10b981' };
        return { level: 'Unknown', color: '#6b7280' };
    };

    const threat = getThreatLevel();

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: `1px solid ${threat.color}44`,
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
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
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
                            VirusTotal Intelligence
                        </h3>
                        <p style={{
                            margin: 0,
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            Multi-Vendor Threat Analysis
                        </p>
                    </div>
                </div>

                <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: `${threat.color}22`,
                    border: `2px solid ${threat.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertCircle size={16} style={{ color: threat.color }} />
                    <span style={{
                        color: threat.color,
                        fontWeight: 700,
                        fontSize: '0.875rem'
                    }}>
                        {threat.level}
                    </span>
                </div>
            </div>

            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <h5 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600
                }}>
                    VENDOR ANALYSIS
                </h5>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                }}>
                    <div style={{
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#ef4444',
                            marginBottom: '4px'
                        }}>
                            {vt.malicious}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase'
                        }}>
                            Malicious
                        </div>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#f59e0b',
                            marginBottom: '4px'
                        }}>
                            {vt.suspicious}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase'
                        }}>
                            Suspicious
                        </div>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#10b981',
                            marginBottom: '4px'
                        }}>
                            {vt.clean}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase'
                        }}>
                            Clean
                        </div>
                    </div>
                </div>
                <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: 'rgba(100, 100, 100, 0.2)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    {vt.malicious_vendors_count} • Community Score: {vt.community_score}
                </div>
            </div>

            {(vt.organization || vt.country || vt.asn) && (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    <h5 style={{
                        margin: '0 0 12px 0',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}>
                        NETWORK INTELLIGENCE
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {vt.organization && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Server size={14} style={{ color: '#06b6d4' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <strong style={{ color: 'var(--text-secondary)' }}>Org:</strong> {vt.organization}
                                </span>
                            </div>
                        )}
                        {vt.country && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={14} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <strong style={{ color: 'var(--text-secondary)' }}>Country:</strong> {vt.country}
                                </span>
                            </div>
                        )}
                        {vt.asn && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Globe size={14} style={{ color: '#8b5cf6' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <strong style={{ color: 'var(--text-secondary)' }}>ASN:</strong> AS{vt.asn}
                                </span>
                            </div>
                        )}
                        {vt.ip_range && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Server size={14} style={{ color: '#f59e0b' }} />
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'monospace'
                                }}>
                                    <strong style={{ color: 'var(--text-secondary)' }}>Range:</strong> {vt.ip_range}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{
                padding: '8px 12px',
                background: 'rgba(100, 100, 100, 0.2)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center'
            }}>
                Last analyzed: {vt.last_analysis_date}
            </div>
        </div>
    );
};

export default VirusTotalCard;
