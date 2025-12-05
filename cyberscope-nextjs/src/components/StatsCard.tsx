// Stats Card Component
interface StatTrend {
    increased: boolean;
    value: string;
    label: string;
}

interface StatsCardProps {
    icon?: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: StatTrend;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    title,
    value,
    subtitle,
    trend,
    color = 'primary'
}) => {
    const colorClasses = {
        primary: 'var(--primary-accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)'
    };

    return (
        <div className="glass-card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {title}
                    </div>
                    <div className="stat-value" style={{ color: colorClasses[color] }}>
                        {value}
                    </div>
                    {subtitle && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            {subtitle}
                        </div>
                    )}
                </div>
                {icon && (
                    <div style={{
                        fontSize: '2rem',
                        opacity: 0.5,
                        color: colorClasses[color]
                    }}>
                        {icon}
                    </div>
                )}
            </div>
            {trend && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: trend.increased ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: trend.increased ? 'var(--danger)' : 'var(--success)'
                }}>
                    {trend.increased ? '↑' : '↓'} {trend.value} {trend.label}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
