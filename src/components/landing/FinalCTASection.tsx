'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn, staggerContainer } from '@/app/landing/page'

export default function FinalCTASection() {
  const router = useRouter()

  return (
    <section style={{
      padding: '140px 24px 120px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(139,124,248,0.09) 0%, transparent 62%)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', margin: '0 auto' }}>

        {/* Closing headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 5vw, 54px)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Most habits fail because nobody&apos;s watching.
          </motion.p>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 5vw, 54px)',
              color: 'var(--accent-violet)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginTop: '8px',
            }}
          >
            Be the one who watches.
          </motion.p>
        </motion.div>

        {/* Sub-lines */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ margin: '48px 0 0' }}
        >
          {[
            'VibeCalendar is free.',
            'Open it today.',
            'Mark one habit.',
            'Start there.',
          ].map(line => (
            <motion.p
              key={line}
              variants={fadeIn}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                color: 'var(--text-muted)',
                lineHeight: 2.4,
                margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginTop: '56px' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 80px rgba(139,124,248,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard')}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '18px',
              background: 'var(--accent-violet)',
              color: 'white',
              padding: '18px 48px',
              borderRadius: '999px',
              boxShadow: '0 0 60px rgba(139,124,248,0.42)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            → Start Tracking — It&apos;s Free
          </motion.button>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-faint)',
            marginTop: '20px',
          }}>
            No account needed to explore. Your data stays yours.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
