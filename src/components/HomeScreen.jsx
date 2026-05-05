import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { formatTime } from '../utils/formatTime';
import CharacterBackdrop from './CharacterBackdrop';
import PrimaryButton from './PrimaryButton';

export default function HomeScreen({ onStartCustom, onExplorePresets, sessions = [] }) {
  const lastSession = sessions[0];

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative flex min-h-[calc(100dvh-32px)] flex-col pb-2 text-center">
      <div className="relative z-[1] mt-2 flex flex-col items-center gap-1">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow lotus" className="h-11 w-11 opacity-90" />
        <h1 className="font-display text-[44px] font-extrabold tracking-tight text-[#2487EA]">PranaFlow</h1>
      </div>

      <div className="relative z-[1] mt-6 space-y-2 px-3 text-center">
        <p className="font-display text-[15px] font-bold uppercase tracking-[0.28em] text-[#2487EA]/80">Daily breath ritual</p>
        <h2 className="font-display text-[32px] font-extrabold leading-[1.02] text-[#071D55]">
          Find your rhythm
          <span className="block text-[#2487EA]">and settle in</span>
        </h2>
        <p className="mx-auto max-w-[285px] text-[14px] leading-6 text-[#657899]">Choose your own breathing pattern or begin with a guided preset designed for calm, focus, or sleep.</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center pt-5">
        <CharacterBackdrop className="mx-auto w-full max-w-[330px]" glowSizeClass="h-72 w-72">
          <div className="relative flex flex-col items-center">
            <img src="/assets/images/Inhale_pose.png" alt="Meditation pose for breathing" className="relative z-10 w-[300px] object-contain" />
            <div className="pointer-events-none -mt-3 h-5 w-[170px] rounded-full bg-[#d7ebfb]/80 blur-[1px]" aria-hidden="true" />
          </div>
        </CharacterBackdrop>
      </div>

      <div className="relative z-[1] mt-3 flex w-full flex-col items-center gap-2">
        {lastSession && (
          <p className="rounded-full border border-[#DCEEFF] bg-white/88 px-3.5 py-1.5 text-[12px] font-medium text-[#5E7497] shadow-[0_8px_18px_rgba(36,135,234,0.08)]">
            Last session: {formatTime(lastSession.durationSeconds)} · {lastSession.rounds} round{lastSession.rounds !== 1 ? 's' : ''}{lastSession.moodAfter ? ` · ${lastSession.moodAfter}` : ''}
          </p>
        )}
        <p className="text-[12px] font-semibold tracking-wide text-[#7A8EAB]">No setup needed to begin</p>
      </div>

      <div className="mt-4 w-full space-y-2.5 pt-1">
        <PrimaryButton icon={Play} onClick={onStartCustom} className="h-[56px] text-[16px] shadow-[0_16px_32px_rgba(36,135,234,0.32)]">
          Start Custom Breathing
        </PrimaryButton>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#9AB0C8]">or</p>
        <PrimaryButton icon={Sparkles} variant="secondary" onClick={onExplorePresets} className="h-[46px] text-[14px] text-[#5B7EA7] shadow-[0_8px_18px_rgba(36,135,234,0.09)]">
          Explore Presets
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
