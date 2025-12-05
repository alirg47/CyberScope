import { Alert, RiskLevel } from '@/data/mockAlerts';
import { Incident } from '@/data/mockIncidents';
import { Campaign } from '@/data/mockCampaigns';
import { AlertTimeData, SeverityData, SourceData, TopIPData } from '@/data/l1ChartData';
import { IncidentStatusData } from '@/data/l2ChartData';

// --- L1 Helpers ---

export const calculateAlertsOverTime = (alerts: Alert[], view: 'hourly' | 'weekly'): AlertTimeData[] => {
    const now = new Date();
    const data: Record<string, number> = {};

    if (view === 'hourly') {
        // Initialize last 24 hours
        for (let i = 0; i < 24; i++) {
            const d = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hour = d.getHours().toString().padStart(2, '0') + ':00';
            data[hour] = 0;
        }

        alerts.forEach(alert => {
            const alertDate = new Date(alert.timestamp);
            // Check if within last 24h
            if (now.getTime() - alertDate.getTime() <= 24 * 60 * 60 * 1000) {
                const hour = alertDate.getHours().toString().padStart(2, '0') + ':00';
                if (data[hour] !== undefined) data[hour]++;
            }
        });

        return Object.entries(data)
            .map(([time, count]) => ({ time, alerts: count }))
            .reverse(); // Show oldest to newest
    } else {
        // Weekly view
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const day = days[d.getDay()];
            data[day] = 0;
        }

        alerts.forEach(alert => {
            const alertDate = new Date(alert.timestamp);
            if (now.getTime() - alertDate.getTime() <= 7 * 24 * 60 * 60 * 1000) {
                const day = days[alertDate.getDay()];
                if (data[day] !== undefined) data[day]++;
            }
        });

        // Return in correct order of days ending with today
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const day = days[d.getDay()];
            result.push({ time: day, alerts: data[day] || 0 });
        }
        return result;
    }
};

export const calculateAlertsBySeverity = (alerts: Alert[]): SeverityData[] => {
    const counts: Record<string, number> = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
    };

    alerts.forEach(a => {
        // Only count the 4 main severity levels, ignore Info
        if (counts[a.severity] !== undefined) counts[a.severity]++;
    });

    const colors: Record<string, string> = {
        Critical: '#dc2626',  // Red
        High: '#ea580c',      // Orange
        Medium: '#eab308',    // Yellow
        Low: '#22c55e'        // Green
    };

    return Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([severity, count]) => ({
            severity,
            count,
            color: colors[severity]
        }));
};

export const calculateAlertSources = (alerts: Alert[]): SourceData[] => {
    const counts: Record<string, number> = {};

    alerts.forEach(a => {
        counts[a.source] = (counts[a.source] || 0) + 1;
    });

    const colors = ['#3b82f6', '#8b5cf6', '#00f3ff', '#f59e0b', '#bc13fe', '#10b981', '#ef4444'];

    return Object.entries(counts)
        .map(([source, count], index) => ({
            source,
            count,
            color: colors[index % colors.length]
        }))
        .sort((a, b) => b.count - a.count);
};

export const calculateTopIPs = (alerts: Alert[]): TopIPData[] => {
    const ipStats: Record<string, { count: number, risk: RiskLevel }> = {};

    alerts.forEach(a => {
        if (!ipStats[a.src_ip]) {
            ipStats[a.src_ip] = { count: 0, risk: 'Low' };
        }
        ipStats[a.src_ip].count++;

        // Upgrade risk if higher severity alert found
        const currentRisk = ipStats[a.src_ip].risk;
        if (getRiskWeight(a.severity) > getRiskWeight(currentRisk)) {
            ipStats[a.src_ip].risk = a.severity;
        }
    });

    // Mock country mapping
    const countries = ['US', 'CN', 'RU', 'IR', 'KP', 'DE', 'FR', 'GB', 'BR', 'IN'];

    return Object.entries(ipStats)
        .map(([ip, stats], index) => ({
            ip,
            count: stats.count,
            country: countries[index % countries.length], // Mock country
            risk: stats.risk as any
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
};

const getRiskWeight = (risk: string): number => {
    switch (risk) {
        case 'Critical': return 4;
        case 'High': return 3;
        case 'Medium': return 2;
        case 'Low': return 1;
        default: return 0;
    }
};

// --- L2 Helpers ---

export const calculateIncidentStatus = (incidents: Incident[]): IncidentStatusData[] => {
    const counts: Record<string, number> = {
        'Open': 0,
        'In-Progress': 0,
        'Escalated to L3': 0,
        'Closed': 0
    };

    incidents.forEach(i => {
        if (counts[i.status] !== undefined) counts[i.status]++;
        else counts['Open']++; // Fallback
    });

    const colors: Record<string, string> = {
        'Open': '#ef4444',
        'In-Progress': '#f59e0b',
        'Escalated to L3': '#bc13fe',
        'Closed': '#10b981'
    };

    return Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
            status,
            count,
            color: colors[status]
        }));
};
