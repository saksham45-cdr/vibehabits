'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { fadeUp, fadeIn, staggerContainer } from '@/app/page'

const featureRows = [
  'Log daily milk delivery — morning, evening, or both',
  'Mark missed days instantly',
  'See the full month at a glance, no manual tallying',
  'Auto-calculate monthly bill — no WhatsApp math, no disputes',
]

// Minimal calendar mockup — illustrates taken/skipped pattern
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const TAKEN = new Set([1,2,3,5,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30,31])
const SKIPPED = new Set([4, 11, 18, 25])

export default function DoodhSection() {
  const router = useRouter()
  const { user } = useAuth()
  const sectionRef = useRef<HTMLElement>(null)

  // Drive background colour based on scroll position within this section.
  // Progress 0 → section top just enters viewport from below (dark).
  // Progress 1 → section top reaches mid-viewport (light).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start center'],
  })

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#07070F', '#F8F9FD'],
  )

  // Gradient overlay at section top fades out as user scrolls in,
  // eliminating the hard seam between dark landing and light section.
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleCTA = () => {
    // Both auth states route to the same URL.
    // Unauthenticated users will see AuthPage at /dashboard;
    // after login the ?open=doodh param is still in the URL and
    // dashboard reads it to auto-open the modal.
    router.push('/dashboard?open=doodh')
  }

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor, padding: '160px 24px 120px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Dark-to-light gradient seam — fades out once section is in view */}
      <motion.div
        style={{
          opacity: overlayOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, #07070F 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Subtle teal ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 65% 45% at 50% 30%, rgba(34,212,168,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>

        {/* Feature badge */}
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#22D4A8',
            background: 'rgba(34,212,168,0.1)',
            border: '1px solid rgba(34,212,168,0.3)',
            padding: '6px 18px',
            borderRadius: '999px',
            letterSpacing: '0.04em',
            marginBottom: '32px',
          }}>
            🥛 Built into VibeCalendar
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(40px, 7.5vw, 76px)',
            color: '#0F0F1A',
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            margin: 0,
          }}>
            Doodh ka Hisaab.
          </h2>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(26px, 4.5vw, 48px)',
            color: '#22D4A8',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '10px 0 0',
          }}>
            Track it. Bill it. Done.
          </p>
        </motion.div>

        {/* Value description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'rgba(15,15,26,0.55)',
            maxWidth: '560px',
            margin: '24px auto 0',
            lineHeight: 1.75,
          }}
        >
          Track daily milk, dues, and bill history — without the spreadsheet chaos.
          Built for households that want clarity and simple bookkeeping.
        </motion.p>

        {/* Compact calendar preview mockup */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '28px 28px 24px',
            margin: '56px auto',
            maxWidth: '500px',
            boxShadow: '0 2px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Mockup header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              color: '#0F0F1A',
            }}>
              March 2025
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: '#22D4A8',
              fontWeight: 700,
              background: 'rgba(34,212,168,0.1)',
              padding: '3px 10px',
              borderRadius: '999px',
            }}>
              ₹1,240 this month
            </span>
          </div>

          {/* Weekday row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '3px',
            marginBottom: '6px',
          }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} style={{
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(15,15,26,0.3)',
                paddingBottom: '4px',
              }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '3px',
          }}>
            {DAYS.map(day => (
              <div
                key={day}
                style={{
                  aspectRatio: '1',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  background: TAKEN.has(day)
                    ? 'rgba(34,212,168,0.15)'
                    : SKIPPED.has(day)
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(0,0,0,0.025)',
                  color: TAKEN.has(day)
                    ? '#16a085'
                    : SKIPPED.has(day)
                    ? '#e74c3c'
                    : 'rgba(15,15,26,0.25)',
                  border: TAKEN.has(day)
                    ? '1px solid rgba(34,212,168,0.3)'
                    : SKIPPED.has(day)
                    ? '1px solid rgba(239,68,68,0.2)'
                    : '1px solid transparent',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '18px',
            justifyContent: 'center',
          }}>
            {[
              { color: 'rgba(34,212,168,0.3)', label: 'Taken' },
              { color: 'rgba(239,68,68,0.2)', label: 'Skipped' },
            ].map(({ color, label }) => (
              <span key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(15,15,26,0.45)',
              }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Feature list */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ margin: '0 auto 48px', maxWidth: '520px', textAlign: 'left' }}
        >
          {featureRows.map(row => (
            <motion.div
              key={row}
              variants={fadeUp}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}
            >
              <span style={{
                color: '#22D4A8',
                fontWeight: 700,
                fontSize: '15px',
                marginTop: '2px',
                flexShrink: 0,
              }}>✓</span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'rgba(15,15,26,0.65)',
                lineHeight: 1.6,
              }}>
                {row}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Real-life callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: 'rgba(34,212,168,0.05)',
            border: '1px solid rgba(34,212,168,0.2)',
            borderRadius: '18px',
            padding: '28px 36px',
            margin: '0 auto 52px',
            maxWidth: '520px',
            textAlign: 'left',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '11px',
            color: '#22D4A8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Real-life use case
          </p>
          {[
            { text: "You open the app. It's the 30th.", highlight: false },
            { text: "Papaji asks: 'Kitna hua is mahine?'", highlight: false },
            { text: null, teal: '₹1,240', prefix: "You say: 'Exactly ", suffix: ". Here, dekho.'" },
            { text: "That's it. That's the feature.", highlight: true },
          ].map((item, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-display)',
              fontWeight: item.highlight ? 700 : 500,
              fontSize: '16px',
              color: item.highlight ? '#0F0F1A' : 'rgba(15,15,26,0.65)',
              lineHeight: 1.9,
              margin: 0,
            }}>
              {item.text ?? (
                <>
                  {item.prefix}
                  <span style={{ color: '#22D4A8', fontWeight: 700 }}>{item.teal}</span>
                  {item.suffix}
                </>
              )}
            </p>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 52px rgba(34,212,168,0.42)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCTA}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '16px',
              background: '#22D4A8',
              color: '#07070F',
              padding: '16px 42px',
              borderRadius: '999px',
              boxShadow: '0 4px 28px rgba(34,212,168,0.3)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🥛 Open Doodh ka Hisaab
          </motion.button>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'rgba(15,15,26,0.4)',
            marginTop: '14px',
          }}>
            {user
              ? 'Opens directly in your dashboard.'
              : 'Free to use. Quick login, then you\'re in.'}
          </p>
        </motion.div>

      </div>
    </motion.section>
  )
}
