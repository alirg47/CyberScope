'use client';

import { Target, Activity, FileText, Zap, Lightbulb } from 'lucide-react';

interface AISummaryProps {
    summary: string;
}

const AISummaryDisplay = ({ summary }: AISummaryProps) => {
    // Parse the summary string into structured parts
    const parseSection = (text: string, label: string) => {
        const regex = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)(?=\\n\\n\\*\\*|$)`, 's');
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    };

    const riskScore = parseSection(summary, 'Risk Score');
    const behavior = parseSection(summary, 'Behavior');
    const evidence = parseSection(summary, 'Evidence');
    const irAction = parseSection(summary, 'IR Action');
    const recommendation = parseSection(summary, 'Recommendation');

    const getSeverityColor = (score: string) => {
        const num = parseInt(score);
        if (num >= 8) return '#ef4444';
        if (num >= 6) return '#f59e0b';
        if (num >= 4) return '#facc15';
        return '#10b981';
    };

    const riskScoreNum = riskScore ? riskScore.split('/')[0] : '0';
    const severityColor = getSeverityColor(riskScoreNum);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                }}>
                    <Activity size={18} color="white" />
                </div>
                <h3 style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: '1.125rem',
                    fontWeight: 700
                }}>
                    AI Threat Analysis
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Risk Score */}
                {riskScore && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        background: `${severityColor}15`,
                        border: `1px solid ${severityColor}40`,
                        borderRadius: '8px'
                    }}>
                        <Target size={20} style={{ color: severityColor, marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <span style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Risk Score
                            </span>
                            <p style={{
                                margin: '4px 0 0 0',
                                color: severityColor,
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                lineHeight: 1
                            }}>
                                {riskScore}
                            </p>
                        </div>
                    </div>
                )}

                {/* Behavior */}
                {behavior && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px'
                    }}>
                        <Activity size={18} style={{ color: '#60a5fa', marginTop: '4px', flexShrink: 0 }} />
                        <div>
                            <h4 style={{
                                margin: '0 0 6px 0',
                                color: '#60a5fa',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Behavior
                            </h4>
                            <p style={{
                                margin: 0,
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                lineHeight: 1.6
                            }}>
                                {behavior}
                            </p>
                        </div>
                    </div>
                )}

                {/* Evidence */}
                {evidence && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px'
                    }}>
                        <FileText size={18} style={{ color: '#a78bfa', marginTop: '4px', flexShrink: 0 }} />
                        <div>
                            <h4 style={{
                                margin: '0 0 6px 0',
                                color: '#a78bfa',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Evidence
                            </h4>
                            <p style={{
                                margin: 0,
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                lineHeight: 1.6
                            }}>
                                {evidence}
                            </p>
                        </div>
                    </div>
                )}

                {/* IR Action */}
                {irAction && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px'
                    }}>
                        <Zap size={18} style={{ color: '#fbbf24', marginTop: '4px', flexShrink: 0 }} />
                        <div>
                            <h4 style={{
                                margin: '0 0 6px 0',
                                color: '#fbbf24',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                IR Action
                            </h4>
                            <p style={{
                                margin: 0,
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                lineHeight: 1.6
                            }}>
                                {irAction}
                            </p>
                        </div>
                    </div>
                )}

                {/* Recommendation */}
                {recommendation && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <Lightbulb size={18} style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                        <div>
                            <h4 style={{
                                margin: '0 0 6px 0',
                                color: '#10b981',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Recommendation
                            </h4>
                            <p style={{
                                margin: 0,
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                lineHeight: 1.6
                            }}>
                                {recommendation}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AISummaryDisplay;
