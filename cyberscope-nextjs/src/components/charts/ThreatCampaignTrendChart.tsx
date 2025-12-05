'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartContainer from './ChartContainer';
import { campaignTrendData, CampaignTrendData } from '@/data/l3ChartData';

interface ThreatCampaignTrendChartProps {
    data?: CampaignTrendData[];
}

export default function ThreatCampaignTrendChart({ data }: ThreatCampaignTrendChartProps) {
    const chartData = data || campaignTrendData;

    return (
        <ChartContainer
            title="Threat Campaign Trends"
            subtitle="Multi-Week Detection Patterns"
            height={400}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="campaignGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '0.75rem' }}
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
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload as CampaignTrendData;
                                return (
                                    <div style={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        color: '#e0e0e0',
                                    }}>
                                        <p style={{ margin: 0, fontWeight: 600, color: '#ff003c' }}>{data.date}</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                                            Detections: <strong>{data.detections}</strong>
                                        </p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                                            Campaigns: <strong>{data.campaigns.join(', ')}</strong>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="detections"
                        stroke="#ff003c"
                        strokeWidth={3}
                        dot={{ fill: '#ff003c', r: 5, strokeWidth: 2, stroke: '#0a0a0a' }}
                        activeDot={{ r: 7, fill: '#ff003c', stroke: '#ffb800', strokeWidth: 2 }}
                        fill="url(#campaignGradient)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
