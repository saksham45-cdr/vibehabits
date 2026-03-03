"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Guest login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-blobs">
                <div className="auth-blob auth-blob-1"></div>
                <div className="auth-blob auth-blob-2"></div>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <span className="brand-icon large">📅</span>
                    <h1>VibeCalendar</h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? "Welcome back. Re-enter your flow."
                            : "Start your journey. Build consistency today."}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button className="auth-submit-btn" type="submit" disabled={loading}>
                        {loading ? "Authenticating..." : (isLogin ? "Log In" : "Sign Up")}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>


                <button
                    className="auth-secondary-btn guest-btn"
                    onClick={handleGuestLogin}
                    disabled={loading}
                    title="Try the app without an account"
                >
                    Continue as Guest
                </button>

                <div className="auth-footer">
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "New here? Create an account" : "Already a member? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
