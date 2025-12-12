'use client';

import { TimelineEvent, IncidentAlert, IncidentGraph } from '@/data/mockIncidents';
import { Clock, User, FileText, AlertCircle, Network } from 'lucide-react';

interface L2InvestigationData {
    analyst: string;
    notes: string;
    timeline: TimelineEvent[];
    related_alerts: IncidentAlert[];
    graph: IncidentGraph;
    escalation_note: string;
    escalation_timestamp: string;
    escalated_by: string;
}

interface L2InvestigationPanelProps {
    data: L2InvestigationData;
}

const L2InvestigationPanel = ({ data }: L2InvestigationPanelProps) => {
    return (
        <div className="l2-investigation-panel">
            {/* Escalation Metadata */}
            <div className="escalation-meta">
                <div className="meta-header">
                    <h5>Escalation Information</h5>
                </div>
                <div className="meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">
                            <User size={16} />
                            Escalated by:
                        </span>
                        <span className="meta-value">{data.escalated_by}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">
                            <Clock size={16} />
                            Escalation Date:
                        </span>
                        <span className="meta-value" suppressHydrationWarning>
                            {new Date(data.escalation_timestamp).toLocaleString()}
                        </span>
                    </div>
                    <div className="meta-item full-width">
                        <span className="meta-label">
                            <FileText size={16} />
                            Escalation Note:
                        </span>
                        <span className="meta-value escalation-note">{data.escalation_note}</span>
                    </div>
                </div>
            </div>

            {/* L2 Analyst & Notes */}
            <div className="l2-analyst-section">
                <div className="section-header">
                    <User size={18} color="#3b82f6" />
                    <h5>L2 Analyst Investigation</h5>
                </div>
                <div className="analyst-info">
                    <span className="analyst-label">Investigated by:</span>
                    <span className="analyst-name">{data.analyst}</span>
                </div>
                <div className="l2-notes">
                    <strong>Investigation Notes:</strong>
                    <p>{data.notes}</p>
                </div>
            </div>

            {/* Timeline */}
            {data.timeline && data.timeline.length > 0 && (
                <div className="l2-timeline-section">
                    <div className="section-header">
                        <Clock size={18} color="#10b981" />
                        <h5>Investigation Timeline ({data.timeline.length} events)</h5>
                    </div>
                    <div className="timeline-list">
                        {data.timeline.map((event, index) => (
                            <div key={index} className="timeline-event">
                                <div className="timeline-time">{event.time}</div>
                                <div className="timeline-details">
                                    <div className="timeline-event-text">{event.event}</div>
                                    <div className="timeline-meta">
                                        <span className="timeline-stage">{event.stage}</span>
                                        <span className="timeline-host">{event.host}</span>
                                        {event.mitre_technique && (
                                            <span className="timeline-mitre">{event.mitre_technique}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Alerts */}
            {data.related_alerts && data.related_alerts.length > 0 && (
                <div className="l2-alerts-section">
                    <div className="section-header">
                        <AlertCircle size={18} color="#f59e0b" />
                        <h5>Related Alerts ({data.related_alerts.length})</h5>
                    </div>
                    <div className="alerts-list">
                        {data.related_alerts.map((alert, index) => (
                            <div key={index} className="alert-item">
                                <div className="alert-id">{alert.alert_id}</div>
                                <div className="alert-type">{alert.alert_type}</div>
                                <div className="alert-details">
                                    {alert.user && <span>User: {alert.user}</span>}
                                    {alert.host && <span>Host: {alert.host}</span>}
                                    {alert.src_ip && <span>IP: {alert.src_ip}</span>}
                                </div>
                                <div className="alert-time" suppressHydrationWarning>
                                    {new Date(alert.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Correlation Graph */}
            {data.graph && data.graph.nodes && data.graph.nodes.length > 0 && (
                <div className="l2-graph-section">
                    <div className="section-header">
                        <Network size={18} color="#bc13fe" />
                        <h5>Correlation Graph</h5>
                    </div>
                    <div className="graph-summary">
                        <span>{data.graph.nodes.length} nodes</span>
                        <span>{data.graph.edges.length} connections</span>
                    </div>
                    <div className="graph-details">
                        <div className="graph-nodes">
                            <strong>Entities:</strong>
                            <div className="node-list">
                                {data.graph.nodes.map((node, index) => (
                                    <span key={index} className={`node-badge ${node.type}`}>
                                        {node.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default L2InvestigationPanel;
