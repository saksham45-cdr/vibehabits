"use client";

import { useState, useRef } from "react";
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

/**
 * Checkmark with SVG path-draw animation.
 * Keyed on `active` so the draw re-fires every time state enters 'success'.
 */
function CheckMark({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <motion.path
        key={active ? "draw" : "idle"}
        d="M5 12l5 5L20 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success";

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Primary button: full morph state machine
  const [btnState, setBtnState] = useState<BtnState>("idle");
  // Pixel width captured just before morphing — lets Framer Motion interpolate
  // from the exact rendered size rather than from "100%" string.
  const [lockedWidth, setLockedWidth] = useState<number | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Guest button: simpler independent loading flag
  const [loadingGuest, setLoadingGuest] = useState(false);

  // Respect OS-level prefers-reduced-motion.
  // When true: no scale/morph transforms; opacity fades still run.
  const prefersReduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Lock rendered width so the morph starts from the exact pixel size
    if (btnRef.current) setLockedWidth(btnRef.current.offsetWidth);
    setBtnState("loading");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Flash success checkmark — component will likely unmount quickly as
        // AuthContext propagates the new session, but the animation is visible
        // for at least one frame and adds premium feel.
        setBtnState("success");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Signup may stay on page (email verification flow) — show checkmark
        // for 1.4s then smoothly return to idle.
        setBtnState("success");
        await new Promise(r => setTimeout(r, 1400));
        setBtnState("idle");
        // Slight delay before releasing width control so the expand animation
        // finishes before CSS "width: 100%" takes over.
        setTimeout(() => setLockedWidth(null), 420);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      setBtnState("idle");
      setLockedWidth(null);
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

  // ── Derived flags ────────────────────────────────────────────────────────────

  const isIdle    = btnState === "idle";
  const isMorphed = btnState !== "idle"; // collapsed to circle shape

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
           * ── Primary morphing button ──────────────────────────────────────
           *
           * Width + border-radius are animated by Framer Motion.
           *
           * Three layers sit inside with position:absolute so they never
           * affect layout — the text label (always in DOM) anchors the height.
           *
           *   [text label]      opacity 1 → 0 on loading/success
           *   [spinner]         opacity 0 → 1 on loading
           *   [checkmark]       opacity 0 → 1 on success (path draws in)
           */}
          <motion.button
            ref={btnRef}
            className="auth-submit-btn"
            type="submit"
            disabled={!isIdle || loadingGuest}

            // Width morphs to ~52px (circle) on loading/success, then back.
            // lockedWidth holds the pixel width captured at click-time so
            // Framer Motion interpolates from an exact value, not "100%".
            animate={prefersReduced ? undefined : {
              width:        isMorphed ? 52            : (lockedWidth ?? undefined),
              borderRadius: isMorphed ? 999           : 16,
            }}

            whileHover={isIdle && !prefersReduced ? {
              scale:     1.02,
              boxShadow: "0 0 36px rgba(139,92,246,0.55)",
            } : undefined}
            whileTap={isIdle && !prefersReduced ? { scale: 0.97 } : undefined}

            transition={{ duration: 0.38, ease }}

            style={{
              position:        "relative",
              overflow:        "hidden",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              cursor:          isIdle ? "pointer" : "default",
              // width: "100%" is the CSS-controlled default when lockedWidth
              // is null and Framer Motion is not animating width.
              width: lockedWidth != null ? lockedWidth : "100%",
            }}
          >
            {/*
             * Text label — stays in DOM (never unmounted) so its line-height
             * always defines the button's natural height. Fades out on morph.
             */}
            <motion.span
              animate={{
                opacity: isIdle ? 1   : 0,
                y:       isIdle ? 0   : -10,
              }}
              transition={{
                opacity:  { duration: 0.18, ease: "easeOut", delay: isIdle ? 0.14 : 0 },
                y:        { duration: 0.18, ease: "easeOut", delay: isIdle ? 0.14 : 0 },
              }}
              style={{ display: "block", pointerEvents: "none", whiteSpace: "nowrap" }}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </motion.span>

            {/* Spinner — absolute, no layout contribution */}
            <motion.span
              animate={{
                opacity: btnState === "loading" ? 1    : 0,
                scale:   btnState === "loading" ? 1    : 0.5,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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

            {/* Checkmark — absolute, path-draw on enter */}
            <motion.span
              animate={{
                opacity: btnState === "success" ? 1    : 0,
                scale:   btnState === "success" ? 1    : 0.5,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position:       "absolute",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                pointerEvents:  "none",
              }}
            >
              <CheckMark active={btnState === "success"} />
            </motion.span>
          </motion.button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/*
         * ── Guest button — simpler loading, no morph ─────────────────────
         * Separate loading state; unaffected by submit loading.
         */}
        <motion.button
          className="auth-secondary-btn guest-btn"
          onClick={handleGuestLogin}
          disabled={!isIdle || loadingGuest}
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
