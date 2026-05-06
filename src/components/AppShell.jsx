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
        '--theme-bg-app': '#F7FBFF',
        '--theme-surface': '#FFFFFF',
        '--theme-surface-border': 'rgba(214,234,255,1)',
        '--theme-text-primary': '#071D55',
        '--theme-text-secondary': '#657899',
        '--theme-brand': '#2487EA',
        '--btn-primary-bg': 'linear-gradient(90deg, #1E7FE6 0%, #38BBF2 100%)',
        '--btn-primary-text': '#FFFFFF',
        '--btn-primary-shadow': '0 12px 30px rgba(36,135,234,0.28)',
        '--btn-secondary-bg': '#FFFFFF',
        '--btn-secondary-text': '#2487EA',
        '--btn-secondary-border': '#D6EAFF',
        '--btn-secondary-shadow': '0 10px 26px rgba(36,135,234,0.12)',
        '--btn-danger-bg': 'linear-gradient(90deg, #F74D61 0%, #EF6C4F 100%)',
        '--btn-danger-text': '#FFFFFF',
        '--btn-danger-shadow': '0 12px 30px rgba(247,77,97,0.28)',
        '--btn-icon-bg': 'rgba(255,255,255,0.9)',
        '--btn-icon-text': '#2487EA',
        '--decor-particle-a': 'rgba(140,202,242,0.18)',
        '--decor-particle-b': 'rgba(215,241,250,0.20)',
        '--decor-particle-c': 'rgba(191,231,248,0.22)',
        '--decor-sparkle-a': 'rgba(255,255,255,0.80)',
        '--decor-sparkle-b': 'rgba(200,232,250,0.80)',
        '--decor-wave-a': 'rgba(140,202,242,0.14)',
        '--decor-wave-b': 'rgba(191,231,248,0.20)',
        '--decor-wave-c': 'rgba(234,246,255,0.55)',
        '--decor-dot-a': '#2487EA',
        '--decor-dot-b': '#8CCAF2',
        '--decor-halo-outer': 'radial-gradient(circle, transparent 30%, rgba(140,202,242,0.28) 54%, rgba(191,231,248,0.22) 74%, transparent 100%)',
        '--decor-halo-core': 'radial-gradient(circle, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.74) 28%, rgba(205,235,255,0.50) 56%, rgba(140,202,242,0) 84%)',
        '--decor-halo-outer-opacity': '0.86',
        '--decor-halo-outer-scale': '1.26',
        '--decor-halo-core-scale': '1.18',
        '--decor-halo-outer-blur': '14px',
      };

  return (
    <div className="min-h-dvh flex justify-center" style={{ backgroundColor: 'var(--theme-bg-app)', ...palette }}>
      <main
        className="relative min-h-dvh w-full max-w-[430px] overflow-x-hidden px-4 pb-4 pt-4 sm:px-5 sm:pt-5"
        style={{
          background: isNight
            ? `radial-gradient(circle at 50% 38%, rgba(148,163,184,0.13) 0%, rgba(30,41,59,0) 44%), linear-gradient(180deg, #0F172A 0%, #1E293B 58%, ${toColor} 100%)`
            : `radial-gradient(circle at 50% 38%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 44%), linear-gradient(180deg, #F7FBFF 0%, #EAF6FF 58%, ${toColor} 100%)`,
          transition: 'background 0.8s ease',
        }}
      >
        {children}
      </main>
    </div>
  );
}
