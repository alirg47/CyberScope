'use client';

import { Incident } from '@/data/mockIncidents';
import { useState } from 'react';
import ActionModal from './ActionModal';
import ThreatGraph from './ThreatGraph';
import KillChainView from './KillChainView';

interface IncidentDetailsPanelProps {
    incident: Incident;
    onClose: () => void;
    onAction?: (incidentId: string, action: 'Close' | 'Confirm Threat' | 'Escalate to L3', comment?: string) => void;
}

const IncidentDetailsPanel = ({ incident, onClose, onAction }: IncidentDetailsPanelProps) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'alerts' | 'context'>('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'Close' | 'Confirm Threat' | 'Escalate to L3'>('Close');

    const handleAction = (action: 'Close' | 'Confirm Threat' | 'Escalate to L3') => {
        if (action === 'Escalate to L3') {
            if (onAction) {
                onAction(incident.incident_id, action);
            }
            return;
        }
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (comment: string) => {
        if (onAction) {
            onAction(incident.incident_id, modalAction, comment);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="incident-details-panel">
                <div className="panel-header">
                    <div>
                        <h2>{incident.title}</h2>
                        <p className="incident-id">{incident.incident_id}</p>
                    </div>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <div className="panel-tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        Timeline
                    </button>
                    <button
                        className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('alerts')}
                    >
                        Alerts ({incident.related_alerts.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'context' ? 'active' : ''}`}
                        onClick={() => setActiveTab('context')}
                    >
                        Context
                    </button>
                </div>

                <div className="panel-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="incident-summary-section">
                                <h3>Summary</h3>
                                <p>{incident.summary}</p>
                            </div>

                            {incident.l2_notes && (
                                <div className="notes-section">
                                    <h3>L2 Notes</h3>
                                    <p>{incident.l2_notes}</p>
                                </div>
                            )}

                            <div className="graph-section">
                                <h3>Attack Graph</h3>
                                <ThreatGraph graph={incident.graph} />
                            </div>

                            <div className="killchain-section">
                                <h3>Cyber Kill Chain</h3>
                                <KillChainView killChain={incident.kill_chain} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="timeline-tab">
                            <div className="timeline">
                                {incident.timeline.map((event, index) => (
                                    <div key={index} className="timeline-event">
                                        <div className="timeline-time">{event.time}</div>
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <div className="timeline-stage">{event.stage}</div>
                                            <div className="timeline-event-text">{event.event}</div>
                                            <div className="timeline-host">{event.host}</div>
                                            {event.mitre_technique && (
                                                <div className="timeline-mitre">{event.mitre_technique}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'alerts' && (
                        <div className="alerts-tab">
                            <div className="alerts-list">
                                {incident.related_alerts.map((alert, index) => (
                                    <div key={index} className="related-alert-card">
                                        <div className="alert-header-mini">
                                            <span className="alert-id">{alert.alert_id}</span>
                                            <span className="alert-type">{alert.alert_type}</span>
                                        </div>
                                        <div className="alert-details">
                                            <div className="detail-item">
                                                <span className="label">Time:</span>
                                                <span className="value">{formatTimestamp(alert.timestamp)}</span>
                                            </div>
                                            {alert.user && (
                                                <div className="detail-item">
                                                    <span className="label">User:</span>
                                                    <span className="value">{alert.user}</span>
                                                </div>
                                            )}
                                            {alert.host && (
                                                <div className="detail-item">
                                                    <span className="label">Host:</span>
                                                    <span className="value">{alert.host}</span>
                                                </div>
                                            )}
                                            {alert.src_ip && (
                                                <div className="detail-item">
                                                    <span className="label">Source IP:</span>
                                                    <span className="value">{alert.src_ip}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'context' && (
                        <div className="context-tab">
                            <h3>RAG Context (Similar Incidents)</h3>
                            <div className="rag-context-list">
                                {incident.rag_context.map((context, index) => (
                                    <div key={index} className="rag-context-item">
                                        <span className="context-icon">💡</span>
                                        <p>{context}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {incident.status !== 'Closed' && incident.status !== 'Escalated to L3' && (
                    <div className="panel-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleAction('Close')}
                        >
                            Close Incident
                        </button>
                        <button
                            className="btn btn-warning"
                            onClick={() => handleAction('Confirm Threat')}
                        >
                            Confirm Threat
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleAction('Escalate to L3')}
                        >
                            Escalate to L3
                        </button>
                    </div>
                )}
            </div>

            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                title={
                    modalAction === 'Close' ? 'Close Incident' :
                        modalAction === 'Confirm Threat' ? 'Confirm Threat' :
                            'Escalate to L3'
                }
                actionLabel={
                    modalAction === 'Close' ? 'Close' :
                        modalAction === 'Confirm Threat' ? 'Confirm' :
                            'Escalate'
                }
            />
        </>
    );
};

export default IncidentDetailsPanel;
