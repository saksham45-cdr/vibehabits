"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Rotating single-arc spinner — GPU transform only, zero JS per frame. */
function Spinner() {
  return (
    <motion.svg
      width="20" height="20" viewBox="0 0 20 20" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      style={{ display: "block" }}
    >
      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M18 10A8 8 0 0 0 10 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </motion.svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Two independent loading flags — submit and guest never block each other.
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const prefersReduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: prevent double-trigger while a request is already in flight.
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // On success: AuthContext picks up the new session and unmounts this
        // component. We intentionally do NOT update state here — setting state
        // on an unmounting component causes the React warning and can interfere
        // with navigation. Navigation is driven by AuthContext, not this button.
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Signup may keep user on this page (email-verification flow).
        // Reset immediately — no artificial delay that would run after unmount.
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    // Guard: prevent double-trigger.
    if (loadingGuest || loading) return;
    setError(null);
    setLoadingGuest(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      // AuthContext handles navigation on success — no state update needed.
    } catch (err: any) {
      setError(err.message || "Guest login failed");
      setLoadingGuest(false);
    }
  };

  const isIdle = !loading;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="auth-container">
      <div className="auth-bg-blobs">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
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
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          {/*
           * ── Primary button — stable width, no morph ──────────────────────
           *
           * The width-morph from the previous version (idle→circle→idle) was
           * the primary source of instability: it required capturing offsetWidth
           * before the API call, added a lockedWidth state update that raced
           * with the fetch, and left setTimeout callbacks that fired after
           * unmount. Removed entirely.
           *
           * Two layers sit inside with position:absolute — the text label
           * (always in DOM) anchors the button height throughout transitions.
           *
           *   [text label]   opacity 1 → 0 while loading
           *   [spinner]      opacity 0 → 1 while loading
           */}
          <motion.button
            className="auth-submit-btn"
            type="submit"
            disabled={loading || loadingGuest}
            whileHover={isIdle && !prefersReduced ? {
              scale:     1.02,
              boxShadow: "0 0 36px rgba(139,92,246,0.55)",
            } : undefined}
            whileTap={isIdle && !prefersReduced ? { scale: 0.97 } : undefined}
            transition={{ duration: 0.2, ease }}
            style={{
              position:       "relative",
              overflow:       "hidden",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              cursor:         isIdle ? "pointer" : "default",
              width:          "100%",
            }}
          >
            {/* Text label — stays in DOM; its line-height anchors button height. */}
            <motion.span
              animate={{ opacity: loading ? 0 : 1, y: loading ? -10 : 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ display: "block", pointerEvents: "none", whiteSpace: "nowrap" }}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </motion.span>

            {/* Spinner — absolute, no layout contribution */}
            <motion.span
              animate={{ opacity: loading ? 1 : 0, scale: loading ? 1 : 0.5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position:       "absolute",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                pointerEvents:  "none",
              }}
            >
              <Spinner />
            </motion.span>
          </motion.button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/*
         * ── Guest button — simple opacity swap, no morph ─────────────────
         * Separate loading state; unaffected by submit loading.
         */}
        <motion.button
          className="auth-secondary-btn guest-btn"
          onClick={handleGuestLogin}
          disabled={loading || loadingGuest}
          whileHover={!loadingGuest && isIdle && !prefersReduced ? {
            scale:     1.015,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.14)",
          } : undefined}
          whileTap={!loadingGuest && isIdle && !prefersReduced ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.2, ease }}
          title="Try the app without an account"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            overflow:       "hidden",
            position:       "relative",
          }}
        >
          <motion.span
            animate={{ opacity: loadingGuest ? 0 : 1, y: loadingGuest ? -8 : 0 }}
            transition={{ duration: 0.15 }}
            style={{ pointerEvents: "none" }}
          >
            Continue as Guest
          </motion.span>
          <motion.span
            animate={{ opacity: loadingGuest ? 1 : 0, scale: loadingGuest ? 1 : 0.6 }}
            transition={{ duration: 0.15 }}
            style={{ position: "absolute", display: "flex" }}
          >
            <motion.svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <path d="M14 8A6 6 0 0 0 8 2" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          </motion.span>
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
