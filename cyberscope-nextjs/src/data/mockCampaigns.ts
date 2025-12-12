// Campaign Types and Interfaces
import type { TimelineEvent, IncidentAlert, IncidentGraph } from './mockIncidents';

export interface MISPIndicators {
    ips: string[];
    domains: string[];
    hashes: string[];
    emails: string[];
}

export type CampaignStatus = 'Active' | 'Monitoring' | 'Resolved' | 'False Positive';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// L3 Threat Hunting Intelligence Analysis
export interface ThreatHuntingAnalysis {
    technique_id: string;              // MITRE ATT&CK technique ID
    technique_name: string;            // Exact MITRE technique name
    threat_impact: string;             // MITRE tactic category
    ai_confidence: number;             // Confidence score 1-100
    technique_description: string;     // Short explanation of the technique
    detection_strategies: string[];    // Realistic SOC detection methods
    ttp_prediction: string[];          // Predicted next MITRE steps/behaviors
    attack_probability_score: number;  // Percentage likelihood of escalation
    early_indicators: string[];        // Pre-attack/early compromise evidence
    recommended_action: string;        // SOC-friendly proactive action
}

export interface Campaign {
    campaign_id: string;
    name: string;
    description: string;
    risk_level: RiskLevel;
    misp_ioc_matches: MISPIndicators;
    related_incidents: string[];
    pattern_type: string;
    status: CampaignStatus;
    l3_notes: string;
    created_by: string;
    created_at: string;
    threat_actor?: string;
    mitre_tactics: string[];

    // L2 Investigation Data (preserved from incident escalation)
    escalated_from_incident_id?: string;
    l2_investigation?: {
        analyst: string;
        notes: string;
        timeline: TimelineEvent[];
        related_alerts: IncidentAlert[];
        graph: IncidentGraph;
        escalation_note: string;
        escalation_timestamp: string;
        escalated_by: string;
    };

    // L3 Threat Hunting Analysis
    threat_analysis?: ThreatHuntingAnalysis;
}

// Mock Campaign Data (L3 threat hunting)
// Fix hydration error: Use static base time
const BASE_TIME = new Date('2024-12-12T12:00:00Z').getTime();

export const mockCampaigns: Campaign[] = [
    {
        campaign_id: 'CAMP-2024-001',
        name: 'Operation Silent Phoenix',
        description: 'Advanced persistent threat campaign targeting financial institutions. Sophisticated spearphishing with custom malware. Attribution to APT28 based on TTPs and infrastructure overlap.',
        risk_level: 'Critical',
        status: 'Active',
        created_by: 'Omar Al-Mansour',
        created_at: new Date(BASE_TIME - 1209600000).toISOString(),
        threat_actor: 'APT28 (Fancy Bear)',
        pattern_type: 'Targeted Espionage',
        l3_notes: 'Ongoing campaign with high confidence attribution. Attackers using zero-day vulnerabilities. Recommend immediate patching and enhanced monitoring, Strong correlation with recent geopolitical events.',
        misp_ioc_matches: {
            ips: [
                '45.142.120.10',
                '193.106.191.77',
                '45.155.205.93',
                '91.214.124.143'
            ],
            domains: [
                'secure-login-portal.com',
                'update-microsoft-security.net',
                'verify-account-now.org',
                'corporate-mail-service.com'
            ],
            hashes: [
                'a1b2c3d4e5f6789012345678901234567890abcd',
                'f1e2d3c4b5a6987654321098765432109876fedc',
                '1a2b3c4d5e6f7890abcdef1234567890abcdef12'
            ],
            emails: [
                'security@verify-account-now.org',
                'noreply@update-microsoft-security.net',
                'admin@corporate-mail-service.com'
            ]
        },
        related_incidents: ['INC-2024-002', 'INC-2024-006'],
        mitre_tactics: [
            'TA0001 - Initial Access',
            'TA0002 - Execution',
            'TA0003 - Persistence',
            'TA0004 - Privilege Escalation',
            'TA0006 - Credential Access',
            'TA0011 - Command and Control'
        ]
    },
    {
        campaign_id: 'CAMP-2024-002',
        name: 'CryptoHeist Campaign',
        description: 'Large-scale ransomware campaign using LockBit 3.0 variant. Multiple organizations targeted across sectors. Affiliate-based distribution model with varying initial access methods.',
        risk_level: 'High',
        status: 'Monitoring',
        created_by: 'Layla Al-Dosari',
        created_at: new Date(BASE_TIME - 2592000000).toISOString(),
        threat_actor: 'LockBit Ransomware Group',
        pattern_type: 'Ransomware-as-a-Service',
        l3_notes: 'Campaign activity decreased after law enforcement action. Continue monitoring for resurgence. Affiliates may rebrand and continue operations. Focus on detection of lateral movement patterns.',
        misp_ioc_matches: {
            ips: [
                '185.220.101.45',
                '45.142.120.10',
                '91.214.124.143'
            ],
            domains: [
                'lockbit3nego.onion',
                'lockbit3decrypt.onion'
            ],
            hashes: [
                'lockbit3_payload_sha256_hash_example_1234567890',
                'lockbit3_dropper_hash_abcdef1234567890abcdef',
                'lockbit3_ransomware_binary_hash_fedcba098765'
            ],
            emails: [
                'support@lockbitsupp.onion'
            ]
        },
        related_incidents: ['INC-2024-001'],
        mitre_tactics: [
            'TA0001 - Initial Access',
            'TA0002 - Execution',
            'TA0003 - Persistence',
            'TA0008 - Lateral Movement',
            'TA0011 - Command and Control',
            'TA0040 - Impact'
        ]
    },
    {
        campaign_id: 'CAMP-2024-003',
        name: 'Mobile Banking Trojan Wave',
        description: 'Distribution of Android banking trojan targeting Middle East financial apps. Malware distributed via phishing SMS and malicious ads. Credential theft and SMS interception capabilities.',
        risk_level: 'High',
        status: 'Active',
        created_by: 'Omar Al-Mansour',
        created_at: new Date(BASE_TIME - 1814400000).toISOString(),
        threat_actor: 'FluBot Gang',
        pattern_type: 'Mobile Malware Campaign',
        l3_notes: 'New variant detected with enhanced evasion techniques. Coordinate with mobile security team. Recommend user awareness training on SMS phishing. Monitor app stores for malicious banking apps.',
        misp_ioc_matches: {
            ips: [
                '203.0.113.42',
                '198.51.100.88'
            ],
            domains: [
                'bankapp-update.com',
                'mobile-banking-secure.net',
                'verify-mobile-bank.org'
            ],
            hashes: [
                'flubot_android_apk_hash_1234567890abcdef',
                'flubot_variant2_hash_fedcba0987654321'
            ],
            emails: []
        },
        related_incidents: [],
        mitre_tactics: [
            'TA0001 - Initial Access',
            'TA0002 - Execution',
            'TA0006 - Credential Access',
            'TA0009 - Collection',
            'TA0011 - Command and Control'
        ]
    },
    {
        campaign_id: 'CAMP-2024-004',
        name: 'Supply Chain Cryptominer',
        description: 'Cryptomining malware distributed through compromised third-party software updates. Affects multiple organizations using popular IT management tools. Low detectability, high persistence.',
        risk_level: 'Medium',
        status: 'Resolved',
        created_by: 'Layla Al-Dosari',
        created_at: new Date(BASE_TIME - 3456000000).toISOString(),
        threat_actor: 'Unknown (Financially Motivated)',
        pattern_type: 'Supply Chain Compromise',
        l3_notes: 'Campaign resolved after vendor patched compromised update server. All affected customers notified. Lessons learned documented for supply chain risk management. Similar tactics may reemerge.',
        misp_ioc_matches: {
            ips: [
                '185.220.101.45',
                '104.244.72.115'
            ],
            domains: [
                'mining-pool-xmr.com',
                'crypto-pool-monero.net'
            ],
            hashes: [
                'xmrig_miner_embedded_hash_abcdef123456',
                'cryptominer_payload_hash_fedcba987654'
            ],
            emails: []
        },
        related_incidents: ['INC-2024-004'],
        mitre_tactics: [
            'TA0001 - Initial Access',
            'TA0002 - Execution',
            'TA0003 - Persistence',
            'TA0011 - Command and Control',
            'TA0040 - Impact'
        ]
    },
    {
        campaign_id: 'CAMP-2024-005',
        name: 'BEC Impersonation Scheme',
        description: 'Business Email Compromise campaign imit ating executives and vendors. Social engineering-based with no malware. Wire transfer fraud targeting finance departments.',
        risk_level: 'Medium',
        status: 'Monitoring',
        created_by: 'Omar Al-Mansour',
        created_at: new Date(BASE_TIME - 2419200000).toISOString(),
        threat_actor: 'West African BEC Group',
        pattern_type: 'Business Email Compromise',
        l3_notes: 'No technical IOCs - purely social engineering. Train finance staff on verification procedures. Implement out-of-band confirmation for large wire transfers. Monitor for lookalike domains.',
        misp_ioc_matches: {
            ips: [],
            domains: [
                'companyname-inc.com',
                'executivename-office.net'
            ],
            hashes: [],
            emails: [
                'ceo@companyname-inc.com',
                'cfo@executivename-office.net'
            ]
        },
        related_incidents: [],
        mitre_tactics: [
            'TA0001 - Initial Access',
            'TA0009 - Collection'
        ]
    }
];

// Generate realistic threat analysis based on campaign MITRE tactics
function generateThreatAnalysis(campaign: Campaign): ThreatHuntingAnalysis {
    const firstTactic = campaign.mitre_tactics[0] || 'TA0001 - Initial Access';
    const tacticMap: Record<string, any> = {
        'TA0001': {
            id: 'T1566.001',
            name: 'Spearphishing Attachment',
            impact: 'Initial Access',
            description: 'Adversaries send spearphishing emails with malicious attachments to gain initial access.',
            detection: [
                'Monitor email gateway for suspicious attachments',
                'Analyze email headers for spoofing indicators',
                'Sandboxing of email attachments',
                'User-reported phishing analysis'
            ],
            ttp_next: [
                'T1204.002 - User Execution: Malicious File',
                'T1059.001 - PowerShell execution',
                'T1547.001 - Registry Run Keys for persistence'
            ],
            indicators: [
                'Emails from recently registered domains',
                'Attachments with double extensions',
                'Macro-enabled documents from external sources'
            ]
        },
        'TA0002': {
            id: 'T1059.001',
            name: 'PowerShell',
            impact: 'Execution',
            description: 'Adversaries abuse PowerShell to execute commands and scripts.',
            detection: [
                'PowerShell logging and monitoring',
                'Script block logging analysis',
                'Behavioral detection of obfuscated commands',
                'Parent-child process relationship monitoring'
            ],
            ttp_next: [
                'T1003.001 - LSASS Memory dumping',
                'T1059.003 - Windows Command Shell',
                'T1071.001 - C2 over web protocols'
            ],
            indicators: [
                'Base64-encoded PowerShell commands',
                'Download cradles (IEX, Invoke-WebRequest)',
                'Uncommon parent processes spawning PowerShell'
            ]
        },
        'TA0003': {
            id: 'T1547.001',
            name: 'Registry Run Keys / Startup Folder',
            impact: 'Persistence',
            description: 'Adversaries achieve persistence by adding programs to startup locations.',
            detection: [
                'Monitor registry key modifications',
                'Baseline startup folder contents',
                'Alert on new autoruns entries',
                'Sysmon Event ID 13 monitoring'
            ],
            ttp_next: [
                'T1055 - Process Injection',
                'T1543.003 - Windows Service creation',
                'T1053.005 - Scheduled Task persistence'
            ],
            indicators: [
                'Modifications to Run/RunOnce registry keys',
                'New files in startup folders',
                'Suspicious scheduled tasks'
            ]
        },
        'TA0004': {
            id: 'T1068',
            name: 'Exploitation for Privilege Escalation',
            impact: 'Privilege Escalation',
            description: 'Adversaries exploit software vulnerabilities to elevate privileges.',
            detection: [
                'Monitor for unexpected privilege changes',
                'Vulnerability scanning and patching',
                'User Account Control (UAC) bypass detection',
                'Kernel exploit detection via endpoint monitoring'
            ],
            ttp_next: [
                'T1003.001 - Credential Dumping',
                'T1078.003 - Local Accounts abuse',
                'T1136 - Create Account for persistence'
            ],
            indicators: [
                'Processes running with unexpected privileges',
                'Known CVE exploitation attempts',
                'Modifications to access tokens'
            ]
        },
        'TA0006': {
            id: 'T1003.001',
            name: 'LSASS Memory',
            impact: 'Credential Access',
            description: 'Adversaries access LSASS process memory to obtain credentials.',
            detection: [
                'Monitor LSASS process access',
                'Detect credential dumping tools (Mimikatz)',
                'Alert on suspicious process injection',
                'EDR behavioral detection'
            ],
            ttp_next: [
                'T1021.002 - SMB/Windows Admin Shares lateral movement',
                'T1550.002 - Pass the Hash',
                'T1078 - Valid Accounts usage'
            ],
            indicators: [
                'Suspicious LSASS process access',
                'Known credential dumping tool signatures',
                'LSASS memory dumps'
            ]
        },
        'TA0008': {
            id: 'T1021.002',
            name: 'SMB/Windows Admin Shares',
            impact: 'Lateral Movement',
            description: 'Adversaries use SMB to move laterally across network.',
            detection: [
                'Monitor SMB traffic patterns',
                'Detect admin share enumeration',
                'Alert on unusual logon patterns',
                'Track remote service  creation'
            ],
            ttp_next: [
                'T1569.002 - Service Execution',
                'T1053.005 - Scheduled Task on remote systems',
                'T1047 - WMI for remote execution'
            ],
            indicators: [
                'ADMIN$ share access from unusual hosts',
                'Spike in SMB connections',
                'Service installations on multiple hosts'
            ]
        },
        'TA0009': {
            id: 'T1005',
            name: 'Data from Local System',
            impact: 'Collection',
            description: 'Adversaries search and collect data from local system sources.',
            detection: [
                'File access monitoring',
                'Detect mass file reading operations',
                'Monitor for archiving tools',
                'Track sensitive file access'
            ],
            ttp_next: [
                'T1560.001 - Archive via utility',
                'T1041 - Exfiltration Over C2 Channel',
                'T1071.001 - Web-based exfiltration'
            ],
            indicators: [
                'Access to sensitive directories',
                'Use of archiving utilities (7zip, WinRAR)',
                'Large file operations'
            ]
        },
        'TA0011': {
            id: 'T1071.001',
            name: 'Web Protocols',
            impact: 'Command and Control',
            description: 'Adversaries use web protocols for C2 communications.',
            detection: [
                'SSL/TLS inspection',
                'Detect beaconing behavior',
                'Monitor for C2 domain IOCs',
                'Analyze HTTP/HTTPS traffic patterns'
            ],
            ttp_next: [
                'T1041 - Exfiltration Over C2',
                'T1105 - Ingress Tool Transfer',
                'T1219 - Remote Access Software'
            ],
            indicators: [
                'Regular beaconing to external IPs',
                'Communication with known malicious domains',
                'Unusual user-agent strings'
            ]
        },
        'TA0040': {
            id: 'T1486',
            name: 'Data Encrypted for Impact',
            impact: 'Impact',
            description: 'Adversaries encrypt data to disrupt availability and/or extort payment.',
            detection: [
                'Monitor for mass file encryption',
                'Detect ransomware signatures',
                'Alert on unusual file extension changes',
                'Behavioral ransomware detection'
            ],
            ttp_next: [
                'T1491 - Defacement',
                'T1490 - Inhibit System Recovery',
                'T1489 - Service Stop of backups'
            ],
            indicators: [
                'Rapid file modifications across system',
                'Ransom notes (README.txt, HOW_TO_DECRYPT)',
                'Known ransomware file extensions'
            ]
        }
    };

    const tacticCode = firstTactic.substring(0, 6);
    const tacticInfo = tacticMap[tacticCode] || tacticMap['TA0001'];

    const riskScore = campaign.risk_level === 'Critical' ? 95 :
        campaign.risk_level === 'High' ? 85 :
            campaign.risk_level === 'Medium' ? 70 : 55;

    const attackProb = campaign.status === 'Active' ?
        (campaign.risk_level === 'Critical' ? 92 : 78) :
        (campaign.status === 'Monitoring' ? 55 : 25);

    return {
        technique_id: tacticInfo.id,
        technique_name: tacticInfo.name,
        threat_impact: tacticInfo.impact,
        ai_confidence: riskScore,
        technique_description: tacticInfo.description,
        detection_strategies: tacticInfo.detection,
        ttp_prediction: tacticInfo.ttp_next,
        attack_probability_score: attackProb,
        early_indicators: tacticInfo.indicators,
        recommended_action: campaign.status === 'Active' ?
            `Immediate threat - Deploy enhanced monitoring for ${tacticInfo.name}. Isolate affected systems and hunt for IOCs across environment.` :
            `Monitor for escalation indicators. Review logs for ${tacticInfo.name} patterns. Update detection rules.`
    };
}

// Add threat analysis to all campaigns
mockCampaigns.forEach(campaign => {
    campaign.threat_analysis = generateThreatAnalysis(campaign);
});

// Helper functions

export const getCampaignById = (id: string): Campaign | undefined => {
    return mockCampaigns.find(campaign => campaign.campaign_id === id);
};

export const getCampaignsByStatus = (status: CampaignStatus): Campaign[] => {
    return mockCampaigns.filter(campaign => campaign.status === status);
};

export const getActiveCampaigns = (): Campaign[] => {
    return mockCampaigns.filter(campaign => campaign.status === 'Active' || campaign.status === 'Monitoring');
};

export const getCampaignsByRiskLevel = (riskLevel: RiskLevel): Campaign[] => {
    return mockCampaigns.filter(campaign => campaign.risk_level === riskLevel);
};
