'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAlerts, Alert } from '@/data/mockAlerts';
import { mockIncidents, Incident } from '@/data/mockIncidents';
import { mockCampaigns, Campaign } from '@/data/mockCampaigns';

// Define types for attachments and escalation
export interface Attachment {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedBy: string;
    timestamp: string;
}

interface DataContextType {
    alerts: Alert[];
    incidents: Incident[];
    campaigns: Campaign[];
    escalateAlert: (alertId: string, note: string, files: File[]) => void;
    escalateIncident: (incidentId: string, note: string, files: File[]) => void;
    addAttachment: (entityId: string, entityType: 'alert' | 'incident' | 'campaign', file: File) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
    const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
    const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

    // Helper to simulate file upload
    const processFiles = (files: File[]): Attachment[] => {
        return files.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            name: f.name,
            size: `${(f.size / 1024).toFixed(2)} KB`,
            type: f.type,
            uploadedBy: 'Current User', // In real app, get from AuthContext
            timestamp: new Date().toISOString()
        }));
    };

    const escalateAlert = (alertId: string, note: string, files: File[]) => {
        // Validation
        if (!alertId || typeof alertId !== 'string') {
            console.error('Invalid alertId provided to escalateAlert');
            return;
        }

        const alertToEscalate = alerts.find(a => a.alert_id === alertId);
        if (!alertToEscalate) {
            console.error(`Alert with ID ${alertId} not found`);
            return;
        }

        // 1. Remove from L1 (Alerts)
        setAlerts(prev => prev.filter(a => a.alert_id !== alertId));

        // 2. Add to L2 (Incidents)
        const newIncident: Incident = {
            incident_id: `INC-${Math.floor(Math.random() * 10000)}`,
            title: `Escalated: ${alertToEscalate.title}`,
            summary: note || alertToEscalate.ai_summary || "No summary provided",
            severity: alertToEscalate.severity,
            status: 'Open',
            created_by: 'L1 Analyst', // Added missing field
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Map other fields as necessary
            related_alerts: [{
                alert_id: alertToEscalate.alert_id,
                alert_type: alertToEscalate.alert_type,
                timestamp: alertToEscalate.timestamp,
                user: alertToEscalate.user,
                host: alertToEscalate.host,
                src_ip: alertToEscalate.src_ip
            }],
            l2_notes: note, // Map note to l2_notes
            // Initialize required fields to prevent runtime errors
            kill_chain: {
                reconnaissance: false,
                weaponization: false,
                delivery: false,
                exploitation: false,
                installation: false,
                commandControl: false,
                actionsObjectives: false
            },
            timeline: [
                {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    event: 'Incident created via escalation',
                    stage: 'Initial Access',
                    host: alertToEscalate.host || 'Unknown'
                }
            ],
            graph: { nodes: [], edges: [] },
            rag_context: []
        } as any;

        setIncidents(prev => [newIncident, ...prev]);
    };

    const escalateIncident = (incidentId: string, note: string, files: File[]) => {
        // Validation
        if (!incidentId || typeof incidentId !== 'string') {
            console.error('Invalid incidentId provided to escalateIncident');
            return;
        }

        const incidentToEscalate = incidents.find(i => i.incident_id === incidentId);
        if (!incidentToEscalate) {
            console.error(`Incident with ID ${incidentId} not found`);
            return;
        }

        // 1. Update L2 status (or remove if requirement is strict movement)
        // Requirement: "If L2 escalates -> must appear inside L3 Threat Hunting queue"
        // Usually incidents stay in L2 but get flagged. Let's follow the "Movement" requirement strictly:
        // "Real Movement Behavior Required... If L2 escalates -> must appear inside L3"

        setIncidents(prev => prev.filter(i => i.incident_id !== incidentId));

        // 2. Add to L3 (Campaigns/Threats)
        const newCampaign: Campaign = {
            campaign_id: `CMP-${Math.floor(Math.random() * 10000)}`,
            name: `Investigation: ${incidentToEscalate.title}`,
            description: note || incidentToEscalate.summary,
            status: 'Active',
            risk_level: incidentToEscalate.severity as any,
            threat_actors: ['Unknown'],
            affected_assets: [], // Would copy from incident
            indicators: [],
            timeline: [],
            // notes: [{ // Assuming mockCampaigns has a notes field or we add it
            //     id: Math.random().toString(36).substr(2, 9),
            //     author: 'L2 Analyst',
            //     content: note,
            //     timestamp: new Date().toISOString(),
            //     attachments: processFiles(files)
            // }]
        } as any;

        setCampaigns(prev => [newCampaign, ...prev]);
    };

    const addAttachment = (entityId: string, entityType: 'alert' | 'incident' | 'campaign', file: File) => {
        // Implementation for adding attachments to existing items
        console.log('Adding attachment', file.name, 'to', entityType, entityId);
    };

    return (
        <DataContext.Provider value={{ alerts, incidents, campaigns, escalateAlert, escalateIncident, addAttachment }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
