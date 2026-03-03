// VibeCalendar — Frequency Resolution (Layer 2)

import type { Frequency, DateRange } from "@/types/api";
import { getDateRange, isWeekday, getDayOfWeek } from "./date-utils";

/**
 * Given a frequency and date range, return all dates where a log is expected.
 * This is used for streak calculation and completion rate.
 *
 * - "daily": every day
 * - "weekday": Mon–Fri only
 * - "weekly": one specific day per week (defaults to the day of the range start)
 */
export function getExpectedDates(
    frequency: Frequency,
    dateRange: DateRange,
    weeklyAnchorDay?: number // 0=Sun..6=Sat; used for "weekly" frequency
): string[] {
    const allDates = getDateRange(dateRange.start, dateRange.end);

    switch (frequency) {
        case "daily":
            return allDates;

        case "weekday":
            return allDates.filter((d) => isWeekday(d));

        case "weekly": {
            const anchor = weeklyAnchorDay ?? getDayOfWeek(dateRange.start);
            return allDates.filter((d) => getDayOfWeek(d) === anchor);
        }

        default:
            return allDates;
    }
}
