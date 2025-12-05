'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useData } from '@/context/DataContext';
import AccessDenied from '@/components/AccessDenied';
import IncidentCard from '@/components/IncidentCard';
import IncidentDetailsPanel from '@/components/IncidentDetailsPanel';
import EscalationModal from '@/components/EscalationModal';
import IncidentTimelineChart from '@/components/charts/IncidentTimelineChart';
import CorrelationGraphChart from '@/components/charts/CorrelationGraphChart';
import IncidentStatusChart from '@/components/charts/IncidentStatusChart';
import UserActivityAnomalyChart from '@/components/charts/UserActivityAnomalyChart';
import { Incident } from '@/data/mockIncidents';
import { calculateIncidentStatus } from '@/utils/chartHelpers';

export default function L2Page() {
    const { canAccess } = useAuth();
    const { currentUser } = useUser();
    const { incidents, escalateIncident } = useData();
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In-Progress' | 'Escalated to L3' | 'Closed'>('All');

    // Escalation State
    const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
    const [incidentToEscalateId, setIncidentToEscalateId] = useState<string | null>(null);

    if (!canAccess('/l2')) {
        return <AccessDenied />;
    }

    // Calculate Chart Data
    const incidentStatusData = calculateIncidentStatus(incidents);

    const handleEscalateClick = (incidentId: string) => {
        setIncidentToEscalateId(incidentId);
        setIsEscalationModalOpen(true);
    };

    const handleConfirmEscalation = (note: string, files: File[]) => {
        if (incidentToEscalateId) {
            escalateIncident(incidentToEscalateId, note, files);
            setIsEscalationModalOpen(false);
            setIncidentToEscalateId(null);
            setSelectedIncident(null);
        }
    };

    const filteredIncidents = statusFilter === 'All'
        ? incidents
        : incidents.filter(inc => inc.status === statusFilter);

    const openCount = incidents.filter(i => i.status === 'Open').length;
    const inProgressCount = incidents.filter(i => i.status === 'In-Progress').length;
    const escalatedCount = incidents.filter(i => i.status === 'Escalated to L3').length;
    const closedCount = incidents.filter(i => i.status === 'Closed').length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {currentUser.fullName}</h1>
                    <p className="dashboard-subtitle">
                        Incident Investigation (L2) • Total: {incidents.length} | Open: {openCount} | In Progress: {inProgressCount} | Escalated: {escalatedCount} | Closed: {closedCount}
                    </p>
                </div>
            </div>

            {/* Visualization Section */}
            <div className="charts-grid">
                <div className="chart-full-width">
                    <IncidentTimelineChart />
                </div>
                <div className="chart-full-width">
                    <CorrelationGraphChart />
                </div>
                <IncidentStatusChart data={incidentStatusData} />
                <UserActivityAnomalyChart />
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Filter by Status:</label>
                    <div className="filter-buttons">
                        {['All', 'Open', 'In-Progress', 'Escalated to L3', 'Closed'].map(status => (
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

            <div className={`incidents-layout ${!selectedIncident ? 'full-width' : ''}`}>
                <div className="incidents-queue">
                    <h2 className="section-title">Incident Queue</h2>
                    <div className="incidents-list">
                        {filteredIncidents.length === 0 ? (
                            <div className="empty-state">
                                <p>No incidents found matching your filters.</p>
                            </div>
                        ) : (
                            filteredIncidents.map(incident => (
                                <div key={incident.incident_id} onClick={() => setSelectedIncident(incident)}>
                                    <IncidentCard incident={incident} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {selectedIncident && (
                    <div className="incident-details-container">
                        <IncidentDetailsPanel
                            incident={selectedIncident}
                            onClose={() => setSelectedIncident(null)}
                            onAction={(id, action, comment) => {
                                if (action === 'Escalate to L3') {
                                    handleEscalateClick(id);
                                } else {
                                    console.log('Action:', action, id, comment);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            <EscalationModal
                isOpen={isEscalationModalOpen}
                onClose={() => setIsEscalationModalOpen(false)}
                onEscalate={handleConfirmEscalation}
                title={incidentToEscalateId ? `Escalating Incident ${incidentToEscalateId}` : 'Escalate Incident'}
                targetLevel="L3 (Threat Hunting)"
            />
        </div>
    );
}
