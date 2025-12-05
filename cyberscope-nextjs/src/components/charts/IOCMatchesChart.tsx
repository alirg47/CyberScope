'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from './ChartContainer';
import { iocMatchesData, IOCMatchData } from '@/data/l3ChartData';

interface IOCMatchesChartProps {
    data?: IOCMatchData[];
}

export default function IOCMatchesChart({ data }: IOCMatchesChartProps) {
    const chartData = data || iocMatchesData;

    return (
        <ChartContainer
            title="IOC Matches Breakdown"
            subtitle="Indicator of Compromise Distribution"
            height={350}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="type"
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                        angle={-15}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#e0e0e0',
                        }}
                        cursor={{ fill: 'rgba(255, 0, 60, 0.1)' }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
