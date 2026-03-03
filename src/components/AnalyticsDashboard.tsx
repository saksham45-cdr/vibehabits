"use client";

import type { StreakResult } from "@/types/api";

interface AnalyticsDashboardProps {
    taskName: string;
    taskColor: string;
    streak: StreakResult;
    completionRate: number;
    totalLogs: number;
}

export default function AnalyticsDashboard({
    taskName,
    taskColor,
    streak,
    completionRate,
    totalLogs,
}: AnalyticsDashboardProps) {
    const completionPct = Math.round(completionRate * 100);

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <div className="analytics-task-indicator" style={{ backgroundColor: taskColor }} />
                <h3 className="analytics-title">{taskName}</h3>
            </div>

            <div className="analytics-cards">
                {/* Current Streak */}
                <div className="analytics-card">
                    <div className="analytics-card-icon">🔥</div>
                    <div className="analytics-card-value">{streak.currentStreak}</div>
                    <div className="analytics-card-label">Current Streak</div>
                </div>

                {/* Longest Streak */}
                <div className="analytics-card">
                    <div className="analytics-card-icon">🏆</div>
                    <div className="analytics-card-value">{streak.longestStreak}</div>
                    <div className="analytics-card-label">Longest Streak</div>
                </div>

                {/* Completion Rate */}
                <div className="analytics-card">
                    <div className="analytics-card-icon">📊</div>
                    <div className="analytics-card-value">{completionPct}%</div>
                    <div className="analytics-card-label">30-Day Rate</div>
                    <div className="analytics-progress-bar">
                        <div
                            className="analytics-progress-fill"
                            style={{
                                width: `${completionPct}%`,
                                backgroundColor: taskColor,
                            }}
                        />
                    </div>
                </div>

                {/* Total Logs */}
                <div className="analytics-card">
                    <div className="analytics-card-icon">📝</div>
                    <div className="analytics-card-value">{totalLogs}</div>
                    <div className="analytics-card-label">Total Logs</div>
                </div>
            </div>

            {/* Streak status message */}
            <div className="analytics-status">
                {streak.isActiveToday ? (
                    <span className="analytics-status-active">✅ Done for today!</span>
                ) : (
                    <span className="analytics-status-pending">⏳ Not yet logged today</span>
                )}
            </div>
        </div>
    );
}
