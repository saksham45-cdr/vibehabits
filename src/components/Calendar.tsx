"use client";

import { memo, useMemo, useCallback } from "react";
import type { Task, DailyLog } from "@/types/api";

interface CalendarProps {
    tasks: Task[];
    logs: DailyLog[];
    currentMonth: string; // YYYY-MM
    onMonthChange: (month: string) => void;
    onToggleLog: (taskId: string, date: string) => void;
    selectedTaskId: string | null;
    selectedTaskName?: string;
    selectedTaskColor?: string;
    onPrevHabit?: () => void;
    onNextHabit?: () => void;
    habitIndex?: number;
    habitCount?: number;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// ── DayCell — memoized so only the clicked cell re-renders on toggle ──
interface DayCellProps {
    date: string;
    day: number;
    inMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    dotColors: string[];
    onDayClick: (date: string) => void;
}

const DayCell = memo(function DayCell({
    date,
    day,
    inMonth,
    isToday,
    isSelected,
    isDisabled,
    dotColors,
    onDayClick,
}: DayCellProps) {
    return (
        <button
            className={`calendar-day${!inMonth ? " calendar-day-outside" : ""}${isToday ? " calendar-day-today" : ""}${isSelected ? " calendar-day-active" : ""}${isDisabled ? " calendar-day-future" : ""}`}
            onClick={() => onDayClick(date)}
            disabled={isDisabled}
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
});

const Calendar = memo(function Calendar({
    tasks,
    logs,
    currentMonth,
    onMonthChange,
    onToggleLog,
    selectedTaskId,
    selectedTaskName,
    selectedTaskColor,
    onPrevHabit,
    onNextHabit,
    habitIndex,
    habitCount,
}: CalendarProps) {
    const [year, month] = currentMonth.split("-").map(Number);

    const logMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        logs.forEach((log) => {
            if (!map.has(log.logDate)) map.set(log.logDate, new Set());
            map.get(log.logDate)!.add(log.taskId);
        });
        return map;
    }, [logs]);

    const taskColorMap = useMemo(() => {
        const map = new Map<string, string>();
        tasks.forEach((t) => map.set(t.id, t.color));
        return map;
    }, [tasks]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: { date: string; inMonth: boolean; day: number }[] = [];

        for (let i = startPad - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, -i);
            days.push({ date: d.toISOString().split("T")[0], inMonth: false, day: d.getDate() });
        }

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            days.push({ date: dateStr, inMonth: true, day: d });
        }

        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month, i);
            days.push({ date: d.toISOString().split("T")[0], inMonth: false, day: d.getDate() });
        }

        return days;
    }, [year, month]);

    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const navigateMonth = useCallback((delta: number) => {
        const d = new Date(year, month - 1 + delta, 1);
        onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }, [year, month, onMonthChange]);

    const handleDayClick = useCallback((date: string) => {
        if (selectedTaskId) onToggleLog(selectedTaskId, date);
    }, [selectedTaskId, onToggleLog]);

    return (
        <div className="calendar-container">
            {habitCount && habitCount > 0 ? (
                <div className="calendar-habit-slider">
                    <button className="calendar-nav-btn" onClick={onPrevHabit} aria-label="Previous habit">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="calendar-habit-name">
                        {selectedTaskColor && (
                            <span className="calendar-habit-dot" style={{ backgroundColor: selectedTaskColor }} />
                        )}
                        <span>{selectedTaskName ?? "Select a habit"}</span>
                        {habitCount > 1 && (
                            <span className="calendar-habit-counter">{(habitIndex ?? 0) + 1} / {habitCount}</span>
                        )}
                    </div>
                    <button className="calendar-nav-btn" onClick={onNextHabit} aria-label="Next habit">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="calendar-habit-empty">No habits yet — create one to get started</div>
            )}

            <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)} aria-label="Previous month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h2 className="calendar-month-title">
                    {MONTH_NAMES[month - 1]} {year}
                </h2>
                <button className="calendar-nav-btn" onClick={() => navigateMonth(1)} aria-label="Next month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="calendar-grid calendar-weekdays">
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="calendar-weekday-label">{label}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {calendarDays.map(({ date, inMonth, day }) => {
                    const taskIdsForDay = logMap.get(date);
                    const isSelected = !!(selectedTaskId && taskIdsForDay?.has(selectedTaskId));
                    const dotColors: string[] = [];
                    if (taskIdsForDay) {
                        taskIdsForDay.forEach((tid) => {
                            const color = taskColorMap.get(tid);
                            if (color) dotColors.push(color);
                        });
                    }
                    return (
                        <DayCell
                            key={date}
                            date={date}
                            day={day}
                            inMonth={inMonth}
                            isToday={date === today}
                            isSelected={isSelected}
                            isDisabled={!inMonth || !selectedTaskId || date > today}
                            dotColors={dotColors}
                            onDayClick={handleDayClick}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default Calendar;
