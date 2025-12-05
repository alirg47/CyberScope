import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  height?: number | string;
  headerAction?: ReactNode;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  className = '',
  height = 350,
  headerAction,
}: ChartContainerProps) {
  return (
    <div className={`chart-container ${className}`}>
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        {headerAction && <div className="chart-header-action">{headerAction}</div>}
      </div>
      <div className="chart-content" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        {children}
      </div>
    </div>
  );
}
