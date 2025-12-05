'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import ChartContainer from './ChartContainer';
import TimeRangeFilter from '../TimeRangeFilter';
import { generateAlertsOverTime, TimeRange } from '@/utils/dataGenerators';
import { AlertTimeData } from '@/data/l1ChartData';

interface AlertsOverTimeChartProps {
  data?: AlertTimeData[];
  view?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  showTimeFilter?: boolean;
}

export default function AlertsOverTimeChart({ data, view, showTimeFilter = true }: AlertsOverTimeChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const chartData = data || generateAlertsOverTime(timeRange);

  return (
    <ChartContainer
      title="Alerts Over Time"
      subtitle={showTimeFilter ? undefined : 'Trend Analysis'}
      height={350}
      headerAction={showTimeFilter ? (
        <TimeRangeFilter
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
        />
      ) : undefined}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
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
          <Area
            type="monotone"
            dataKey="alerts"
            stroke="#00f3ff"
            strokeWidth={2}
            fill="url(#alertGradient)"
            name="Alerts"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
