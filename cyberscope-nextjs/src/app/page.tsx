'use client';

import { useUser } from '@/context/UserContext';
import { useData } from '@/context/DataContext';
import { generatePlatformStatistics, PlatformStatistics } from '@/utils/statisticsEngine';
import OverviewStatsCard from '@/components/OverviewStatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity,
  CheckCircle,
  Clock,
  Bell,
  Target,
  AlertTriangle,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { currentUser } = useUser();
  const { alerts, incidents } = useData();

  // Generate realistic statistics on client side only to avoid hydration mismatch
  const [stats, setStats] = useState<PlatformStatistics | null>(null);

  useEffect(() => {
    setStats(generatePlatformStatistics());
  }, []);

  // Show loading state while stats are being generated
  if (!stats) {
    return <div className="dashboard-container">Loading...</div>;
  }

  // Calculate current filtered numbers from actual data
  const openAlerts = alerts.filter(alert => alert.status === 'Open').length;
  const openIncidents = incidents.filter(inc => inc.status === 'Open' || inc.status === 'In-Progress').length;

  // Realistic alert trend data for the week
  const alertTrendData = [
    { day: 'Sat', alerts: 95 },
    { day: 'Sun', alerts: 88 },
    { day: 'Mon', alerts: 112 },
    { day: 'Tue', alerts: 105 },
    { day: 'Wed', alerts: 98 },
    { day: 'Thu', alerts: 107 },
    { day: 'Fri', alerts: stats.alerts.total },
  ];

  // Calculate percentage changes
  const alertFilteredPercent = Math.round((stats.alerts.filtered / stats.alerts.total) * 100);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {currentUser.fullName}</h1>
        <p className="dashboard-subtitle">Security Operations Command Center - Overview Dashboard</p>
      </div>

      <div className="stats-grid">
        <OverviewStatsCard
          icon={<Activity size={24} color="#00f3ff" />}
          title="Total Alerts Today"
          value={stats.alerts.total}
          trend={{ value: 5, isPositive: false }}
          subtitle="All detected alerts"
          color="#00f3ff"
        />
        <OverviewStatsCard
          icon={<CheckCircle size={24} color="#10b981" />}
          title="Alerts Filtered"
          value={`${stats.alerts.filtered} of ${stats.alerts.total}`}
          trend={{ value: alertFilteredPercent, isPositive: true }}
          subtitle={`${alertFilteredPercent}% filtered rate`}
          color="#10b981"
        />
        <OverviewStatsCard
          icon={<Clock size={24} color="#f59e0b" />}
          title="Avg Processing Time"
          value="2.3 min"
          subtitle="Per alert"
          color="#f59e0b"
        />
        <OverviewStatsCard
          icon={<Bell size={24} color="#ef4444" />}
          title="Open Alerts"
          value={stats.alerts.filtered}
          subtitle={`${openAlerts} currently displayed`}
          color="#ef4444"
        />
        <OverviewStatsCard
          icon={<Target size={24} color="#f59e0b" />}
          title="Open Incidents"
          value={stats.incidents.open + stats.incidents.inProgress}
          trend={{ value: 8, isPositive: false }}
          subtitle={`${openIncidents} in queue`}
          color="#f59e0b"
        />
        <OverviewStatsCard
          icon={<AlertTriangle size={24} color="#8b5cf6" />}
          title="Escalated Alerts"
          value={stats.alerts.escalated}
          subtitle="Require attention"
          color="#8b5cf6"
        />
        <OverviewStatsCard
          icon={<Zap size={24} color="#dc2626" />}
          title="Active Campaigns"
          value={stats.threatHunting.activeCampaigns}
          trend={{ value: 0, isPositive: true }}
          subtitle="Threat campaigns"
          color="#dc2626"
        />
        <OverviewStatsCard
          icon={<ShieldCheck size={24} color="#10b981" />}
          title="Confirmed Threats"
          value={stats.threatHunting.patternDetections}
          subtitle="Pattern matches"
          color="#10b981"
        />
      </div>

      {/* Alert Trend Chart */}
      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Alert Trend - Last 7 Days</h3>
            <p className="chart-subtitle">Daily alert volume showing {stats.alerts.total} alerts today</p>
          </div>
        </div>
        <div className="chart-content" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alertTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="alertTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="#666"
                style={{ fontSize: '0.75rem' }}
                tick={{ fill: '#999' }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '0.75rem' }}
                tick={{ fill: '#999' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                labelStyle={{ color: '#e0e0e0' }}
                itemStyle={{ color: '#00f3ff' }}
              />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="#00f3ff"
                strokeWidth={2}
                fill="url(#alertTrendGradient)"
                name="Alerts"
                dot={{ fill: '#00f3ff', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
