'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';
import { incidentStatusData, IncidentStatusData } from '@/data/l2ChartData';

interface IncidentStatusChartProps {
    data?: IncidentStatusData[];
}

export default function IncidentStatusChart({ data }: IncidentStatusChartProps) {
    const chartData = data || incidentStatusData;

    // Custom label to show count only
    const renderCustomLabel = (entry: any) => {
        return `${entry.count}`;
    };

    return (
        <ChartContainer
            title="Incident Status Distribution"
            subtitle="Current Incident States"
            height={350}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="status"
                        label={renderCustomLabel}
                        labelLine={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#0a0a0a"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#e0e0e0',
                        }}
                        formatter={(value: any, name: any) => [value, name]}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value: string, entry: any) => (
                            <span style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
                                {value}: {entry.payload.count}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
