// L2 Dashboard - Incident Investigation Visualizations Mock Data

export interface TimelineEvent {
    id: string;
    type: 'alert' | 'login' | 'anomaly' | 'network' | 'file';
    timestamp: string;
    time: number; // Unix timestamp for sorting
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
    user?: string;
    host?: string;
}

export interface CorrelationNode {
    id: string;
    label: string;
    type: 'user' | 'host' | 'ip' | 'alert' | 'file';
    risk: 'Critical' | 'High' | 'Medium' | 'Low';
    x: number;
    y: number;
}

export interface CorrelationEdge {
    source: string;
    target: string;
    strength: number; // 1-10
    type: string;
}

export interface IncidentStatusData {
    status: string;
    count: number;
    color: string;
}

export interface UserAnomalyData {
    category: string;
    value: number;
    max: number;
}

// Incident Timeline - Events for a specific incident investigation
export const incidentTimelineData: TimelineEvent[] = [
    {
        id: 'evt-001',
        type: 'alert',
        timestamp: '2024-12-01 08:15:23',
        time: 1733041523000,
        description: 'Multiple failed login attempts detected',
        severity: 'High',
        user: 'admin',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-002',
        type: 'login',
        timestamp: '2024-12-01 08:18:45',
        time: 1733041725000,
        description: 'Failed login from unusual location',
        severity: 'Medium',
        user: 'admin',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-003',
        type: 'anomaly',
        timestamp: '2024-12-01 08:22:12',
        time: 1733041932000,
        description: 'Unusual login time detected (outside business hours)',
        severity: 'Medium',
        user: 'admin',
    },
    {
        id: 'evt-004',
        type: 'login',
        timestamp: '2024-12-01 08:25:34',
        time: 1733042134000,
        description: 'Successful login after 15 failed attempts',
        severity: 'Critical',
        user: 'admin',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-005',
        type: 'network',
        timestamp: '2024-12-01 08:27:56',
        time: 1733042276000,
        description: 'Large data transfer to external IP',
        severity: 'Critical',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-006',
        type: 'file',
        timestamp: '2024-12-01 08:30:18',
        time: 1733042418000,
        description: 'Sensitive file access detected',
        severity: 'High',
        user: 'admin',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-007',
        type: 'alert',
        timestamp: '2024-12-01 08:32:45',
        time: 1733042565000,
        description: 'Data exfiltration attempt detected',
        severity: 'Critical',
        user: 'admin',
        host: 'WS-FINANCE-01',
    },
    {
        id: 'evt-008',
        type: 'network',
        timestamp: '2024-12-01 08:35:12',
        time: 1733042712000,
        description: 'Connection to known C2 server',
        severity: 'Critical',
        host: 'WS-FINANCE-01',
    },
];

// Correlation Graph - Nodes and Edges
export const correlationNodes: CorrelationNode[] = [
    { id: 'user-1', label: 'admin', type: 'user', risk: 'Critical', x: 250, y: 150 },
    { id: 'user-2', label: 'jdoe', type: 'user', risk: 'Medium', x: 150, y: 250 },
    { id: 'host-1', label: 'WS-FINANCE-01', type: 'host', risk: 'Critical', x: 400, y: 150 },
    { id: 'host-2', label: 'SRV-DB-02', type: 'host', risk: 'High', x: 400, y: 300 },
    { id: 'ip-1', label: '185.220.101.45', type: 'ip', risk: 'Critical', x: 550, y: 100 },
    { id: 'ip-2', label: '203.0.113.78', type: 'ip', risk: 'High', x: 550, y: 250 },
    { id: 'alert-1', label: 'Brute Force', type: 'alert', risk: 'High', x: 250, y: 50 },
    { id: 'alert-2', label: 'Data Exfil', type: 'alert', risk: 'Critical', x: 550, y: 400 },
    { id: 'file-1', label: 'finance.xlsx', type: 'file', risk: 'Medium', x: 300, y: 350 },
];

export const correlationEdges: CorrelationEdge[] = [
    { source: 'user-1', target: 'host-1', strength: 9, type: 'login' },
    { source: 'user-1', target: 'alert-1', strength: 8, type: 'triggered' },
    { source: 'host-1', target: 'ip-1', strength: 10, type: 'connection' },
    { source: 'host-1', target: 'alert-2', strength: 9, type: 'triggered' },
    { source: 'host-1', target: 'file-1', strength: 7, type: 'accessed' },
    { source: 'user-2', target: 'host-2', strength: 5, type: 'login' },
    { source: 'host-2', target: 'ip-2', strength: 6, type: 'connection' },
    { source: 'ip-1', target: 'alert-2', strength: 8, type: 'related' },
];

// Incident Status Distribution
export const incidentStatusData: IncidentStatusData[] = [
    { status: 'Open', count: 23, color: '#ef4444' },
    { status: 'In Progress', count: 45, color: '#f59e0b' },
    { status: 'Escalated to L3', count: 12, color: '#bc13fe' },
    { status: 'Closed', count: 156, color: '#10b981' },
];

// User Activity Anomaly - Radar Chart Data
export const userAnomalyData: UserAnomalyData[] = [
    { category: 'Failed Logins', value: 85, max: 100 },
    { category: 'Unusual Time', value: 72, max: 100 },
    { category: 'Network Spikes', value: 65, max: 100 },
    { category: 'Script Execution', value: 78, max: 100 },
    { category: 'File Access', value: 58, max: 100 },
    { category: 'Privilege Escalation', value: 45, max: 100 },
];

// Helper to get event type color
export const getEventTypeColor = (type: string): string => {
    switch (type) {
        case 'alert':
            return '#ff003c';
        case 'login':
            return '#00f3ff';
        case 'anomaly':
            return '#ffb800';
        case 'network':
            return '#bc13fe';
        case 'file':
            return '#00ff9d';
        default:
            return '#3b82f6';
    }
};

// Helper to get node color by type
export const getNodeColor = (type: string, risk: string): string => {
    const riskColors: Record<string, string> = {
        Critical: '#ff003c',
        High: '#ffb800',
        Medium: '#eab308',
        Low: '#00ff9d',
    };
    return riskColors[risk] || '#00f3ff';
};
