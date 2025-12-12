'use client';

import { Alert } from '@/data/mockAlerts';
import MitreAttackCard from './ThreatIntel/MitreAttackCard';
import VirusTotalCard from './ThreatIntel/VirusTotalCard';
import AISummaryDisplay from './AISummaryDisplay';
import { MessageSquare } from 'lucide-react';

interface AlertCardProps {
    alert: Alert;
    onEscalate?: (alertId: string) => void;
}

const AlertCard = ({ alert, onEscalate }: AlertCardProps) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return '#dc2626';
            case 'High': return '#ea580c';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            case 'Info': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'SIEM': return '#8b5cf6';
            case 'EDR': return '#3b82f6';
            case 'XDR': return '#10b981';
            case 'NDR': return '#f59e0b';
            case 'Email Gateway': return '#ec4899';
            case 'Firewall': return '#14b8a6';
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

    return (
        <div className="alert-card">
            <div className="alert-header">
                <div className="alert-header-left">
                    <div
                        className="risk-score-badge"
                        style={{
                            backgroundColor: `${getSeverityColor(alert.severity)}20`,
                            color: getSeverityColor(alert.severity),
                            border: `2px solid ${getSeverityColor(alert.severity)}`
                        }}
                    >
                        <div className="risk-score-value">{alert.ai_risk_score}</div>
                        <div className="risk-score-label">{alert.severity}</div>
                    </div>
                    <div className="alert-title-section">
                        <h3 className="alert-title">{alert.title}</h3>
                        <div className="alert-meta">
                            <span
                                className="source-badge"
                                style={{
                                    backgroundColor: `${getSourceColor(alert.source)}20`,
                                    color: getSourceColor(alert.source),
                                    border: `1px solid ${getSourceColor(alert.source)}`
                                }}
                            >
                                {alert.source}
                            </span>
                            <span className="alert-type">{alert.alert_type}</span>
                            <span className="alert-timestamp" suppressHydrationWarning>
                                {formatTimestamp(alert.timestamp)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-context-grid">
                <div className="context-item">
                    <span className="context-label">User:</span>
                    <span className="context-value">{alert.user}</span>
                </div>
                <div className="context-item">
                    <span className="context-label">Host:</span>
                    <span className="context-value">{alert.host}</span>
                </div>
                <div className="context-item">
                    <span className="context-label">Source IP:</span>
                    <span className="context-value">{alert.src_ip}</span>
                </div>
                <div className="context-item">
                    <span className="context-label">Location:</span>
                    <span className="context-value">{alert.location}</span>
                </div>
                <div className="context-item">
                    <span className="context-label">Department:</span>
                    <span className="context-value">{alert.context.department}</span>
                </div>
                <div className="context-item">
                    <span className="context-label">Criticality:</span>
                    <span className="context-value">{alert.context.assetCriticality}</span>
                </div>
            </div>

            {/* AI Threat Analysis Display */}
            <AISummaryDisplay summary={alert.ai_summary} />

            {/* MITRE ATT&CK Intelligence */}
            {alert.mitre_attack && (
                <MitreAttackCard mitre={alert.mitre_attack} />
            )}

            {/* VirusTotal Intelligence */}
            {alert.virustotal_data && (
                <VirusTotalCard vt={alert.virustotal_data} />
            )}

            {alert.l1_comments && (
                <div className="comments-section">
                    <div className="section-header">
                        <span className="section-icon"><MessageSquare size={20} color="#9ca3af" /></span>
                        <span className="section-title">L1 Comments</span>
                    </div>
                    <p className="comment-text">{alert.l1_comments}</p>
                    {alert.l1_analyst && (
                        <p className="comment-author">By: {alert.l1_analyst}</p>
                    )}
                </div>
            )}

            {alert.status === 'Open' && (
                <div className="alert-actions">
                    <button
                        className="btn btn-ignore"
                        onClick={() => {/* Ignore functionality */ }}
                    >
                        Ignore
                    </button>
                    <button
                        className="btn btn-escalate"
                        onClick={() => onEscalate && onEscalate(alert.alert_id)}
                    >
                        Escalate to L2
                    </button>
                </div>
            )}

            {alert.status !== 'Open' && (
                <div className="alert-status-badge">
                    Status: {alert.status === 'Escalated' ? 'Escalated' :
                        alert.status === 'Ignored' ? 'Ignored' :
                            alert.status === 'Closed' ? 'Closed' : alert.status}
                </div>
            )}
        </div>
    );
};

export default AlertCard;
