'use client';

import { getCurrentUser } from '@/data/mockUsers';

export default function ProfilePage() {
    const user = getCurrentUser();

    const formatLastLogin = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">User Profile</h1>
                <p className="dashboard-subtitle">Your account information and statistics</p>
            </div>

            <div className="profile-layout">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <span className="avatar-icon">👤</span>
                        </div>
                        <div className="profile-info">
                            <h2 className="profile-name">{user.name}</h2>
                            <p className="profile-name-en">{user.nameEn}</p>
                            <span
                                className="profile-role-badge"
                                style={{
                                    backgroundColor: user.role === 'L1' ? '#10b98120' :
                                        user.role === 'L2' ? '#f59e0b20' :
                                            user.role === 'L3' ? '#3b82f620' : '#8b5cf620',
                                    color: user.role === 'L1' ? '#10b981' :
                                        user.role === 'L2' ? '#f59e0b' :
                                            user.role === 'L3' ? '#3b82f6' : '#8b5cf6',
                                    border: `1px solid ${user.role === 'L1' ? '#10b981' :
                                            user.role === 'L2' ? '#f59e0b' :
                                                user.role === 'L3' ? '#3b82f6' : '#8b5cf6'
                                        }`
                                }}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Department:</span>
                            <span className="detail-value">{user.department}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Last Login:</span>
                            <span className="detail-value">{formatLastLogin(user.lastLogin)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">User ID:</span>
                            <span className="detail-value">{user.id}</span>
                        </div>
                    </div>
                </div>

                <div className="statistics-card">
                    <h3 className="card-title">Statistics</h3>
                    <div className="stats-grid-profile">
                        {user.role === 'L1' && (
                            <>
                                <div className="stat-item">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.alertsProcessed}</div>
                                        <div className="stat-label">Alerts Processed</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">⏱️</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.avgResponseTime} min</div>
                                        <div className="stat-label">Avg Response Time</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {(user.role === 'L2' || user.role === 'Lead') && (
                            <>
                                <div className="stat-item">
                                    <div className="stat-icon">🎯</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.incidentsHandled}</div>
                                        <div className="stat-label">Incidents Handled</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">✓</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.threatsConfirmed}</div>
                                        <div className="stat-label">Threats Confirmed</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">⏱️</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.avgResponseTime} min</div>
                                        <div className="stat-label">Avg Investigation Time</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {(user.role === 'L3' || user.role === 'Lead') && (
                            <>
                                <div className="stat-item">
                                    <div className="stat-icon">🔍</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.threatsConfirmed}</div>
                                        <div className="stat-label">Threats Discovered</div>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon">⏱️</div>
                                    <div className="stat-content">
                                        <div className="stat-value">{user.statistics.avgResponseTime} min</div>
                                        <div className="stat-label">Avg Analysis Time</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="activity-card">
                    <h3 className="card-title">Recent Activity</h3>
                    <div className="activity-timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-title">Login</div>
                                <div className="timeline-time">{formatLastLogin(user.lastLogin)}</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-title">Processed {user.role === 'L1' ? 'Alerts' : 'Incidents'}</div>
                                <div className="timeline-time">2 hours ago</div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-title">Profile Updated</div>
                                <div className="timeline-time">3 days ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
