'use client';

import React from 'react';
import ChartContainer from './ChartContainer';
import { correlationNodes, correlationEdges, CorrelationNode, CorrelationEdge, getNodeColor } from '@/data/l2ChartData';

interface CorrelationGraphChartProps {
    nodes?: CorrelationNode[];
    edges?: CorrelationEdge[];
}

export default function CorrelationGraphChart({ nodes, edges }: CorrelationGraphChartProps) {
    const chartNodes = nodes || correlationNodes;
    const chartEdges = edges || correlationEdges;

    return (
        <ChartContainer
            title="Alert Correlation Graph"
            subtitle="Relationship Analysis"
            height={500}
        >
            <svg width="100%" height="100%" viewBox="0 0 700 500" style={{ background: 'transparent' }}>
                {/* Render edges first (behind nodes) */}
                {chartEdges.map((edge, index) => {
                    const sourceNode = chartNodes.find(n => n.id === edge.source);
                    const targetNode = chartNodes.find(n => n.id === edge.target);

                    if (!sourceNode || !targetNode) return null;

                    return (
                        <g key={`edge-${index}`}>
                            <line
                                x1={sourceNode.x}
                                y1={sourceNode.y}
                                x2={targetNode.x}
                                y2={targetNode.y}
                                stroke="#00f3ff"
                                strokeWidth={edge.strength / 3}
                                strokeOpacity={0.3 + (edge.strength / 20)}
                                strokeDasharray={edge.type === 'related' ? '5,5' : '0'}
                            />
                        </g>
                    );
                })}

                {/* Render nodes */}
                {chartNodes.map((node) => (
                    <g key={node.id} style={{ cursor: 'pointer' }}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={20}
                            fill={getNodeColor(node.type, node.risk)}
                            stroke="#0a0a0a"
                            strokeWidth={2}
                            opacity={0.9}
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={25}
                            fill="none"
                            stroke={getNodeColor(node.type, node.risk)}
                            strokeWidth={1}
                            opacity={0.5}
                        />
                        <text
                            x={node.x}
                            y={node.y + 35}
                            textAnchor="middle"
                            fill="#e0e0e0"
                            fontSize="11"
                            fontWeight="600"
                        >
                            {node.label.length > 12 ? node.label.substring(0, 12) + '...' : node.label}
                        </text>
                        <text
                            x={node.x}
                            y={node.y + 48}
                            textAnchor="middle"
                            fill="#9ca3af"
                            fontSize="9"
                        >
                            {node.type}
                        </text>
                    </g>
                ))}
            </svg>

            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(20, 20, 20, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #374151',
                fontSize: '0.75rem',
            }}>
                <div style={{ color: '#9ca3af', marginBottom: '4px' }}>Legend:</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#ff003c' }}>● Critical</span>
                    <span style={{ color: '#ffb800' }}>● High</span>
                    <span style={{ color: '#eab308' }}>● Medium</span>
                    <span style={{ color: '#00ff9d' }}>● Low</span>
                </div>
            </div>
        </ChartContainer>
    );
}
