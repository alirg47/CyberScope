'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { RiskLevel } from '@/data/mockAlerts';


interface CyberKillChainProps {
    activeStage?: number; // 0-6, defaults to 6 (Actions on Objectives)
    showAlertCounts?: boolean; // Whether to show alert count badges (default: true)
    campaigns?: any[]; // Optional campaigns to show campaign counts instead of alert counts
}

interface KillChainPhase {
    id: number;
    name: string;
    short: string;
    alertCount: number;
    severity: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

const stages = [
    { id: 0, name: 'Reconnaissance', short: 'RECON' },
    { id: 1, name: 'Weaponization', short: 'WEAPON' },
    { id: 2, name: 'Delivery', short: 'DELIVERY' },
    { id: 3, name: 'Exploitation', short: 'EXPLOIT' },
    { id: 4, name: 'Installation', short: 'INSTALL' },
    { id: 5, name: 'Command & Control', short: 'C2' },
    { id: 6, name: 'Actions on Objectives', short: 'ACTIONS' },
];

// Map alert types to kill chain phases
const ALERT_TYPE_TO_PHASE: Record<string, number> = {
    'Port Scan': 0,
    'Suspicious Login': 0,
    'Brute Force Attack': 0,
    'Malware Detection': 1,
    'Phishing Attempt': 2,
    'SQL Injection': 3,
    'Privilege Escalation': 3,
    'Lateral Movement': 4,
    'Command & Control': 5,
    'Data Exfiltration': 6,
};

export default function CyberKillChain({ activeStage, showAlertCounts = true, campaigns }: CyberKillChainProps) {
    const { alerts } = useData();
    const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

    // Helper to map MITRE tactic to kill chain stage (0-6)
    const getTacticStage = (tactic: string): number => {
        const t = tactic.toLowerCase();
        if (t.includes('ta0040') || t.includes('impact') || t.includes('ta0010') || t.includes('exfiltration') || t.includes('ta0009') || t.includes('collection') || t.includes('ta0006') || t.includes('credential')) return 6;
        if (t.includes('ta0011') || t.includes('command') || t.includes('control')) return 5;
        if (t.includes('ta0003') || t.includes('persistence')) return 4;
        if (t.includes('ta0002') || t.includes('execution') || t.includes('ta0004') || t.includes('privilege')) return 3;
        if (t.includes('ta0001') || t.includes('initial')) return 2;
        if (t.includes('ta0042') || t.includes('resource')) return 1;
        if (t.includes('ta0043') || t.includes('reconnaissance') || t.includes('ta0007') || t.includes('discovery')) return 0;
        return 0;
    };

    // Calculate counts per phase (alerts or campaigns)
    const phaseData: KillChainPhase[] = stages.map(stage => {
        if (campaigns) {
            // Count campaigns that have tactics matching this stage
            const activeCampaigns = campaigns.filter(c => c.status === 'Active' || c.status === 'Monitoring');
            const phaseCampaigns = activeCampaigns.filter(campaign =>
                campaign.mitre_tactics?.some((tactic: string) => getTacticStage(tactic) === stage.id)
            );

            // Calculate campaign risk level breakdown
            const severity = {
                critical: phaseCampaigns.filter(c => c.risk_level === 'Critical').length,
                high: phaseCampaigns.filter(c => c.risk_level === 'High').length,
                medium: phaseCampaigns.filter(c => c.risk_level === 'Medium').length,
                low: phaseCampaigns.filter(c => c.risk_level === 'Low').length,
            };

            return {
                ...stage,
                alertCount: phaseCampaigns.length,
                severity,
                campaigns: phaseCampaigns // Store campaigns for tooltip
            };
        } else {
            // Original alert-based counting
            const phaseAlerts = alerts.filter(alert =>
                ALERT_TYPE_TO_PHASE[alert.alert_type] === stage.id
            );

            const severity = {
                critical: phaseAlerts.filter(a => a.severity === 'Critical').length,
                high: phaseAlerts.filter(a => a.severity === 'High').length,
                medium: phaseAlerts.filter(a => a.severity === 'Medium').length,
                low: phaseAlerts.filter(a => a.severity === 'Low').length,
            };

            return {
                ...stage,
                alertCount: phaseAlerts.length,
                severity,
            };
        }
    });

    // Determine active stage based on highest phase with alerts
    const calculatedActiveStage = activeStage !== undefined
        ? activeStage
        : phaseData.reduce((max, phase) =>
            phase.alertCount > 0 ? Math.max(max, phase.id) : max, 0
        );

    return (
        <div className="cyber-kill-chain">
            <h3 className="kill-chain-title">Cyber Kill Chain Progression</h3>

            <div className="kill-chain-container">
                {/* Horizontal connecting line */}
                <div className="kill-chain-line" />

                {/* Stages */}
                <div className="kill-chain-stages">
                    {phaseData.map((phase, index) => {
                        const isActive = index <= calculatedActiveStage;
                        const isCurrent = index === calculatedActiveStage;
                        const hasAlerts = phase.alertCount > 0;

                        return (
                            <div
                                key={phase.id}
                                className="kill-chain-stage"
                                onMouseEnter={() => setHoveredPhase(phase.id)}
                                onMouseLeave={() => setHoveredPhase(null)}
                            >
                                <div
                                    className={`
                                        kill-chain-node 
                                        ${isActive ? 'active' : 'inactive'}
                                        ${isCurrent ? 'current' : ''}
                                        ${hasAlerts ? 'has-alerts' : ''}
                                    `}
                                >
                                    <div className="node-inner" />
                                    {showAlertCounts && hasAlerts && (
                                        <div className="alert-count-badge">{phase.alertCount}</div>
                                    )}
                                </div>
                                <div className="kill-chain-label">{phase.short}</div>

                                {/* Tooltip on hover */}
                                {hoveredPhase === phase.id && (
                                    <div className="kill-chain-tooltip">
                                        <div className="tooltip-title">{phase.name}</div>
                                        <div className="tooltip-content">
                                            <div className="tooltip-row">
                                                <span>{campaigns ? 'Campaigns:' : 'Alerts:'}</span>
                                                <span className="tooltip-value">{phase.alertCount}</span>
                                            </div>

                                            <div className="tooltip-divider" />

                                            {campaigns ? (
                                                /* Campaign Mode: Show Risk Levels and Status */
                                                <>
                                                    <div className="tooltip-section-label">Risk Level</div>
                                                    <div className="tooltip-severity">
                                                        {phase.severity.critical > 0 && (
                                                            <div className="severity-item">
                                                                <span className="severity-dot critical" />
                                                                <span>Critical: {phase.severity.critical}</span>
                                                            </div>
                                                        )}
                                                        {phase.severity.high > 0 && (
                                                            <div className="severity-item">
                                                                <span className="severity-dot high" />
                                                                <span>High: {phase.severity.high}</span>
                                                            </div>
                                                        )}
                                                        {phase.severity.medium > 0 && (
                                                            <div className="severity-item">
                                                                <span className="severity-dot medium" />
                                                                <span>Medium: {phase.severity.medium}</span>
                                                            </div>
                                                        )}
                                                        {phase.severity.low > 0 && (
                                                            <div className="severity-item">
                                                                <span className="severity-dot low" />
                                                                <span>Low: {phase.severity.low}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Campaign Status Breakdown */}
                                                    {(phase as any).campaigns && (
                                                        <>
                                                            <div className="tooltip-divider" />
                                                            <div className="tooltip-section-label">Status</div>
                                                            <div className="tooltip-status">
                                                                {(() => {
                                                                    const campList = (phase as any).campaigns;
                                                                    const activeCount = campList.filter((c: any) => c.status === 'Active').length;
                                                                    const monitoringCount = campList.filter((c: any) => c.status === 'Monitoring').length;
                                                                    return (
                                                                        <>
                                                                            {activeCount > 0 && (
                                                                                <div className="status-item">
                                                                                    <span className="status-indicator active" />
                                                                                    <span>Active: {activeCount}</span>
                                                                                </div>
                                                                            )}
                                                                            {monitoringCount > 0 && (
                                                                                <div className="status-item">
                                                                                    <span className="status-indicator monitoring" />
                                                                                    <span>Monitoring: {monitoringCount}</span>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                /* Alert Mode: Show Severity Only */
                                                <div className="tooltip-severity">
                                                    {phase.severity.critical > 0 && (
                                                        <div className="severity-item">
                                                            <span className="severity-dot critical" />
                                                            <span>Critical: {phase.severity.critical}</span>
                                                        </div>
                                                    )}
                                                    {phase.severity.high > 0 && (
                                                        <div className="severity-item">
                                                            <span className="severity-dot high" />
                                                            <span>High: {phase.severity.high}</span>
                                                        </div>
                                                    )}
                                                    {phase.severity.medium > 0 && (
                                                        <div className="severity-item">
                                                            <span className="severity-dot medium" />
                                                            <span>Medium: {phase.severity.medium}</span>
                                                        </div>
                                                    )}
                                                    {phase.severity.low > 0 && (
                                                        <div className="severity-item">
                                                            <span className="severity-dot low" />
                                                            <span>Low: {phase.severity.low}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
