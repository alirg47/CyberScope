// L3 Dashboard - Threat Hunting Visualizations Mock Data

export interface CampaignTrendData {
    date: string;
    timestamp: number;
    detections: number;
    campaigns: string[];
    [key: string]: any;
}

export interface IOCMatchData {
    type: string;
    count: number;
    color: string;
    [key: string]: any;
}

export interface MITRETacticData {
    tactic: string;
    techniques: string[];
    detections: number;
    intensity: number; // 0-100 for heatmap color
    [key: string]: any;
}

export interface PatternNode {
    id: string;
    label: string;
    type: 'user' | 'host' | 'ip' | 'alert' | 'incident' | 'ioc' | 'campaign';
    risk: 'Critical' | 'High' | 'Medium' | 'Low';
    size: number;
    x: number;
    y: number;
}

export interface PatternEdge {
    source: string;
    target: string;
    strength: number;
    type: string;
}

// Threat Campaign Trend - Multi-week data
export const campaignTrendData: CampaignTrendData[] = [
    {
        date: 'Nov 1',
        timestamp: 1698796800000,
        detections: 12,
        campaigns: ['APT29'],
    },
    {
        date: 'Nov 3',
        timestamp: 1698969600000,
        detections: 15,
        campaigns: ['APT29', 'Lazarus'],
    },
    {
        date: 'Nov 5',
        timestamp: 1699142400000,
        detections: 23,
        campaigns: ['APT29', 'Lazarus'],
    },
    {
        date: 'Nov 7',
        timestamp: 1699315200000,
        detections: 18,
        campaigns: ['Lazarus'],
    },
    {
        date: 'Nov 9',
        timestamp: 1699488000000,
        detections: 28,
        campaigns: ['APT29', 'Lazarus', 'Kimsuky'],
    },
    {
        date: 'Nov 11',
        timestamp: 1699660800000,
        detections: 34,
        campaigns: ['APT29', 'Lazarus', 'Kimsuky'],
    },
    {
        date: 'Nov 13',
        timestamp: 1699833600000,
        detections: 42,
        campaigns: ['APT29', 'Lazarus', 'Kimsuky', 'APT28'],
    },
    {
        date: 'Nov 15',
        timestamp: 1700006400000,
        detections: 38,
        campaigns: ['Lazarus', 'Kimsuky', 'APT28'],
    },
    {
        date: 'Nov 17',
        timestamp: 1700179200000,
        detections: 45,
        campaigns: ['APT29', 'Kimsuky', 'APT28'],
    },
    {
        date: 'Nov 19',
        timestamp: 1700352000000,
        detections: 52,
        campaigns: ['APT29', 'Lazarus', 'Kimsuky', 'APT28'],
    },
    {
        date: 'Nov 21',
        timestamp: 1700524800000,
        detections: 48,
        campaigns: ['APT29', 'APT28'],
    },
    {
        date: 'Nov 23',
        timestamp: 1700697600000,
        detections: 41,
        campaigns: ['APT29', 'APT28'],
    },
    {
        date: 'Nov 25',
        timestamp: 1700870400000,
        detections: 35,
        campaigns: ['APT28'],
    },
    {
        date: 'Nov 27',
        timestamp: 1701043200000,
        detections: 29,
        campaigns: ['APT28', 'Kimsuky'],
    },
    {
        date: 'Nov 29',
        timestamp: 1701216000000,
        detections: 32,
        campaigns: ['APT29', 'Kimsuky'],
    },
    {
        date: 'Dec 1',
        timestamp: 1701388800000,
        detections: 38,
        campaigns: ['APT29', 'Lazarus', 'Kimsuky'],
    },
];

// IOC Matches Breakdown
export const iocMatchesData: IOCMatchData[] = [
    { type: 'Malicious IPs', count: 342, color: '#ff003c' },
    { type: 'Suspicious Domains', count: 267, color: '#ffb800' },
    { type: 'Malicious URLs', count: 198, color: '#eab308' },
    { type: 'File Hashes', count: 156, color: '#bc13fe' },
    { type: 'Email Addresses', count: 89, color: '#00f3ff' },
    { type: 'Registry Keys', count: 67, color: '#10b981' },
];

// MITRE ATT&CK Heatmap Data
export const mitreAttackData: MITRETacticData[] = [
    {
        tactic: 'Initial Access',
        techniques: ['T1566.001', 'T1190', 'T1133'],
        detections: 89,
        intensity: 85,
    },
    {
        tactic: 'Execution',
        techniques: ['T1059.001', 'T1059.003', 'T1204.002'],
        detections: 156,
        intensity: 95,
    },
    {
        tactic: 'Persistence',
        techniques: ['T1547.001', 'T1053.005', 'T1136.001'],
        detections: 67,
        intensity: 65,
    },
    {
        tactic: 'Privilege Escalation',
        techniques: ['T1068', 'T1078', 'T1055'],
        detections: 45,
        intensity: 45,
    },
    {
        tactic: 'Defense Evasion',
        techniques: ['T1070.004', 'T1562.001', 'T1027'],
        detections: 123,
        intensity: 80,
    },
    {
        tactic: 'Credential Access',
        techniques: ['T1110.001', 'T1003.001', 'T1555'],
        detections: 98,
        intensity: 75,
    },
    {
        tactic: 'Discovery',
        techniques: ['T1083', 'T1087', 'T1018'],
        detections: 134,
        intensity: 88,
    },
    {
        tactic: 'Lateral Movement',
        techniques: ['T1021.001', 'T1021.002', 'T1550'],
        detections: 56,
        intensity: 55,
    },
    {
        tactic: 'Collection',
        techniques: ['T1005', 'T1039', 'T1114'],
        detections: 78,
        intensity: 70,
    },
    {
        tactic: 'Exfiltration',
        techniques: ['T1041', 'T1048', 'T1567'],
        detections: 34,
        intensity: 40,
    },
    {
        tactic: 'Command & Control',
        techniques: ['T1071.001', 'T1573', 'T1095'],
        detections: 112,
        intensity: 82,
    },
    {
        tactic: 'Impact',
        techniques: ['T1486', 'T1490', 'T1491'],
        detections: 23,
        intensity: 30,
    },
];

// Suspicious Pattern Map - Complex correlation network
export const patternNodes: PatternNode[] = [
    // Campaigns
    { id: 'camp-1', label: 'APT29', type: 'campaign', risk: 'Critical', size: 40, x: 400, y: 200 },
    { id: 'camp-2', label: 'Lazarus', type: 'campaign', risk: 'Critical', size: 35, x: 600, y: 200 },

    // IOCs
    { id: 'ioc-1', label: '185.220.101.45', type: 'ioc', risk: 'Critical', size: 30, x: 300, y: 100 },
    { id: 'ioc-2', label: 'evil.com', type: 'ioc', risk: 'High', size: 25, x: 500, y: 100 },
    { id: 'ioc-3', label: 'malware.exe', type: 'ioc', risk: 'Critical', size: 28, x: 700, y: 100 },

    // Incidents
    { id: 'inc-1', label: 'INC-2024-045', type: 'incident', risk: 'Critical', size: 32, x: 250, y: 300 },
    { id: 'inc-2', label: 'INC-2024-067', type: 'incident', risk: 'High', size: 28, x: 550, y: 300 },

    // Hosts
    { id: 'host-1', label: 'WS-FINANCE-01', type: 'host', risk: 'Critical', size: 26, x: 200, y: 400 },
    { id: 'host-2', label: 'SRV-DB-02', type: 'host', risk: 'High', size: 24, x: 400, y: 400 },
    { id: 'host-3', label: 'WS-HR-05', type: 'host', risk: 'Medium', size: 20, x: 600, y: 400 },

    // Users
    { id: 'user-1', label: 'admin', type: 'user', risk: 'Critical', size: 28, x: 150, y: 500 },
    { id: 'user-2', label: 'jdoe', type: 'user', risk: 'Medium', size: 22, x: 350, y: 500 },
    { id: 'user-3', label: 'ssmith', type: 'user', risk: 'High', size: 24, x: 550, y: 500 },

    // Alerts
    { id: 'alert-1', label: 'Brute Force', type: 'alert', risk: 'High', size: 24, x: 100, y: 200 },
    { id: 'alert-2', label: 'Data Exfil', type: 'alert', risk: 'Critical', size: 26, x: 750, y: 300 },
];

export const patternEdges: PatternEdge[] = [
    // Campaign to IOC relationships
    { source: 'camp-1', target: 'ioc-1', strength: 10, type: 'uses' },
    { source: 'camp-1', target: 'ioc-2', strength: 9, type: 'uses' },
    { source: 'camp-2', target: 'ioc-3', strength: 10, type: 'uses' },
    { source: 'camp-2', target: 'ioc-1', strength: 7, type: 'uses' },

    // Campaign to Incident relationships
    { source: 'camp-1', target: 'inc-1', strength: 9, type: 'attributed' },
    { source: 'camp-2', target: 'inc-2', strength: 8, type: 'attributed' },

    // Incident to Host relationships
    { source: 'inc-1', target: 'host-1', strength: 10, type: 'affected' },
    { source: 'inc-1', target: 'host-2', strength: 7, type: 'affected' },
    { source: 'inc-2', target: 'host-3', strength: 8, type: 'affected' },

    // Host to User relationships
    { source: 'host-1', target: 'user-1', strength: 9, type: 'compromised' },
    { source: 'host-2', target: 'user-2', strength: 6, type: 'accessed' },
    { source: 'host-3', target: 'user-3', strength: 7, type: 'compromised' },

    // Alert relationships
    { source: 'alert-1', target: 'user-1', strength: 8, type: 'triggered' },
    { source: 'alert-2', target: 'host-1', strength: 9, type: 'triggered' },
    { source: 'alert-1', target: 'inc-1', strength: 8, type: 'escalated' },
    { source: 'alert-2', target: 'inc-2', strength: 9, type: 'escalated' },

    // IOC to Host relationships
    { source: 'ioc-1', target: 'host-1', strength: 10, type: 'detected' },
    { source: 'ioc-2', target: 'host-2', strength: 7, type: 'detected' },
    { source: 'ioc-3', target: 'host-3', strength: 8, type: 'detected' },
];

// Helper to get intensity color for heatmap
export const getIntensityColor = (intensity: number): string => {
    if (intensity >= 80) return '#ff003c'; // Critical
    if (intensity >= 60) return '#ffb800'; // High
    if (intensity >= 40) return '#eab308'; // Medium
    if (intensity >= 20) return '#00ff9d'; // Low
    return '#00f3ff'; // Info
};

// Helper to get node color by type and risk
export const getPatternNodeColor = (type: string, risk: string): string => {
    const riskColors: Record<string, string> = {
        Critical: '#ff003c',
        High: '#ffb800',
        Medium: '#eab308',
        Low: '#00ff9d',
    };
    return riskColors[risk] || '#00f3ff';
};
