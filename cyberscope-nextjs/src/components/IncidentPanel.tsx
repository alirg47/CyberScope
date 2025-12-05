'use client';

import { Incident } from '@/data/mockIncidents';
import ThreatGraph from './ThreatGraph';
import KillChainView from './KillChainView';
import { useState } from 'react';

interface IncidentPanelProps {
    incident: Incident;
    onResolve: (id: string) => void;
    onEscalate: (id: string) => void;
}

const IncidentPanel: React.FC<IncidentPanelProps> = ({ incident, onResolve, onEscalate }) => {
    const [selectedTab, setSelectedTab] = useState('overview');

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            'Critical': 'var(--risk-critical)',
            'High': 'var(--risk-high)',
            'Medium': 'var(--risk-medium)',
            'Low': 'var(--risk-low)'
        };
        return colors[severity] || colors['Medium'];
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Active': 'var(--danger)',
            'Investigating': 'var(--warning)',
            'Pending Review': 'var(--info)',
            'Resolved': 'var(--success)'
        };
        return colors[status] || colors['Investigating'];
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="glass-card animate-fade-in" style={{ marginBottom: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 'var(--spacing-lg)',
                paddingBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {incident.title}
                        </h3>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getSeverityColor(incident.severity) + '33',
                            color: getSeverityColor(incident.severity),
                            border: `1px solid ${getSeverityColor(incident.severity)}`
                        }}>
                            {incident.severity}
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getStatusColor(incident.status) + '33',
                            color: getStatusColor(incident.status),
                            border: `1px solid ${getStatusColor(incident.status)}`
                        }}>
                            {incident.status}
                        </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {incident.incident_id} • Assigned to {incident.l2_analyst || incident.created_by} • Created {formatTimestamp(incident.created_at)}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                {['overview', 'timeline', 'alerts', 'context'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            cursor: 'pointer',
                            color: selectedTab === tab ? 'var(--primary-accent)' : 'var(--text-secondary)',
                            fontWeight: selectedTab === tab ? 600 : 400,
                            borderBottom: selectedTab === tab ? '2px solid var(--primary-accent)' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && (
                <div>
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
                            {incident.summary}
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            Attack Graph
                        </div>
                        <ThreatGraph graph={incident.graph} />
                    </div>

                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            Kill Chain Progress
                        </div>
                        <KillChainView killChain={incident.kill_chain} />
                    </div>
                </div>
            )}

            {selectedTab === 'timeline' && (
                <div>
                    <div style={{ position: 'relative', paddingLeft: 'var(--spacing-xl)' }}>
                        {/* Timeline line */}
                        <div style={{
                            position: 'absolute',
                            left: '1rem',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: 'linear-gradient(to bottom, var(--primary-accent), var(--secondary-accent))'
                        }} />

                        {incident.timeline.map((item, index) => (
                            <div key={index} style={{
                                marginBottom: 'var(--spacing-lg)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-1.75rem',
                                    top: '0.5rem',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-accent)',
                                    border: '2px solid var(--primary-bg)',
                                    boxShadow: '0 0 10px var(--primary-accent)'
                                }} />

                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div style={{
                                        color: 'var(--primary-accent)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        marginBottom: '0.25rem'
                                    }}>
                                        {item.time} • {item.stage}
                                    </div>
                                    <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                                        {item.event}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        Host: {item.host}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'alerts' && (
                <div>
                    <div style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {incident.related_alerts.length} related alerts grouped into this incident
                    </div>
                    {incident.related_alerts.map((alert, index) => (
                        <div key={index} style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                        #{alert.alert_id} - {alert.alert_type}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {alert.user} • {alert.host} • {formatTimestamp(alert.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedTab === 'context' && (
                <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div style={{
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>🧠</span> RAG Context - Historical Insights
                        </div>
                        {incident.rag_context.map((context, index) => (
                            <div key={index} style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-sm)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                lineHeight: 1.6
                            }}>
                                💡 {context}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-lg)',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <button
                    className="btn btn-success"
                    onClick={() => onResolve(incident.incident_id)}
                    style={{ flex: 1 }}
                >
                    ✓ Mark as Resolved
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => onEscalate(incident.incident_id)}
                    style={{ flex: 1 }}
                >
                    ⬆️ Escalate to L3
                </button>
                <button
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                >
                    📝 Add Note
                </button>
            </div>
        </div>
    );
};

export default IncidentPanel;

