'use client';

import React from 'react';
import type { ThreatHuntingAnalysis } from '@/data/mockCampaigns';
import { Activity, AlertTriangle, Shield, Target, TrendingUp, Eye } from 'lucide-react';

interface ThreatHuntingAnalysisPanelProps {
    analysis: ThreatHuntingAnalysis;
    campaignName: string;
}

export default function ThreatHuntingAnalysisPanel({ analysis, campaignName }: ThreatHuntingAnalysisPanelProps) {
    return (
        <div className="threat-analysis-panel">
            {/* Header Section */}
            <div className="threat-analysis-header">
                <div className="threat-header-left">
                    <h2 className="threat-analysis-title">
                        <Target className="inline-icon" />
                        Threat Hunting Analysis: {campaignName}
                    </h2>
                    <div className="threat-technique-info">
                        <span className="technique-id">{analysis.technique_id}</span>
                        <span className="technique-divider">•</span>
                        <span className="technique-name">{analysis.technique_name}</span>
                    </div>
                </div>
                <div className="threat-header-right">
                    <div className="confidence-badge">
                        <span className="badge-label">AI Confidence</span>
                        <span className="badge-value">{analysis.ai_confidence}%</span>
                    </div>
                    <div className="threat-impact-badge" data-impact={analysis.threat_impact.toLowerCase().replace(/\s+/g, '-')}>
                        <Shield className="inline-icon" />
                        {analysis.threat_impact}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="threat-analysis-grid">
                {/* Technique Description */}
                <div className="analysis-card full-width">
                    <h3 className="analysis-card-title">
                        <Activity className="inline-icon" />
                        Technique Description
                    </h3>
                    <p className="analysis-description">{analysis.technique_description}</p>
                </div>

                {/* Detection Strategies */}
                <div className="analysis-card">
                    <h3 className="analysis-card-title">
                        <Eye className="inline-icon" />
                        Detection Strategies
                    </h3>
                    <ul className="strategy-list">
                        {analysis.detection_strategies.map((strategy, index) => (
                            <li key={index} className="strategy-item">
                                <span className="strategy-bullet">▸</span>
                                {strategy}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Early Indicators */}
                <div className="analysis-card">
                    <h3 className="analysis-card-title">
                        <AlertTriangle className="inline-icon" />
                        Early Indicators
                    </h3>
                    <ul className="indicator-list">
                        {analysis.early_indicators.map((indicator, index) => (
                            <li key={index} className="indicator-item">
                                <span className="indicator-bullet">!</span>
                                {indicator}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* TTP Prediction */}
                <div className="analysis-card full-width">
                    <h3 className="analysis-card-title">
                        <TrendingUp className="inline-icon" />
                        TTP Prediction: Next Likely Attack Steps
                    </h3>
                    <div className="ttp-timeline">
                        {analysis.ttp_prediction.map((ttp, index) => (
                            <div key={index} className="ttp-step">
                                <div className="ttp-connector">
                                    <div className="ttp-dot"></div>
                                    {index < analysis.ttp_prediction.length - 1 && (
                                        <div className="ttp-line"></div>
                                    )}
                                </div>
                                <div className="ttp-content">
                                    <span className="ttp-number">Step {index + 1}</span>
                                    <span className="ttp-text">{ttp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attack Probability */}
                <div className="analysis-card">
                    <h3 className="analysis-card-title">
                        <Target className="inline-icon" />
                        Attack Probability Score
                    </h3>
                    <div className="probability-display">
                        <div className="probability-circle">
                            <svg className="probability-svg" viewBox="0 0 120 120">
                                <circle
                                    className="probability-bg"
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    strokeWidth="8"
                                />
                                <circle
                                    className="probability-fill"
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    strokeWidth="8"
                                    strokeDasharray={`${analysis.attack_probability_score * 3.39} 339.292`}
                                    strokeDashoffset="0"
                                    transform="rotate(-90 60 60)"
                                />
                            </svg>
                            <div className="probability-text">
                                <span className="probability-value">{analysis.attack_probability_score}%</span>
                                <span className="probability-label">Escalation Risk</span>
                            </div>
                        </div>
                        <p className="probability-caption">
                            {analysis.attack_probability_score >= 80 ? 'Critical - Immediate action required' :
                                analysis.attack_probability_score >= 60 ? 'High - Proactive monitoring essential' :
                                    analysis.attack_probability_score >= 40 ? 'Moderate - Continue surveillance' :
                                        'Low - Routine monitoring'}
                        </p>
                    </div>
                </div>

                {/* Recommended Action */}
                <div className="analysis-card">
                    <h3 className="analysis-card-title">
                        <Shield className="inline-icon" />
                        Recommended SOC Action
                    </h3>
                    <div className="recommended-action">
                        <p className="action-text">{analysis.recommended_action}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .threat-analysis-panel {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .threat-analysis-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 2px solid var(--border-color);
                }

                .threat-header-left {
                    flex: 1;
                }

                .threat-analysis-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--accent-primary);
                    margin: 0 0 0.75rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .threat-technique-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1rem;
                }

                .technique-id {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                }

                .technique-name {
                    color: var(--text-primary);
                    font-weight: 600;
                }

                .technique-divider {
                    color: var(--text-secondary);
                }

                .threat-header-right {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .confidence-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    background: rgba(74, 222, 128, 0.1);
                    border: 1px solid rgba(74, 222, 128, 0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                }

                .badge-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .badge-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: rgb(74, 222, 128);
                }

                .threat-impact-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    background: rgba(251, 191, 36, 0.1);
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    color: rgb(251, 191, 36);
                }

                .inline-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                }

                .threat-analysis-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .analysis-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1.5rem;
                }

                .analysis-card.full-width {
                    grid-column: 1 / -1;
                }

                .analysis-card-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--accent-primary);
                    margin: 0 0 1rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .analysis-description {
                    color: var(--text-primary);
                    line-height: 1.6;
                    margin: 0;
                }

                .strategy-list,
                .indicator-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .strategy-item,
                .indicator-item {
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                    background: var(--bg-primary);
                    border-left: 3px solid var(--accent-primary);
                    border-radius: 4px;
                    color: var(--text-primary);
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .strategy-bullet {
                    color: var(--accent-primary);
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .indicator-bullet {
                    background: rgba(251, 191, 36, 0.2);
                    color: rgb(251, 191, 36);
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .ttp-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .ttp-step {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .ttp-connector {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                }

                .ttp-dot {
                    width: 1rem;
                    height: 1rem;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
                }

                .ttp-line {
                    width: 2px;
                    height: 2rem;
                    background: linear-gradient(to bottom, var(--accent-primary), transparent);
                    margin-top: 0.25rem;
                }

                .ttp-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .ttp-number {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .ttp-text {
                    color: var(--text-primary);
                    font-weight: 500;
                    padding: 0.75rem;
                    background: var(--bg-primary);
                    border-radius: 6px;
                    border-left: 3px solid var(--accent-primary);
                }

                .probability-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .probability-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
                }

                .probability-svg {
                    width: 100%;
                    height: 100%;
                }

                .probability-bg {
                    stroke: var(--border-color);
                }

                .probability-fill {
                    stroke: var(--accent-primary);
                    transition: stroke-dasharray 1s ease;
                }

                .probability-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                }

                .probability-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--accent-primary);
                }

                .probability-label {
                    font-size: 0.625rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }

                .probability-caption {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin: 0;
                }

                .recommended-action {
                    background: rgba(16, 185, 129, 0.05);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 6px;
                    padding: 1rem;
                }

                .action-text {
                    color: var(--text-primary);
                    line-height: 1.6;
                    margin: 0;
                    font-weight: 500;
                }

                @media (max-width: 768px) {
                    .threat-analysis-grid {
                        grid-template-columns: 1fr;
                    }

                    .threat-analysis-header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .threat-header-right {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
}
