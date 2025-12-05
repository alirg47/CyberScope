'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useData } from '@/context/DataContext';
import AccessDenied from '@/components/AccessDenied';
import AlertCard from '@/components/AlertCard';
import EscalationModal from '@/components/EscalationModal';
import AlertsOverTimeChart from '@/components/charts/AlertsOverTimeChart';
import AlertsBySeverityChart from '@/components/charts/AlertsBySeverityChart';
import AlertSourcesChart from '@/components/charts/AlertSourcesChart';
import TopTriggeringIPsChart from '@/components/charts/TopTriggeringIPsChart';
import {
    calculateAlertsOverTime,
    calculateAlertsBySeverity,
    calculateAlertSources,
    calculateTopIPs
} from '@/utils/chartHelpers';

export default function L1Page() {
    const { canAccess } = useAuth();
    const { currentUser } = useUser();
    const { alerts, escalateAlert } = useData();
    const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Escalated' | 'Ignored'>('All');

    // Escalation State
    const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

    if (!canAccess('/l1')) {
        return <AccessDenied />;
    }

    // Calculate Chart Data
    const alertsOverTime = calculateAlertsOverTime(alerts, 'hourly');
    const alertsBySeverity = calculateAlertsBySeverity(alerts);
    const alertSources = calculateAlertSources(alerts);
    const topIPs = calculateTopIPs(alerts);

    const handleEscalateClick = (alertId: string) => {
        setSelectedAlertId(alertId);
        setIsEscalationModalOpen(true);
    };

    const handleConfirmEscalation = (note: string, files: File[]) => {
        if (selectedAlertId) {
            escalateAlert(selectedAlertId, note, files);
            setIsEscalationModalOpen(false);
            setSelectedAlertId(null);
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        const severityMatch = filter === 'All' || alert.severity === filter;
        const statusMatch = statusFilter === 'All' || alert.status === statusFilter;
        return severityMatch && statusMatch;
    });

    const openCount = alerts.filter(a => a.status === 'Open').length;
    const escalatedCount = alerts.filter(a => a.status === 'Escalated').length;
    const ignoredCount = alerts.filter(a => a.status === 'Ignored').length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {currentUser.fullName}</h1>
                    <p className="dashboard-subtitle">
                        Alerts Triage (L1) • Total: {alerts.length} | Open: {openCount} | Escalated: {escalatedCount} | Ignored: {ignoredCount}
                    </p>
                </div>
            </div>

            {/* Visualization Section */}
            <div className="charts-grid">
                <div className="chart-full-width">
                    <AlertsOverTimeChart data={alertsOverTime} view="hourly" />
                </div>
                <AlertsBySeverityChart data={alertsBySeverity} />
                <AlertSourcesChart data={alertSources} />
                <div className="chart-full-width">
                    <TopTriggeringIPsChart data={topIPs} />
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Filter by Severity:</label>
                    <div className="filter-buttons">
                        {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                            <button
                                key={sev}
                                className={`filter-btn ${filter === sev ? 'active' : ''}`}
                                onClick={() => setFilter(sev as any)}
                            >
                                {sev}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-group">
                    <label>Filter by Status:</label>
                    <div className="filter-buttons">
                        {['All', 'Open', 'Escalated', 'Ignored'].map(status => (
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
            </div>

            <div className="alerts-grid">
                {filteredAlerts.length === 0 ? (
                    <div className="empty-state">
                        <p>No alerts found matching your filters.</p>
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <AlertCard
                            key={alert.alert_id}
                            alert={alert}
                            onEscalate={handleEscalateClick}
                        />
                    ))
                )}
            </div>

            <EscalationModal
                isOpen={isEscalationModalOpen}
                onClose={() => setIsEscalationModalOpen(false)}
                onEscalate={handleConfirmEscalation}
                title={selectedAlertId ? `Escalating Alert ${selectedAlertId}` : 'Escalate Alert'}
                targetLevel="L2 (Incident Investigation)"
            />
        </div>
    );
}
