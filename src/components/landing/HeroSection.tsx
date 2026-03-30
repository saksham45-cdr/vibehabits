'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn } from '@/app/landing/page'

const tileIndices = Array.from({ length: 21 }, (_, i) => i)
const violetTiles = new Set([0, 1, 2, 4, 5, 7, 8, 9, 11, 13, 14])
const tealTiles = new Set([3, 6, 15, 18])

function getTileStyle(i: number): React.CSSProperties {
  if (violetTiles.has(i)) return {
    background: 'rgba(139,124,248,0.55)',
    border: '1px solid rgba(139,124,248,0.7)',
  }
  if (tealTiles.has(i)) return {
    background: 'rgba(34,212,168,0.45)',
    border: '1px solid rgba(34,212,168,0.6)',
  }
  return {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
  }
}

export default function HeroSection() {
  const router = useRouter()

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      {/* Radial top-right */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', top: 0, left: 0,
        background: 'radial-gradient(ellipse 80% 60% at 68% 18%, rgba(139,124,248,0.11) 0%, transparent 60%)',
        zIndex: 0,
      }} />

      {/* Radial bottom-left */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%', top: 0, left: 0,
        background: 'radial-gradient(ellipse 50% 45% at 8% 88%, rgba(34,212,168,0.07) 0%, transparent 55%)',
        zIndex: 0,
      }} />

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', width: '100%' }}>

        {/* Badge */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-violet)',
            background: 'rgba(139,124,248,0.1)',
            border: '1px solid rgba(139,124,248,0.25)',
            padding: '6px 16px',
            borderRadius: '999px',
            letterSpacing: '0.04em',
            marginBottom: '32px',
          }}>
            ✦ Free to use · No account required
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(36px, 6vw, 68px)',
            lineHeight: 1.08,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          You know the habit.<br />
          You just{' '}
          <span style={{
            color: 'var(--accent-violet)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(139,124,248,0.4)',
            textUnderlineOffset: '6px',
          }}>never</span>
          {' '}track it<br />
          long enough.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '520px',
            margin: '24px auto 0',
            lineHeight: 1.75,
          }}
        >
          VibeCalendar is your daily habit tracker — built for people who actually want to stay consistent. No fluff. Just your calendar, your streaks, and real clarity.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          style={{ marginTop: '40px' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 56px rgba(139,124,248,0.55)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard')}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '16px',
              color: 'white',
              background: 'var(--accent-violet)',
              padding: '14px 36px',
              borderRadius: '999px',
              boxShadow: '0 0 36px rgba(139,124,248,0.38)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            → Open VibeCalendar
          </motion.button>
        </motion.div>

        {/* Microcopy */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.65 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-faint)',
            marginTop: '14px',
          }}
        >
          No signup chaos. No clutter. Just open and start.
        </motion.p>

        {/* Calendar Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 0.55, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card"
          style={{ padding: '24px', maxWidth: '420px', margin: '72px auto 0' }}
        >
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            color: 'var(--text-faint)',
            marginBottom: '12px',
            textAlign: 'left',
          }}>
            October
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 36px)',
            gap: '6px',
            justifyContent: 'center',
          }}>
            {tileIndices.map(i => (
              <div
                key={i}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  ...getTileStyle(i),
                }}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
