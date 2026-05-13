import { motion } from 'framer-motion';
import { ArrowRight, MoonStar, Sun } from 'lucide-react';

export default function HomeScreen({ onStartCustom, onExplorePresets, memory, sessions = [], theme = 'night', onToggleTheme }) {
  const isDay = theme === 'day';
  const lastSession = sessions[0];
  const resumeRhythm = memory?.lastRhythm || (lastSession
    ? {
        inhaleSeconds: lastSession.inhaleSeconds,
        holdSeconds: lastSession.holdSeconds,
        exhaleSeconds: lastSession.exhaleSeconds,
      }
    : null);

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative flex min-h-[calc(100dvh-32px)] flex-col pb-2 text-center">
      <div className="relative z-[2] flex w-full items-center justify-between pt-0.5">
        <div className="flex items-end gap-2">
          <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow lotus" className="h-9 w-9 opacity-90" />
          <h1
            className={isDay ? 'font-serif-display text-[34px] font-bold leading-none tracking-tight' : 'font-display text-[36px] font-extrabold leading-none tracking-tight'}
            style={{ color: 'var(--theme-brand)' }}
          >
            PranaFlow
          </h1>
        </div>
        <button
          type="button"
          aria-label={theme === 'night' ? 'Switch to Day Theme' : 'Switch to Night Theme'}
          onClick={onToggleTheme}
          className="grid h-10 w-10 place-items-center rounded-2xl border shadow-[0_8px_18px_rgba(15,23,42,0.15)]"
          style={{
            backgroundColor: isDay ? 'rgba(255,250,242,0.85)' : 'var(--theme-surface)',
            borderColor: 'var(--theme-surface-border)',
            color: 'var(--theme-brand)',
          }}
        >
          {theme === 'night' ? <Sun size={17} /> : <MoonStar size={17} />}
        </button>
      </div>

      <div className="relative z-[1] mt-7 space-y-1.5 px-3 text-center">
        {isDay ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#5B6A78' }}>Pranayama</p>
            <h2 className="font-serif-display text-[34px] font-bold leading-[1.07]" style={{ color: 'var(--theme-text-primary)' }}>
              Design your
              <span className="block" style={{ color: 'var(--theme-brand)' }}>pranayama</span>
            </h2>
            <p className="mx-auto max-w-[295px] text-[14px] leading-[1.6]" style={{ color: 'var(--theme-text-secondary)' }}>
              Create a breath flow that matches your body, mood, and intention today.
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-[15px] font-bold uppercase tracking-[0.28em]" style={{ color: 'var(--theme-text-secondary)' }}>Daily breath ritual</p>
            <h2 className="font-display text-[32px] font-extrabold leading-[1.02]" style={{ color: 'var(--theme-text-primary)' }}>
              Slow your breath.
              <span className="block text-[#60A5FA]">Calm your mind.</span>
            </h2>
            <p className="mx-auto max-w-[285px] text-[14px] leading-6" style={{ color: 'var(--theme-text-secondary)' }}>Choose your own breathing pattern or begin with a guided preset designed for calm, focus, or sleep.</p>
          </>
        )}
      </div>

      <div className="relative flex flex-1 items-center justify-center pt-2">
        <div className="relative mx-auto w-full max-w-[330px]">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[50%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            animate={isDay ? { scale: [1, 1.015, 1], opacity: [0.46, 0.52, 0.46] } : { scale: [1, 1.012, 1], opacity: [0.52, 0.57, 0.52] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: isDay
                ? 'radial-gradient(circle, rgba(255,248,235,0.75) 0%, rgba(255,248,235,0.32) 45%, rgba(255,236,212,0.18) 64%, transparent 78%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(148,163,184,0.16) 26%, rgba(96,165,250,0.14) 52%, rgba(15,23,42,0) 82%)',
              filter: 'blur(18px)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[51%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: isDay
                ? 'radial-gradient(circle, rgba(255,255,255,0.58) 0%, rgba(255,248,235,0.24) 52%, transparent 76%)'
                : 'radial-gradient(circle, rgba(226,232,240,0.22) 0%, rgba(148,163,184,0.08) 45%, transparent 75%)',
              filter: 'blur(10px)',
            }}
            aria-hidden="true"
          />

          <span className="pointer-events-none absolute left-[21%] top-[26%] text-sm" style={{ color: isDay ? 'rgba(255,255,255,0.60)' : 'rgba(226,232,240,0.62)' }} aria-hidden="true">✦</span>
          <span className="pointer-events-none absolute right-[22%] top-[32%] text-xs" style={{ color: isDay ? 'rgba(245,232,210,0.58)' : 'rgba(148,163,184,0.62)' }} aria-hidden="true">✦</span>
          <span className="pointer-events-none absolute left-[27%] top-[41%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isDay ? 'rgba(255,255,255,0.55)' : 'rgba(226,232,240,0.58)' }} aria-hidden="true" />
          <span className="pointer-events-none absolute right-[27%] top-[47%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isDay ? 'rgba(248,233,205,0.52)' : 'rgba(148,163,184,0.52)' }} aria-hidden="true" />

          <motion.div
            className="relative z-10 flex justify-center"
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/assets/images/Inhale_pose.png" alt="Meditation pose for breathing" className="w-[300px] object-contain" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-[1] mt-3 flex w-full flex-col items-center gap-2">
        {resumeRhythm && (
          <div
            className="flex items-center gap-2 rounded-full border px-2.5 py-1.5"
            style={{
              borderColor: 'var(--theme-surface-border)',
              backgroundColor: isDay ? 'rgba(255,250,242,0.88)' : 'var(--theme-surface)',
              boxShadow: isDay ? '0 8px 18px rgba(75,54,33,0.10)' : '0 8px 18px rgba(15,23,42,0.18)',
            }}
          >
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ backgroundColor: isDay ? 'rgba(74,143,231,0.10)' : 'color-mix(in srgb, var(--theme-brand) 12%, var(--theme-surface))', color: 'var(--theme-text-secondary)' }}>
              Last rhythm
            </span>
            <span className="text-[12px] font-bold" style={{ color: 'var(--theme-text-secondary)' }}>
              <span style={{ color: isDay ? '#4A8FE7' : '#60A5FA' }}>I</span>
              <span>-</span>
              <span style={{ color: isDay ? '#8B6AD8' : '#A78BFA' }}>H</span>
              <span>-</span>
              <span style={{ color: isDay ? '#37AAA4' : '#22D3EE' }}>E</span>
              <span className="ml-1.5" style={{ color: 'var(--theme-text-secondary)' }}>(</span>
              <span style={{ color: isDay ? '#4A8FE7' : '#60A5FA' }}>{resumeRhythm.inhaleSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>-</span>
              <span style={{ color: isDay ? '#8B6AD8' : '#A78BFA' }}>{resumeRhythm.holdSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>-</span>
              <span style={{ color: isDay ? '#37AAA4' : '#22D3EE' }}>{resumeRhythm.exhaleSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>)</span>
            </span>
          </div>
        )}
      </div>

      <div className="relative mt-4 w-full pb-2 pt-1">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40"
          style={{ background: isDay ? 'linear-gradient(to bottom, transparent, rgba(255,247,236,0.45))' : 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.28))' }}
          aria-hidden="true"
        />
        <div className="relative z-[1] space-y-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01, y: -1 }}
            type="button"
            onClick={isDay ? onStartCustom : onExplorePresets}
            className="flex h-[58px] w-full items-center justify-center gap-2.5 rounded-[28px] px-4 text-[16px] font-bold"
            style={{
              background: isDay ? 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)' : 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              boxShadow: isDay ? '0 10px 30px rgba(7, 29, 54, 0.22)' : 'var(--btn-primary-shadow)',
            }}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{ backgroundColor: isDay ? 'rgba(255,255,255,0.18)' : 'var(--btn-icon-bg)', color: 'var(--btn-primary-text)' }}
            >
              <ArrowRight size={16} />
            </span>
            <span>{isDay ? 'Create Your Breath Flow' : 'Quick Breathework'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01, y: -1 }}
            type="button"
            onClick={isDay ? onExplorePresets : onStartCustom}
            className="h-[50px] w-full rounded-[24px] px-4 text-[15px] font-semibold"
            style={{
              background: isDay ? 'rgba(255,255,255,0.55)' : 'var(--btn-secondary-bg)',
              border: isDay ? '1px solid rgba(255,255,255,0.50)' : '1px solid var(--btn-secondary-border)',
              backdropFilter: isDay ? 'blur(16px)' : undefined,
              WebkitBackdropFilter: isDay ? 'blur(16px)' : undefined,
              color: 'var(--theme-text-primary)',
              boxShadow: isDay ? '0 8px 22px rgba(75,54,33,0.10)' : 'var(--btn-secondary-shadow)',
            }}
          >
            {isDay ? 'Explore Presets' : 'Design your Pranayam'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
