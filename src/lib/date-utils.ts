// VibeCalendar — Date Utilities (Layer 2)
// Framework §3: log_date is always resolved server-side using the user's IANA timezone

/**
 * Resolve "today" in the user's IANA timezone.
 * Returns YYYY-MM-DD string.
 */
export function resolveLogDate(timezone: string): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return formatter.format(now); // en-CA gives YYYY-MM-DD
}

/**
 * Check if a date falls on a DST boundary for the given timezone.
 */
export function isDSTBoundary(date: string, timezone: string): boolean {
    const d = new Date(date + "T12:00:00");
    const dayBefore = new Date(d);
    dayBefore.setDate(dayBefore.getDate() - 1);

    const getOffset = (dt: Date) => {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            timeZoneName: "shortOffset",
        }).formatToParts(dt);
        const tzPart = parts.find((p) => p.type === "timeZoneName");
        return tzPart?.value ?? "";
    };

    return getOffset(d) !== getOffset(dayBefore);
}

/**
 * Add days to a YYYY-MM-DD date string.
 */
export function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split("T")[0];
}

/**
 * Get the day of week (0=Sun, 6=Sat) for a YYYY-MM-DD date.
 */
export function getDayOfWeek(dateStr: string): number {
    const d = new Date(dateStr + "T12:00:00Z");
    return d.getUTCDay();
}

/**
 * Check if a date is a weekday (Mon-Fri).
 */
export function isWeekday(dateStr: string): boolean {
    const day = getDayOfWeek(dateStr);
    return day >= 1 && day <= 5;
}

/**
 * Get all dates between start and end (inclusive), as YYYY-MM-DD strings.
 */
export function getDateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    let current = start;
    while (current <= end) {
        dates.push(current);
        current = addDays(current, 1);
    }
    return dates;
}
