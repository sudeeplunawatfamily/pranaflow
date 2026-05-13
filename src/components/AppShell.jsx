export default function AppShell({ children, phaseColor = null, theme = 'night' }) {
  const isNight = theme === 'night';
  const toColor = phaseColor ? `${phaseColor}1f` : isNight ? '#334155' : '#D8EDFF';

  const palette = isNight
    ? {
        '--theme-bg-app': '#0F172A',
        '--theme-surface': '#1E293B',
        '--theme-surface-border': 'rgba(148,163,184,0.3)',
        '--theme-text-primary': '#E2E8F0',
        '--theme-text-secondary': '#94A3B8',
        '--theme-brand': '#60A5FA',
        '--btn-primary-bg': 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
        '--btn-primary-text': '#E2E8F0',
        '--btn-primary-shadow': '0 0 0 1px rgba(96,165,250,0.45), 0 0 24px rgba(96,165,250,0.42)',
        '--btn-secondary-bg': '#1E293B',
        '--btn-secondary-text': '#E2E8F0',
        '--btn-secondary-border': 'rgba(148,163,184,0.32)',
        '--btn-secondary-shadow': '0 8px 22px rgba(15,23,42,0.45), 0 0 16px rgba(148,163,184,0.12)',
        '--btn-danger-bg': 'linear-gradient(90deg, #B91C1C 0%, #DC2626 100%)',
        '--btn-danger-text': '#F8FAFC',
        '--btn-danger-shadow': '0 0 0 1px rgba(239,68,68,0.35), 0 0 18px rgba(239,68,68,0.25)',
        '--btn-icon-bg': 'rgba(15,23,42,0.55)',
        '--btn-icon-text': '#E2E8F0',
        '--decor-particle-a': 'rgba(96,165,250,0.10)',
        '--decor-particle-b': 'rgba(167,139,250,0.10)',
        '--decor-particle-c': 'rgba(34,211,238,0.12)',
        '--decor-sparkle-a': 'rgba(226,232,240,0.70)',
        '--decor-sparkle-b': 'rgba(148,163,184,0.70)',
        '--decor-wave-a': 'rgba(96,165,250,0.08)',
        '--decor-wave-b': 'rgba(167,139,250,0.10)',
        '--decor-wave-c': 'rgba(34,211,238,0.08)',
        '--decor-dot-a': '#60A5FA',
        '--decor-dot-b': '#94A3B8',
        '--decor-halo-outer': 'radial-gradient(circle, transparent 34%, rgba(96,165,250,0.26) 58%, rgba(167,139,250,0.14) 80%, transparent 100%)',
        '--decor-halo-core': 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(148,163,184,0.16) 26%, rgba(96,165,250,0.14) 52%, rgba(15,23,42,0) 82%)',
        '--decor-halo-outer-opacity': '0.70',
        '--decor-halo-outer-scale': '1.20',
        '--decor-halo-core-scale': '1.15',
        '--decor-halo-outer-blur': '18px',
      }
    : {
        '--theme-bg-app': '#FFF7EC',
        '--theme-surface': 'rgba(255, 250, 242, 0.92)',
        '--theme-surface-border': 'rgba(120, 90, 55, 0.12)',
        '--theme-text-primary': '#071D36',
        '--theme-text-secondary': '#5F6E7C',
        '--theme-brand': '#4A8FE7',
        '--btn-primary-bg': 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)',
        '--btn-primary-text': '#FFFFFF',
        '--btn-primary-shadow': '0 14px 34px rgba(7,29,54,0.22)',
        '--btn-secondary-bg': 'rgba(255, 250, 242, 0.78)',
        '--btn-secondary-text': '#071D36',
        '--btn-secondary-border': 'rgba(7, 29, 54, 0.10)',
        '--btn-secondary-shadow': '0 8px 22px rgba(75,54,33,0.10)',
        '--btn-danger-bg': 'linear-gradient(90deg, #B91C1C 0%, #DC2626 100%)',
        '--btn-danger-text': '#FFFFFF',
        '--btn-danger-shadow': '0 12px 30px rgba(185,28,28,0.28)',
        '--btn-icon-bg': 'rgba(255, 250, 242, 0.90)',
        '--btn-icon-text': '#071D36',
        '--decor-particle-a': 'rgba(74,143,231,0.10)',
        '--decor-particle-b': 'rgba(139,106,216,0.10)',
        '--decor-particle-c': 'rgba(55,170,164,0.10)',
        '--decor-sparkle-a': 'rgba(255,255,255,0.80)',
        '--decor-sparkle-b': 'rgba(210,190,160,0.70)',
        '--decor-wave-a': 'rgba(210,190,155,0.16)',
        '--decor-wave-b': 'rgba(230,210,180,0.22)',
        '--decor-wave-c': 'rgba(248,234,216,0.55)',
        '--decor-dot-a': '#4A8FE7',
        '--decor-dot-b': '#8B6AD8',
        '--decor-halo-outer': 'radial-gradient(circle, transparent 28%, rgba(255,220,170,0.20) 52%, rgba(255,200,130,0.12) 72%, transparent 100%)',
        '--decor-halo-core': 'radial-gradient(circle, rgba(255,255,255,0.90) 0%, rgba(255,248,235,0.70) 28%, rgba(255,235,205,0.40) 56%, rgba(255,220,170,0) 84%)',
        '--decor-halo-outer-opacity': '0.75',
        '--decor-halo-outer-scale': '1.26',
        '--decor-halo-core-scale': '1.18',
        '--decor-halo-outer-blur': '14px',
      };

  return (
    <div className="min-h-dvh flex justify-center" style={{ backgroundColor: 'var(--theme-bg-app)', ...palette }}>
      <main
        className={`relative min-h-dvh w-full max-w-[430px] overflow-x-hidden ${isNight ? '' : 'day-theme'}`}
        style={{
          /* Horizontal padding: 16px + safe area sides */
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
          /* Top padding respects status bar / Dynamic Island */
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          /* Bottom padding respects home indicator */
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: isNight
            ? `radial-gradient(circle at 50% 38%, rgba(148,163,184,0.13) 0%, rgba(30,41,59,0) 44%), linear-gradient(180deg, #0F172A 0%, #1E293B 58%, ${toColor} 100%)`
            : undefined,
          transition: 'background 0.8s ease',
        }}
      >
        {/* Day theme: mountain/lake background image with warm cream overlay */}
        {!isNight && (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(/assets/images/background/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,248,238,0.18) 0%, rgba(255,246,232,0.12) 38%, rgba(255,240,218,0.15) 100%)',
              }}
              aria-hidden="true"
            />
          </>
        )}
        <div className={isNight ? undefined : 'relative z-[2]'}>
          {children}
        </div>
      </main>
    </div>
  );
}
