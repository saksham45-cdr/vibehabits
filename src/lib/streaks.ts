// VibeCalendar — Streak Calculation (Layer 2)
// Framework §3: "A streak is always computed from raw DailyLog entries ordered by date"

import type { DailyLog, Frequency, StreakResult, DateRange } from "@/types/api";
import { getExpectedDates } from "./frequency";
import { addDays } from "./date-utils";

/**
 * Compute streak from raw DailyLog entries.
 * Pure, deterministic function — no side effects.
 *
 * Framework §3: "it is never stored as a column, never inferred from a cache"
 *
 * @param logs     Raw DailyLog entries for a single task, unordered is fine
 * @param frequency The task's frequency setting
 * @param today    The current date (YYYY-MM-DD), resolved server-side from user's timezone
 */
export function computeStreak(
    logs: Pick<DailyLog, "logDate">[],
    frequency: Frequency,
    today: string
): StreakResult {
    if (logs.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLogDate: null,
            isActiveToday: false,
        };
    }

    // Create a set of logged dates for O(1) lookup
    const loggedDates = new Set(logs.map((l) => l.logDate));
    const isActiveToday = loggedDates.has(today);

    // Build the expected dates from the earliest log to today
    const sortedLogDates = [...loggedDates].sort();
    const earliestLog = sortedLogDates[0];
    const lastLogDate = sortedLogDates[sortedLogDates.length - 1];

    const dateRange: DateRange = { start: earliestLog, end: today };
    const expectedDates = getExpectedDates(frequency, dateRange);

    if (expectedDates.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLogDate,
            isActiveToday,
        };
    }

    // Walk backwards through expected dates from today to compute current streak
    let currentStreak = 0;
    for (let i = expectedDates.length - 1; i >= 0; i--) {
        if (loggedDates.has(expectedDates[i])) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Walk forward through all expected dates to compute longest streak
    let longestStreak = 0;
    let runningStreak = 0;
    for (const date of expectedDates) {
        if (loggedDates.has(date)) {
            runningStreak++;
            longestStreak = Math.max(longestStreak, runningStreak);
        } else {
            runningStreak = 0;
        }
    }

    return {
        currentStreak,
        longestStreak,
        lastLogDate,
        isActiveToday,
    };
}

/**
 * Compute completion rate for a task over a date range.
 * Returns a value between 0 and 1.
 */
export function computeCompletionRate(
    logs: Pick<DailyLog, "logDate">[],
    frequency: Frequency,
    dateRange: DateRange
): number {
    const expectedDates = getExpectedDates(frequency, dateRange);
    if (expectedDates.length === 0) return 0;

    const loggedDates = new Set(logs.map((l) => l.logDate));
    const completed = expectedDates.filter((d) => loggedDates.has(d)).length;

    return completed / expectedDates.length;
}
