import { motion } from 'framer-motion';
import { Pause, Play, Square, Waves, Wind } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useAudioGuide from '../hooks/useAudioGuide';
import useBreathingEngine from '../hooks/useBreathingEngine';
import useWakeLock from '../hooks/useWakeLock';
import { playTick, stopAllAudio as stopTickAudio, setAudioEnabled, playBreathGuide, stopBreathGuide, pauseBreathGuide, resumeBreathGuide } from '../utils/audioManager';
import { phaseConfig } from '../utils/phaseConfig';
import CharacterBackdrop from './CharacterBackdrop';
import Header from './Header';

const phaseIcons = { inhale: Wind, hold: Pause, exhale: Waves };

export default function BreathingSession({ settings, onComplete, onEnd, onPhaseChange, theme = 'night', onToggleTheme }) {
  const INTRO_MIN_MS = 1400;
  const INTRO_WATCHDOG_MS = 12000;
  const isNight = theme === 'night';
  const audio = useAudioGuide();
  const [sessionPhase, setSessionPhase] = useState('intro'); // 'intro' | 'countdown' | 'breathing'
  const [countdown, setCountdown] = useState(3);
  const introPlayedRef = useRef(false);
  const introSkippedRef = useRef(false);
  const introTransitionTimeoutRef = useRef(null);
  const sessionFlowActiveRef = useRef(true);

  // Track current phase so resumeBreathGuide knows the remaining duration.
  const currentPhaseRef = useRef('inhale');
  const currentPhaseCountRef = useRef(1);
  const currentPhaseDurationRef = useRef(settings.inhaleSeconds);

  // Keep the screen awake while the breathing session is running.
  // Wake lock is released automatically when the session ends or the component unmounts.
  useWakeLock(sessionPhase === 'breathing');

  const handleExitSession = () => {
    sessionFlowActiveRef.current = false;
    stopBreathGuide();
    audio.stopAllAudio();
     stopTickAudio();
    onEnd?.();
  };

  const handleSkipIntro = () => {
    introSkippedRef.current = true;
    if (introTransitionTimeoutRef.current) {
      clearTimeout(introTransitionTimeoutRef.current);
      introTransitionTimeoutRef.current = null;
    }
    audio.stopIntro();
    setCountdown(3);
    setSessionPhase('countdown');
  };

  const transitionToCountdown = useCallback((delayMs = 0) => {
    if (introTransitionTimeoutRef.current) {
      clearTimeout(introTransitionTimeoutRef.current);
    }

    introTransitionTimeoutRef.current = setTimeout(() => {
      introTransitionTimeoutRef.current = null;

      if (introSkippedRef.current || !sessionFlowActiveRef.current) {
        return;
      }

      audio.stopIntro();
      setCountdown(3);
      setSessionPhase('countdown');
    }, Math.max(0, delayMs));
  }, [audio.stopIntro]);

  const withTimeout = (promise, timeoutMs, fallback = 'timeout') =>
    Promise.race([
      promise,
      new Promise((resolve) => {
        setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);

  // Play intro audio first, then transition to countdown phase
  useEffect(() => {
    let watchdogTimer = null;

    if (sessionPhase === 'intro' && !introPlayedRef.current) {
      introSkippedRef.current = false;
      introPlayedRef.current = true;
      const introStartedAt = Date.now();

      const runIntro = async () => {
        await withTimeout(audio.playIntro(), INTRO_WATCHDOG_MS, 'timeout');

        const elapsed = Date.now() - introStartedAt;
        transitionToCountdown(INTRO_MIN_MS - elapsed);
      };

      watchdogTimer = setTimeout(() => {
        const elapsed = Date.now() - introStartedAt;
        transitionToCountdown(INTRO_MIN_MS - elapsed);
      }, INTRO_WATCHDOG_MS + 250);

      runIntro().catch(() => {
        const elapsed = Date.now() - introStartedAt;
        transitionToCountdown(INTRO_MIN_MS - elapsed);
      });
    }

    return () => {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      if (introTransitionTimeoutRef.current) {
        clearTimeout(introTransitionTimeoutRef.current);
        introTransitionTimeoutRef.current = null;
      }
    };
  }, [sessionPhase, audio.playIntro, transitionToCountdown]);

  const engine = useBreathingEngine(settings, {
    onBeforeSessionStart: async () => {
      // Intro and countdown have already completed; session starts immediately.
      // Ambient is started in onBeforePhaseStart so voice prompts can claim audio focus first.
    },
    onBeforePhaseStart: async (phase, round) => {
      if (!sessionFlowActiveRef.current) return;

      if (settings.voiceEnabled) {
        let result = await audio.playPhase(phase, round);

        // Retry once for transient playback failures before continuing.
        if (result === 'play-failed' || result === 'runtime-error' || result === 'error') {
          result = await audio.playPhase(phase, round);
        }
      }

      if (sessionFlowActiveRef.current && settings.soundEnabled) {
        audio.startAmbient();
      }
    },
    onCount: (count, phaseDuration, phase) => {
      // Keep refs in sync so resume knows exactly how much time is left.
      currentPhaseRef.current = phase;
      currentPhaseCountRef.current = count;
      currentPhaseDurationRef.current = phaseDuration;

      // Play the breath guide sound at the very first count of each phase
      // so it starts in sync with the timer and lasts exactly phaseDuration seconds.
      if (count === 1 && settings.breathGuideMode !== 'off') {
        playBreathGuide({
          phase,
          duration: phaseDuration,
          soundType: settings.breathGuideMode,
        });
      }

      if (settings.soundEnabled) {
        const isLastSecond = count === phaseDuration;
        playTick(isLastSecond);
      }
    },
    onPause: () => {
      audio.pauseVoice();
      if (settings.soundEnabled) {
        audio.pauseAmbient();
      }
      audio.stopTick();
      // Pause the breath guide — it cannot be truly seeked, so we fade it out.
      // On resume we restart it for the remaining phase duration.
      pauseBreathGuide();
    },
    onResume: () => {
      audio.resumeVoice();
      if (settings.soundEnabled) {
        audio.resumeAmbient();
      }
      // Restart breath guide for the remaining seconds in the current phase
      // so the arc does not overlap or play beyond the timer.
      if (settings.breathGuideMode !== 'off') {
        const elapsed = currentPhaseCountRef.current; // counts already ticked
        const remaining = currentPhaseDurationRef.current - elapsed + 1;
        if (remaining > 0) {
          resumeBreathGuide({
            phase: currentPhaseRef.current,
            remainingSeconds: remaining,
            soundType: settings.breathGuideMode,
          });
        }
      }
    },
    onComplete: ({ durationSeconds }) => {
      sessionFlowActiveRef.current = false;
      stopBreathGuide();
      audio.stopAllAudio();

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
  }, [sessionPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      sessionFlowActiveRef.current = true;

      return () => {
        sessionFlowActiveRef.current = false;
        if (introTransitionTimeoutRef.current) {
          clearTimeout(introTransitionTimeoutRef.current);
          introTransitionTimeoutRef.current = null;
        }
        stopBreathGuide();
         stopTickAudio();
      };
    },
    []
  );

  // Notify parent of phase color for background tint
  useEffect(() => {
    onPhaseChange?.(phaseConfig[engine.currentPhase].color);
  }, [engine.currentPhase]);

    // Monitor sound toggle and update audio manager accordingly
    useEffect(() => {
      if (sessionPhase === 'breathing') {
        setAudioEnabled(settings.soundEnabled);
      }
    }, [settings.soundEnabled, sessionPhase]);

  const phase = phaseConfig[engine.currentPhase];
  const PhaseIcon = phaseIcons[engine.currentPhase];
  const sessionUi = {
    progressCardShadow: isNight ? '0 8px 22px rgba(15,23,42,0.22)' : '0 8px 22px rgba(36,135,234,0.14)',
    roundBadgeBg: isNight
      ? 'color-mix(in srgb, var(--theme-bg-app) 88%, #000)'
      : 'color-mix(in srgb, var(--theme-bg-app) 84%, white)',
    progressTrackBg: isNight ? 'rgba(51,65,85,0.85)' : '#DDEEFE',
    phaseTrackBg: isNight ? 'rgba(51,65,85,0.90)' : '#DDEEFE',
    pipInactive: isNight ? '#334155' : '#BFDDF6',
  };

  // Intro screen: listening to intro audio
  if (sessionPhase === 'intro') {
    return (
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col">
        <Header showBack onBack={handleExitSession} showHelp theme={theme} onToggleTheme={onToggleTheme} />
        <div className="flex justify-end px-2 pt-1">
          <button
            type="button"
            onClick={handleSkipIntro}
            className="inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[11px] font-bold shadow-[0_8px_18px_rgba(15,23,42,0.2)] transition hover:brightness-[1.04] active:scale-[0.97]"
            style={{ borderColor: 'var(--theme-surface-border)', backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text-secondary)' }}
            aria-label="Skip intro"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
            Skip
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.img
            src="/assets/icons/logo_lotus.svg"
            alt=""
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-16 w-16 opacity-80"
          />
          <div className="space-y-2">
            <p className="text-[28px] font-extrabold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>
              Welcome to PranaFlow
            </p>
            <p className="text-[20px] font-bold text-[#60A5FA]">
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
        <Header showBack onBack={handleExitSession} showHelp theme={theme} onToggleTheme={onToggleTheme} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-[14px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text-secondary)' }}>Get ready</p>
          <motion.p
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="font-display text-[120px] font-extrabold leading-none text-[#60A5FA]"
          >
            {countdown}
          </motion.p>
          <p className="text-[15px]" style={{ color: 'var(--theme-text-secondary)' }}>Find a comfortable position</p>
        </div>
      </motion.section>
    );
  }

  // Breathing screen: active session
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col">
      <Header showBack onBack={handleExitSession} showHelp theme={theme} onToggleTheme={onToggleTheme} />

      {/* Progress card */}
      <div
        className="relative z-[1] flex items-center gap-3 rounded-2xl border px-3 py-3"
        style={{
          borderColor: 'var(--theme-surface-border)',
          backgroundColor: 'var(--theme-surface)',
          boxShadow: sessionUi.progressCardShadow,
        }}
      >

        {/* Round badge — number + glow ring */}
        <div
          className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-[3px]"
          style={{
            backgroundColor: sessionUi.roundBadgeBg,
            borderColor: phase.color,
            boxShadow: `0 0 0 4px ${phase.color}24, 0 0 16px ${phase.color}60`,
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
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-secondary)' }}>Session Progress</span>
            <span className="text-[13px] font-bold">
              <span style={{ color: phase.color }}>{engine.currentRound}</span>
              <span className="font-normal" style={{ color: 'var(--theme-text-secondary)' }}> / {settings.rounds}</span>
            </span>
          </div>

          {/* Progress bar — gradient fill with glow */}
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ backgroundColor: sessionUi.progressTrackBg }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${engine.totalProgress * 100}%`,
                background: `linear-gradient(90deg, ${phase.color}88 0%, ${phase.color} 100%)`,
                boxShadow: `0 0 10px ${phase.color}aa`,
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
                      backgroundColor: done || active ? phase.color : sessionUi.pipInactive,
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
                ? { width: 294, height: 294, opacity: 0.32 }
                : {
                    width: engine.currentPhase === 'inhale' ? 332 : engine.currentPhase === 'exhale' ? 268 : [296, 316, 296],
                    height: engine.currentPhase === 'inhale' ? 332 : engine.currentPhase === 'exhale' ? 268 : [296, 316, 296],
                    opacity: engine.currentPhase === 'hold' ? [0.5, 0.72, 0.5] : engine.currentPhase === 'inhale' ? 0.62 : 0.42,
                  }
            }
            initial={{ width: 294, height: 294, opacity: 0.4 }}
            style={{
              borderColor: `${phase.color}B3`,
              backgroundColor: `${phase.color}22`,
              boxShadow: `0 0 16px ${phase.color}55`,
            }}
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

        <p className="mt-1 text-center text-base" style={{ color: 'var(--theme-text-secondary)' }}>{phase.instruction}</p>

        <div className="mt-3 w-[180px]">
          <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-text-secondary)' }}>Phase progress</p>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: sessionUi.phaseTrackBg }}>
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${engine.phaseProgress * 100}%`,
                backgroundColor: phase.color,
                boxShadow: `0 0 9px ${phase.color}aa`,
              }}
            />
          </div>
        </div>

      </div>

      <div className="mt-auto flex items-center justify-between px-1 pt-3">
        <button
          type="button"
          onClick={() => {
            if (engine.isPaused) {
              engine.resume();
            } else {
              engine.pause();
            }
          }}
          aria-label={engine.isPaused ? 'Resume session' : 'Pause session'}
          className="grid h-11 w-11 place-items-center rounded-full border shadow-[0_8px_18px_rgba(15,23,42,0.22)] transition active:scale-[0.96]"
          style={{ borderColor: 'var(--theme-surface-border)', backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text-primary)' }}
        >
          {engine.isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>

        <button
          type="button"
          onClick={() => {
            engine.end();
            handleExitSession();
          }}
          aria-label="End session"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#EF4444] bg-gradient-to-b from-[#B91C1C] to-[#DC2626] text-white shadow-[0_0_0_1px_rgba(239,68,68,0.36),0_0_18px_rgba(239,68,68,0.25)] transition active:scale-[0.96]"
        >
          <Square size={15} />
        </button>
      </div>
    </motion.section>
  );
}
