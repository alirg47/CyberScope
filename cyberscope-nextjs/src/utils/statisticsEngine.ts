/**
 * Statistics Engine for SOAx Platform
 * Generates realistic, consistent SOC statistics across all dashboards
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export const STATISTICS_CONFIG = {
    // Alert Distribution (Daily)
    alerts: {
        total: { min: 90, max: 120 },        // Total alerts per day
        filtered: { min: 0, max: 80 },       // Filtered/displayed alerts
        severity: {
            critical: { min: 0.03, max: 0.07 },  // 3-7%
            high: { min: 0.15, max: 0.25 },      // 15-25%
            medium: { min: 0.40, max: 0.55 },    // 40-55%
            low: { min: 0.20, max: 0.35 },       // 20-35%
        },
    },

    // Incident Distribution
    incidents: {
        total: { min: 2, max: 8 },           // Daily incidents
        status: {
            open: { min: 0.30, max: 0.40 },           // 30-40%
            inProgress: { min: 0.20, max: 0.30 },     // 20-30%
            escalated: { min: 0.05, max: 0.15 },      // 5-15%
            closed: { min: 0.20, max: 0.30 },         // 20-30%
        },
    },

    // Threat Hunting
    threatHunting: {
        campaigns: { min: 0, max: 4 },
        iocMatches: { min: 5, max: 25 },
        patternDetections: { min: 0, max: 12 },
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
    // Validation
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new Error('randomInRange: min and max must be numbers');
    }
    if (!isFinite(min) || !isFinite(max)) {
        throw new Error('randomInRange: min and max must be finite numbers');
    }
    if (min > max) {
        throw new Error('randomInRange: min cannot be greater than max');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random percentage within range
 */
function randomPercentage(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Normalize percentages to sum to 1.0
 */
function normalizePercentages(values: number[]): number[] {
    // Validation
    if (!Array.isArray(values) || values.length === 0) {
        return [];
    }
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum === 0) {
        // Return equal distribution if sum is 0
        return values.map(() => 1 / values.length);
    }
    return values.map(v => v / sum);
}

// ============================================================================
// ALERT STATISTICS
// ============================================================================

export interface AlertStatistics {
    total: number;
    filtered: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    open: number;
    escalated: number;
    ignored: number;
    closed: number;
}

/**
 * Generate realistic alert statistics
 */
export function generateAlertStatistics(): AlertStatistics {
    const total = randomInRange(
        STATISTICS_CONFIG.alerts.total.min,
        STATISTICS_CONFIG.alerts.total.max
    );

    const filtered = randomInRange(
        STATISTICS_CONFIG.alerts.filtered.min,
        STATISTICS_CONFIG.alerts.filtered.max
    );

    // Generate severity percentages
    const severityPercentages = normalizePercentages([
        randomPercentage(
            STATISTICS_CONFIG.alerts.severity.critical.min,
            STATISTICS_CONFIG.alerts.severity.critical.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.alerts.severity.high.min,
            STATISTICS_CONFIG.alerts.severity.high.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.alerts.severity.medium.min,
            STATISTICS_CONFIG.alerts.severity.medium.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.alerts.severity.low.min,
            STATISTICS_CONFIG.alerts.severity.low.max
        ),
    ]);

    const critical = Math.floor(total * severityPercentages[0]);
    const high = Math.floor(total * severityPercentages[1]);
    const medium = Math.floor(total * severityPercentages[2]);
    const low = total - critical - high - medium; // Ensure exact sum

    // Status distribution (realistic SOC workflow)
    const open = Math.floor(total * 0.45); // 45% still open
    const escalated = Math.floor(total * 0.25); // 25% escalated
    const ignored = Math.floor(total * 0.15); // 15% ignored
    const closed = total - open - escalated - ignored; // Remainder closed

    return {
        total,
        filtered,
        critical,
        high,
        medium,
        low,
        open,
        escalated,
        ignored,
        closed,
    };
}

// ============================================================================
// INCIDENT STATISTICS
// ============================================================================

export interface IncidentStatistics {
    total: number;
    open: number;
    inProgress: number;
    escalated: number;
    closed: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
}

/**
 * Generate realistic incident statistics
 */
export function generateIncidentStatistics(): IncidentStatistics {
    const total = randomInRange(
        STATISTICS_CONFIG.incidents.total.min,
        STATISTICS_CONFIG.incidents.total.max
    );

    // Generate status percentages
    const statusPercentages = normalizePercentages([
        randomPercentage(
            STATISTICS_CONFIG.incidents.status.open.min,
            STATISTICS_CONFIG.incidents.status.open.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.incidents.status.inProgress.min,
            STATISTICS_CONFIG.incidents.status.inProgress.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.incidents.status.escalated.min,
            STATISTICS_CONFIG.incidents.status.escalated.max
        ),
        randomPercentage(
            STATISTICS_CONFIG.incidents.status.closed.min,
            STATISTICS_CONFIG.incidents.status.closed.max
        ),
    ]);

    const open = Math.floor(total * statusPercentages[0]);
    const inProgress = Math.floor(total * statusPercentages[1]);
    const escalated = Math.floor(total * statusPercentages[2]);
    const closed = total - open - inProgress - escalated;

    // Severity distribution for incidents (higher severity than alerts)
    const critical = Math.floor(total * 0.12); // 12%
    const high = Math.floor(total * 0.35); // 35%
    const medium = Math.floor(total * 0.38); // 38%
    const low = total - critical - high - medium;

    return {
        total,
        open,
        inProgress,
        escalated,
        closed,
        critical,
        high,
        medium,
        low,
    };
}

// ============================================================================
// THREAT HUNTING STATISTICS
// ============================================================================

export interface ThreatHuntingStatistics {
    activeCampaigns: number;
    iocMatches: number;
    patternDetections: number;
    suspiciousUsers: number;
    suspiciousHosts: number;
    newIOCs: number;
}

/**
 * Generate realistic threat hunting statistics
 */
export function generateThreatHuntingStatistics(): ThreatHuntingStatistics {
    return {
        activeCampaigns: randomInRange(
            STATISTICS_CONFIG.threatHunting.campaigns.min,
            STATISTICS_CONFIG.threatHunting.campaigns.max
        ),
        iocMatches: randomInRange(
            STATISTICS_CONFIG.threatHunting.iocMatches.min,
            STATISTICS_CONFIG.threatHunting.iocMatches.max
        ),
        patternDetections: randomInRange(
            STATISTICS_CONFIG.threatHunting.patternDetections.min,
            STATISTICS_CONFIG.threatHunting.patternDetections.max
        ),
        suspiciousUsers: randomInRange(2, 8),
        suspiciousHosts: randomInRange(3, 12),
        newIOCs: randomInRange(5, 20),
    };
}

// ============================================================================
// HOME DASHBOARD STATISTICS
// ============================================================================

export interface HomeDashboardStatistics {
    currentAlerts: number;
    activeIncidents: number;
    suspiciousUsers: number;
    newIOCs: number;
    threatFeedsUpdated: number;
    campaignsDetected: number;
    systemUptime: number;
}

/**
 * Generate realistic home dashboard statistics
 */
export function generateHomeDashboardStatistics(
    alertStats: AlertStatistics,
    incidentStats: IncidentStatistics,
    threatStats: ThreatHuntingStatistics
): HomeDashboardStatistics {
    return {
        currentAlerts: alertStats.filtered,
        activeIncidents: incidentStats.open + incidentStats.inProgress,
        suspiciousUsers: threatStats.suspiciousUsers,
        newIOCs: threatStats.newIOCs,
        threatFeedsUpdated: randomInRange(2, 6),
        campaignsDetected: threatStats.activeCampaigns,
        systemUptime: 99.2 + Math.random() * 0.7, // 99.2-99.9%
    };
}

// ============================================================================
// MASTER STATISTICS GENERATOR
// ============================================================================

export interface PlatformStatistics {
    alerts: AlertStatistics;
    incidents: IncidentStatistics;
    threatHunting: ThreatHuntingStatistics;
    home: HomeDashboardStatistics;
}

/**
 * Generate all platform statistics in one consistent set
 */
export function generatePlatformStatistics(): PlatformStatistics {
    const alerts = generateAlertStatistics();
    const incidents = generateIncidentStatistics();
    const threatHunting = generateThreatHuntingStatistics();
    const home = generateHomeDashboardStatistics(alerts, incidents, threatHunting);

    return {
        alerts,
        incidents,
        threatHunting,
        home,
    };
}
