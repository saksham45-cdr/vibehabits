// VibeCalendar — AI Insights (Layer 5)
// Framework §5: Feature flags gate all AI functionality
// Framework §2: Layer 5 reads anonymized aggregates, holds no write access to Layers 1–4

import type { StreakResult } from "@/types/api";
import { config } from "@/lib/config";

/**
 * Generate motivational copy based on streak data.
 * This is a Layer 5 function — read-only, feature-flagged.
 * A Layer 5 failure must never degrade Layer 1–4 availability.
 */
export function generateMotivation(streak: StreakResult): string {
    if (!config.enableAI) return "";

    try {
        if (streak.currentStreak === 0) {
            const messages = [
                "Every journey begins with a single step. Start your streak today! 🌱",
                "Today is the perfect day to begin. You've got this! ✨",
                "A fresh start awaits. One log at a time. 🎯",
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }

        if (streak.currentStreak >= 30) {
            return `🔥 Incredible! ${streak.currentStreak} days and counting. You're unstoppable!`;
        }

        if (streak.currentStreak >= 14) {
            return `💪 ${streak.currentStreak}-day streak! You've built a real habit. Keep it going!`;
        }

        if (streak.currentStreak >= 7) {
            return `🌟 A full week! ${streak.currentStreak} days strong. Momentum is on your side.`;
        }

        if (streak.currentStreak >= 3) {
            return `✨ ${streak.currentStreak} days in a row! You're building something great.`;
        }

        return `👍 ${streak.currentStreak}-day streak started. Keep showing up!`;
    } catch {
        // Layer 5 failure must never degrade Layers 1–4
        return "";
    }
}

/**
 * Generate a weekly summary narrative.
 */
export function generateWeeklySummary(
    completionRate: number,
    streakCount: number
): string {
    if (!config.enableAI) return "";

    try {
        const pct = Math.round(completionRate * 100);

        if (pct >= 90) {
            return `Outstanding week! You completed ${pct}% of your goals with a ${streakCount}-day streak. 🏆`;
        }
        if (pct >= 70) {
            return `Great progress this week — ${pct}% completion rate. A few more days and you'll hit your stride! 📈`;
        }
        if (pct >= 50) {
            return `Solid effort at ${pct}%. Every completed day adds up. Tomorrow is another opportunity. 🌊`;
        }
        return `${pct}% this week. Remember: consistency beats perfection. Start small, stay steady. 🌿`;
    } catch {
        return "";
    }
}
