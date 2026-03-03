"use client";

import type { StreakResult } from "@/types/api";
import { generateMotivation } from "@/lib/ai/insights";
import { config } from "@/lib/config";

interface AiInsightCardProps {
    streak: StreakResult;
}

/**
 * Layer 5 — AI Insight Card
 * Feature-flagged, hidden when NEXT_PUBLIC_ENABLE_AI !== "true"
 * Framework §5: "A Layer 5 failure must never degrade Layer 1–4 availability"
 */
export default function AiInsightCard({ streak }: AiInsightCardProps) {
    if (!config.enableAI) return null;

    const message = generateMotivation(streak);
    if (!message) return null;

    return (
        <div className="ai-insight-card">
            <div className="ai-insight-header">
                <span className="ai-insight-badge">✨ AI Insight</span>
            </div>
            <p className="ai-insight-message">{message}</p>
        </div>
    );
}
