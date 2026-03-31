'use client'

import { motion } from 'framer-motion'
import { fadeUp, fadeIn, staggerContainer, slideLeft } from '@/app/page'

const Divider = () => (
  <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '56px auto' }} />
)

export default function ValueLinesSection() {
  return (
    <section style={{
      padding: '120px 24px',
      textAlign: 'center',
      position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>

      {/* Stanza 1 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {[
          'Your gym streak? Visible.',
          'Your water habit? Tracked.',
          'Your sleep routine? Finally, honest.',
        ].map(line => (
          <motion.p
            key={line}
            variants={slideLeft}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.4,
              margin: '0 0 6px 0',
            }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      <Divider />

      {/* Stanza 2 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '18px',
            color: 'var(--text-muted)',
            margin: '0 0 8px 0',
          }}
        >
          Most habit apps make it complicated.
        </motion.p>
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '18px',
            color: 'var(--text-muted)',
            margin: '0 0 8px 0',
          }}
        >
          VibeCalendar just asks:
        </motion.p>
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(34px, 5.5vw, 58px)',
            color: 'var(--accent-teal)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginTop: '12px',
            textShadow: '0 0 64px rgba(34,212,168,0.4)',
          }}
        >
          Did you do it today?
        </motion.p>
      </motion.div>

      <Divider />

      {/* Stanza 3 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {[
          { text: 'See your whole month at a glance.', weight: 500, size: 'clamp(18px, 2.2vw, 24px)', color: 'var(--text-muted)' },
          { text: 'Spot your gaps. Fix your patterns.', weight: 500, size: 'clamp(18px, 2.2vw, 24px)', color: 'var(--text-muted)' },
          { text: 'Actually know yourself.', weight: 800, size: 'clamp(22px, 3vw, 30px)', color: 'var(--text-primary)' },
        ].map(({ text, weight, size, color }) => (
          <motion.p
            key={text}
            variants={fadeIn}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: weight,
              fontSize: size,
              color,
              margin: '0 0 8px 0',
            }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>

    </section>
  )
}
