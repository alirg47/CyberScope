'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useData } from '@/context/DataContext';
import AccessDenied from '@/components/AccessDenied';
import ThreatCampaignCard from '@/components/ThreatCampaignCard';
import CyberKillChain from '@/components/CyberKillChain';
import ThreatCampaignTrendChart from '@/components/charts/ThreatCampaignTrendChart';
import IOCMatchesChart from '@/components/charts/IOCMatchesChart';
import MITREAttackHeatmap from '@/components/charts/MITREAttackHeatmap';
import SuspiciousPatternMap from '@/components/charts/SuspiciousPatternMap';

// Helper function to calculate kill chain stage from campaign MITRE tactics
function getKillChainStageFromCampaigns(campaigns: any[]): number {
    const activeCampaigns = campaigns.filter(c => c.status === 'Active' || c.status === 'Monitoring');

    if (activeCampaigns.length === 0) return 0;

    const killChainStages = {
        reconnaissance: false,
        weaponization: false,
        delivery: false,
        exploitation: false,
        installation: false,
        commandControl: false,
        actionsObjectives: false
    };

    // Map MITRE tactics to kill chain stages
    activeCampaigns.forEach(campaign => {
        campaign.mitre_tactics?.forEach((tactic: string) => {
            const tacticLower = tactic.toLowerCase();

            if (tacticLower.includes('ta0043') || tacticLower.includes('reconnaissance') || tacticLower.includes('ta0007') || tacticLower.includes('discovery')) {
                killChainStages.reconnaissance = true;
            }
            if (tacticLower.includes('ta0042') || tacticLower.includes('resource') || tacticLower.includes('weaponization')) {
                killChainStages.weaponization = true;
            }
            if (tacticLower.includes('ta0001') || tacticLower.includes('initial') || tacticLower.includes('delivery')) {
                killChainStages.delivery = true;
            }
            if (tacticLower.includes('ta0002') || tacticLower.includes('execution') || tacticLower.includes('ta0004') || tacticLower.includes('privilege')) {
                killChainStages.exploitation = true;
            }
            if (tacticLower.includes('ta0003') || tacticLower.includes('persistence') || tacticLower.includes('installation')) {
                killChainStages.installation = true;
            }
            if (tacticLower.includes('ta0011') || tacticLower.includes('command') || tacticLower.includes('c2') || tacticLower.includes('control')) {
                killChainStages.commandControl = true;
            }
            if (tacticLower.includes('ta0040') || tacticLower.includes('impact') || tacticLower.includes('ta0010') || tacticLower.includes('exfiltration') || tacticLower.includes('ta0009') || tacticLower.includes('collection') || tacticLower.includes('ta0006') || tacticLower.includes('credential')) {
                killChainStages.actionsObjectives = true;
            }
        });
    });

    // Return the highest active stage (0-6)
    if (killChainStages.actionsObjectives) return 6;
    if (killChainStages.commandControl) return 5;
    if (killChainStages.installation) return 4;
    if (killChainStages.exploitation) return 3;
    if (killChainStages.delivery) return 2;
    if (killChainStages.weaponization) return 1;
    if (killChainStages.reconnaissance) return 0;

    return 0;
}

export default function L3Page() {
    const { canAccess } = useAuth();
    const { currentUser } = useUser();
    const { campaigns } = useData();
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Monitoring' | 'Resolved' | 'False Positive'>('All');
    const [riskFilter, setRiskFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

    if (!canAccess('/l3')) {
        return <AccessDenied />;
    }

    const filteredCampaigns = campaigns.filter(campaign => {
        const statusMatch = statusFilter === 'All' || campaign.status === statusFilter;
        const riskMatch = riskFilter === 'All' || campaign.risk_level === riskFilter;
        return statusMatch && riskMatch;
    });

    const activeCount = campaigns.filter(c => c.status === 'Active').length;
    const monitoringCount = campaigns.filter(c => c.status === 'Monitoring').length;
    const resolvedCount = campaigns.filter(c => c.status === 'Resolved').length;

    // Calculate dynamic kill chain stage from FILTERED campaigns (those currently displayed)
    const killChainStage = getKillChainStageFromCampaigns(filteredCampaigns);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {currentUser.fullName}</h1>
                    <p className="dashboard-subtitle">
                        Threat Hunting (L3) • Total: {campaigns.length} | Active: {activeCount} | Monitoring: {monitoringCount} | Resolved: {resolvedCount}
                    </p>
                </div>
            </div>

            {/* Cyber Kill Chain Component */}
            <CyberKillChain activeStage={killChainStage} campaigns={filteredCampaigns} showAlertCounts={true} />

            {/* Visualization Section */}
            <div className="charts-grid">
                <div className="chart-full-width">
                    <ThreatCampaignTrendChart />
                </div>
                <IOCMatchesChart />
                <div className="chart-full-width">
                    <MITREAttackHeatmap />
                </div>
                <div className="chart-full-width">
                    <SuspiciousPatternMap />
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Filter by Status:</label>
                    <div className="filter-buttons">
                        {['All', 'Active', 'Monitoring', 'Resolved', 'False Positive'].map(status => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status as any)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-group">
                    <label>Filter by Risk:</label>
                    <div className="filter-buttons">
                        {['All', 'Critical', 'High', 'Medium', 'Low'].map(risk => (
                            <button
                                key={risk}
                                className={`filter-btn ${riskFilter === risk ? 'active' : ''}`}
                                onClick={() => setRiskFilter(risk as any)}
                            >
                                {risk}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="campaigns-grid">
                {filteredCampaigns.length === 0 ? (
                    <div className="empty-state">
                        <p>No threat campaigns found matching your filters.</p>
                    </div>
                ) : (
                    filteredCampaigns.map(campaign => (
                        <ThreatCampaignCard key={campaign.campaign_id} campaign={campaign} />
                    ))
                )}
            </div>
        </div>
    );
}
