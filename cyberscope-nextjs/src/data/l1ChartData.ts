// L1 Dashboard - Alert Triage Visualizations Mock Data

export interface AlertTimeData {
  time: string;
  alerts: number;
  hour?: number;
  [key: string]: any;
}

export interface SeverityData {
  severity: string;
  count: number;
  color: string;
  [key: string]: any;
}

export interface SourceData {
  source: string;
  count: number;
  color: string;
  [key: string]: any;
}

export interface TopIPData {
  ip: string;
  count: number;
  country: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  [key: string]: any;
}

// Alerts Over Time - Hourly data for the last 24 hours
export const alertsOverTimeData: AlertTimeData[] = [
  { time: '00:00', alerts: 12, hour: 0 },
  { time: '01:00', alerts: 8, hour: 1 },
  { time: '02:00', alerts: 6, hour: 2 },
  { time: '03:00', alerts: 5, hour: 3 },
  { time: '04:00', alerts: 7, hour: 4 },
  { time: '05:00', alerts: 9, hour: 5 },
  { time: '06:00', alerts: 15, hour: 6 },
  { time: '07:00', alerts: 23, hour: 7 },
  { time: '08:00', alerts: 31, hour: 8 },
  { time: '09:00', alerts: 28, hour: 9 },
  { time: '10:00', alerts: 35, hour: 10 },
  { time: '11:00', alerts: 42, hour: 11 },
  { time: '12:00', alerts: 38, hour: 12 },
  { time: '13:00', alerts: 45, hour: 13 },
  { time: '14:00', alerts: 52, hour: 14 },
  { time: '15:00', alerts: 48, hour: 15 },
  { time: '16:00', alerts: 41, hour: 16 },
  { time: '17:00', alerts: 36, hour: 17 },
  { time: '18:00', alerts: 29, hour: 18 },
  { time: '19:00', alerts: 24, hour: 19 },
  { time: '20:00', alerts: 19, hour: 20 },
  { time: '21:00', alerts: 16, hour: 21 },
  { time: '22:00', alerts: 14, hour: 22 },
  { time: '23:00', alerts: 11, hour: 23 },
];

// Weekly view - last 7 days
export const alertsOverTimeWeekly: AlertTimeData[] = [
  { time: 'Mon', alerts: 245 },
  { time: 'Tue', alerts: 312 },
  { time: 'Wed', alerts: 289 },
  { time: 'Thu', alerts: 356 },
  { time: 'Fri', alerts: 423 },
  { time: 'Sat', alerts: 198 },
  { time: 'Sun', alerts: 167 },
];

// Alerts by Severity - Only 4 categories
export const alertsBySeverityData: SeverityData[] = [
  { severity: 'Critical', count: 30, color: '#dc2626' },  // Red
  { severity: 'High', count: 45, color: '#ea580c' },      // Orange
  { severity: 'Medium', count: 42, color: '#eab308' },    // Yellow
  { severity: 'Low', count: 33, color: '#22c55e' }        // Green
];

// Alert Sources Breakdown
export const alertSourcesData: SourceData[] = [
  { source: 'SIEM', count: 245, color: '#3b82f6' },
  { source: 'EDR', count: 189, color: '#8b5cf6' },
  { source: 'NDR', count: 156, color: '#00f3ff' },
  { source: 'Firewall', count: 134, color: '#f59e0b' },
  { source: 'XDR', count: 98, color: '#bc13fe' },
  { source: 'Email Gateway', count: 54, color: '#ef4444' },
];

// Top 10 Triggering IPs
export const topTriggeringIPsData: TopIPData[] = [
  { ip: '185.220.101.45', count: 342, country: 'RU', risk: 'Critical' },
  { ip: '203.0.113.78', count: 298, country: 'CN', risk: 'Critical' },
  { ip: '198.51.100.23', count: 267, country: 'IR', risk: 'High' },
  { ip: '192.0.2.156', count: 234, country: 'KP', risk: 'Critical' },
  { ip: '45.142.212.67', count: 198, country: 'RU', risk: 'High' },
  { ip: '91.219.237.89', count: 176, country: 'UA', risk: 'High' },
  { ip: '103.253.145.12', count: 145, country: 'VN', risk: 'Medium' },
  { ip: '217.182.143.207', count: 132, country: 'NL', risk: 'Medium' },
  { ip: '89.248.165.98', count: 118, country: 'DE', risk: 'Medium' },
  { ip: '176.123.9.45', count: 95, country: 'FR', risk: 'Low' },
];

// Helper function to get risk color
export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'Critical':
      return '#dc2626';
    case 'High':
      return '#ea580c';
    case 'Medium':
      return '#eab308';
    case 'Low':
      return '#22c55e';
    default:
      return '#00f3ff';
  }
};
