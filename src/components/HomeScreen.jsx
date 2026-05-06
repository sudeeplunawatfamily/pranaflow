import { motion } from 'framer-motion';
import { MoonStar, Play, Sparkles, Sun } from 'lucide-react';
import CharacterBackdrop from './CharacterBackdrop';
import PrimaryButton from './PrimaryButton';

export default function HomeScreen({ onStartCustom, onExplorePresets, memory, sessions = [], theme = 'night', onToggleTheme }) {
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
      <div className="relative z-[2] flex w-full justify-end">
        <button
          type="button"
          aria-label={theme === 'night' ? 'Switch to Day Theme' : 'Switch to Night Theme'}
          onClick={onToggleTheme}
          className="grid h-10 w-10 place-items-center rounded-2xl border shadow-[0_8px_18px_rgba(15,23,42,0.25)]"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-surface-border)',
            color: 'var(--theme-brand)',
          }}
        >
          {theme === 'night' ? <Sun size={17} /> : <MoonStar size={17} />}
        </button>
      </div>

      <div className="relative z-[1] mt-2 flex flex-col items-center gap-1">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow lotus" className="h-11 w-11 opacity-90" />
        <h1 className="font-display text-[44px] font-extrabold tracking-tight" style={{ color: 'var(--theme-brand)' }}>PranaFlow</h1>
      </div>

      <div className="relative z-[1] mt-6 space-y-2 px-3 text-center">
        <p className="font-display text-[15px] font-bold uppercase tracking-[0.28em]" style={{ color: 'var(--theme-text-secondary)' }}>Daily breath ritual</p>
        <h2 className="font-display text-[32px] font-extrabold leading-[1.02]" style={{ color: 'var(--theme-text-primary)' }}>
          Slow your breath.
          <span className="block text-[#60A5FA]">Calm your mind.</span>
        </h2>
        <p className="mx-auto max-w-[285px] text-[14px] leading-6" style={{ color: 'var(--theme-text-secondary)' }}>Choose your own breathing pattern or begin with a guided preset designed for calm, focus, or sleep.</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center pt-5">
        <CharacterBackdrop className="mx-auto w-full max-w-[330px]" glowSizeClass="h-72 w-72">
          <div className="relative flex flex-col items-center">
            <img src="/assets/images/Inhale_pose.png" alt="Meditation pose for breathing" className="relative z-10 w-[300px] object-contain" />
            <div className="pointer-events-none -mt-3 h-5 w-[170px] rounded-full bg-[#60A5FA]/16 blur-[1px]" aria-hidden="true" />
          </div>
        </CharacterBackdrop>
      </div>

      <div className="relative z-[1] mt-3 flex w-full flex-col items-center gap-2">
        {resumeRhythm && (
          <div
            className="flex items-center gap-2 rounded-full border px-2.5 py-1.5"
            style={{
              borderColor: 'var(--theme-surface-border)',
              backgroundColor: 'var(--theme-surface)',
              boxShadow: '0 8px 18px rgba(15,23,42,0.18)',
            }}
          >
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-brand) 12%, var(--theme-surface))', color: 'var(--theme-text-secondary)' }}>
              Last rhythm
            </span>
            <span className="text-[12px] font-bold" style={{ color: 'var(--theme-text-secondary)' }}>
              <span className="text-[#60A5FA]">I</span>
              <span>-</span>
              <span className="text-[#A78BFA]">H</span>
              <span>-</span>
              <span className="text-[#22D3EE]">E</span>
              <span className="ml-1.5" style={{ color: 'var(--theme-text-secondary)' }}>(</span>
              <span className="text-[#60A5FA]">{resumeRhythm.inhaleSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>-</span>
              <span className="text-[#A78BFA]">{resumeRhythm.holdSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>-</span>
              <span className="text-[#22D3EE]">{resumeRhythm.exhaleSeconds}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>)</span>
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 w-full space-y-2.5 pt-1">
        <PrimaryButton icon={Play} onClick={onStartCustom} className="h-[56px] text-[16px] shadow-[0_0_0_1px_rgba(96,165,250,0.45),0_0_28px_rgba(96,165,250,0.36)]">
          Start Custom Breathing
        </PrimaryButton>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: 'var(--theme-text-secondary)' }}>or</p>
        <PrimaryButton icon={Sparkles} variant="secondary" onClick={onExplorePresets} className="h-[46px] text-[14px]">
          Explore Presets
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
