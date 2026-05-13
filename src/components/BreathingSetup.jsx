import { motion } from 'framer-motion';
import { Bell, ChevronRight, Mic, Minus, Music2, Play, Plus, Repeat2, RotateCcw, SlidersHorizontal, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatTime } from '../utils/formatTime';
import BreathFlowDiagram from './BreathFlowDiagram';
import GlassCard from './GlassCard';
import Header from './Header';
import PrimaryButton from './PrimaryButton';
import SettingsRow from './SettingsRow';
import SetupSegmentedControl from './SetupSegmentedControl';
import SoundSettingsSheet from './SoundSettingsSheet';

function PhaseEditorRow({
  label,
  value,
  color,
  ariaLabel,
  active,
  disabled,
  canToggle,
  isEnabled,
  onToggle,
  onFocus,
  onChange,
  onDecrease,
  onIncrease,
}) {
  const isDisabled = disabled;

  return (
    <div
      className="rounded-3xl border p-3.5"
      style={{
        borderColor: active ? `${color}70` : 'rgba(120,90,55,0.14)',
        background: isDisabled
          ? 'linear-gradient(180deg, rgba(244,232,217,0.5) 0%, rgba(238,226,210,0.44) 100%)'
          : 'linear-gradient(180deg, rgba(255,252,246,0.92) 0%, rgba(255,246,232,0.84) 100%)',
        boxShadow: active
          ? `0 12px 26px ${color}22, inset 0 1px 0 rgba(255,255,255,0.68)`
          : '0 8px 18px rgba(75,54,33,0.07), inset 0 1px 0 rgba(255,255,255,0.62)',
      }}
      onClick={onFocus}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <p className="text-[14px] font-bold" style={{ color: '#071D36' }}>{label}</p>
        </div>

        {canToggle ? (
          <div
            className="inline-flex rounded-full border p-0.5"
            style={{ borderColor: 'rgba(120,90,55,0.2)', background: 'rgba(255,250,242,0.9)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              onClick={() => onToggle?.(true)}
              style={{
                color: isEnabled ? '#FFFFFF' : '#6E6A66',
                background: isEnabled ? 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)' : 'transparent',
              }}
            >
              ON
            </button>
            <button
              type="button"
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              onClick={() => onToggle?.(false)}
              style={{
                color: !isEnabled ? '#FFFFFF' : '#6E6A66',
                background: !isEnabled ? 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)' : 'transparent',
              }}
            >
              OFF
            </button>
          </div>
        ) : (
          <div className="rounded-full border px-2.5 py-0.5 text-[14px] font-bold" style={{ borderColor: `${color}55`, color, background: `${color}15` }}>
            {isDisabled ? 'Off' : `${value}s`}
          </div>
        )}
      </div>

      <div className="mt-2.5 rounded-2xl border px-2.5 py-2" style={{ borderColor: 'rgba(120,90,55,0.12)', background: 'rgba(255,250,242,0.72)' }}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Decrease ${ariaLabel}`}
            onClick={(event) => {
              event.stopPropagation();
              onDecrease();
            }}
            disabled={isDisabled}
            className="grid h-8 w-8 place-items-center rounded-full border"
            style={{
              borderColor: 'rgba(120,90,55,0.18)',
              color: isDisabled ? '#A39A8F' : '#071D36',
              background: 'rgba(255,250,242,0.92)',
            }}
          >
            <Minus size={14} />
          </button>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={value}
            disabled={isDisabled}
            onFocus={onFocus}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onChange(Number(event.target.value))}
            aria-label={ariaLabel}
            className="h-2 w-full appearance-none rounded-full"
            style={{
              background: isDisabled ? 'linear-gradient(90deg, #D2C3AF 0%, #DDD1C2 100%)' : `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
            }}
          />

          <button
            type="button"
            aria-label={`Increase ${ariaLabel}`}
            onClick={(event) => {
              event.stopPropagation();
              onIncrease();
            }}
            disabled={isDisabled}
            className="grid h-8 w-8 place-items-center rounded-full"
            style={{
              background: isDisabled ? '#D8CCBC' : 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)',
              color: '#FFFFFF',
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px]" style={{ color: '#6E6A66' }}>
          <span>1</span>
          <span>seconds</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}

export default function BreathingSetup({ settings, setSettings, onBack, onBeginSession, onSaveRhythm, theme = 'night', onToggleTheme }) {
  const [step, setStep] = useState(0);
  const [activeSheet, setActiveSheet] = useState(null);
  const [focusedPhase, setFocusedPhase] = useState('inhale');

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  // Treat missing holdEnabled as true (backward compat)
  const holdEnabled = settings.holdEnabled !== false;

  // When box breathing is turned ON, force holdEnabled true
  const handleBoxBreathingToggle = (isBox) => {
    setSettings((prev) => ({
      ...prev,
      boxBreathing: isBox,
      ...(isBox ? { holdEnabled: true } : {}),
    }));
  };

  const holdActive = settings.boxBreathing ? true : holdEnabled;
  const rhythmTotal = settings.inhaleSeconds + (holdActive ? settings.holdSeconds : 0) + settings.exhaleSeconds;
  const cycleExtra = settings.boxBreathing ? 4 : 0;
  const estimatedSeconds = settings.rounds * (rhythmTotal + cycleExtra);

  // Helper: increment rounds by 5s
  const incrementRounds = () => {
    const { rounds } = settings;
    if (rounds === 1) {
      update('rounds', 5);
    } else if (rounds < 5) {
      update('rounds', 5);
    } else if (rounds < 10) {
      update('rounds', 10);
    } else if (rounds < 15) {
      update('rounds', 15);
    } else if (rounds < 20) {
      update('rounds', 20);
    } else if (rounds < 25) {
      update('rounds', 25);
    } else if (rounds < 30) {
      update('rounds', 30);
    } else if (rounds < 35) {
      update('rounds', 35);
    } else if (rounds < 40) {
      update('rounds', 40);
    } else if (rounds < 45) {
      update('rounds', 45);
    } else {
      update('rounds', 50);
    }
  };

  // Helper: decrement rounds by 5s
  const decrementRounds = () => {
    const { rounds } = settings;
    if (rounds > 45) {
      update('rounds', 45);
    } else if (rounds > 40) {
      update('rounds', 40);
    } else if (rounds > 35) {
      update('rounds', 35);
    } else if (rounds > 30) {
      update('rounds', 30);
    } else if (rounds > 25) {
      update('rounds', 25);
    } else if (rounds > 20) {
      update('rounds', 20);
    } else if (rounds > 15) {
      update('rounds', 15);
    } else if (rounds > 10) {
      update('rounds', 10);
    } else if (rounds > 5) {
      update('rounds', 5);
    } else {
      update('rounds', 1);
    }
  };

  const profileLabel = useMemo(
    () => ({
      'hindi-calm': 'Hindi Calm Voice',
      'english-soft': 'English Soft Voice',
    }),
    []
  );

  const ambientLabel = useMemo(
    () => ({
      off: 'Off',
      'ocean-waves': 'Ocean Waves',
      rain: 'Rain',
      forest: 'Forest',
      'soft-om': 'Soft Om',
      'temple-chime': 'Temple Chime',
    }),
    []
  );

  const tickLabel = useMemo(
    () => ({
      'soft-chime': 'Soft Chime',
      'wooden-tap': 'Wooden Tap',
      bell: 'Bell',
      off: 'Off',
    }),
    []
  );

  const phaseSummary = holdActive
    ? `Inhale ${settings.inhaleSeconds}s • Hold ${settings.holdSeconds}s • Exhale ${settings.exhaleSeconds}s`
    : `Inhale ${settings.inhaleSeconds}s • Exhale ${settings.exhaleSeconds}s`;

  const soundSummary = settings.soundEnabled
    ? `${ambientLabel[settings.ambientSound]} • ${tickLabel[settings.tickSound]}`
    : 'Off';

  const openPhaseEditor = (phase = 'inhale') => {
    setFocusedPhase(phase);
    setActiveSheet('phases');
  };

  const handleBack = () => {
    if (activeSheet) {
      setActiveSheet(null);
      return;
    }

    if (step === 0) {
      onBack();
      return;
    }

    setStep(0);
  };

  const handlePrimaryAction = () => {
    if (step === 0) {
      onSaveRhythm();
      setStep(1);
      return;
    }

    onBeginSession();
  };

  const heading = step === 0 ? 'Design Your Flow' : 'Review Your Flow';
  const subtitle = step === 0 ? 'Shape a rhythm that feels right today.' : 'Make sure everything feels right.';



  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex min-h-[calc(100dvh-32px)] flex-col pb-1"
    >
      <div className="flex flex-1 flex-col">
        <Header showBack onBack={handleBack} showHelp theme={theme} onToggleTheme={onToggleTheme} />

        <h2 className="mt-2 font-serif-display text-[35px] font-bold leading-[1.05]" style={{ color: '#071D36' }}>
          {heading}
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: '#6E6A66' }}>
          {subtitle}
        </p>

        {step === 0 ? (
          <div className="mt-4 space-y-3">
            <GlassCard
              className="p-4"
              style={{
                background: 'rgba(255,250,242,0.72)',
                backdropFilter: 'blur(14px)',
                borderColor: 'rgba(120,90,55,0.08)',
                boxShadow: '0 12px 30px rgba(75,54,33,0.08)',
              }}
            >
              {settings.boxBreathing ? (
                <div
                  className="mb-3 overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: 'rgba(120,90,55,0.16)',
                    background:
                      'linear-gradient(180deg, rgba(255,252,246,0.9) 0%, rgba(255,246,232,0.86) 100%)',
                    boxShadow: '0 10px 24px rgba(75,54,33,0.06), inset 0 1px 0 rgba(255,255,255,0.65)',
                  }}
                >
                  <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'rgba(120,90,55,0.10)' }}>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ background: 'rgba(139,106,216,0.14)', color: '#6F4FB8' }}
                    >
                      Box Breathing
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: '#7A7268' }}>4-step calm protocol</span>
                  </div>

                  <p className="px-3 py-2.5 text-[12px] font-semibold leading-snug" style={{ color: '#10233F' }}>
                    Used by Navy seals to calm down and sleep effectively.
                  </p>
                </div>
              ) : null}

              <BreathFlowDiagram
                inhaleSeconds={settings.inhaleSeconds}
                holdSeconds={settings.holdSeconds}
                exhaleSeconds={settings.exhaleSeconds}
                holdActive={holdActive}
                boxBreathing={settings.boxBreathing}
                onOpenEditor={() => openPhaseEditor(focusedPhase)}
                onSelectPhase={setFocusedPhase}
              />

              <p className="mt-2 text-center text-[12px] font-semibold" style={{ color: '#10233F' }}>
                <span style={{ color: '#4A8FE7' }}>Inhale {settings.inhaleSeconds}s</span>
                {holdActive ? (
                  <>
                    <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: '#4A8FE7' }} aria-hidden="true" />
                    <span style={{ color: '#8B6AD8' }}>Hold {settings.holdSeconds}s</span>
                    <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: '#8B6AD8' }} aria-hidden="true" />
                  </>
                ) : (
                  <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: '#4A8FE7' }} aria-hidden="true" />
                )}
                <span style={{ color: '#37AAA4' }}>Exhale {settings.exhaleSeconds}s</span>
                {settings.boxBreathing ? (
                  <>
                    <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: '#8B6AD8' }} aria-hidden="true" />
                    <span style={{ color: '#8B6AD8' }}>Hold 4s</span>
                  </>
                ) : null}
              </p>
              <button
                type="button"
                onClick={() => openPhaseEditor(focusedPhase)}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full border px-3 text-[12px] font-semibold"
                style={{
                  borderColor: 'rgba(120,90,55,0.16)',
                  color: '#10233F',
                  background: 'rgba(255,250,242,0.72)',
                  boxShadow: '0 6px 16px rgba(75,54,33,0.06)',
                }}
              >
                <SlidersHorizontal size={14} />
                Customize Breath Flow
              </button>
            </GlassCard>

            <GlassCard className="p-3">
              <SetupSegmentedControl
                value={settings.boxBreathing ? 'box' : 'natural'}
                onChange={(mode) => handleBoxBreathingToggle(mode === 'box')}
                options={[
                  { label: 'Natural Flow', value: 'natural', icon: Wind },
                  { label: 'Box Breath', value: 'box', icon: Repeat2 },
                ]}
              />
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold" style={{ color: '#071D36' }}>Rounds</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease rounds"
                    onClick={decrementRounds}
                    className="grid h-10 w-10 place-items-center rounded-full border"
                    style={{ borderColor: 'rgba(120,90,55,0.16)', color: '#071D36', background: 'rgba(255,250,242,0.85)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="grid h-10 min-w-12 place-items-center rounded-full border px-3 text-[16px] font-bold"
                    style={{ borderColor: 'rgba(120,90,55,0.16)', color: '#071D36' }}
                  >
                    {settings.rounds}
                  </div>
                  <button
                    type="button"
                    aria-label="Increase rounds"
                    onClick={incrementRounds}
                    className="grid h-10 w-10 place-items-center rounded-full"
                    style={{ background: 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)', color: '#FFFFFF' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-2 p-3">
              <SettingsRow
                label="Sound Settings"
                value={soundSummary}
                onClick={() => setActiveSheet('ambient')}
              />
            </GlassCard>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-5 flex flex-col gap-[18px]">

            {/* ── Hero: character + breath ring + phase pill ── */}
            <div
              className="relative mx-auto flex w-full flex-col items-center rounded-[28px] pb-4 pt-5"
              style={{
                background: 'rgba(255,250,242,0.42)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(120,90,55,0.06)',
              }}
            >
              {/* Warm mist halo */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,248,235,0.78) 0%, rgba(255,238,210,0.32) 42%, rgba(255,238,210,0.10) 62%, transparent 78%)',
                }}
                animate={{ scale: [1, 1.015, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Character + breath ring */}
              <div className="relative h-[220px] w-[220px]">
                {/* Thin gradient arc ring */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 220 220"
                  aria-hidden="true"
                >
                  {settings.boxBreathing ? (
                    <>
                      <defs>
                        <linearGradient id="rvBoxTop" x1="38" y1="28" x2="182" y2="28" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#4A8FE7" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#8B6AD8" stopOpacity="0.42" />
                        </linearGradient>
                        <linearGradient id="rvBoxRight" x1="182" y1="28" x2="182" y2="182" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#8B6AD8" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#37AAA4" stopOpacity="0.42" />
                        </linearGradient>
                        <linearGradient id="rvBoxBottom" x1="182" y1="182" x2="38" y2="182" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#37AAA4" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#8B6AD8" stopOpacity="0.42" />
                        </linearGradient>
                        <linearGradient id="rvBoxLeft" x1="38" y1="182" x2="38" y2="28" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#8B6AD8" stopOpacity="0.48" />
                          <stop offset="100%" stopColor="#4A8FE7" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      <motion.path
                        d="M 38,28 H 182"
                        fill="none"
                        stroke="url(#rvBoxTop)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.42, 0.78, 0.42] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="M 182,28 V 182"
                        fill="none"
                        stroke="url(#rvBoxRight)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.4, 0.74, 0.4] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                      />
                      <motion.path
                        d="M 182,182 H 38"
                        fill="none"
                        stroke="url(#rvBoxBottom)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.38, 0.72, 0.38] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      />
                      <motion.path
                        d="M 38,182 V 28"
                        fill="none"
                        stroke="url(#rvBoxLeft)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.36, 0.7, 0.36] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.75 }}
                      />
                    </>
                  ) : (
                    <>
                      <defs>
                        <linearGradient id="rvArcIH" x1="110" y1="10" x2="197" y2="160" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#4A8FE7" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#8B6AD8" stopOpacity="0.42" />
                        </linearGradient>
                        <linearGradient id="rvArcHE" x1="197" y1="160" x2="23" y2="160" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#8B6AD8" stopOpacity="0.48" />
                          <stop offset="100%" stopColor="#37AAA4" stopOpacity="0.42" />
                        </linearGradient>
                        <linearGradient id="rvArcEI" x1="23" y1="160" x2="110" y2="10" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#37AAA4" stopOpacity="0.48" />
                          <stop offset="100%" stopColor="#4A8FE7" stopOpacity="0.42" />
                        </linearGradient>
                      </defs>

                      <motion.path
                        d="M 110,10 A 100,100 0 0,1 197,160"
                        fill="none"
                        stroke="url(#rvArcIH)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.42, 0.78, 0.42] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.path
                        d="M 197,160 A 100,100 0 0,1 23,160"
                        fill="none"
                        stroke="url(#rvArcHE)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.40, 0.74, 0.40] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                      />
                      <motion.path
                        d="M 23,160 A 100,100 0 0,1 110,10"
                        fill="none"
                        stroke="url(#rvArcEI)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        animate={{ opacity: [0.38, 0.72, 0.38] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                      />
                    </>
                  )}
                </svg>

                {/* Character image */}
                <motion.img
                  src="/assets/images/Inhale_pose.png"
                  alt="Meditation character"
                  className="relative z-10 h-[220px] w-[220px] object-contain"
                  animate={{ scale: [1, 1.015, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Phase summary pill */}
              <div
                className="mt-3 flex gap-1 overflow-hidden rounded-full border px-1 py-1"
                style={{ borderColor: 'rgba(120,90,55,0.12)', background: 'rgba(255,250,242,0.88)' }}
              >
                <span
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ background: 'rgba(74,143,231,0.12)', color: '#4A8FE7' }}
                >
                  Inhale {settings.inhaleSeconds}s
                </span>
                {holdActive ? (
                  <span
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                    style={{ background: 'rgba(139,106,216,0.12)', color: '#8B6AD8' }}
                  >
                    Hold {settings.holdSeconds}s
                  </span>
                ) : null}
                <span
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ background: 'rgba(55,170,164,0.12)', color: '#37AAA4' }}
                >
                  Exhale {settings.exhaleSeconds}s
                </span>
                {settings.boxBreathing ? (
                  <span
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                    style={{ background: 'rgba(139,106,216,0.12)', color: '#8B6AD8' }}
                  >
                    Hold 4s
                  </span>
                ) : null}
              </div>
            </div>

            {/* ── Unified settings + stats panel ── */}
            <div
              className="overflow-hidden rounded-[28px] border"
              style={{
                background: 'rgba(255,250,242,0.72)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(120,90,55,0.08)',
                boxShadow: '0 12px 30px rgba(75,54,33,0.08)',
              }}
            >
              {/* Rounds */}
              <button
                type="button"
                onClick={() => setActiveSheet('rounds')}
                className="flex h-[56px] w-full items-center justify-between px-4 text-left"
                style={{ borderBottom: '1px solid rgba(120,90,55,0.08)' }}
              >
                <span className="flex items-center gap-2.5">
                  <RotateCcw size={18} style={{ color: '#071D36', opacity: 0.6 }} />
                  <span className="text-[14px] font-semibold" style={{ color: '#071D36' }}>Rounds</span>
                </span>
                <span className="flex items-center gap-1.5 text-[13px]" style={{ color: '#6E6A66' }}>
                  {settings.rounds}
                  <ChevronRight size={15} />
                </span>
              </button>

              {/* Voice Guidance */}
              <button
                type="button"
                onClick={() => setActiveSheet('voice')}
                className="flex h-[56px] w-full items-center justify-between px-4 text-left"
                style={{ borderBottom: '1px solid rgba(120,90,55,0.08)' }}
              >
                <span className="flex items-center gap-2.5">
                  <Mic size={18} style={{ color: '#071D36', opacity: 0.6 }} />
                  <span className="text-[14px] font-semibold" style={{ color: '#071D36' }}>Voice Guidance</span>
                </span>
                <span className="flex items-center gap-1.5 text-[13px]" style={{ color: '#6E6A66' }}>
                  {settings.voiceEnabled ? profileLabel[settings.voiceProfile] : 'Off'}
                  <ChevronRight size={15} />
                </span>
              </button>

              {/* Ambient Sound */}
              <button
                type="button"
                onClick={() => setActiveSheet('ambient')}
                className="flex h-[56px] w-full items-center justify-between px-4 text-left"
                style={{ borderBottom: '1px solid rgba(120,90,55,0.08)' }}
              >
                <span className="flex items-center gap-2.5">
                  <Music2 size={18} style={{ color: '#071D36', opacity: 0.6 }} />
                  <span className="text-[14px] font-semibold" style={{ color: '#071D36' }}>Ambient Sound</span>
                </span>
                <span className="flex items-center gap-1.5 text-[13px]" style={{ color: '#6E6A66' }}>
                  {settings.soundEnabled ? ambientLabel[settings.ambientSound] : 'Off'}
                  <ChevronRight size={15} />
                </span>
              </button>

              {/* Tick Sound */}
              <button
                type="button"
                onClick={() => setActiveSheet('tick')}
                className="flex h-[56px] w-full items-center justify-between px-4 text-left"
                style={{ borderBottom: '1px solid rgba(120,90,55,0.08)' }}
              >
                <span className="flex items-center gap-2.5">
                  <Bell size={18} style={{ color: '#071D36', opacity: 0.6 }} />
                  <span className="text-[14px] font-semibold" style={{ color: '#071D36' }}>Tick Sound</span>
                </span>
                <span className="flex items-center gap-1.5 text-[13px]" style={{ color: '#6E6A66' }}>
                  {settings.soundEnabled ? tickLabel[settings.tickSound] : 'Off'}
                  <ChevronRight size={15} />
                </span>
              </button>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x px-2 py-4 text-center" style={{ '--tw-divide-opacity': 1, borderTop: '1px solid rgba(120,90,55,0.08)', color: 'rgba(120,90,55,0.20)' }}>
                <div>
                  <p className="text-[11px]" style={{ color: '#6E6A66' }}>Per Round</p>
                  <p className="mt-0.5 text-[15px] font-bold" style={{ color: '#071D36' }}>{formatTime(rhythmTotal + cycleExtra)}</p>
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: '#6E6A66' }}>Breaths</p>
                  <p className="mt-0.5 text-[15px] font-bold" style={{ color: '#071D36' }}>{settings.rounds * (settings.boxBreathing ? 4 : holdActive ? 3 : 2)}</p>
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: '#6E6A66' }}>Total</p>
                  <p className="mt-0.5 text-[15px] font-bold" style={{ color: '#071D36' }}>{formatTime(estimatedSeconds)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <motion.div
        className="mt-auto pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <PrimaryButton icon={Play} onClick={handlePrimaryAction} className="h-[60px] text-[18px] font-bold">
          {step === 0 ? 'Review Flow' : 'Begin This Flow'}
        </PrimaryButton>
        {step === 1 ? (
          <p className="mt-2 text-center text-[12px]" style={{ color: 'rgba(7,29,54,0.46)' }}>
            You can pause or adjust anytime.
          </p>
        ) : null}
      </motion.div>

      {activeSheet === 'rounds' || activeSheet === 'phases' ? (
        <motion.button
          type="button"
          aria-label="Close panel"
          className="absolute inset-0 z-40 bg-[#071D36]/35"
          onClick={() => setActiveSheet(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      ) : null}

      {activeSheet === 'phases' ? (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <GlassCard
            className="rounded-t-[32px] p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(255,252,246,0.96) 0%, rgba(255,246,234,0.9) 100%)',
              borderColor: 'rgba(120,90,55,0.12)',
              boxShadow: '0 20px 40px rgba(75,54,33,0.14)',
            }}
          >
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[#CDBCA7]" />
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif-display text-[24px] font-bold" style={{ color: '#071D36' }}>Customize Breath Flow</h3>
              <span
                className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ borderColor: 'rgba(120,90,55,0.18)', color: '#7A7268', background: 'rgba(255,250,242,0.84)' }}
              >
                Live
              </span>
            </div>
            <p className="mt-1 text-[12px]" style={{ color: '#6E6A66' }}>
              Adjust each phase without leaving your flow.
            </p>

            <div className="mt-4 space-y-2.5">
              <PhaseEditorRow
                label="Inhale"
                value={settings.inhaleSeconds}
                color="#4A8FE7"
                ariaLabel="Breathe in seconds"
                active={focusedPhase === 'inhale'}
                disabled={false}
                canToggle={false}
                isEnabled
                onFocus={() => setFocusedPhase('inhale')}
                onChange={(value) => update('inhaleSeconds', value)}
                onDecrease={() => update('inhaleSeconds', Math.max(1, settings.inhaleSeconds - 1))}
                onIncrease={() => update('inhaleSeconds', Math.min(10, settings.inhaleSeconds + 1))}
              />

              <PhaseEditorRow
                label="Hold"
                value={settings.holdSeconds}
                color="#8B6AD8"
                ariaLabel="Hold seconds"
                active={focusedPhase === 'hold'}
                disabled={!holdActive}
                canToggle={!settings.boxBreathing}
                isEnabled={holdActive}
                onToggle={(enabled) => update('holdEnabled', enabled)}
                onFocus={() => setFocusedPhase('hold')}
                onChange={(value) => update('holdSeconds', value)}
                onDecrease={() => update('holdSeconds', Math.max(1, settings.holdSeconds - 1))}
                onIncrease={() => update('holdSeconds', Math.min(10, settings.holdSeconds + 1))}
              />

              <PhaseEditorRow
                label="Exhale"
                value={settings.exhaleSeconds}
                color="#37AAA4"
                ariaLabel="Breathe out seconds"
                active={focusedPhase === 'exhale'}
                disabled={false}
                canToggle={false}
                isEnabled
                onFocus={() => setFocusedPhase('exhale')}
                onChange={(value) => update('exhaleSeconds', value)}
                onDecrease={() => update('exhaleSeconds', Math.max(1, settings.exhaleSeconds - 1))}
                onIncrease={() => update('exhaleSeconds', Math.min(10, settings.exhaleSeconds + 1))}
              />
            </div>

            {settings.boxBreathing ? (
              <p className="mt-3 text-[11px]" style={{ color: '#6E6A66' }}>
                Box Breath keeps hold active and adds a second hold after exhale.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setActiveSheet(null)}
              className="mt-4 h-11 w-full rounded-2xl text-[15px] font-bold"
              style={{ background: 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)', color: '#FFFFFF' }}
            >
              Done
            </button>
          </GlassCard>
        </motion.div>
      ) : null}

      {activeSheet === 'rounds' ? (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <GlassCard className="rounded-t-[30px] p-4">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[#CDBCA7]" />
            <h3 className="font-serif-display text-[24px] font-bold" style={{ color: '#071D36' }}>Rounds</h3>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Decrease rounds"
                onClick={decrementRounds}
                className="grid h-12 w-12 place-items-center rounded-full border"
                style={{ borderColor: 'rgba(120,90,55,0.18)', color: '#071D36' }}
              >
                <Minus size={18} />
              </button>
              <div className="grid h-12 min-w-14 place-items-center rounded-full border px-3 text-[20px] font-extrabold"
                style={{ borderColor: 'rgba(120,90,55,0.18)', color: '#071D36' }}
              >
                {settings.rounds}
              </div>
              <button
                type="button"
                aria-label="Increase rounds"
                onClick={incrementRounds}
                className="grid h-12 w-12 place-items-center rounded-full"
                style={{ background: 'linear-gradient(135deg, #071D36 0%, #0E2A49 100%)', color: '#FFFFFF' }}
              >
                <Plus size={18} />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      ) : null}

      <SoundSettingsSheet
        open={activeSheet === 'voice' || activeSheet === 'ambient' || activeSheet === 'tick'}
        section={activeSheet}
        onClose={() => setActiveSheet(null)}
        voiceEnabled={settings.voiceEnabled}
        soundEnabled={settings.soundEnabled}
        voiceChoice={settings.voiceProfile}
        ambientChoice={settings.ambientSound}
        tickChoice={settings.tickSound}
        onVoiceToggle={(enabled) => update('voiceEnabled', enabled)}
        onSoundToggle={(enabled) => update('soundEnabled', enabled)}
        onVoiceChoice={(value) => update('voiceProfile', value)}
        onAmbientChoice={(value) => {
          update('ambientSound', value);
          if (value === 'off' && settings.tickSound === 'off') {
            update('soundEnabled', false);
          } else if (value !== 'off') {
            update('soundEnabled', true);
          }
        }}
        onTickChoice={(value) => {
          update('tickSound', value);
          if (value === 'off' && settings.ambientSound === 'off') {
            update('soundEnabled', false);
          } else if (value !== 'off') {
            update('soundEnabled', true);
          }
        }}
      />
    </motion.section>
  );
}
