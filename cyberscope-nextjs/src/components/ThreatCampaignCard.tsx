'use client';

import { Campaign } from '@/data/mockCampaigns';
import { useState } from 'react';
import { ChevronDown, ChevronRight, User, Link, Target, Search } from 'lucide-react';
import L2InvestigationPanel from './L2InvestigationPanel';
import AISummaryDisplay from './AISummaryDisplay';
import MitreAttackCard from './ThreatIntel/MitreAttackCard';
import VirusTotalCard from './ThreatIntel/VirusTotalCard';
import KillChainView from './KillChainView';
import ThreatHuntingAnalysisPanel from './ThreatHuntingAnalysisPanel';

interface ThreatCampaignCardProps {
    campaign: Campaign;
}

const ThreatCampaignCard = ({ campaign }: ThreatCampaignCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getRiskLevelColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'Critical': return '#dc2626';
            case 'High': return '#ea580c';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return '#dc2626';
            case 'Monitoring': return '#f59e0b';
            case 'Resolved': return '#10b981';
            case 'False Positive': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const totalIOCs = campaign.misp_ioc_matches ? (
        (campaign.misp_ioc_matches.ips?.length || 0) +
        (campaign.misp_ioc_matches.domains?.length || 0) +
        (campaign.misp_ioc_matches.hashes?.length || 0) +
        (campaign.misp_ioc_matches.emails?.length || 0)
    ) : 0;

    return (
        <div className="threat-campaign-card">
            <div className="campaign-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="campaign-title-section">
                    <h3 className="campaign-title">{campaign.name}</h3>
                    <p className="campaign-id">{campaign.campaign_id}</p>
                </div>
                <div className="campaign-badges">
                    {campaign.threat_analysis && (
                        <>
                            <span className="analysis-badge confidence-badge">
                                AI: {campaign.threat_analysis.ai_confidence}%
                            </span>
                            <span className="analysis-badge probability-badge">
                                Prob: {campaign.threat_analysis.attack_probability_score}%
                            </span>
                        </>
                    )}
                    <span
                        className="risk-badge"
                        style={{
                            backgroundColor: `${getRiskLevelColor(campaign.risk_level)}20`,
                            color: getRiskLevelColor(campaign.risk_level),
                            border: `1px solid ${getRiskLevelColor(campaign.risk_level)}`
                        }}
                    >
                        {campaign.risk_level}
                    </span>
                    <span
                        className="status-badge"
                        style={{
                            backgroundColor: `${getStatusColor(campaign.status)}20`,
                            color: getStatusColor(campaign.status),
                            border: `1px solid ${getStatusColor(campaign.status)}`
                        }}
                    >
                        {campaign.status === 'Active' ? 'Active' :
                            campaign.status === 'Monitoring' ? 'Monitoring' :
                                campaign.status === 'Resolved' ? 'Resolved' :
                                    campaign.status === 'False Positive' ? 'False Positive' : campaign.status}
                    </span>
                    <button className="expand-btn">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
            </div>

            <p className="campaign-description">{campaign.description}</p>

            <div className="campaign-meta">
                <div className="meta-item">
                    <span className="meta-icon"><User size={16} color="#a855f7" /></span>
                    <span className="meta-label">Created by:</span>
                    <span className="meta-value">{campaign.created_by}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><Link size={16} color="#3b82f6" /></span>
                    <span className="meta-label">Related Incidents:</span>
                    <span className="meta-value">{campaign.related_incidents?.length || 0}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><Target size={16} color="#ef4444" /></span>
                    <span className="meta-label">IOC Matches:</span>
                    <span className="meta-value">{totalIOCs}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><Search size={16} color="#10b981" /></span>
                    <span className="meta-label">Pattern Type:</span>
                    <span className="meta-value">{campaign.pattern_type}</span>
                </div>
            </div>

            {campaign.threat_actor && (
                <div className="threat-actor-section">
                    <span className="threat-actor-label">Threat Actor:</span>
                    <span className="threat-actor-name">{campaign.threat_actor}</span>
                </div>
            )}

            {isExpanded && (
                <div className="campaign-details">
                    {/* L3 Threat Hunting Analysis */}
                    {campaign.threat_analysis && (
                        <ThreatHuntingAnalysisPanel
                            analysis={campaign.threat_analysis}
                            campaignName={campaign.name}
                        />
                    )}

                    {campaign.misp_ioc_matches && (
                        <div className="ioc-section">
                            <h4>Indicators of Compromise (IOCs)</h4>

                            {campaign.misp_ioc_matches.ips && campaign.misp_ioc_matches.ips.length > 0 && (
                                <div className="ioc-group">
                                    <strong>IP Addresses:</strong>
                                    <ul>
                                        {campaign.misp_ioc_matches.ips.map((ip, i) => (
                                            <li key={i} className="ioc-item">{ip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {campaign.misp_ioc_matches.domains && campaign.misp_ioc_matches.domains.length > 0 && (
                                <div className="ioc-group">
                                    <strong>Domains:</strong>
                                    <ul>
                                        {campaign.misp_ioc_matches.domains.map((domain, i) => (
                                            <li key={i} className="ioc-item">{domain}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {campaign.misp_ioc_matches.hashes && campaign.misp_ioc_matches.hashes.length > 0 && (
                                <div className="ioc-group">
                                    <strong>Hashes:</strong>
                                    <ul>
                                        {campaign.misp_ioc_matches.hashes.map((hash, i) => (
                                            <li key={i} className="ioc-item hash">{hash}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {campaign.misp_ioc_matches.emails && campaign.misp_ioc_matches.emails.length > 0 && (
                                <div className="ioc-group">
                                    <strong>Emails:</strong>
                                    <ul>
                                        {campaign.misp_ioc_matches.emails.map((email, i) => (
                                            <li key={i} className="ioc-item">{email}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="tactics-section">
                        <h4>MITRE ATT&CK Tactics</h4>
                        <div className="tactics-list">
                            {campaign.mitre_tactics?.map((tactic, i) => (
                                <span key={i} className="tactic-badge">{tactic}</span>
                            ))}
                        </div>
                    </div>

                    <div className="notes-section">
                        <h4>L2 Notes</h4>
                        <p className="campaign-notes">{campaign.l3_notes}</p>
                    </div>

                    {/* Threat Intelligence from L2 Investigation */}
                    {campaign.l2_investigation && (
                        <div className="threat-intel-section">
                            <h4>Threat Intelligence</h4>

                            {/* AI Threat Analysis */}
                            {campaign.l2_investigation.related_alerts.some(alert => alert.ai_summary) && (
                                <div className="intel-subsection">
                                    <AISummaryDisplay
                                        summary={campaign.l2_investigation.related_alerts.find(a => a.ai_summary)?.ai_summary || ''}
                                    />
                                </div>
                            )}

                            {/* MITRE ATT&CK Technique */}
                            {campaign.l2_investigation.related_alerts.some(alert => alert.mitre_attack) && (
                                <div className="intel-subsection">
                                    <MitreAttackCard
                                        mitre={campaign.l2_investigation.related_alerts.find(a => a.mitre_attack)?.mitre_attack!}
                                    />
                                </div>
                            )}

                            {/* VirusTotal Intelligence */}
                            {campaign.l2_investigation.related_alerts.some(alert => alert.virustotal_data) && (
                                <div className="intel-subsection">
                                    <VirusTotalCard
                                        vt={campaign.l2_investigation.related_alerts.find(a => a.virustotal_data)?.virustotal_data!}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* L2 Investigation History */}
                    {campaign.l2_investigation && (
                        <div className="l2-history-section">
                            <h4>L2 Investigation History</h4>
                            <p className="l2-history-note">
                                This campaign was escalated from incident <strong>{campaign.escalated_from_incident_id}</strong>
                            </p>
                            <L2InvestigationPanel data={campaign.l2_investigation} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThreatCampaignCard;
