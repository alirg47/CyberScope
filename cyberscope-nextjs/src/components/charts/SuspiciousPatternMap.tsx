'use client';

import React from 'react';
import ChartContainer from './ChartContainer';
import { patternNodes, patternEdges, PatternNode, PatternEdge, getPatternNodeColor } from '@/data/l3ChartData';

interface SuspiciousPatternMapProps {
    nodes?: PatternNode[];
    edges?: PatternEdge[];
}

export default function SuspiciousPatternMap({ nodes, edges }: SuspiciousPatternMapProps) {
    const chartNodes = nodes || patternNodes;
    const chartEdges = edges || patternEdges;

    const getNodeShape = (type: string): string => {
        switch (type) {
            case 'campaign':
                return 'hexagon';
            case 'ioc':
                return 'triangle';
            case 'incident':
                return 'diamond';
            case 'host':
                return 'square';
            case 'user':
                return 'circle';
            case 'alert':
                return 'star';
            default:
                return 'circle';
        }
    };

    const renderNode = (node: PatternNode) => {
        const color = getPatternNodeColor(node.type, node.risk);
        const size = node.size;

        switch (getNodeShape(node.type)) {
            case 'hexagon':
                const hexPoints = Array.from({ length: 6 }, (_, i) => {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    return `${node.x + size * Math.cos(angle)},${node.y + size * Math.sin(angle)}`;
                }).join(' ');
                return <polygon points={hexPoints} fill={color} stroke="#0a0a0a" strokeWidth={2} opacity={0.9} />;

            case 'triangle':
                const triPoints = `${node.x},${node.y - size} ${node.x - size},${node.y + size} ${node.x + size},${node.y + size}`;
                return <polygon points={triPoints} fill={color} stroke="#0a0a0a" strokeWidth={2} opacity={0.9} />;

            case 'diamond':
                const diamondPoints = `${node.x},${node.y - size} ${node.x + size},${node.y} ${node.x},${node.y + size} ${node.x - size},${node.y}`;
                return <polygon points={diamondPoints} fill={color} stroke="#0a0a0a" strokeWidth={2} opacity={0.9} />;

            case 'square':
                return <rect x={node.x - size} y={node.y - size} width={size * 2} height={size * 2} fill={color} stroke="#0a0a0a" strokeWidth={2} opacity={0.9} />;

            default:
                return <circle cx={node.x} cy={node.y} r={size} fill={color} stroke="#0a0a0a" strokeWidth={2} opacity={0.9} />;
        }
    };

    return (
        <ChartContainer
            title="Suspicious Pattern Map"
            subtitle="Complex Threat Correlation Network"
            height={600}
        >
            <svg width="100%" height="100%" viewBox="0 0 850 600" style={{ background: 'transparent' }}>
                {/* Render edges */}
                {chartEdges.map((edge, index) => {
                    const sourceNode = chartNodes.find(n => n.id === edge.source);
                    const targetNode = chartNodes.find(n => n.id === edge.target);

                    if (!sourceNode || !targetNode) return null;

                    const color = edge.strength >= 8 ? '#ff003c' : edge.strength >= 6 ? '#ffb800' : '#00f3ff';

                    return (
                        <g key={`edge-${index}`}>
                            <line
                                x1={sourceNode.x}
                                y1={sourceNode.y}
                                x2={targetNode.x}
                                y2={targetNode.y}
                                stroke={color}
                                strokeWidth={edge.strength / 2}
                                strokeOpacity={0.4 + (edge.strength / 25)}
                            />
                        </g>
                    );
                })}

                {/* Render nodes */}
                {chartNodes.map((node) => (
                    <g key={node.id} style={{ cursor: 'pointer' }}>
                        {renderNode(node)}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size + 5}
                            fill="none"
                            stroke={getPatternNodeColor(node.type, node.risk)}
                            strokeWidth={1}
                            opacity={0.3}
                        />
                        <text
                            x={node.x}
                            y={node.y + node.size + 18}
                            textAnchor="middle"
                            fill="#e0e0e0"
                            fontSize="10"
                            fontWeight="600"
                        >
                            {node.label.length > 14 ? node.label.substring(0, 14) + '...' : node.label}
                        </text>
                    </g>
                ))}
            </svg>

            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(20, 20, 20, 0.95)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #374151',
                fontSize: '0.75rem',
                maxWidth: '200px',
            }}>
                <div style={{ color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>Node Types:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <span>⬡ Campaign</span>
                    <span>▲ IOC</span>
                    <span>◆ Incident</span>
                    <span>■ Host</span>
                    <span>● User</span>
                    <span>⚠ Alert</span>
                </div>
                <div style={{ color: '#9ca3af', marginTop: '12px', marginBottom: '6px', fontWeight: 600 }}>Risk Level:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: '#ff003c' }}>● Critical</span>
                    <span style={{ color: '#ffb800' }}>● High</span>
                    <span style={{ color: '#eab308' }}>● Medium</span>
                </div>
            </div>
        </ChartContainer>
    );
}
