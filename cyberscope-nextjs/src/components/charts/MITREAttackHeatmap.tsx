'use client';

import React from 'react';
import ChartContainer from './ChartContainer';
import { mitreAttackData, MITRETacticData, getIntensityColor } from '@/data/l3ChartData';

interface MITREAttackHeatmapProps {
    data?: MITRETacticData[];
}

export default function MITREAttackHeatmap({ data }: MITREAttackHeatmapProps) {
    const chartData = data || mitreAttackData;

    const maxDetections = Math.max(...chartData.map(d => d.detections));

    return (
        <ChartContainer
            title="MITRE ATT&CK Heatmap"
            subtitle="Tactic Detection Frequency"
            height={450}
        >
            <div style={{
                height: '100%',
                overflowY: 'auto',
                padding: '20px',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                }}>
                    {chartData.map((tactic) => (
                        <div
                            key={tactic.tactic}
                            style={{
                                background: `linear-gradient(135deg, ${getIntensityColor(tactic.intensity)}20, ${getIntensityColor(tactic.intensity)}10)`,
                                border: `2px solid ${getIntensityColor(tactic.intensity)}`,
                                borderRadius: '8px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 8px 16px ${getIntensityColor(tactic.intensity)}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                padding: '4px 8px',
                                background: getIntensityColor(tactic.intensity),
                                color: '#0a0a0a',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                borderBottomLeftRadius: '8px',
                            }}>
                                {tactic.detections}
                            </div>

                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#e0e0e0',
                                marginBottom: '8px',
                                marginRight: '40px',
                            }}>
                                {tactic.tactic}
                            </div>

                            <div style={{
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                                marginBottom: '8px',
                            }}>
                                Techniques: {tactic.techniques.join(', ')}
                            </div>

                            <div style={{
                                width: '100%',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${tactic.intensity}%`,
                                    height: '100%',
                                    background: getIntensityColor(tactic.intensity),
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '8px' }}>
                        Intensity Scale:
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                        <span style={{ color: '#ff003c' }}>● Critical (80-100)</span>
                        <span style={{ color: '#ffb800' }}>● High (60-79)</span>
                        <span style={{ color: '#eab308' }}>● Medium (40-59)</span>
                        <span style={{ color: '#00ff9d' }}>● Low (20-39)</span>
                        <span style={{ color: '#00f3ff' }}>● Info (0-19)</span>
                    </div>
                </div>
            </div>
        </ChartContainer>
    );
}
