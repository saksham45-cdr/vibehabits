"use client";

import type { Task, DailyLog, StreakResult } from "@/types/api";
import { useMemo } from "react";

interface TaskListProps {
    tasks: Task[];
    logs: DailyLog[];
    selectedTaskId: string | null;
    onSelectTask: (taskId: string | null) => void;
    onToggleToday: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    streaks: Map<string, number>;
    today: string;
}

export default function TaskList({
    tasks,
    logs,
    selectedTaskId,
    onSelectTask,
    onToggleToday,
    onDeleteTask,
    streaks,
    today,
}: TaskListProps) {
    // Check which tasks have been logged today
    const todayLogSet = useMemo(() => {
        const set = new Set<string>();
        logs.forEach((l) => {
            if (l.logDate === today) set.add(l.taskId);
        });
        return set;
    }, [logs, today]);

    return (
        <div className="task-list">
            <div className="task-list-header">
                <h3 className="task-list-title">My Habits</h3>
            </div>

            <div className="task-list-items">
                {tasks.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    const isDoneToday = todayLogSet.has(task.id);

                    const streak = streaks.get(task.id) ?? 0;

                    return (
                        <div
                            key={task.id}
                            className={`task-item ${isSelected ? "task-item-selected" : ""}`}
                            onClick={() => onSelectTask(isSelected ? null : task.id)}
                        >
                            <div className="task-item-left">
                                <div
                                    className="task-color-indicator"
                                    style={{ backgroundColor: task.color }}
                                />
                                <div className="task-item-info">
                                    <span className="task-item-name">{task.name}</span>
                                    <div className="task-item-meta">
                                        <span className="task-item-frequency">{task.frequency}</span>
                                        {streak > 0 && (
                                            <span className="task-streak-badge">🔥 {streak}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="task-item-actions">
                                <button
                                    className={`task-toggle-btn ${isDoneToday ? "task-toggle-done" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleToday(task.id);
                                    }}
                                    aria-label={`${isDoneToday ? "Unmark" : "Mark"} ${task.name} as done today`}
                                >
                                    {isDoneToday ? (
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                            <circle cx="11" cy="11" r="10" fill="currentColor" opacity="0.15" />
                                            <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M7 11L10 14L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                            <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    className="task-delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteTask(task.id);
                                    }}
                                    aria-label={`Delete ${task.name}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14H6L5 6" />
                                        <path d="M10 11v6M14 11v6" />
                                        <path d="M9 6V4h6v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {tasks.length === 0 && (
                <div className="task-list-empty">
                    <p>No habits yet. Create one to get started!</p>
                </div>
            )}
        </div>
    );
}
