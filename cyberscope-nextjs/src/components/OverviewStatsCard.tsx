'use client';

interface OverviewStatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

const OverviewStatsCard = ({ icon, title, value, subtitle, trend, color = '#3b82f6' }: OverviewStatsCardProps) => {
    return (
        <div className="overview-stats-card">
            <div className="stats-icon" style={{ backgroundColor: `${color}20`, color }}>
                {icon}
            </div>
            <div className="stats-content">
                <h3 className="stats-title">{title}</h3>
                <div className="stats-value">{value}</div>
                {subtitle && (
                    <div className="stats-subtitle">{subtitle}</div>
                )}
                {trend && (
                    <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
                        <span className="trend-icon">{trend.isPositive ? '↑' : '↓'}</span>
                        <span className="trend-value">{Math.abs(trend.value)}%</span>
                        <span className="trend-label">from last week</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewStatsCard;
