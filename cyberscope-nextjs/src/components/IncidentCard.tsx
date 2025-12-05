'use client';

import { Incident } from '@/data/mockIncidents';
import { FileText } from 'lucide-react';

interface IncidentCardProps {
    incident: Incident;
    onClick?: () => void;
}

const IncidentCard = ({ incident, onClick }: IncidentCardProps) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return '#dc2626';
            case 'High': return '#ea580c';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return '#3b82f6';
            case 'In-Progress': return '#f59e0b';
            case 'Escalated to L3': return '#8b5cf6';
            case 'Closed': return '#10b981';
            default: return '#6b7280';
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

    const getTimeAgo = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'moments ago';
    };

    return (
        <div className="incident-card" onClick={onClick}>
            <div className="incident-header">
                <div className="incident-title-section">
                    <h3 className="incident-title">{incident.title}</h3>
                    <p className="incident-id">{incident.incident_id}</p>
                </div>
                <div className="incident-badges">
                    <span
                        className="severity-badge"
                        style={{
                            backgroundColor: `${getSeverityColor(incident.severity)}20`,
                            color: getSeverityColor(incident.severity),
                            border: `1px solid ${getSeverityColor(incident.severity)}`
                        }}
                    >
                        {incident.severity}
                    </span>
                    <span
                        className="status-badge"
                        style={{
                            backgroundColor: `${getStatusColor(incident.status)}20`,
                            color: getStatusColor(incident.status),
                            border: `1px solid ${getStatusColor(incident.status)}`
                        }}
                    >
                        {incident.status}
                    </span>
                </div>
            </div>

            <div className="incident-meta">
                <div className="meta-item">
                    <span className="meta-label">Created by:</span>
                    <span className="meta-value">{incident.created_by}</span>
                </div>
                {incident.l2_analyst && (
                    <div className="meta-item">
                        <span className="meta-label">L2 Analyst:</span>
                        <span className="meta-value">{incident.l2_analyst}</span>
                    </div>
                )}
                <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{getTimeAgo(incident.created_at)}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Related Alerts:</span>
                    <span className="meta-value">{incident.related_alerts.length}</span>
                </div>
            </div>

            <p className="incident-summary">{incident.summary}</p>

            {incident.l2_notes && (
                <div className="incident-notes">
                    <span className="notes-icon"><FileText size={16} color="#3b82f6" /></span>
                    <span className="notes-text">{incident.l2_notes}</span>
                </div>
            )}
        </div>
    );
};

export default IncidentCard;
