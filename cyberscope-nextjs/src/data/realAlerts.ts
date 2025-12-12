// This file imports and transforms the history.json data from AbsherTwaiq
// into the Alert format used by the SOC application

import historyData from '../../AbsherTwaiq/storage/history.json';
import type { Alert, AlertStatus, RiskLevel, AlertSource } from './mockAlerts';
export type { Alert } from './mockAlerts';

// Map risk scores to severity levels
function mapRiskScoreToSeverity(riskScore: string | number): RiskLevel {
    const score = typeof riskScore === 'string' ? parseInt(riskScore) : riskScore;

    if (isNaN(score) || riskScore === 'N/A') return 'Low';

    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
}

// Determine alert source based on alert characteristics
function determineAlertSource(item: any): AlertSource {
    const description = item.alert.description.toLowerCase();
    const tactic = item.mitre.tactic?.toLowerCase() || '';
    const isExternalIP = !item.alert.source_ip.startsWith('10.') &&
        !item.alert.source_ip.startsWith('172.16.') &&
        !item.alert.source_ip.startsWith('192.168.');
    const hasMalicious = item.virustotal.malicious > 0;
    const riskScore = typeof item.llm_response.risk_score === 'string'
        ? parseInt(item.llm_response.risk_score)
        : item.llm_response.risk_score;

    // XDR: Only critical credential/privilege attacks (5-10%)
    if (riskScore >= 8 &&
        (tactic.includes('credential-access') || tactic.includes('privilege-escalation'))) {
        return 'XDR';
    }

    // EDR: Endpoint threats - malware, execution, file operations (15-20%)
    if (description.includes('ransomware') ||
        description.includes('macro') ||
        description.includes('antivirus') ||
        description.includes('powershell') ||
        description.includes('encryption') ||
        (description.includes('scheduled task') && riskScore >= 5)) {
        return 'EDR';
    }

    // NDR: Network-related activities and external connections (10-15%)
    if (isExternalIP ||
        description.includes('tor') ||
        description.includes('outbound') ||
        description.includes('data transfer') ||
        description.includes('connection') ||
        (description.includes('ssh') && riskScore >= 5) ||
        (description.includes('sql') && riskScore >= 6)) {
        return 'NDR';
    }



    // SIEM: Default for most security events, authentication, logging, and general alerts
    return 'SIEM';
}

// Transform the history.json data to Alert format
export const realAlerts: Alert[] = historyData.map((item, index) => {
    const alertId = `ALT-${String(index + 1).padStart(6, '0')}`;
    // Use fixed base time for hydration consistency: 2024-12-12T12:00:00Z
    const baseTime = new Date('2024-12-12T12:00:00Z').getTime();
    const timestamp = new Date(baseTime - (index * 3600000)).toISOString();

    // Determine status based on risk score
    let status: AlertStatus = 'Open';
    if (item.llm_response.recommendation?.includes('Ignore')) {
        status = 'Ignored';
    }

    const severity = mapRiskScoreToSeverity(item.llm_response.risk_score);

    // Extract risk score as number
    const riskScoreNum = typeof item.llm_response.risk_score === 'string'
        ? parseInt(item.llm_response.risk_score)
        : item.llm_response.risk_score;

    return {
        alert_id: alertId,
        title: `${item.mitre.name} - ${item.alert.username}`,
        timestamp: timestamp,
        alert_type: item.mitre.name || 'Security Alert',
        source: determineAlertSource(item),
        severity: severity,
        src_ip: item.alert.source_ip,
        dest_ip: item.virustotal.ip_address !== item.alert.source_ip ? item.virustotal.ip_address : undefined,
        user: item.alert.username,
        host: `HOST-${item.alert.location.toUpperCase().replace(/\s+/g, '-')}`,
        location: item.alert.location,
        status: status,
        description: item.alert.description,

        // AI Summary from LLM response
        ai_summary: `**Risk Score: ${riskScoreNum}/10**\n\n**Behavior:** ${item.llm_response.behavior}\n\n**Evidence:** ${item.llm_response.evidence}\n\n**IR Action:** ${item.llm_response.ir_action}\n\n**Recommendation:** ${item.llm_response.recommendation}`,
        ai_risk_score: isNaN(riskScoreNum) ? 50 : riskScoreNum * 10,
        ai_recommendation: item.llm_response.recommendation || 'Review and monitor for suspicious activity.',

        // Context
        context: {
            department: item.alert.location,
            userHistory: 'Imported from threat intelligence feed',
            assetCriticality: severity === 'Critical' || severity === 'High' ? 'High' : 'Medium'
        },

        // MITRE ATT&CK data
        mitre_attack: {
            id: item.mitre.id,
            name: item.mitre.name,
            tactic: item.mitre.tactic,
            confidence: item.mitre.confidence,
            description: item.mitre.description,
            references: item.mitre.references
        },

        // VirusTotal Intelligence
        virustotal_data: {
            malicious: item.virustotal.malicious,
            suspicious: item.virustotal.suspicious,
            clean: item.virustotal.clean,
            community_score: item.virustotal.community_score,
            malicious_vendors_count: item.virustotal.malicious_vendors_count,
            ip_address: item.alert.source_ip,
            asn: item.virustotal.asn,
            organization: item.virustotal.organization,
            country: item.virustotal.country,
            ip_range: item.virustotal.ip_range,
            last_analysis_date: item.virustotal.last_analysis_date || 'N/A',
            whois: item.virustotal.whois
        },

        // Additional context
        raw_log: JSON.stringify(item, null, 2)
    };
});

// Export count for easy reference
export const REAL_ALERTS_COUNT = realAlerts.length;
