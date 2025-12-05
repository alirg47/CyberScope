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
            <CyberKillChain activeStage={6} />

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
