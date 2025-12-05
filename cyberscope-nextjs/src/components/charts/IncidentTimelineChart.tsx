'use client';

import React from 'react';
import ChartContainer from './ChartContainer';
import { incidentTimelineData, TimelineEvent, getEventTypeColor } from '@/data/l2ChartData';

interface IncidentTimelineChartProps {
    data?: TimelineEvent[];
}

export default function IncidentTimelineChart({ data }: IncidentTimelineChartProps) {
    const chartData = data || incidentTimelineData;

    const getSeverityColor = (severity: string): string => {
        switch (severity) {
            case 'Critical':
                return '#ff003c';
            case 'High':
                return '#ffb800';
            case 'Medium':
                return '#eab308';
            case 'Low':
                return '#00ff9d';
            default:
                return '#00f3ff';
        }
    };

    return (
        <ChartContainer
            title="Incident Timeline"
            subtitle="Event Sequence Analysis"
            height={400}
        >
            <div style={{
                height: '100%',
                overflowY: 'auto',
                padding: '20px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'linear-gradient(to bottom, #374151, #00f3ff, #374151)',
                }} />

                {chartData.map((event, index) => (
                    <div
                        key={event.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '24px',
                            position: 'relative',
                            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                        }}
                    >
                        <div style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${getEventTypeColor(event.type)}`,
                            borderRadius: '8px',
                            marginLeft: index % 2 === 0 ? 0 : '16px',
                            marginRight: index % 2 === 0 ? '16px' : 0,
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: getEventTypeColor(event.type),
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                }}>
                                    {event.type}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#9ca3af',
                                }}>
                                    {event.timestamp}
                                </span>
                            </div>
                            <div style={{
                                color: '#e0e0e0',
                                fontSize: '0.875rem',
                                marginBottom: '8px',
                            }}>
                                {event.description}
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    background: `${getSeverityColor(event.severity)}20`,
                                    color: getSeverityColor(event.severity),
                                    border: `1px solid ${getSeverityColor(event.severity)}`,
                                }}>
                                    {event.severity}
                                </span>
                                {event.user && (
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: '#3b82f6',
                                    }}>
                                        User: {event.user}
                                    </span>
                                )}
                                {event.host && (
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8b5cf6',
                                    }}>
                                        Host: {event.host}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: getEventTypeColor(event.type),
                            border: '3px solid #0a0a0a',
                            zIndex: 10,
                            flexShrink: 0,
                        }} />
                    </div>
                ))}
            </div>
        </ChartContainer>
    );
}
