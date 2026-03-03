// VibeCalendar — Centralized Configuration
// Framework §5: Feature flags gate all Layer 5 (AI) functionality

export const config = {
    /** AI features are disabled by default per framework §5 */
    enableAI: process.env.NEXT_PUBLIC_ENABLE_AI === "true",

    /** Default timezone fallback */
    defaultTimezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "UTC",

    /** Database URL */
    databaseUrl: process.env.DATABASE_URL || "",

    /** Supabase Config */
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },

    /** Performance ceilings from framework §4 */
    performance: {
        logToggleMaxMs: 600,
        monthlyAnalyticsMaxMs: 1500,
    },
} as const;
