"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ── Spinner ───────────────────────────────────────────────────────────────────
// Single-arc SVG that Framer Motor spins. GPU-only transform, no JS per frame.
function Spinner({ color = "white", size = 16 }: { color?: string; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M14 8A6 6 0 0 0 8 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  // Honour system-level reduced-motion preference.
  // When true, skip scale/transform animations but keep opacity fades.
  const prefersReduced = useReducedMotion();

  const hoverScale = prefersReduced ? 1 : 1.02;
  const tapScale   = prefersReduced ? 1 : 0.97;
  const easing     = [0.22, 1, 0.36, 1] as const;

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
    setLoadingGuest(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Guest login failed");
    } finally {
      setLoadingGuest(false);
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

          {/* ── Primary submit button ─────────────────────────────────────── */}
          <motion.button
            className="auth-submit-btn"
            type="submit"
            disabled={loading || loadingGuest}
            whileHover={!loading && !loadingGuest ? {
              scale: hoverScale,
              boxShadow: "0 0 36px rgba(139,92,246,0.55)",
            } : undefined}
            whileTap={!loading && !loadingGuest ? { scale: tapScale } : undefined}
            transition={{ duration: 0.22, ease: easing }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Spinner color="white" size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {isLogin ? "Log In" : "Sign Up"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* ── Guest / secondary button ──────────────────────────────────── */}
        <motion.button
          className="auth-secondary-btn guest-btn"
          onClick={handleGuestLogin}
          disabled={loading || loadingGuest}
          whileHover={!loading && !loadingGuest ? {
            scale: hoverScale,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.14)",
          } : undefined}
          whileTap={!loading && !loadingGuest ? { scale: tapScale } : undefined}
          transition={{ duration: 0.2, ease: easing }}
          title="Try the app without an account"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loadingGuest ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Spinner color="rgba(255,255,255,0.8)" size={16} />
              </motion.span>
            ) : (
              <motion.span
                key="label"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                Continue as Guest
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="auth-footer">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "New here? Create an account" : "Already a member? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
