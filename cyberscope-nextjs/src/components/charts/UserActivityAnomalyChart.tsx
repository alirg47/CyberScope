'use client';

import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';
import { userAnomalyData, UserAnomalyData } from '@/data/l2ChartData';

interface UserActivityAnomalyChartProps {
    data?: UserAnomalyData[];
}

export default function UserActivityAnomalyChart({ data }: UserActivityAnomalyChartProps) {
    const chartData = data || userAnomalyData;

    return (
        <ChartContainer
            title="User Activity Anomalies"
            subtitle="Behavioral Risk Assessment"
            height={400}
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis
                        dataKey="category"
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                    />
                    <Radar
                        name="Anomaly Score"
                        dataKey="value"
                        stroke="#ff003c"
                        fill="#ff003c"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#e0e0e0',
                        }}
                        formatter={(value: any) => [`${value}%`, 'Risk Score']}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
