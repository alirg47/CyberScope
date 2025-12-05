/**
 * Data Generators for SOAx Platform
 * Generates realistic time-series data for charts and dashboards
 */

// ============================================================================
// TIME RANGE TYPES
// ============================================================================

export type TimeRange = '24h' | '7d' | '30d' | '6m' | '12m' | 'custom';

export interface TimeRangeConfig {
    label: string;
    dataPoints: number;
    granularity: 'hour' | 'day' | 'week' | 'month';
    alertRange: { min: number; max: number };
}

export const TIME_RANGE_CONFIGS: Record<TimeRange, TimeRangeConfig> = {
    '24h': {
        label: 'Last 24 Hours',
        dataPoints: 24,
        granularity: 'hour',
        alertRange: { min: 40, max: 120 },
    },
    '7d': {
        label: 'Last 7 Days',
        dataPoints: 7,
        granularity: 'day',
        alertRange: { min: 300, max: 900 },
    },
    '30d': {
        label: 'Last 30 Days',
        dataPoints: 30,
        granularity: 'day',
        alertRange: { min: 1200, max: 4000 },
    },
    '6m': {
        label: 'Last 6 Months',
        dataPoints: 26,
        granularity: 'week',
        alertRange: { min: 5000, max: 20000 },
    },
    '12m': {
        label: 'Last 12 Months',
        dataPoints: 12,
        granularity: 'month',
        alertRange: { min: 15000, max: 60000 },
    },
    'custom': {
        label: 'Custom Range',
        dataPoints: 30,
        granularity: 'day',
        alertRange: { min: 1000, max: 5000 },
    },
};

// ============================================================================
// TIME SERIES DATA GENERATION
// ============================================================================

export interface TimeSeriesDataPoint {
    timestamp: string;
    value: number;
    label: string;
}

/**
 * Generate realistic SOC alert curve
 * Follows normal distribution with business hours peak
 */
function generateSOCCurve(dataPoints: number, total: number): number[] {
    const values: number[] = [];
    const avgPerPoint = total / dataPoints;

    for (let i = 0; i < dataPoints; i++) {
        // Add natural variation (±30%)
        const variation = 0.7 + Math.random() * 0.6;
        let value = avgPerPoint * variation;

        // Add business hours pattern (for hourly/daily data)
        if (dataPoints <= 30) {
            const hourOfDay = i % 24;
            // Peak during business hours (8-18)
            if (hourOfDay >= 8 && hourOfDay <= 18) {
                value *= 1.3;
            } else if (hourOfDay >= 0 && hourOfDay <= 6) {
                value *= 0.6; // Lower at night
            }
        }

        // Add weekly pattern (for daily/weekly data)
        if (dataPoints >= 7) {
            const dayOfWeek = i % 7;
            // Lower on weekends
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                value *= 0.7;
            }
        }

        values.push(Math.floor(value));
    }

    // Normalize to match total
    const sum = values.reduce((a, b) => a + b, 0);
    const normalized = values.map(v => Math.floor((v / sum) * total));

    // Adjust last value to ensure exact sum
    const currentSum = normalized.reduce((a, b) => a + b, 0);
    normalized[normalized.length - 1] += total - currentSum;

    return normalized;
}

/**
 * Format timestamp based on granularity
 */
function formatTimestamp(
    index: number,
    granularity: 'hour' | 'day' | 'week' | 'month',
    now: Date = new Date()
): { timestamp: string; label: string } {
    const date = new Date(now);

    switch (granularity) {
        case 'hour':
            date.setHours(date.getHours() - (23 - index));
            return {
                timestamp: date.toISOString(),
                label: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };

        case 'day':
            date.setDate(date.getDate() - (index));
            return {
                timestamp: date.toISOString(),
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };

        case 'week':
            date.setDate(date.getDate() - (index * 7));
            return {
                timestamp: date.toISOString(),
                label: `Week ${index + 1}`,
            };

        case 'month':
            date.setMonth(date.getMonth() - (11 - index));
            return {
                timestamp: date.toISOString(),
                label: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            };
    }
}

/**
 * Generate time series data for alerts over time
 */
export function generateAlertsOverTime(timeRange: TimeRange): TimeSeriesDataPoint[] {
    const config = TIME_RANGE_CONFIGS[timeRange];
    const total = Math.floor(
        Math.random() * (config.alertRange.max - config.alertRange.min) + config.alertRange.min
    );

    const values = generateSOCCurve(config.dataPoints, total);

    return values.map((value, index) => {
        const { timestamp, label } = formatTimestamp(index, config.granularity);
        return { timestamp, value, label };
    }).reverse(); // Reverse to show oldest first
}

// ============================================================================
// SEVERITY DISTRIBUTION OVER TIME
// ============================================================================

export interface SeverityTimeSeriesData {
    timestamp: string;
    label: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
}

/**
 * Generate severity distribution over time
 */
export function generateSeverityOverTime(timeRange: TimeRange): SeverityTimeSeriesData[] {
    const config = TIME_RANGE_CONFIGS[timeRange];
    const alertsData = generateAlertsOverTime(timeRange);

    return alertsData.map(point => {
        const total = point.value;

        // Realistic severity distribution
        const critical = Math.floor(total * (0.03 + Math.random() * 0.04)); // 3-7%
        const high = Math.floor(total * (0.15 + Math.random() * 0.10)); // 15-25%
        const medium = Math.floor(total * (0.40 + Math.random() * 0.15)); // 40-55%
        const low = total - critical - high - medium; // Remainder

        return {
            timestamp: point.timestamp,
            label: point.label,
            critical,
            high,
            medium,
            low,
        };
    });
}

// ============================================================================
// CUSTOM RANGE SUPPORT
// ============================================================================

export interface CustomDateRange {
    startDate: Date;
    endDate: Date;
}

/**
 * Generate data for custom date range
 */
export function generateCustomRangeData(range: CustomDateRange): TimeSeriesDataPoint[] {
    const daysDiff = Math.ceil(
        (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine appropriate granularity
    let granularity: 'hour' | 'day' | 'week' | 'month' = 'day';
    let dataPoints = daysDiff;

    if (daysDiff <= 2) {
        granularity = 'hour';
        dataPoints = daysDiff * 24;
    } else if (daysDiff > 90) {
        granularity = 'week';
        dataPoints = Math.ceil(daysDiff / 7);
    } else if (daysDiff > 365) {
        granularity = 'month';
        dataPoints = Math.ceil(daysDiff / 30);
    }

    // Estimate total alerts based on duration
    const alertsPerDay = 50 + Math.random() * 100;
    const total = Math.floor(alertsPerDay * daysDiff);

    const values = generateSOCCurve(dataPoints, total);

    return values.map((value, index) => {
        const { timestamp, label } = formatTimestamp(index, granularity, range.endDate);
        return { timestamp, value, label };
    }).reverse();
}
