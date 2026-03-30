'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/app/page'

const pills = [
  { icon: '📅', title: 'Daily Check-in', sub: '10 seconds. Done.' },
  { icon: '🔥', title: 'Streak Tracking', sub: 'See your momentum build.' },
  { icon: '📊', title: 'Analytics Dashboard', sub: "Patterns you didn't know existed." },
  { icon: '🤖', title: 'AI Insights', sub: 'Not data. Understanding.' },
]

export default function ProductIntroSection() {
  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 52px)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          One calendar. Every habit. Full picture.
        </motion.h2>

        {/* Two-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '64px',
        }}>

          {/* Left column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--text-muted)',
              lineHeight: 1.85,
              marginBottom: '20px',
            }}>
              VibeCalendar gives you a clean, calendar-based view of your habits. Each day is a tile. Each habit is a mark.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--text-muted)',
              lineHeight: 1.85,
            }}>
              Together, they show you what your consistency actually looks like.
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--accent-violet)',
              marginTop: '32px',
            }}>
              It&apos;s not about gamification. It&apos;s about clarity.
            </p>
          </motion.div>

          {/* Right column — 2×2 pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {pills.map(({ icon, title, sub }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="glass-card"
                style={{ padding: '20px 18px' }}
              >
                <div style={{ fontSize: '22px' }}>{icon}</div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  marginTop: '10px',
                  marginBottom: '4px',
                }}>
                  {title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  {sub}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
