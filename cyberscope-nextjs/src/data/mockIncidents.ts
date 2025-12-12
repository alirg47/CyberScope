// Incident Types and Interfaces
import type { MitreAttackData, VirusTotalData } from './mockAlerts';

export interface IncidentAlert {
    alert_id: string;
    alert_type: string;
    timestamp: string;
    user?: string;
    host?: string;
    src_ip?: string;
    // Preserve full alert for display
    mitre_attack?: MitreAttackData;
    virustotal_data?: VirusTotalData;
    ai_summary?: string;
    ai_recommendation?: string;
}

export interface TimelineEvent {
    time: string;
    event: string;
    stage: string;
    host: string;
    mitre_technique?: string;
}

export interface KillChain {
    reconnaissance: boolean;
    weaponization: boolean;
    delivery: boolean;
    exploitation: boolean;
    installation: boolean;
    commandControl: boolean;
    actionsObjectives: boolean;
}

export interface GraphNode {
    id: string;
    label: string;
    type: string;
}

export interface GraphEdge {
    from: string;
    to: string;
    label: string;
}

export interface IncidentGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export type IncidentStatus = 'Open' | 'In-Progress' | 'Closed' | 'Escalated to L3';
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Incident {
    incident_id: string;
    title: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    created_by: string; // L1 analyst who escalated
    created_at: string;
    updated_at: string;
    summary: string;
    related_alerts: IncidentAlert[];
    timeline: TimelineEvent[];
    kill_chain: KillChain;
    rag_context: string[];
    graph: IncidentGraph;
    l2_action?: 'Close' | 'Confirm Threat' | 'Escalate to L3';
    l2_notes?: string;
    l2_timestamp?: string;
    l2_analyst?: string; // L2 analyst assigned
    // Threat Intelligence (from escalated alert)
    mitre_attack?: MitreAttackData;
    virustotal_data?: VirusTotalData;
    ai_summary?: string;
}

// Mock Incident Data (grouped and correlated alerts for L2)
function generateMockIncidents(): Incident[] {
    // Fix hydration error: Use static base time
    const BASE_TIME = new Date('2024-12-12T12:00:00Z').getTime();

    return [
        {
            incident_id: 'INC-2024-001',
            title: 'Ransomware Attack Campaign',
            severity: 'Critical',
            status: 'In-Progress',
            created_by: 'Mohammad Al-Ahmad',
            l2_analyst: 'Ahmad Bin Saeed',
            created_at: new Date(BASE_TIME - 7200000).toISOString(),
            updated_at: new Date(BASE_TIME - 1800000).toISOString(),
            summary: 'Multiple systems infected with ransomware variant. Lateral movement detected across network. Critical file servers encrypted. Ransom note demanding 50 BTC. Command and control servers identified.',
            l2_notes: 'Confirmed ransomware strain is LockBit 3.0. Isolated affected network segment. Working with IR team to restore from backups. C2 domains blocked at firewall.',
            related_alerts: [
                { alert_id: 'ALT-000001', alert_type: 'Malware Detection', timestamp: new Date(BASE_TIME - 7200000).toISOString(), user: 'Fatimah Al-Zahrani', host: 'FILE-SERVER-01', src_ip: '192.168.1.100' },
                { alert_id: 'ALT-000005', alert_type: 'Lateral Movement', timestamp: new Date(BASE_TIME - 6900000).toISOString(), user: 'Fatimah Al-Zahrani', host: 'FILE-SERVER-01' },
                { alert_id: 'ALT-000012', alert_type: 'Command & Control', timestamp: new Date(BASE_TIME - 6600000).toISOString(), host: 'FILE-SERVER-01', src_ip: '45.142.120.10' },
                { alert_id: 'ALT-000018', alert_type: 'Data Exfiltration', timestamp: new Date(BASE_TIME - 6300000).toISOString(), host: 'FILE-SERVER-01', src_ip: '45.142.120.10' }
            ],
            timeline: [
                { time: '14:20', event: 'Suspicious email with malicious attachment opened', stage: 'Delivery', host: 'WORKSTATION-45', mitre_technique: 'T1566.001 - Phishing: Spearphishing Attachment' },
                { time: '14:22', event: 'Malicious payload executed via macro', stage: 'Exploitation', host: 'WORKSTATION-45', mitre_technique: 'T1204.002 - User Execution: Malicious File' },
                { time: '14:25', event: 'Persistence established via scheduled task', stage: 'Installation', host: 'WORKSTATION-45', mitre_technique: 'T1053.005 - Scheduled Task/Job' },
                { time: '14:30', event: 'Lateral movement to file server via SMB', stage: 'Lateral Movement', host: 'FILE-SERVER-01', mitre_technique: 'T1021.002 - Remote Services: SMB/Windows Admin Shares' },
                { time: '14:35', event: 'C2 communication established', stage: 'Command & Control', host: 'FILE-SERVER-01', mitre_technique: 'T1071.001 - Application Layer Protocol: Web Protocols' },
                { time: '14:40', event: 'Files encrypted, ransom note deployed', stage: 'Impact', host: 'FILE-SERVER-01', mitre_technique: 'T1486 - Data Encrypted for Impact' }
            ],
            kill_chain: {
                reconnaissance: true,
                weaponization: true,
                delivery: true,
                exploitation: true,
                installation: true,
                commandControl: true,
                actionsObjectives: true
            },
            rag_context: [
                'Similar ransomware incident occurred 3 months ago targeting same department.',
                'LockBit 3.0 typically exploits unpatched vulnerabilities in VPN endpoints.',
                'Historical data shows this variant spreads via lateral movement using compromised credentials.',
                'Average recovery time for ransomware incidents: 72 hours with backup restoration.'
            ],
            graph: {
                nodes: [
                    { id: 'user1', label: 'Fatimah Al-Zahrani', type: 'user' },
                    { id: 'ws45', label: 'WORKSTATION-45', type: 'host' },
                    { id: 'fs01', label: 'FILE-SERVER-01', type: 'host' },
                    { id: 'c2', label: '45.142.120.10', type: 'external_ip' },
                    { id: 'mal', label: 'LockBit 3.0', type: 'malware' }
                ],
                edges: [
                    { from: 'user1', to: 'ws45', label: 'opened_attachment' },
                    { from: 'mal', to: 'ws45', label: 'infected' },
                    { from: 'ws45', to: 'fs01', label: 'lateral_movement' },
                    { from: 'fs01', to: 'c2', label: 'c2_communication' },
                    { from: 'mal', to: 'fs01', label: 'encrypted_files' }
                ]
            }
        },
        {
            incident_id: 'INC-2024-002',
            title: 'APT Credential Harvesting Campaign',
            severity: 'High',
            status: 'Escalated to L3',
            created_by: 'Ali AL-Ghannam',
            l2_analyst: 'Khalid Al-Harbi',
            created_at: new Date(BASE_TIME - 172800000).toISOString(),
            updated_at: new Date(BASE_TIME - 86400000).toISOString(),
            summary: 'Sophisticated phishing campaign targeting executives. Multiple credential theft attempts detected. Attackers using typosquatted domains mimicking internal services. Evidence of reconnaissance and targeted social engineering.',
            l2_notes: 'Escalated to L3 for threat hunting. Pattern matches APT28 tactics. Recommend comprehensive account audit and MFA enforcement.',
            l2_action: 'Escalate to L3',
            related_alerts: [
                { alert_id: 'ALT-000023', alert_type: 'Phishing Attempt', timestamp: new Date(BASE_TIME - 172800000).toISOString(), user: 'Omar Al-Mansour' },
                { alert_id: 'ALT-000031', alert_type: 'Suspicious Login', timestamp: new Date(BASE_TIME - 169200000).toISOString(), user: 'Omar Al-Mansour', src_ip: '193.106.191.77' },
                { alert_id: 'ALT-000042', alert_type: 'Privilege Escalation', timestamp: new Date(BASE_TIME - 165600000).toISOString(), user: 'Omar Al-Mansour', host: 'DC-PRIMARY-01' }
            ],
            timeline: [
                { time: '09:15', event: 'Spearphishing email received', stage: 'Reconnaissance', host: 'WORKSTATION-12', mitre_technique: 'T1566.002 - Phishing: Spearphishing Link' },
                { time: '09:20', event: 'User clicked malicious link', stage: 'Initial Access', host: 'WORKSTATION-12', mitre_technique: 'T1078 - Valid Accounts' },
                { time: '09:22', event: 'Credentials captured via fake login page', stage: 'Credential Access', host: 'External', mitre_technique: 'T1056.003 - Input Capture: Web Portal Capture' },
                { time: '11:30', event: 'Login from  anomalous location', stage: 'Initial Access', host: 'MAIL-SERVER-01', mitre_technique: 'T1078 - Valid Accounts' },
                { time: '11:45', event: 'Privilege escalation attempt', stage: 'Privilege Escalation', host: 'DC-PRIMARY-01', mitre_technique: 'T1068 - Exploitation for Privilege Escalation' }
            ],
            kill_chain: {
                reconnaissance: true,
                weaponization: true,
                delivery: true,
                exploitation: true,
                installation: false,
                commandControl: false,
                actionsObjectives: false
            },
            rag_context: [
                'APT28 known for targeting government and enterprise organizations.',
                'Similar credential harvesting campaigns observed industry-wide in Q4 2024.',
                'Typosquatting is a common initial access tactic for sophisticated threat actors.',
                'MFA significantly reduces success rate of credential theft attacks.'
            ],
            graph: {
                nodes: [
                    { id: 'user2', label: 'Omar Al-Mansour', type: 'user' },
                    { id: 'ws12', label: 'WORKSTATION-12', type: 'host' },
                    { id: 'ms01', label: 'MAIL-SERVER-01', type: 'host' },
                    { id: 'dc01', label: 'DC-PRIMARY-01', type: 'host' },
                    { id: 'phish', label: 'Phishing Domain', type: 'external' }
                ],
                edges: [
                    { from: 'phish', to: 'user2', label: 'sent_email' },
                    { from: 'user2', to: 'phish', label: 'submitted_creds' },
                    { from: 'phish', to: 'ms01', label: 'authenticated' },
                    { from: 'ms01', to: 'dc01', label: 'priv_esc_attempt' }
                ]
            }
        },
        {
            incident_id: 'INC-2024-003',
            title: 'Insider Threat Data Exfiltration',
            severity: 'High',
            status: 'Closed',
            created_by: 'Fatimah Al-Zahrani',
            l2_analyst: 'Noor Al-Shamsi',
            created_at: new Date(BASE_TIME - 432000000).toISOString(),
            updated_at: new Date(BASE_TIME - 259200000).toISOString(),
            summary: 'Employee accessed and exfiltrated sensitive customer data before resignation. Large file transfers to personal cloud storage detected. Policy violations and unauthorized data access confirmed.',
            l2_notes: 'Investigation completed. Employee terminated and legal action initiated. All exfiltrated data deleted from cloud storage. Implemented enhanced DLP policies.',
            l2_action: 'Close',
            related_alerts: [
                { alert_id: 'ALT-000056', alert_type: 'Data Exfiltration', timestamp: new Date(BASE_TIME - 432000000).toISOString(), user: 'Saad Al-Qarni', host: 'WORKSTATION-78' },
                { alert_id: 'ALT-000059', alert_type: 'Suspicious Login', timestamp: new Date(BASE_TIME - 428400000).toISOString(), user: 'Saad Al-Qarni' }
            ],
            timeline: [
                { time: '18:30', event: 'After-hours login detected', stage: 'Initial Access', host: 'WORKSTATION-78', mitre_technique: 'T1078 - Valid Accounts' },
                { time: '18:35', event: 'Accessed confidential customer database', stage: 'Collection', host: 'DB-SERVER-02', mitre_technique: 'T1213 - Data from Information Repositories' },
                { time: '18:45', event: 'Data exported to CSV files', stage: 'Collection', host: 'WORKSTATION-78', mitre_technique: 'T1005 - Data from Local System' },
                { time: '19:10', event: 'Large upload to Dropbox detected', stage: 'Exfiltration', host: 'WORKSTATION-78', mitre_technique: 'T1567.002 - Exfiltration Over Web Service' }
            ],
            kill_chain: {
                reconnaissance: false,
                weaponization: false,
                delivery: false,
                exploitation: false,
                installation: false,
                commandControl: false,
                actionsObjectives: true
            },
            rag_context: [
                'Insider threats account for 34% of data breaches in financial sector.',
                'Departing employees pose elevated risk in 2-week notice period.',
                'DLP policies should monitor cloud storage uploads.',
                'User behavior analytics can detect anomalous access patterns.'
            ],
            graph: {
                nodes: [
                    { id: 'user3', label: 'Saad Al-Qarni', type: 'user' },
                    { id: 'ws78', label: 'WORKSTATION-78', type: 'host' },
                    { id: 'db02', label: 'DB-SERVER-02', type: 'host' },
                    { id: 'dropbox', label: 'Dropbox', type: 'external' }
                ],
                edges: [
                    { from: 'user3', to: 'ws78', label: 'logged_in' },
                    { from: 'ws78', to: 'db02', label: 'accessed_data' },
                    { from: 'ws78', to: 'dropbox', label: 'uploaded_files' }
                ]
            }
        },
        {
            incident_id: 'INC-2024-004',
            title: 'Cryptomining Malware Infection',
            severity: 'Medium',
            status: 'Closed',
            created_by: 'Mohammad Al-Ahmad',
            l2_analyst: 'Ahmad Bin Saeed',
            created_at: new Date(BASE_TIME - 604800000).toISOString(),
            updated_at: new Date(BASE_TIME - 518400000).toISOString(),
            summary: 'Cryptomining malware discovered on multiple workstations. High CPU usage and network traffic to mining pools detected. Malware distributed via compromised software update mechanism.',
            l2_notes: 'All affected systems cleaned and patched. Software vendor notified of compromise. No data breach confirmed.',
            l2_action: 'Close',
            related_alerts: [
                { alert_id: 'ALT-000072', alert_type: 'Malware Detection', timestamp: new Date(BASE_TIME - 604800000).toISOString(), host: 'WORKSTATION-23' },
                { alert_id: 'ALT-000078', alert_type: 'Command & Control', timestamp: new Date(BASE_TIME - 601200000).toISOString(), host: 'WORKSTATION-23', src_ip: '185.220.101.45' }
            ],
            timeline: [
                { time: '14:00', event: 'Automatic software update initiated', stage: 'Initial Access', host: 'WORKSTATION-23', mitre_technique: 'T1195.002 - Supply Chain Compromise' },
                { time: '14:05', event: 'Cryptominer payload executed', stage: 'Execution', host: 'WORKSTATION-23', mitre_technique: 'T1496 - Resource Hijacking' },
                { time: '14:10', event: 'Connection to mining pool established', stage: 'Command & Control', host: 'WORKSTATION-23', mitre_technique: 'T1071 - Application Layer Protocol' },
                { time: '14:15', event: 'High CPU usage detected', stage: 'Impact', host: 'WORKSTATION-23', mitre_technique: 'T1496 - Resource Hijacking' }
            ],
            kill_chain: {
                reconnaissance: false,
                weaponization: true,
                delivery: true,
                exploitation: true,
                installation: true,
                commandControl: true,
                actionsObjectives: true
            },
            rag_context: [
                'Cryptomining malware increasingly distributed via supply chain attacks.',
                'Mining activity can degrade system performance by 70-90%.',
                'No sensitive data typically targeted by cryptominers.',
                'Verify integrity of all software updates from third-party vendors.'
            ],
            graph: {
                nodes: [
                    { id: 'ws23', label: 'WORKSTATION-23', type: 'host' },
                    { id: 'update', label: 'Compromised Update Server', type: 'external' },
                    { id: 'pool', label: 'Mining Pool', type: 'external' },
                    { id: 'miner', label: 'XMRig Miner', type: 'malware' }
                ],
                edges: [
                    { from: 'update', to: 'ws23', label: 'delivered_payload' },
                    { from: 'miner', to: 'ws23', label: 'infected' },
                    { from: 'ws23', to: 'pool', label: 'mining_traffic' }
                ]
            }
        },
        {
            incident_id: 'INC-2024-005',
            title: 'SQL Injection Attack on Web Application',
            severity: 'High',
            status: 'Open',
            created_by: 'Ali AL-Ghannam',
            created_at: new Date(BASE_TIME - 3600000).toISOString(),
            updated_at: new Date(BASE_TIME - 1800000).toISOString(),
            summary: 'Multiple SQL injection attempts detected on customer portal. Attacker attempting database enumeration and data extraction. WAF blocking most attempts but some bypasses detected.',
            related_alerts: [
                { alert_id: 'ALT-000091', alert_type: 'SQL Injection', timestamp: new Date(BASE_TIME - 3600000).toISOString(), src_ip: '45.155.205.93' },
                { alert_id: 'ALT-000095', alert_type: 'SQL Injection', timestamp: new Date(BASE_TIME - 3300000).toISOString(), src_ip: '45.155.205.93' }
            ],
            timeline: [
                { time: '16:10', event: 'Initial SQL injection probe', stage: 'Reconnaissance', host: 'WEB-SERVER-01', mitre_technique: 'T1190 - Exploit Public-Facing Application' },
                { time: '16:15', event: 'Database schema enumeration attempts', stage: 'Discovery', host: 'WEB-SERVER-01', mitre_technique: 'T1046 - Network Service Scanning' },
                { time: '16:20', event: 'WAF bypass attempts using encoding', stage: 'Defense Evasion', host: 'WEB-SERVER-01', mitre_technique: 'T1027 - Obfuscated Files or Information' }
            ],
            kill_chain: {
                reconnaissance: true,
                weaponization: false,
                delivery: false,
                exploitation: true,
                installation: false,
                commandControl: false,
                actionsObjectives: false
            },
            rag_context: [
                'SQL injection remains in OWASP Top 10 vulnerabilities.',
                'Consider implementing parameterized queries and input validation.',
                'WAF rules should be updated to detect encoding-based bypasses.',
                'Similar attack patterns observed from same threat actor network.'
            ],
            graph: {
                nodes: [
                    { id: 'attacker', label: '45.155.205.93', type: 'external_ip' },
                    { id: 'web01', label: 'WEB-SERVER-01', type: 'host' },
                    { id: 'db03', label: 'Customer DB', type: 'database' }
                ],
                edges: [
                    { from: 'attacker', to: 'web01', label: 'sql_injection' },
                    { from: 'web01', to: 'db03', label: 'query_attempts' }
                ]
            }
        }
    ];
}

export const mockIncidents: Incident[] = generateMockIncidents();

// Helper functions
export const getIncidentById = (id: string): Incident | undefined => {
    return mockIncidents.find(incident => incident.incident_id === id);
};

export const getIncidentsByStatus = (status: IncidentStatus): Incident[] => {
    return mockIncidents.filter(incident => incident.status === status);
};

export const getIncidentsBySeverity = (severity: IncidentSeverity): Incident[] => {
    return mockIncidents.filter(incident => incident.severity === severity);
};
