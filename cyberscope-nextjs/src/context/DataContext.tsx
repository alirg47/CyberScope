'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { realAlerts, Alert } from '@/data/realAlerts';
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
    const [alerts, setAlerts] = useState<Alert[]>(realAlerts);
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

        // 2. Add to L2 (Incidents) - Preserve ALL threat intelligence
        const newIncident: Incident = {
            incident_id: `INC-${Math.floor(Math.random() * 10000)}`,
            title: `Escalated: ${alertToEscalate.title}`,
            summary: note || alertToEscalate.ai_summary || "No summary provided",
            severity: alertToEscalate.severity,
            status: 'Open',
            created_by: 'L1 Analyst',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            // Preserve complete alert with threat intelligence
            related_alerts: [{
                alert_id: alertToEscalate.alert_id,
                alert_type: alertToEscalate.alert_type,
                timestamp: alertToEscalate.timestamp,
                user: alertToEscalate.user,
                host: alertToEscalate.host,
                src_ip: alertToEscalate.src_ip,
                // Preserve threat intelligence
                mitre_attack: alertToEscalate.mitre_attack,
                virustotal_data: alertToEscalate.virustotal_data,
                ai_summary: alertToEscalate.ai_summary,
                ai_recommendation: alertToEscalate.ai_recommendation
            }],

            // Copy threat intelligence to incident level
            mitre_attack: alertToEscalate.mitre_attack,
            virustotal_data: alertToEscalate.virustotal_data,
            ai_summary: alertToEscalate.ai_summary,

            l2_notes: note,

            // AUTO-GENERATED Kill Chain and Graph from MITRE tactic
            kill_chain: alertToEscalate.mitre_attack
                ? (() => {
                    const kc = {
                        reconnaissance: false,
                        weaponization: false,
                        delivery: false,
                        exploitation: false,
                        installation: false,
                        commandControl: false,
                        actionsObjectives: false
                    };
                    const tactic = alertToEscalate.mitre_attack.tactic.toLowerCase();
                    if (tactic.includes('collection') || tactic.includes('discovery')) kc.reconnaissance = true;
                    if (tactic.includes('initial') || tactic.includes('execution')) { kc.delivery = true; kc.exploitation = true; }
                    if (tactic.includes('privilege') || tactic.includes('credential')) kc.exploitation = true;
                    if (tactic.includes('persistence')) kc.installation = true;
                    if (tactic.includes('command')) kc.commandControl = true;
                    if (tactic.includes('impact') || tactic.includes('exfiltration')) kc.actionsObjectives = true;
                    return kc;
                })()
                : {
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
                    event: 'Incident created via escalation from L1',
                    stage: alertToEscalate.mitre_attack?.tactic || 'Initial Access',
                    host: alertToEscalate.host || 'Unknown',
                    mitre_technique: alertToEscalate.mitre_attack
                        ? `${alertToEscalate.mitre_attack.id} - ${alertToEscalate.mitre_attack.name}`
                        : undefined
                }
            ],

            // AUTO-GENERATED Attack Graph
            graph: (() => {
                const nodes = [];
                const edges = [];
                if (alertToEscalate.user) nodes.push({ id: 'user1', label: alertToEscalate.user, type: 'user' });
                if (alertToEscalate.host) {
                    nodes.push({ id: 'host1', label: alertToEscalate.host, type: 'host' });
                    if (alertToEscalate.user) edges.push({ from: 'user1', to: 'host1', label: 'accessed' });
                }
                if (alertToEscalate.src_ip) {
                    nodes.push({ id: 'attacker', label: alertToEscalate.src_ip, type: 'external_ip' });
                    if (alertToEscalate.host) {
                        const label = (alertToEscalate.virustotal_data?.malicious ?? 0) > 0 ? 'malicious_attack' : 'suspicious_connection';
                        edges.push({ from: 'attacker', to: 'host1', label });
                    }
                }
                if (alertToEscalate.mitre_attack) {
                    nodes.push({ id: 'technique', label: alertToEscalate.mitre_attack.id, type: 'technique' });
                    if (alertToEscalate.host) edges.push({ from: 'technique', to: 'host1', label: 'attack_pattern' });
                }
                return { nodes, edges };
            })(),

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

        // Remove from L2 (incident moves to L3)
        setIncidents(prev => prev.filter(i => i.incident_id !== incidentId));

        // Extract MITRE tactics from timeline events
        const extractMITRETactics = (incident: typeof incidentToEscalate): string[] => {
            const tactics = new Set<string>();

            // Extract from timeline
            incident.timeline.forEach(event => {
                if (event.mitre_technique) {
                    // Extract tactic ID from technique (e.g., "T1566.001 - Phishing" -> get tactic)
                    const match = event.mitre_technique.match(/T\d{4}/);
                    if (match) {
                        // Map common technique IDs to tactics
                        const tid = match[0];
                        if (tid.startsWith('T15')) tactics.add('TA0001 - Initial Access');
                        else if (tid.startsWith('T12')) tactics.add('TA0002 - Execution');
                        else if (tid.startsWith('T10')) tactics.add('TA0004 - Privilege Escalation');
                        else if (tid.startsWith('T14')) tactics.add('TA0006 - Credential Access');
                        else if (tid.startsWith('T10')) tactics.add('TA0011 - Command and Control');
                    }
                }
                // Also check stage for mapping
                if (event.stage) {
                    const stage = event.stage.toLowerCase();
                    if (stage.includes('access')) tactics.add('TA0001 - Initial Access');
                    if (stage.includes('execution')) tactics.add('TA0002 - Execution');
                    if (stage.includes('privilege')) tactics.add('TA0004 - Privilege Escalation');
                    if (stage.includes('credential')) tactics.add('TA0006 - Credential Access');
                    if (stage.includes('command') || stage.includes('c2')) tactics.add('TA0011 - Command and Control');
                    if (stage.includes('impact')) tactics.add('TA0040 - Impact');
                    if (stage.includes('exfiltration')) tactics.add('TA0010 - Exfiltration');
                }
            });

            return Array.from(tactics);
        };

        // Create new L3 campaign with preserved L2 investigation data
        const newCampaign: Campaign = {
            campaign_id: `CMP-${Math.floor(Math.random() * 10000)}`,
            name: `Investigation: ${incidentToEscalate.title}`,
            description: note || incidentToEscalate.summary,
            status: 'Active',
            risk_level: incidentToEscalate.severity as any,
            threat_actors: ['Unknown'],
            pattern_type: 'Escalated Investigation',
            created_by: 'L3 Analyst',
            created_at: new Date().toISOString(),
            mitre_tactics: extractMITRETactics(incidentToEscalate),
            related_incidents: [incidentToEscalate.incident_id],
            misp_ioc_matches: {
                ips: [],
                domains: [],
                hashes: [],
                emails: []
            },
            l3_notes: `Escalated from L2 incident ${incidentToEscalate.incident_id}. ${note}`,

            // Preserve L2 investigation data
            escalated_from_incident_id: incidentToEscalate.incident_id,
            l2_investigation: {
                analyst: incidentToEscalate.l2_analyst || incidentToEscalate.created_by,
                notes: incidentToEscalate.l2_notes || 'No L2 notes provided',
                timeline: incidentToEscalate.timeline,
                related_alerts: incidentToEscalate.related_alerts,
                graph: incidentToEscalate.graph,
                escalation_note: note,
                escalation_timestamp: new Date().toISOString(),
                escalated_by: 'L2 Analyst' // TODO: Get from current user context
            }
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
