export default function CharacterBackdrop({ children, className = '', glowSizeClass = 'h-64 w-64' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-0">

        {/* Outer diffuse ring — moonlight halo boundary */}
        <div
          className={`absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowSizeClass} opacity-70`}
          style={{
            background: 'var(--decor-halo-outer, radial-gradient(circle, transparent 34%, rgba(96,165,250,0.26) 58%, rgba(167,139,250,0.14) 80%, transparent 100%))',
            opacity: 'var(--decor-halo-outer-opacity, 0.70)',
            transform: 'translate(-50%, -50%) scale(var(--decor-halo-outer-scale, 1.20))',
            filter: 'blur(var(--decor-halo-outer-blur, 18px))',
          }}
        />

        {/* Primary halo disc */}
        <div
          className={`absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowSizeClass}`}
          style={{
            background: 'var(--decor-halo-core, radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(148,163,184,0.16) 26%, rgba(96,165,250,0.14) 52%, rgba(15,23,42,0) 82%))',
            transform: 'translate(-50%, -50%) scale(var(--decor-halo-core-scale, 1.15))',
          }}
        />

        {/* Ambient particles */}
        <span className="absolute left-[12%] top-[62%] h-8 w-8 rounded-full blur-[6px]" style={{ backgroundColor: 'var(--decor-particle-a)' }} />
        <span className="absolute right-[10%] top-[58%] h-7 w-7 rounded-full blur-[6px]" style={{ backgroundColor: 'var(--decor-particle-b)' }} />
        <span className="absolute left-[18%] top-[45%] h-5 w-5 rounded-full blur-[4px]" style={{ backgroundColor: 'var(--decor-particle-c)' }} />
        <span className="absolute right-[17%] top-[42%] h-6 w-6 rounded-full blur-[5px]" style={{ backgroundColor: 'var(--decor-particle-a)' }} />

        {/* Sparkles */}
        <svg viewBox="0 0 16 16" className="absolute left-[18%] top-[30%] h-4 w-4" style={{ color: 'var(--decor-sparkle-a)' }} fill="currentColor" aria-hidden="true">
          <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
        </svg>
        <svg viewBox="0 0 16 16" className="absolute right-[18%] top-[36%] h-3.5 w-3.5" style={{ color: 'var(--decor-sparkle-b)' }} fill="currentColor" aria-hidden="true">
          <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
        </svg>
        <span className="absolute left-[28%] top-[40%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--decor-sparkle-a)' }} />
        <span className="absolute right-[26%] top-[48%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--decor-particle-a)' }} />

        <div
          className="absolute bottom-2 left-[7%] right-[7%] h-14 rounded-full blur-lg"
          style={{ background: 'linear-gradient(90deg, var(--decor-wave-a) 0%, var(--decor-wave-b) 50%, var(--decor-wave-c) 100%)' }}
        />

        {/* Bottom lotus mark */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 opacity-[0.35]">
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--decor-dot-a)' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--decor-dot-b)' }} />
          <img src="/assets/icons/logo_lotus.svg" alt="" className="h-6 w-6" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--decor-dot-b)' }} />
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--decor-dot-a)' }} />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
