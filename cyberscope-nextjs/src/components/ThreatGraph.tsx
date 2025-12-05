'use client';

import { IncidentGraph } from '@/data/mockIncidents';

interface ThreatGraphProps {
    graph: IncidentGraph;
}

const ThreatGraph: React.FC<ThreatGraphProps> = ({ graph }) => {
    const { nodes = [], edges = [] } = graph || {};

    const getNodeColor = (type: string) => {
        const colors: Record<string, string> = {
            user: '#3b82f6',
            host: '#8b5cf6',
            external_ip: '#ef4444',
            malware: '#dc2626',
            database: '#10b981',
            external_device: '#f59e0b'
        };
        return colors[type] || '#6b7280';
    };

    const getNodeIcon = (type: string) => {
        const icons: Record<string, string> = {
            user: '👤',
            host: '🖥️',
            external_ip: '🌐',
            malware: '🦠',
            database: '🗄️',
            external_device: '💾'
        };
        return icons[type] || '📌';
    };

    if (!nodes.length) {
        return (
            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔗</div>
                <div style={{ color: 'var(--text-muted)' }}>No graph data available</div>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                Attack Graph
            </h4>

            <div style={{
                position: 'relative',
                minHeight: '400px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-xl)',
                overflow: 'auto'
            }}>
                {/* Simplified visual representation */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-lg)',
                    alignItems: 'center'
                }}>
                    {nodes.map((node) => {
                        const relatedEdges = edges.filter(e => e.from === node.id || e.to === node.id);

                        return (
                            <div key={node.id} style={{ width: '100%', maxWidth: '600px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    background: getNodeColor(node.type) + '20',
                                    border: `2px solid ${getNodeColor(node.type)}`,
                                    borderRadius: 'var(--radius-lg)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        fontSize: '2rem',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: getNodeColor(node.type),
                                        borderRadius: '50%'
                                    }}>
                                        {getNodeIcon(node.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.875rem'
                                        }}>
                                            {node.label}
                                        </div>
                                        <div style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.75rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {node.type.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Show connections */}
                                {relatedEdges.map((edge, edgeIndex) => {
                                    if (edge.from === node.id) {
                                        return (
                                            <div key={edgeIndex} style={{
                                                marginLeft: '2rem',
                                                marginTop: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                borderLeft: '2px solid var(--secondary-accent)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                → {edge.label}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-md)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)',
                    fontSize: '0.75rem'
                }}>
                    <div style={{ color: 'var(--text-muted)', width: '100%', marginBottom: 'var(--spacing-sm)' }}>
                        Node Types:
                    </div>
                    {['user', 'host', 'external_ip', 'malware', 'database', 'external_device'].map(type => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: getNodeColor(type),
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.6rem'
                            }}>
                                {getNodeIcon(type)}
                            </div>
                            <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                {type.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThreatGraph;
