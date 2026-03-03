// VibeCalendar — Shared API Types (Layer 3 contracts)

export type Frequency = "daily" | "weekday" | "weekly";

export interface User {
    id: string;
    email: string;
    timezone: string; // IANA timezone, e.g. "America/New_York"
    createdAt: string;
}

export interface Task {
    id: string;
    userId: string;
    name: string;
    frequency: Frequency;
    color: string;
    archived: boolean;
    createdAt: string;
}

export interface DailyLog {
    id: string;
    taskId: string;
    logDate: string; // YYYY-MM-DD, resolved server-side from user's timezone
    createdAt: string;
}

export interface StreakResult {
    currentStreak: number;
    longestStreak: number;
    lastLogDate: string | null;
    isActiveToday: boolean;
}

export interface AnalyticsResult {
    taskId: string;
    streak: StreakResult;
    completionRate: number; // 0–1
    totalLogs: number;
    dateRange: DateRange;
}

export interface DateRange {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
}

export interface ApiError {
    code: string;
    message: string;
    statusCode: number;
}

export interface CreateTaskPayload {
    name: string;
    frequency: Frequency;
    color: string;
}

export interface UpdateTaskPayload {
    name?: string;
    frequency?: Frequency;
    color?: string;
    archived?: boolean;
}

export interface ToggleLogPayload {
    taskId: string;
    logDate: string; // YYYY-MM-DD
}
