'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp, fadeIn, staggerContainer } from '@/app/page'

const featureRows = [
  'Log daily milk delivery — morning, evening, or both',
  'Mark missed days instantly',
  'See the full month — same calendar, new layer',
  'Get auto-calculated bill — no WhatsApp math',
]

export default function DoodhSection() {
  const router = useRouter()

  return (
    <section style={{
      padding: '120px 24px',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(34,212,168,0.065) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>

        {/* Badge */}
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-teal)',
            background: 'rgba(34,212,168,0.1)',
            border: '1px solid rgba(34,212,168,0.25)',
            padding: '6px 16px',
            borderRadius: '999px',
            letterSpacing: '0.04em',
            marginBottom: '32px',
          }}>
            ✦ Special Feature
          </span>
        </motion.div>

        {/* Hook headline */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(44px, 8vw, 80px)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: 0,
          }}>
            Doodh ka Hisaab.
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(44px, 8vw, 80px)',
            color: 'var(--accent-teal)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginTop: '4px',
          }}>
            Finally.
          </p>
        </motion.div>

        {/* Problem block */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ margin: '48px 0' }}
        >
          {[
            { text: 'The milkman comes.', bold: false },
            { text: 'You take the milk.', bold: false },
            { text: "But at the end of the month?", bold: false },
            { text: "Nobody's sure what the number should be.", bold: true },
          ].map(({ text, bold }) => (
            <motion.p
              key={text}
              variants={fadeIn}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: bold ? 600 : 500,
                fontSize: '20px',
                color: bold ? 'var(--text-primary)' : 'var(--text-muted)',
                lineHeight: 2.2,
                margin: 0,
              }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>

        {/* Feature Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-card-teal"
          style={{
            padding: '40px 48px',
            margin: '48px auto',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Milk fill strip */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(to top, var(--accent-teal), rgba(34,212,168,0.2))',
              borderRadius: '24px 0 0 24px',
            }}
            initial={{ scaleY: 0, originY: 1 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            viewport={{ once: true }}
          />

          {featureRows.map(row => (
            <div
              key={row}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}
            >
              <span style={{
                color: 'var(--accent-teal)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '16px',
                marginTop: '2px',
                flexShrink: 0,
              }}>
                ✓
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}>
                {row}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Real-life callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '28px 36px',
            margin: '32px auto',
            textAlign: 'left',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '11px',
            color: 'var(--text-faint)',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}>
            REAL-LIFE USE CASE
          </p>
          {[
            <span key="1">You open the app. It&apos;s the 30th.</span>,
            <span key="2">Papaji asks: &apos;Kitna hua is mahine?&apos;</span>,
            <span key="3">You say: &apos;Exactly <span style={{ color: 'var(--accent-teal)' }}>₹1,240</span>. Here, dekho.&apos;</span>,
            <span key="4">That&apos;s it. That&apos;s the feature.</span>,
          ].map((content, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '17px',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {content}
            </p>
          ))}
        </motion.div>

        {/* Doodh CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 52px rgba(34,212,168,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard')}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '15px',
              background: 'var(--accent-teal)',
              color: '#07070F',
              padding: '14px 36px',
              borderRadius: '999px',
              boxShadow: '0 0 36px rgba(34,212,168,0.35)',
              border: 'none',
              cursor: 'pointer',
              marginTop: '40px',
            }}
          >
            → Try Doodh ka Hisaab
          </motion.button>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-faint)',
            marginTop: '12px',
          }}>
            Free to use. No math required.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
