"use client";

import { useState, useMemo, useCallback } from "react";
import type { Task, DailyLog } from "@/types/api";
import { addDays, getDayOfWeek } from "@/lib/date-utils";

interface CalendarProps {
    tasks: Task[];
    logs: DailyLog[];
    currentMonth: string; // YYYY-MM
    onMonthChange: (month: string) => void;
    onToggleLog: (taskId: string, date: string) => void;
    selectedTaskId: string | null;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function Calendar({
    tasks,
    logs,
    currentMonth,
    onMonthChange,
    onToggleLog,
    selectedTaskId,
}: CalendarProps) {
    const [year, month] = currentMonth.split("-").map(Number);

    // Build a map: date -> taskId[] for quick lookup
    const logMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        logs.forEach((log) => {
            if (!map.has(log.logDate)) map.set(log.logDate, new Set());
            map.get(log.logDate)!.add(log.taskId);
        });
        return map;
    }, [logs]);

    // Get task color map
    const taskColorMap = useMemo(() => {
        const map = new Map<string, string>();
        tasks.forEach((t) => map.set(t.id, t.color));
        return map;
    }, [tasks]);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: { date: string; inMonth: boolean; day: number }[] = [];

        // Padding days from previous month
        for (let i = startPad - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, -i);
            days.push({
                date: d.toISOString().split("T")[0],
                inMonth: false,
                day: d.getDate(),
            });
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            days.push({ date: dateStr, inMonth: true, day: d });
        }

        // Padding days for next month
        const remaining = 42 - days.length; // 6 rows × 7 cols
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month, i);
            days.push({
                date: d.toISOString().split("T")[0],
                inMonth: false,
                day: d.getDate(),
            });
        }

        return days;
    }, [year, month]);

    const today = new Date().toISOString().split("T")[0];

    const navigateMonth = (delta: number) => {
        const d = new Date(year, month - 1 + delta, 1);
        const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        onMonthChange(newMonth);
    };

    const handleDayClick = (date: string) => {
        if (selectedTaskId) {
            onToggleLog(selectedTaskId, date);
        }
    };

    return (
        <div className="calendar-container">
            {/* Month navigation */}
            <div className="calendar-header">
                <button
                    className="calendar-nav-btn"
                    onClick={() => navigateMonth(-1)}
                    aria-label="Previous month"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h2 className="calendar-month-title">
                    {MONTH_NAMES[month - 1]} {year}
                </h2>
                <button
                    className="calendar-nav-btn"
                    onClick={() => navigateMonth(1)}
                    aria-label="Next month"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Weekday headers */}
            <div className="calendar-grid calendar-weekdays">
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="calendar-weekday-label">
                        {label}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="calendar-grid">
                {calendarDays.map(({ date, inMonth, day }) => {
                    const taskIdsForDay = logMap.get(date);
                    const isToday = date === today;
                    const isSelected = selectedTaskId && taskIdsForDay?.has(selectedTaskId);

                    // Collect colors of all logged tasks for this day
                    const dotColors: string[] = [];
                    if (taskIdsForDay) {
                        taskIdsForDay.forEach((tid) => {
                            const color = taskColorMap.get(tid);
                            if (color) dotColors.push(color);
                        });
                    }

                    return (
                        <button
                            key={date}
                            className={`calendar-day ${!inMonth ? "calendar-day-outside" : ""} ${isToday ? "calendar-day-today" : ""} ${isSelected ? "calendar-day-active" : ""}`}
                            onClick={() => inMonth && handleDayClick(date)}
                            disabled={!inMonth || !selectedTaskId}
                            aria-label={`${date}${isToday ? " (Today)" : ""}${dotColors.length ? ` - ${dotColors.length} tasks completed` : ""}`}
                        >
                            <span className="calendar-day-number">{day}</span>
                            {dotColors.length > 0 && (
                                <div className="calendar-day-dots">
                                    {dotColors.slice(0, 4).map((color, i) => (
                                        <span
                                            key={i}
                                            className="calendar-day-dot"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
