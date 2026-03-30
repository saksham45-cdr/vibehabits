'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7,7,15,0.8)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '18px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        VibeCalendar
      </span>

      <Link href="/dashboard">
        <motion.span
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'white',
            background: 'var(--accent-violet)',
            padding: '8px 20px',
            borderRadius: '999px',
            boxShadow: '0 0 20px rgba(139,124,248,0.3)',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Open App →
        </motion.span>
      </Link>
    </nav>
  )
}
