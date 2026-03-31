'use client'

import './landing-tokens.css'
import LandingNavbar from '@/components/landing/LandingNavbar'
import HeroSection from '@/components/landing/HeroSection'
import ValueLinesSection from '@/components/landing/ValueLinesSection'
import ProductIntroSection from '@/components/landing/ProductIntroSection'
import DoodhSection from '@/components/landing/DoodhSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import LandingFooter from '@/components/landing/LandingFooter'

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -22 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function LandingPage() {
  return (
    <main className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <ValueLinesSection />
      <ProductIntroSection />
      <DoodhSection />
      <FinalCTASection />
      <LandingFooter />
    </main>
  )
}
