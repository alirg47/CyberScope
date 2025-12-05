'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        criticalAlerts: true,
        highAlerts: true,
        mediumAlerts: false,
        incidents: true,
        campaigns: true
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Settings</h1>
                <p className="dashboard-subtitle">Manage system preferences and notifications</p>
            </div>

            <div className="settings-layout">
                <div className="settings-card">
                    <h3 className="card-title">Notification Preferences</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Critical Alerts</div>
                            <div className="setting-description">Notifications for all critical severity alerts</div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.criticalAlerts}
                                onChange={(e) => setNotifications({ ...notifications, criticalAlerts: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">High Alerts</div>
                            <div className="setting-description">Notifications for high severity alerts</div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.highAlerts}
                                onChange={(e) => setNotifications({ ...notifications, highAlerts: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Medium Alerts</div>
                            <div className="setting-description">Notifications for medium severity alerts</div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.mediumAlerts}
                                onChange={(e) => setNotifications({ ...notifications, mediumAlerts: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Incident Notifications</div>
                            <div className="setting-description">Updates about incidents assigned to you</div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.incidents}
                                onChange={(e) => setNotifications({ ...notifications, incidents: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Campaign Notifications</div>
                            <div className="setting-description">Updates about active threat campaigns</div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications.campaigns}
                                onChange={(e) => setNotifications({ ...notifications, campaigns: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-card">
                    <h3 className="card-title">Alert Filters</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Minimum Risk Score</div>
                            <div className="setting-description">Show alerts with risk score above this threshold</div>
                        </div>
                        <select className="setting-select">
                            <option value="0">All (0+)</option>
                            <option value="40">Medium (40+)</option>
                            <option value="70">High (70+)</option>
                            <option value="90">Critical (90+)</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Alert Sources</div>
                            <div className="setting-description">Select alert sources to display</div>
                        </div>
                        <div className="setting-checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>SIEM</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>EDR</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>XDR</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>NDR</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>Email Gateway</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>Firewall</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3 className="card-title">Data Retention</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Alert Retention Period</div>
                            <div className="setting-description">How long to retain historical alert data</div>
                        </div>
                        <select className="setting-select">
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90" selected>90 days</option>
                            <option value="180">180 days</option>
                            <option value="365">1 year</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Incident Retention Period</div>
                            <div className="setting-description">How long to retain incident records</div>
                        </div>
                        <select className="setting-select">
                            <option value="90">90 days</option>
                            <option value="180">180 days</option>
                            <option value="365" selected>1 year</option>
                            <option value="730">2 years</option>
                        </select>
                    </div>
                </div>

                <div className="settings-actions">
                    <button className="btn btn-primary">Save Changes</button>
                    <button className="btn btn-secondary">Reset</button>
                </div>
            </div>
        </div>
    );
}
