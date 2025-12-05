'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from './ChartContainer';
import { topTriggeringIPsData, TopIPData, getRiskColor } from '@/data/l1ChartData';

interface TopTriggeringIPsChartProps {
  data?: TopIPData[];
}

export default function TopTriggeringIPsChart({ data }: TopTriggeringIPsChartProps) {
  const chartData = data || topTriggeringIPsData;

  return (
    <ChartContainer
      title="Top Triggering IPs"
      subtitle="Top 10 IPs by Alert Count"
      height={400}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            type="number"
            stroke="#9ca3af"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis 
            type="category"
            dataKey="ip"
            stroke="#9ca3af"
            style={{ fontSize: '0.75rem' }}
            width={110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#e0e0e0',
            }}
            cursor={{ fill: 'rgba(0, 243, 255, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TopIPData;
                return (
                  <div style={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#e0e0e0',
                  }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#00f3ff' }}>{data.ip}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                      Alerts: <strong>{data.count}</strong>
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                      Country: <strong>{data.country}</strong>
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                      Risk: <strong style={{ color: getRiskColor(data.risk) }}>{data.risk}</strong>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="count" 
            radius={[0, 8, 8, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getRiskColor(entry.risk)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
