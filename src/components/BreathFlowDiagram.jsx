import { motion } from 'framer-motion';

const colors = {
  inhale: '#4A8FE7',
  hold: '#8B6AD8',
  exhale: '#37AAA4',
};

function Node({ label, seconds, color, className, phase, onOpenEditor, onSelectPhase }) {
  const phaseAriaMap = {
    inhale: 'Edit inhale duration',
    hold: 'Edit hold duration',
    exhale: 'Edit exhale duration',
  };

  return (
    <motion.div className={`absolute ${className}`}>
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]"
        style={{
          background: `radial-gradient(circle, ${color}30 0%, ${color}16 45%, transparent 74%)`,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.46, 0.72, 0.46] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.button
        type="button"
        aria-label={phaseAriaMap[phase]}
        onClick={() => {
          onSelectPhase?.(phase);
          onOpenEditor?.();
        }}
        className="relative flex h-[82px] w-[82px] cursor-pointer flex-col items-center justify-center rounded-full border text-center"
        style={{
          background: `linear-gradient(180deg, ${color}EE 0%, ${color}D4 100%)`,
          borderColor: 'rgba(255,255,255,0.42)',
          boxShadow: `0 10px 24px ${color}33, inset 0 1px 0 rgba(255,255,255,0.24)`,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{label}</p>
        <p className="text-[20px] font-extrabold leading-none" style={{ color: '#FFFFFF' }}>{seconds}s</p>
      </motion.button>
    </motion.div>
  );
}

export default function BreathFlowDiagram({
  inhaleSeconds,
  holdSeconds,
  exhaleSeconds,
  holdActive,
  boxBreathing,
  onOpenEditor,
  onSelectPhase,
}) {
  const isBoxBreathing = Boolean(boxBreathing);
  const isHoldOff = !holdActive && !isBoxBreathing;
  const holdNodeLabel = isBoxBreathing ? 'Hold x2' : 'Hold';

  return (
    <motion.div
      className="relative mx-auto h-[276px] w-full max-w-[340px]"
      animate={{ scale: [1, 1.012, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,252,246,0.85) 0%, rgba(255,245,226,0.48) 42%, rgba(221,193,154,0.12) 70%, transparent 100%)',
        }}
        animate={{ opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 340 276" aria-hidden="true">
        {isHoldOff ? (
          <>
            <defs>
              <linearGradient id="arcInhaleExhaleOuter" x1="170" y1="36" x2="170" y2="238" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A8FE7" stopOpacity="0.76" />
                <stop offset="100%" stopColor="#37AAA4" stopOpacity="0.64" />
              </linearGradient>
              <linearGradient id="arcExhaleInhaleInner" x1="170" y1="238" x2="170" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#37AAA4" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#4A8FE7" stopOpacity="0.62" />
              </linearGradient>
            </defs>

            <motion.path
              d="M170 38 C250 58, 264 206, 170 236"
              fill="none"
              stroke="url(#arcInhaleExhaleOuter)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.42, 0.78, 0.42] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M170 236 C88 214, 74 68, 170 38"
              fill="none"
              stroke="url(#arcExhaleInhaleInner)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.4, 0.74, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
            />

            <path
              d="M170 38 C250 58, 264 206, 170 236 C88 214, 74 68, 170 38"
              fill="none"
              stroke="rgba(120,90,55,0.12)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
          </>
        ) : (
          <>
            <defs>
              <linearGradient id="arcInhaleHold" x1="84" y1="80" x2="254" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A8FE7" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#8B6AD8" stopOpacity="0.64" />
              </linearGradient>
              <linearGradient id="arcHoldExhale" x1="255" y1="90" x2="180" y2="228" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B6AD8" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#37AAA4" stopOpacity="0.64" />
              </linearGradient>
              <linearGradient id="arcExhaleInhale" x1="162" y1="228" x2="84" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#37AAA4" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4A8FE7" stopOpacity="0.64" />
              </linearGradient>
            </defs>

            <motion.path
              d="M86 82 C126 34, 212 34, 254 82"
              fill="none"
              stroke="url(#arcInhaleHold)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.42, 0.78, 0.42] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M254 92 C272 148, 238 214, 178 228"
              fill="none"
              stroke="url(#arcHoldExhale)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.4, 0.74, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
            />
            <motion.path
              d="M160 228 C98 220, 64 156, 86 90"
              fill="none"
              stroke="url(#arcExhaleInhale)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.38, 0.72, 0.38] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            />

            <path
              d="M86 82 C126 34, 212 34, 254 82"
              fill="none"
              stroke="rgba(120,90,55,0.13)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
          </>
        )}
      </svg>

      <button
        type="button"
        onClick={() => onOpenEditor?.()}
        className="absolute left-1/2 top-1/2 flex h-[128px] w-[128px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full border text-center"
        style={{
          background: 'rgba(255,250,242,0.78)',
          borderColor: 'rgba(120,90,55,0.08)',
          boxShadow: '0 10px 28px rgba(75,54,33,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <img
          src="/assets/icons/logo_lotus.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        />
        <p className="relative text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: '#7A7268' }}>Your</p>
        <p className="relative mt-0.5 text-[21px] font-extrabold leading-[1.05]" style={{ color: '#071D36' }}>
          Breath Flow
        </p>
      </button>

      <Node
        label="Inhale"
        seconds={inhaleSeconds}
        color={colors.inhale}
        className={isHoldOff ? 'left-1/2 top-[10%] -translate-x-1/2' : 'left-[8%] top-[10%]'}
        phase="inhale"
        onOpenEditor={onOpenEditor}
        onSelectPhase={onSelectPhase}
      />
      {!isHoldOff ? (
        <Node
          label={holdNodeLabel}
          seconds={holdSeconds}
          color={colors.hold}
          className="right-[8%] top-[10%]"
          phase="hold"
          onOpenEditor={onOpenEditor}
          onSelectPhase={onSelectPhase}
        />
      ) : null}
      <Node
        label="Exhale"
        seconds={exhaleSeconds}
        color={colors.exhale}
        className="bottom-[6%] left-1/2 -translate-x-1/2"
        phase="exhale"
        onOpenEditor={onOpenEditor}
        onSelectPhase={onSelectPhase}
      />
    </motion.div>
  );
}
