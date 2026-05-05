import { motion } from 'framer-motion';
import { Pause, Play, Square, Waves, Wind } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useAudioGuide from '../hooks/useAudioGuide';
import useBreathingEngine from '../hooks/useBreathingEngine';
import { phaseConfig } from '../utils/phaseConfig';
import CharacterBackdrop from './CharacterBackdrop';
import Header from './Header';
import PrimaryButton from './PrimaryButton';

const phaseIcons = { inhale: Wind, hold: Pause, exhale: Waves };

export default function BreathingSession({ settings, onComplete, onEnd, onPhaseChange }) {
  const audio = useAudioGuide();
  const [sessionPhase, setSessionPhase] = useState('intro'); // 'intro' | 'countdown' | 'breathing'
  const [countdown, setCountdown] = useState(3);
  const introPlayedRef = useRef(false);

  // Play intro audio first, then transition to countdown phase
  useEffect(() => {
    if (sessionPhase === 'intro' && !introPlayedRef.current && settings.voiceEnabled) {
      introPlayedRef.current = true;
      audio.playIntro().then(() => {
        // Intro finished; start countdown
        setSessionPhase('countdown');
      }).catch(() => {
        // Intro failed or unavailable; skip to countdown
        setSessionPhase('countdown');
      });
    } else if (sessionPhase === 'intro' && !settings.voiceEnabled) {
      // Voice disabled; skip intro and start countdown immediately
      setSessionPhase('countdown');
    }
  }, [sessionPhase, settings.voiceEnabled, audio]);

  const engine = useBreathingEngine(settings, {
    onBeforeSessionStart: async () => {
      if (settings.soundEnabled) {
        audio.startAmbient();
      }
      // Intro and countdown have already completed; session starts immediately
    },
    onBeforePhaseStart: async (phase) => {
      if (!settings.voiceEnabled) return;
      await audio.playPhase(phase);
    },
    onCount: () => {
      if (settings.soundEnabled) {
        audio.playTick();
      }
    },
    onPause: () => {
      audio.pauseVoice();
      if (settings.soundEnabled) {
        audio.pauseAmbient();
      }
      audio.stopTick();
    },
    onResume: () => {
      if (settings.soundEnabled) {
        audio.resumeAmbient();
      }
      audio.resumeVoice();
    },
    onComplete: ({ durationSeconds }) => {
      audio.stopTick();
      audio.stopAmbient();
      audio.stopVoice();

      if (settings.voiceEnabled || settings.soundEnabled) {
        audio.playComplete();
      }

      onComplete?.({ durationSeconds });
    },
  });

  // Countdown ticker: 3→2→1→0
  // engine and audio refs are stable across renders; exhaustive-deps disabled intentionally.
  useEffect(() => {
    if (sessionPhase !== 'countdown') return;

    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }

    // Countdown finished; transition to breathing
    setSessionPhase('breathing');
  }, [sessionPhase, countdown]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start breathing engine when entering breathing phase
  useEffect(() => {
    if (sessionPhase === 'breathing') {
      engine.start(); // eslint-disable-line react-hooks/exhaustive-deps
    }

    return () => {
      if (sessionPhase === 'breathing') {
        engine.end(); // eslint-disable-line react-hooks/exhaustive-deps
        audio.stopTick(); // eslint-disable-line react-hooks/exhaustive-deps
        audio.stopAmbient(); // eslint-disable-line react-hooks/exhaustive-deps
      }
    };
  }, [sessionPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent of phase color for background tint
  useEffect(() => {
    onPhaseChange?.(phaseConfig[engine.currentPhase].color);
  }, [engine.currentPhase]);

  const phase = phaseConfig[engine.currentPhase];
  const PhaseIcon = phaseIcons[engine.currentPhase];

  // Intro screen: listening to intro audio
  if (sessionPhase === 'intro') {
    return (
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col">
        <Header showBack onBack={onEnd} showHelp />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.img
            src="/assets/icons/logo_lotus.svg"
            alt=""
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-16 w-16 opacity-80"
          />
          <div className="space-y-2">
            <p className="text-[28px] font-extrabold leading-tight text-[#071D55]">
              Welcome to PranaFlow
            </p>
            <p className="text-[20px] font-bold text-[#2487EA]">
              "Breathe is life, let's master it"
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Countdown screen: 3-2-1 before breathing starts
  if (sessionPhase === 'countdown') {
    return (
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col">
        <Header showBack onBack={onEnd} showHelp />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-[14px] font-bold uppercase tracking-widest text-[#657899]">Get ready</p>
          <motion.p
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="font-display text-[120px] font-extrabold leading-none text-[#2487EA]"
          >
            {countdown}
          </motion.p>
          <p className="text-[15px] text-[#657899]">Find a comfortable position</p>
        </div>
      </motion.section>
    );
  }

  // Breathing screen: active session
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col">
      <Header showBack onBack={onEnd} showHelp />

      {/* Progress card */}
      <div className="relative z-[1] flex items-center gap-3 rounded-2xl bg-white/90 px-3 py-3 shadow-[0_8px_22px_rgba(36,135,234,0.12)]">

        {/* Round badge — number + glow ring */}
        <div
          className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-[3px] bg-white"
          style={{
            borderColor: phase.color,
            boxShadow: `0 0 0 4px ${phase.color}1a, 0 4px 14px ${phase.color}44`,
          }}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: phase.color }}>Rnd</span>
            <span className="text-[22px] font-extrabold leading-none" style={{ color: phase.color }}>
              {engine.currentRound}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Round count label */}
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657899]">Session Progress</span>
            <span className="text-[13px] font-bold">
              <span style={{ color: phase.color }}>{engine.currentRound}</span>
              <span className="font-normal text-[#657899]"> / {settings.rounds}</span>
            </span>
          </div>

          {/* Progress bar — gradient fill with glow */}
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#DDEEFE]/80">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${engine.totalProgress * 100}%`,
                background: `linear-gradient(90deg, ${phase.color}88 0%, ${phase.color} 100%)`,
                boxShadow: `0 0 8px ${phase.color}99`,
              }}
            />
          </div>

          {/* Round pip dots — one per round, max 10 */}
          {settings.rounds <= 10 && (
            <div className="mt-1.5 flex gap-1">
              {Array.from({ length: settings.rounds }, (_, i) => {
                const done = i + 1 < engine.currentRound;
                const active = i + 1 === engine.currentRound;
                return (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: done || active ? phase.color : '#DDEEFE',
                      opacity: done ? 0.55 : 1,
                      boxShadow: active ? `0 0 6px ${phase.color}88` : 'none',
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Centered content zone — fills remaining height and vertically centers everything */}
      <div className="flex flex-1 flex-col items-center justify-center">

        {/* Character + animated breathing ring */}
        {/* HALO_PX: h-64 (256px) × scale(1.15) ≈ 294px — ring neutral aligns with CharacterBackdrop halo */}
        <div className="relative w-full">
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            animate={
              engine.isPaused
                ? { width: 294, height: 294, opacity: 0.35 }
                : {
                    width: engine.currentPhase === 'inhale' ? 324 : engine.currentPhase === 'exhale' ? 258 : [286, 302, 286],
                    height: engine.currentPhase === 'inhale' ? 324 : engine.currentPhase === 'exhale' ? 258 : [286, 302, 286],
                    opacity: engine.currentPhase === 'hold' ? [0.75, 0.4, 0.75] : engine.currentPhase === 'inhale' ? 0.75 : 0.4,
                  }
            }
            initial={{ width: 294, height: 294, opacity: 0.4 }}
            style={{ borderColor: `${phase.color}99` }}
            transition={{
              duration: engine.isPaused ? 0.5 : engine.currentPhase === 'hold' ? 2.5 : engine.phaseDuration,
              ease: 'easeInOut',
              repeat: engine.currentPhase === 'hold' && !engine.isPaused ? Infinity : 0,
              repeatType: 'reverse',
            }}
          />
          <CharacterBackdrop glowSizeClass="h-64 w-64">
            <motion.div
              animate={
                engine.currentPhase === 'inhale'
                  ? { scale: [1, 1.04] }
                  : engine.currentPhase === 'hold'
                  ? { scale: [1.02, 1.025, 1.02] }
                  : { scale: [1.04, 1] }
              }
              transition={{
                duration: engine.currentPhase === 'hold' ? 2 : engine.phaseDuration,
                ease: 'easeInOut',
                repeat: engine.currentPhase === 'hold' ? Infinity : 0,
              }}
              className="relative mx-auto w-fit"
            >
              <img src={phase.image} alt={`${phase.label} yoga pose`} className="relative z-10 mx-auto w-[310px] object-contain" />
            </motion.div>
          </CharacterBackdrop>
        </div>

        {/* Phase label — minimal, sits directly above the count number */}
        <motion.div
          key={engine.currentPhase}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <PhaseIcon size={15} style={{ color: phase.color }} />
          <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: phase.color }}>
            {phase.displayLabel}
          </span>
        </motion.div>

        {/* Large count — pulses on every tick */}
        <motion.p
          key={engine.currentCount}
          initial={{ scale: 1.18, opacity: 0.65 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.08, ease: 'easeOut' }}
          className="font-display mt-2 text-center text-[88px] font-extrabold leading-none"
          style={{ color: phase.color }}
        >
          {engine.currentCount}
        </motion.p>

        <p className="mt-1 text-center text-base text-[#657899]">{phase.instruction}</p>

      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <PrimaryButton
          icon={engine.isPaused ? Play : Pause}
          variant="secondary"
          onClick={() => {
            if (engine.isPaused) {
              engine.resume();
            } else {
              engine.pause();
            }
          }}
          className="h-[51px]"
        >
          {engine.isPaused ? 'Resume' : 'Pause'}
        </PrimaryButton>
        <PrimaryButton
          icon={Square}
          variant="danger"
          onClick={() => {
            audio.stopAllAudio();
            engine.end();
            onEnd?.();
          }}
          className="h-[51px]"
        >
          End
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
