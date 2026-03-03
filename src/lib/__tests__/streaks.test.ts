// VibeCalendar — Streak Unit Tests (Layer 2)
// Framework §5: Analytics Integrity Validation — 5 known-outcome scenarios

import { computeStreak, computeCompletionRate } from "../streaks";
import type { DailyLog, Frequency } from "@/types/api";

// Helper to create log entries
function makeLogs(dates: string[]): Pick<DailyLog, "logDate">[] {
    return dates.map((d) => ({ logDate: d }));
}

describe("computeStreak — Analytics Integrity Validation", () => {
    const today = "2026-03-02";

    // =====================================================
    // Scenario 1: ZERO STREAK — task with no logs
    // =====================================================
    test("Scenario 1: zero streak — no logs produces zero values", () => {
        const result = computeStreak([], "daily", today);
        expect(result.currentStreak).toBe(0);
        expect(result.longestStreak).toBe(0);
        expect(result.lastLogDate).toBeNull();
        expect(result.isActiveToday).toBe(false);
    });

    // =====================================================
    // Scenario 2: ACTIVE STREAK — 5 consecutive daily logs ending today
    // =====================================================
    test("Scenario 2: active streak — 5 consecutive days ending today", () => {
        const logs = makeLogs([
            "2026-02-26",
            "2026-02-27",
            "2026-02-28",
            "2026-03-01",
            "2026-03-02",
        ]);
        const result = computeStreak(logs, "daily", today);
        expect(result.currentStreak).toBe(5);
        expect(result.longestStreak).toBe(5);
        expect(result.isActiveToday).toBe(true);
        expect(result.lastLogDate).toBe("2026-03-02");
    });

    // =====================================================
    // Scenario 3: BROKEN STREAK — gap in the middle
    // =====================================================
    test("Scenario 3: broken streak — gap resets current streak", () => {
        const logs = makeLogs([
            "2026-02-25",
            "2026-02-26",
            "2026-02-27",
            // gap on 2026-02-28
            "2026-03-01",
            "2026-03-02",
        ]);
        const result = computeStreak(logs, "daily", today);
        expect(result.currentStreak).toBe(2);
        expect(result.longestStreak).toBe(3);
        expect(result.isActiveToday).toBe(true);
    });

    // =====================================================
    // Scenario 4: WEEKDAY-FREQUENCY TASK — weekends are non-applicable
    // =====================================================
    test("Scenario 4: weekday task — weekends are skipped, not breaks", () => {
        const logs = makeLogs([
            "2026-02-23", // Mon
            "2026-02-24", // Tue
            "2026-02-25", // Wed
            "2026-02-26", // Thu
            "2026-02-27", // Fri
            // Sat 2/28 & Sun 3/1 are weekends — not expected
            "2026-03-02", // Mon
        ]);
        const result = computeStreak(logs, "weekday", today);
        expect(result.currentStreak).toBe(6);
        expect(result.longestStreak).toBe(6);
        expect(result.isActiveToday).toBe(true);
    });

    // =====================================================
    // Scenario 5: DST BOUNDARY — spring forward does not break streak
    // =====================================================
    test("Scenario 5: DST boundary — date continuity is preserved", () => {
        // US Spring Forward: 2026-03-08, testing around that boundary
        const dstToday = "2026-03-09";
        const logs = makeLogs(["2026-03-07", "2026-03-08", "2026-03-09"]);
        const result = computeStreak(logs, "daily", dstToday);
        expect(result.currentStreak).toBe(3);
        expect(result.longestStreak).toBe(3);
        expect(result.isActiveToday).toBe(true);
    });
});

describe("computeCompletionRate", () => {
    test("returns 0 for no logs", () => {
        const rate = computeCompletionRate([], "daily", {
            start: "2026-02-01",
            end: "2026-02-28",
        });
        expect(rate).toBe(0);
    });

    test("returns 1.0 for fully completed range", () => {
        // 3 days, all logged
        const logs = makeLogs(["2026-03-01", "2026-03-02", "2026-03-03"]);
        const rate = computeCompletionRate(logs, "daily", {
            start: "2026-03-01",
            end: "2026-03-03",
        });
        expect(rate).toBe(1);
    });

    test("returns correct partial rate", () => {
        // 4 days, 2 logged
        const logs = makeLogs(["2026-03-01", "2026-03-03"]);
        const rate = computeCompletionRate(logs, "daily", {
            start: "2026-03-01",
            end: "2026-03-04",
        });
        expect(rate).toBe(0.5);
    });
});
