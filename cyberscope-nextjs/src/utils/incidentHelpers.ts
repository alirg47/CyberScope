// Helper functions for generating Attack Graph and Cyber Kill Chain from alert data

import type { Alert } from '@/data/realAlerts';
import type { KillChain, IncidentGraph } from '@/data/mockIncidents';

// Map MITRE tactics to Cyber Kill Chain stages
export function generateKillChainFromMitre(tactic: string): KillChain {
    const killChain: KillChain = {
        reconnaissance: false,
        weaponization: false,
        delivery: false,
        exploitation: false,
        installation: false,
        commandControl: false,
        actionsObjectives: false
    };

    const tacticLower = tactic.toLowerCase();

    // Map MITRE tactics to kill chain
    if (tacticLower.includes('reconnaissance') || tacticLower.includes('discovery')) {
        killChain.reconnaissance = true;
    }
    if (tacticLower.includes('resource') || tacticLower.includes('weaponization')) {
        killChain.weaponization = true;
    }
    if (tacticLower.includes('initial') || tacticLower.includes('delivery')) {
        killChain.delivery = true;
        killChain.exploitation = true;
    }
    if (tacticLower.includes('execution') || tacticLower.includes('exploitation') || tacticLower.includes('privilege')) {
        killChain.exploitation = true;
    }
    if (tacticLower.includes('persistence') || tacticLower.includes('installation')) {
        killChain.installation = true;
    }
    if (tacticLower.includes('command') || tacticLower.includes('c2') || tacticLower.includes('control')) {
        killChain.commandControl = true;
    }
    if (tacticLower.includes('impact') || tacticLower.includes('exfiltration') || tacticLower.includes('collection') || tacticLower.includes('credential')) {
        killChain.actionsObjectives = true;
    }

    return killChain;
}

// Generate Attack Graph from alert data
export function generateAttackGraphFromAlert(alert: Alert): IncidentGraph {
    const nodes = [];
    const edges = [];

    // Add user node
    if (alert.user) {
        nodes.push({ id: 'user1', label: alert.user, type: 'user' });
    }

    // Add host node
    if (alert.host) {
        nodes.push({ id: 'host1', label: alert.host, type: 'host' });
        if (alert.user) {
            edges.push({ from: 'user1', to: 'host1', label: 'accessed' });
        }
    }

    // Add source IP node (attacker/external)
    if (alert.src_ip) {
        const isExternal = !alert.src_ip.startsWith('10.') &&
            !alert.src_ip.startsWith('192.168.') &&
            !alert.src_ip.startsWith('172.16.');

        nodes.push({
            id: 'source_ip',
            label: alert.src_ip,
            type: isExternal ? 'external_ip' : 'internal_ip'
        });

        // Determine connection type based on VirusTotal data
        const vtData = alert.virustotal_data;
        let connectionLabel = 'connection';

        if (vtData) {
            if (vtData.malicious > 0) {
                connectionLabel = 'malicious_connection';
            } else if (vtData.suspicious > 0) {
                connectionLabel = 'suspicious_connection';
            }
        }

        if (alert.host) {
            edges.push({ from: 'source_ip', to: 'host1', label: connectionLabel });
        }
    }

    // Add MITRE technique node
    if (alert.mitre_attack) {
        nodes.push({
            id: 'technique',
            label: `${alert.mitre_attack.id}: ${alert.mitre_attack.name}`,
            type: 'technique'
        });

        if (alert.host) {
            edges.push({ from: 'technique', to: 'host1', label: 'attack_pattern' });
        }
    }

    return { nodes, edges };
}
