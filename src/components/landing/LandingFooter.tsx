export default function LandingFooter() {
  return (
    <footer style={{
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(7,7,15,0.95)',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '15px',
        color: 'var(--text-faint)',
      }}>
        VibeCalendar
      </span>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--text-faint)',
        fontStyle: 'italic',
      }}>
        Track the small things. They add up.
      </span>

      <div />
    </footer>
  )
}
