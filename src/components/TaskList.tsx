"use client";

import type { Task, DailyLog, StreakResult } from "@/types/api";
import { useMemo } from "react";

interface TaskListProps {
    tasks: Task[];
    logs: DailyLog[];
    selectedTaskId: string | null;
    onSelectTask: (taskId: string | null) => void;
    onToggleToday: (taskId: string) => void;
    today: string;
}

export default function TaskList({
    tasks,
    logs,
    selectedTaskId,
    onSelectTask,
    onToggleToday,
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
                                    <span className="task-item-frequency">{task.frequency}</span>
                                </div>
                            </div>

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
