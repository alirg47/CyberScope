'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { TimeRange, TIME_RANGE_CONFIGS } from '@/utils/dataGenerators';

interface TimeRangeFilterProps {
    selectedRange: TimeRange;
    onRangeChange: (range: TimeRange) => void;
    showCustom?: boolean;
}

export default function TimeRangeFilter({
    selectedRange,
    onRangeChange,
    showCustom = false,
}: TimeRangeFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    const ranges: TimeRange[] = showCustom
        ? ['24h', '7d', '30d', '6m', '12m', 'custom']
        : ['24h', '7d', '30d', '6m', '12m'];

    return (
        <div className="time-range-filter">
            <button
                className="time-range-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Calendar size={16} />
                <span>{TIME_RANGE_CONFIGS[selectedRange].label}</span>
                <svg
                    className={`chevron ${isOpen ? 'rotate' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="time-range-overlay"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="time-range-dropdown">
                        {ranges.map((range) => (
                            <button
                                key={range}
                                className={`time-range-option ${selectedRange === range ? 'active' : ''}`}
                                onClick={() => {
                                    onRangeChange(range);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{TIME_RANGE_CONFIGS[range].label}</span>
                                {selectedRange === range && (
                                    <span className="check-mark">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
