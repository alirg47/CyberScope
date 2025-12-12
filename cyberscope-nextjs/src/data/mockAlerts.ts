// Alert Types and Interfaces
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertSource = 'SIEM' | 'EDR' | 'XDR' | 'NDR' | 'Email Gateway' | 'Firewall';
export type AlertStatus = 'Open' | 'Ignored' | 'Escalated' | 'Closed';

// Threat Intelligence Interfaces
export interface MitreAttackData {
    id: string;
    name: string;
    tactic: string;
    confidence: number;
    description: string;
    references: string[];
}

export interface VirusTotalData {
    malicious: number;
    suspicious: number;
    clean: number;
    community_score: number;
    malicious_vendors_count: string;
    ip_address: string;
    asn: number | null;
    organization: string | null;
    country: string | null;
    ip_range: string;
    last_analysis_date: string; whois: any;
}

export interface Alert {
    alert_id: string;
    title: string;
    alert_type: string;
    source: AlertSource;
    severity: RiskLevel;
    timestamp: string;
    src_ip: string;
    dest_ip?: string;
    user: string;
    host: string;
    location: string;
    ai_summary: string;
    ai_risk_score: number; // 0-100
    ai_recommendation: string;
    status: AlertStatus;
    l1_action?: 'Ignore' | 'Escalate';
    l1_action_timestamp?: string;
    l1_comments?: string;
    l1_analyst?: string;
    context: {
        department: string;
        userHistory: string;
        assetCriticality: string;
    };
    // Threat Intelligence Data
    mitre_attack?: MitreAttackData;
    virustotal_data?: VirusTotalData;
    description?: string;
    raw_log?: string;
}

// Mock Data Constants
const ALERT_TYPES = [
    'Brute Force Attack',
    'Malware Detection',
    'Phishing Attempt',
    'Lateral Movement',
    'Data Exfiltration',
    'Privilege Escalation',
    'Suspicious Login',
    'Port Scan',
    'SQL Injection',
    'Command & Control'
];

const SOURCES: AlertSource[] = ['SIEM', 'EDR', 'XDR', 'NDR', 'Email Gateway', 'Firewall'];

const IPS = [
    '192.168.1.100',
    '10.0.0.45',
    '172.16.50.23',
    '45.142.120.10',
    '193.106.191.77',
    '45.155.205.93',
    '185.220.101.45'
];

const USERS = [
    'Mohammad Bin Ali',
    'Fatimah Al-Harbi',
    'Abdulrahman Al-Saeed',
    'Noor Al-Shammari',
    'Saad Al-Qarni',
    'Reem Al-Anzi',
    'Khalid Al-Buqami',
    'Lina Al-Ghamdi'
];

const HOSTS = [
    'WEB-SERVER-01',
    'DB-SERVER-02',
    'WORKSTATION-45',
    'FILE-SERVER-01',
    'DC-PRIMARY-01',
    'APP-SERVER-03',
    'MAIL-SERVER-01'
];

const LOCATIONS = [
    'Riyadh - Main Data Center',
    'Jeddah - Western Branch Office',
    'Dammam - Eastern Operations Center',
    'Makkah - Central Region Branch',
    'Madinah - Northern Services Center'
];

// Simple seeded random number generator
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateRandomAlert(id: number, isFalsePositive = false): Alert {
    let seed = id * 12345; // Initial seed based on ID
    const nextRand = () => {
        const val = seededRandom(seed++);
        return val;
    };

    const alertType = ALERT_TYPES[Math.floor(nextRand() * ALERT_TYPES.length)];
    const severity = isFalsePositive ? 'Low' : (['Critical', 'High', 'Medium', 'Low'][Math.floor(nextRand() * 4)] as RiskLevel);
    const srcIp = IPS[Math.floor(nextRand() * IPS.length)];
    const user = USERS[Math.floor(nextRand() * USERS.length)];
    const host = HOSTS[Math.floor(nextRand() * HOSTS.length)];
    const source = SOURCES[Math.floor(nextRand() * SOURCES.length)];
    const location = LOCATIONS[Math.floor(nextRand() * LOCATIONS.length)];

    // AI Summary based on alert type (in English)
    const summaries: Record<string, string> = {
        'Brute Force Attack': `Multiple failed login attempts detected from IP ${srcIp} targeting user ${user}. Pattern indicates automated attack tool.`,
        'Malware Detection': `Suspicious executable detected on host ${host}. Signature matches known malware family. User ${user} recently downloaded file from external source.`,
        'Phishing Attempt': `Malicious email received by user ${user}. Link redirects to credential harvesting site. No click detected so far.`,
        'Lateral Movement': `Unusual SMB connection from host ${host} to multiple systems. Service account ${user} accessed 5 different systems in 2 minutes.`,
        'Data Exfiltration': `Large data transfer detected from ${host} to external IP ${srcIp}. ${(nextRand() * 500).toFixed(2)} MB transferred.`,
        'Privilege Escalation': `User ${user} attempted privilege escalation on host ${host}. Process: powershell.exe with suspicious parameters.`,
        'Suspicious Login': `Login from unusual location for user ${user}. Source IP: ${srcIp}. Last known location: different country.`,
        'Port Scan': `Port scanning activity detected from ${srcIp}. ${Math.floor(nextRand() * 1000)} ports scanned in ${Math.floor(nextRand() * 30)} minutes.`,
        'SQL Injection': `SQL injection attempt on web application. Source: ${srcIp}. Payload indicates database enumeration attempt.`,
        'Command & Control': `Suspected C2 connection from ${host} to ${srcIp}. Beacon pattern detected every ${Math.floor(nextRand() * 60)} seconds.`
    };

    const recommendations: Record<RiskLevel, string> = {
        'Critical': 'Requires immediate escalation. Block IP address and isolate affected host.',
        'High': 'Escalate to L2 for investigation. Monitor user activity.',
        'Medium': 'Review and correlate with recent events. May require investigation.',
        'Low': 'Monitor for recurring pattern. Likely normal activity.'
    };

    const riskScoreMap: Record<RiskLevel, [number, number]> = {
        'Critical': [90, 100],
        'High': [70, 89],
        'Medium': [40, 69],
        'Low': [10, 39]
    };

    const [min, max] = riskScoreMap[severity];
    const riskScore = Math.floor(nextRand() * (max - min + 1)) + min;

    // Generate timestamp: 70% within last 24h, 30% within last 7 days
    // Use a fixed reference time for hydration consistency: 2024-12-12T12:00:00Z
    const now = new Date('2024-12-12T12:00:00Z').getTime();
    const isRecent = nextRand() > 0.3;
    const timeOffset = isRecent
        ? nextRand() * 24 * 60 * 60 * 1000 // Last 24h
        : nextRand() * 7 * 24 * 60 * 60 * 1000; // Last 7d

    const timestamp = new Date(now - timeOffset).toISOString();

    return {
        alert_id: `ALT-${String(id).padStart(6, '0')}`,
        title: `${alertType} - ${user}`,
        alert_type: alertType,
        source,
        severity,
        timestamp,
        src_ip: srcIp,
        user,
        host,
        location,
        ai_summary: summaries[alertType],
        ai_risk_score: riskScore,
        ai_recommendation: recommendations[severity],
        status: 'Open',
        context: {
            department: ['IT', 'Finance', 'HR', 'Operations', 'Security'][Math.floor(nextRand() * 5)],
            userHistory: 'Clean - no previous alerts',
            assetCriticality: ['Critical', 'High', 'Medium', 'Low'][Math.floor(nextRand() * 4)]
        }
    };
}

// Generate mock alerts - Increased count for better charts
export const mockAlerts: Alert[] = Array.from({ length: 150 }, (_, i) => generateRandomAlert(i + 1));

// Helper functions
export const getAlertById = (id: string): Alert | undefined => {
    return mockAlerts.find(alert => alert.alert_id === id);
};

export const getAlertsByStatus = (status: AlertStatus): Alert[] => {
    return mockAlerts.filter(alert => alert.status === status);
};

export const getAlertsBySeverity = (severity: RiskLevel): Alert[] => {
    return mockAlerts.filter(alert => alert.severity === severity);
};
