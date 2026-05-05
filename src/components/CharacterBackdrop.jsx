export default function CharacterBackdrop({ children, className = '', glowSizeClass = 'h-64 w-64' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-0">

        {/* Outer diffuse ring — soft blue halo boundary */}
        <div
          className={`absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowSizeClass} opacity-60`}
          style={{
            background: 'radial-gradient(circle, transparent 38%, rgba(175,222,255,0.38) 62%, rgba(140,202,242,0.18) 82%, transparent 100%)',
            transform: 'translate(-50%, -50%) scale(1.20)',
            filter: 'blur(22px)',
          }}
        />

        {/* Primary halo disc — bright white moon, no blur so it stays visible */}
        <div
          className={`absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowSizeClass}`}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.98) 20%, rgba(240,249,255,0.92) 42%, rgba(208,236,255,0.62) 63%, rgba(155,210,250,0.24) 82%, transparent 100%)',
            transform: 'translate(-50%, -50%) scale(1.15)',
          }}
        />

        {/* Left leaves */}
        <img src="/assets/icons/leaf_cluster.svg" className="absolute bottom-8 left-[-8px] w-36" aria-hidden="true" alt="" />

        {/* Right leaves (mirrored) */}
        <img src="/assets/icons/leaf_cluster.svg" className="absolute bottom-8 right-[-8px] w-36 scale-x-[-1]" aria-hidden="true" alt="" />

        {/* Sparkles */}
        <svg viewBox="0 0 16 16" className="absolute left-[18%] top-[30%] h-4 w-4 text-white/80" fill="currentColor" aria-hidden="true">
          <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
        </svg>
        <svg viewBox="0 0 16 16" className="absolute right-[18%] top-[36%] h-3.5 w-3.5 text-[#C8E8FA]/80" fill="currentColor" aria-hidden="true">
          <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
        </svg>
        <span className="absolute left-[28%] top-[40%] h-1.5 w-1.5 rounded-full bg-white/80" />
        <span className="absolute right-[26%] top-[48%] h-1.5 w-1.5 rounded-full bg-[#8CCAF2]/55" />

        {/* Bottom waves */}
        <svg viewBox="0 0 430 110" className="absolute bottom-0 left-0 w-full opacity-55" fill="none" aria-hidden="true">
          <path d="M0 72C38 60 74 58 112 68C148 78 190 82 230 70C272 58 316 52 356 60C384 66 408 70 430 68V110H0V72Z" fill="#D8EDFF" />
          <path d="M0 84C36 76 76 76 118 84C158 92 202 96 246 84C286 74 332 70 378 78C396 81 413 84 430 84V110H0V84Z" fill="#EAF5FF" />
          <path d="M0 94C34 90 70 90 108 94C154 100 200 102 246 96C292 90 340 88 388 92C402 93 416 94 430 94V110H0V94Z" fill="#F5FAFF" />
        </svg>

        {/* Bottom lotus mark */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 opacity-[0.45]">
          <span className="h-1 w-1 rounded-full bg-[#2487EA]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#8CCAF2]" />
          <img src="/assets/icons/logo_lotus.svg" alt="" className="h-6 w-6" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#8CCAF2]" />
          <span className="h-1 w-1 rounded-full bg-[#2487EA]" />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
