// MISP Threat Intelligence Data Types and Interfaces

export interface IOCData {
    malicious: boolean;
    confidence: number;
    firstSeen: string;
    lastSeen: string;
    tags: string[];
    threatActor?: string;
    campaigns?: string[];
    description: string;
    type?: string;
    fileName?: string;
    fileSize?: string;
    malwareFamily?: string;
}

export interface ThreatActor {
    name: string;
    aliases?: string[];
    origin: string;
    attribution?: string;
    motivation: string;
    sophistication: string;
    firstSeen: string;
    targetSectors: string[];
    targetRegions: string[];
    ttps: string[];
    recentActivity: string;
    knownTools: string[];
    mitigations: string[];
}

export interface Campaign {
    name: string;
    threatActor: string;
    startDate: string;
    status: string;
    targetSectors: string[];
    targetRegions: string[];
    victims: number;
    description: string;
    tactics: string[];
    iocs: string[];
}

export interface MalwareFamily {
    name: string;
    type: string;
    family: string;
    firstSeen: string;
    sophistication: string;
    capabilities: string[];
    indicators: string[];
    mitigation: string[];
}

export interface MISPData {
    iocs: {
        ips: Record<string, IOCData>;
        domains: Record<string, IOCData>;
        hashes: Record<string, IOCData>;
        emails: Record<string, IOCData>;
    };
    threatActors: Record<string, ThreatActor>;
    campaigns: Record<string, Campaign>;
    malwareFamilies: Record<string, MalwareFamily>;
}

// Mock MISP Threat Intelligence Data
export const mockMISPData: MISPData = {
    // IOC Database
    iocs: {
        ips: {
            '45.142.120.10': {
                malicious: true,
                confidence: 95,
                firstSeen: '2024-01-15',
                lastSeen: '2024-11-28',
                tags: ['malware-distribution', 'c2-server', 'cerber-ransomware'],
                threatActor: 'TA505',
                campaigns: ['Cerber-Campaign-2024'],
                description: 'Known Cerber ransomware C2 server. Active distribution of ransomware payloads.'
            },
            '193.106.191.77': {
                malicious: true,
                confidence: 90,
                firstSeen: '2023-08-20',
                lastSeen: '2024-11-27',
                tags: ['apt28', 'reconnaissance', 'targeting'],
                threatActor: 'APT28 (Fancy Bear)',
                campaigns: ['APT28-2024-EMEA'],
                description: 'Infrastructure associated with APT28. Used for reconnaissance and initial access operations.'
            },
            '45.155.205.93': {
                malicious: true,
                confidence: 85,
                firstSeen: '2024-10-01',
                lastSeen: '2024-11-29',
                tags: ['brute-force', 'credential-stuffing'],
                threatActor: 'Unknown',
                campaigns: ['Credential-Stuffing-2024'],
                description: 'VPN exit node used for credential stuffing attacks across multiple sectors.'
            }
        },

        domains: {
            'malicious-login-page.xyz': {
                malicious: true,
                confidence: 98,
                firstSeen: '2024-11-01',
                lastSeen: '2024-11-29',
                tags: ['phishing', 'credential-harvesting', 'microsoft-impersonation'],
                threatActor: 'Unknown',
                campaigns: ['Phishing-Campaign-Q4-2024'],
                description: 'Phishing domain impersonating Microsoft login page. High-quality credential harvesting operation.'
            },
            'update-security-now.com': {
                malicious: true,
                confidence: 92,
                firstSeen: '2024-09-15',
                lastSeen: '2024-11-28',
                tags: ['malware-delivery', 'social-engineering'],
                threatActor: 'TA505',
                campaigns: ['Cerber-Campaign-2024'],
                description: 'Fake security update site distributing Cerber ransomware.'
            }
        },

        hashes: {
            'a3c8f9d2e1b7a6c5d4e3f2a1b0c9d8e7': {
                malicious: true,
                confidence: 100,
                type: 'SHA256',
                fileName: 'update.exe',
                fileSize: '2.4 MB',
                malwareFamily: 'Cerber Ransomware',
                firstSeen: '2024-10-12',
                lastSeen: '2024-11-29',
                tags: ['ransomware', 'cerber', 'encryption'],
                threatActor: 'TA505',
                campaigns: ['Cerber-Campaign-2024'],
                description: 'Cerber ransomware payload. Fast encryption, network propagation capabilities.'
            },
            'b7d6e5f4a3c2b1a0d9e8f7a6b5c4d3e2': {
                malicious: true,
                confidence: 98,
                type: 'SHA256',
                fileName: 'invoice.pdf.exe',
                fileSize: '1.8 MB',
                malwareFamily: 'Emotet',
                firstSeen: '2024-08-05',
                lastSeen: '2024-11-15',
                tags: ['trojan', 'emotet', 'banking-malware'],
                threatActor: 'TA542',
                campaigns: ['Emotet-Resurgence-2024'],
                description: 'Emotet banking trojan. Module-based architecture, credential theft, spam distribution.'
            }
        },

        emails: {
            'noreply@micros0ft-security.com': {
                malicious: true,
                confidence: 95,
                firstSeen: '2024-11-20',
                lastSeen: '2024-11-29',
                tags: ['phishing', 'typosquatting', 'microsoft-impersonation'],
                campaigns: ['Phishing-Campaign-Q4-2024'],
                description: 'Typosquatting domain used in phishing campaigns impersonating Microsoft security alerts.'
            }
        }
    },

    // Threat Actor Profiles
    threatActors: {
        'TA505': {
            name: 'TA505',
            aliases: ['Hive0065', 'SectorJ04'],
            origin: 'Eastern Europe (suspected)',
            motivation: 'Financial gain',
            sophistication: 'High',
            firstSeen: '2014',
            targetSectors: ['Finance', 'Retail', 'Healthcare', 'Manufacturing'],
            targetRegions: ['North America', 'Europe', 'Asia'],
            ttps: [
                'Phishing emails with malicious attachments',
                'Cerber ransomware deployment',
                'Dridex banking trojan',
                'ServHelper backdoor',
                'FlawedGrace RAT'
            ],
            recentActivity: 'Active Q4 2024 - Large-scale Cerber ransomware campaign targeting SMBs',
            knownTools: ['Cerber', 'Dridex', 'ServHelper', 'FlawedGrace', 'SDBbot'],
            mitigations: [
                'Email filtering and sandboxing',
                'User security awareness training',
                'Endpoint detection and response',
                'Regular backup and recovery testing'
            ]
        },

        'APT28': {
            name: 'APT28',
            aliases: ['Fancy Bear', 'Sofacy', 'Sednit', 'Pawn Storm'],
            origin: 'Russia',
            attribution: 'GRU Unit 26165',
            motivation: 'Cyber espionage',
            sophistication: 'Very High',
            firstSeen: '2004',
            targetSectors: ['Government', 'Military', 'Defense', 'Aerospace', 'Media'],
            targetRegions: ['Europe', 'North America', 'Middle East'],
            ttps: [
                'Spear phishing',
                'Zero-day exploits',
                'Credential harvesting',
                'Custom malware development',
                'Supply chain compromise'
            ],
            recentActivity: 'Active 2024 - Targeting European government entities and NATO members',
            knownTools: ['X-Agent', 'Sofacy', 'Zebrocy', 'LoJax', 'Cannon'],
            mitigations: [
                'Network segmentation',
                'Privileged access management',
                'Threat hunting',
                'Supply chain security',
                'Advanced email security'
            ]
        },

        'APT29': {
            name: 'APT29',
            aliases: ['Cozy Bear', 'The Dukes', 'YTTRIUM'],
            origin: 'Russia',
            attribution: 'SVR (Foreign Intelligence Service)',
            motivation: 'Cyber espionage',
            sophistication: 'Very High',
            firstSeen: '2008',
            targetSectors: ['Government', 'Research', 'Think Tanks', 'Healthcare', 'Energy'],
            targetRegions: ['North America', 'Europe'],
            ttps: [
                'Stealth and persistence',
                'Cloud infrastructure exploitation',
                'Supply chain attacks',
                'Multi-stage malware',
                'Living-off-the-land techniques'
            ],
            recentActivity: 'Active 2024 - COVID-19 vaccine research targeting, SolarWinds follow-up operations',
            knownTools: ['WellMess', 'WellMail', 'SunBurst', 'Cobalt Strike'],
            mitigations: [
                'Cloud security hardening',
                'Code signing validation',
                'Behavioral analytics',
                'Zero trust architecture'
            ]
        },

        'Lazarus Group': {
            name: 'Lazarus Group',
            aliases: ['Hidden Cobra', 'Guardians of Peace', 'APT38'],
            origin: 'North Korea',
            attribution: 'RGB (Reconnaissance General Bureau)',
            motivation: 'Financial gain, cyber espionage, sabotage',
            sophistication: 'High',
            firstSeen: '2009',
            targetSectors: ['Finance', 'Cryptocurrency', 'Media', 'Defense'],
            targetRegions: ['Global'],
            ttps: [
                'Cryptocurrency exchange compromise',
                'SWIFT network attacks',
                'Destructive malware',
                'DDoS attacks',
                'Social engineering'
            ],
            recentActivity: 'Active 2024 - Cryptocurrency theft operations, targeting DeFi platforms',
            knownTools: ['WannaCry', 'FastCash', 'BeagleBoyz', 'AppleJeus'],
            mitigations: [
                'Cryptocurrency wallet security',
                'Payment system monitoring',
                'Endpoint hardening',
                'Incident response planning'
            ]
        }
    },

    // Campaign Information
    campaigns: {
        'Cerber-Campaign-2024': {
            name: 'Cerber Ransomware Campaign 2024',
            threatActor: 'TA505',
            startDate: '2024-09-01',
            status: 'Active',
            targetSectors: ['SMB', 'Healthcare', 'Education'],
            targetRegions: ['North America', 'Europe'],
            victims: 127,
            description: 'Large-scale ransomware campaign using phishing emails and fake security updates to distribute Cerber ransomware.',
            tactics: ['Phishing', 'Social Engineering', 'Ransomware'],
            iocs: ['45.142.120.10', 'update-security-now.com', 'a3c8f9d2e1b7a6c5d4e3f2a1b0c9d8e7']
        },

        'APT28-2024-EMEA': {
            name: 'APT28 EMEA Reconnaissance Campaign',
            threatActor: 'APT28',
            startDate: '2024-06-01',
            status: 'Active',
            targetSectors: ['Government', 'Defense', 'Critical Infrastructure'],
            targetRegions: ['Europe', 'Middle East'],
            victims: 43,
            description: 'Reconnaissance and initial access campaign targeting European and Middle Eastern government entities.',
            tactics: ['Reconnaissance', 'Spear Phishing', 'Credential Harvesting'],
            iocs: ['193.106.191.77']
        }
    },

    // Malware Families
    malwareFamilies: {
        'Cerber': {
            name: 'Cerber Ransomware',
            type: 'Ransomware',
            family: 'Cerber',
            firstSeen: '2016',
            sophistication: 'High',
            capabilities: [
                'File encryption (AES + RSA)',
                'Network propagation',
                'Anti-analysis techniques',
                'Ransom note deployment',
                'Voice ransom message',
                'TOR payment portal'
            ],
            indicators: [
                'File extensions: .cerber, .cerber2, .cerber3',
                'Ransom note: README.hta',
                'Voice file: HELP_YOUR_FILES.mp3',
                'Mutex: Global\\{Random-GUID}'
            ],
            mitigation: [
                'Regular backups',
                'Email filtering',
                'User training',
                'Endpoint protection',
                'Network segmentation'
            ]
        },

        'Emotet': {
            name: 'Emotet',
            type: 'Trojan',
            family: 'Emotet',
            firstSeen: '2014',
            sophistication: 'Very High',
            capabilities: [
                'Banking credential theft',
                'Email harvesting',
                'Spam distribution',
                'Payload distribution (Trickbot, Ryuk)',
                'Network spreading',
                'Polymorphic code'
            ],
            indicators: [
                'Process injection into explorer.exe',
                'Registry persistence',
                'C2 communication on ports 443, 8080',
                'PowerShell execution'
            ],
            mitigation: [
                'Email security',
                'Macro blocking',
                'Network monitoring',
                'EDR deployment',
                'Patch management'
            ]
        }
    }
};

// Helper function to enrich IOC
export function enrichIOC(iocValue: string, iocType: 'ip' | 'domain' | 'hash' | 'email' = 'ip'): IOCData & { found: boolean } {
    const iocDatabase = {
        ip: mockMISPData.iocs.ips,
        domain: mockMISPData.iocs.domains,
        hash: mockMISPData.iocs.hashes,
        email: mockMISPData.iocs.emails
    };

    const data = iocDatabase[iocType]?.[iocValue];

    if (data) {
        return {
            found: true,
            ...data
        };
    }

    return {
        found: false,
        malicious: false,
        confidence: 0,
        firstSeen: '',
        lastSeen: '',
        tags: [],
        description: 'No threat intelligence available for this IOC'
    };
}
