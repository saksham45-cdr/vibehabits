"use client";

import { useState } from "react";
import type { Frequency } from "@/types/api";

interface TaskFormProps {
    onSubmit: (data: { name: string; frequency: Frequency; color: string }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const PRESET_COLORS = [
    "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4",
    "#22c55e", "#eab308", "#f59e0b", "#ef4444",
    "#ec4899", "#a855f7",
];

export default function TaskForm({ onSubmit, onCancel, isLoading = false }: TaskFormProps) {
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const [color, setColor] = useState(PRESET_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isLoading) return;
        onSubmit({ name: name.trim(), frequency, color });
    };

    return (
        <div className="task-form-overlay">
            <form className="task-form" onSubmit={handleSubmit}>
                <h3 className="task-form-title">New Habit</h3>

                <div className="task-form-field">
                    <label htmlFor="task-name" className="task-form-label">Name</label>
                    <input
                        id="task-name"
                        type="text"
                        className="task-form-input"
                        placeholder="e.g. Morning Meditation"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        disabled={isLoading}
                    />
                </div>

                <div className="task-form-field">
                    <label className="task-form-label">Frequency</label>
                    <div className="task-form-frequency-group">
                        {(["daily", "weekday", "weekly"] as Frequency[]).map((freq) => (
                            <button
                                key={freq}
                                type="button"
                                className={`task-form-freq-btn ${frequency === freq ? "task-form-freq-btn-active" : ""}`}
                                onClick={() => setFrequency(freq)}
                                disabled={isLoading}
                            >
                                {freq === "daily" ? "Every Day" : freq === "weekday" ? "Weekdays" : "Weekly"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="task-form-field">
                    <label className="task-form-label">Color</label>
                    <div className="task-form-color-grid">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`task-form-color-btn ${color === c ? "task-form-color-btn-active" : ""}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                                aria-label={`Select color ${c}`}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                </div>

                <div className="task-form-actions">
                    <button type="button" className="task-form-cancel-btn" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="task-form-submit-btn" disabled={!name.trim() || isLoading}>
                        {isLoading ? "Creating..." : "Create Habit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
