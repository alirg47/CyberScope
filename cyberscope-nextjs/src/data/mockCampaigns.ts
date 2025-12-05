// Campaign Types and Interfaces
export interface MISPIndicators {
    ips: string[];
    domains: string[];
    hashes: string[];
    emails: string[];
}

export type CampaignStatus = 'Active' | 'Monitoring' | 'Resolved' | 'False Positive';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

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
}

// Mock Campaign Data (L3 threat hunting)
export const mockCampaigns: Campaign[] = [
    {
        campaign_id: 'CAMP-2024-001',
        name: 'Operation Silent Phoenix',
        description: 'Advanced persistent threat campaign targeting financial institutions. Sophisticated spearphishing with custom malware. Attribution to APT28 based on TTPs and infrastructure overlap.',
        risk_level: 'Critical',
        status: 'Active',
        created_by: 'Omar Al-Mansour',
        created_at: new Date(Date.now() - 1209600000).toISOString(),
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
        created_at: new Date(Date.now() - 2592000000).toISOString(),
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
        created_at: new Date(Date.now() - 1814400000).toISOString(),
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
        created_at: new Date(Date.now() - 3456000000).toISOString(),
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
        created_at: new Date(Date.now() - 2419200000).toISOString(),
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
