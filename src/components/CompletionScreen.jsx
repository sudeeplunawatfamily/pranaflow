import { motion } from 'framer-motion';
import { Clock, Home, Leaf, Moon, Pause, RefreshCcw, RotateCcw, Smile, Target, Waves, Wind } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useAudioGuide from '../hooks/useAudioGuide';
import { formatTime } from '../utils/formatTime';
import CharacterBackdrop from './CharacterBackdrop';
import PrimaryButton from './PrimaryButton';

const moodConfig = [
  { name: 'Calm', Icon: Smile, color: '#60A5FA' },
  { name: 'Refreshed', Icon: Leaf, color: '#22D3EE' },
  { name: 'Sleepy', Icon: Moon, color: '#A78BFA' },
  { name: 'Focused', Icon: Target, color: '#60A5FA' },
];

const SPARKLE_COLORS = ['#60A5FA', '#22D3EE', '#A78BFA', '#60A5FA', '#22D3EE', '#A78BFA'];

export default function CompletionScreen({ settings, durationSeconds, onRepeat, onChangeRhythm, onHome, onMoodChange, theme = 'night' }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const audio = useAudioGuide();
  const isNight = theme === 'night';

  const completionUi = {
    cardShadow: isNight ? '0 12px 30px rgba(15,23,42,0.22)' : '0 12px 30px rgba(36,135,234,0.14)',
    metricIconBg: isNight ? '#334155' : '#EAF6FF',
    moodSelectedBg: isNight
      ? 'color-mix(in srgb, var(--theme-surface) 80%, #334155)'
      : 'color-mix(in srgb, var(--theme-surface) 85%, #EAF6FF)',
    homeButtonShadow: isNight ? '0 8px 18px rgba(15,23,42,0.2)' : '0 8px 18px rgba(36,135,234,0.14)',
  };

  useEffect(() => {
    if (settings.voiceEnabled || settings.soundEnabled) {
      audio.playComplete();
    }
  }, [audio, settings.soundEnabled, settings.voiceEnabled]);

  const sparkles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((i % 6) - 2.5) * 38,
      targetY: -70 - (i % 3) * 28,
      drift: i % 2 === 0 ? 14 : -14,
      delay: i * 0.07,
      color: SPARKLE_COLORS[i % 6],
      size: 6 + (i % 3) * 4,
    })),
    []
  );

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative flex min-h-[calc(100dvh-32px)] flex-col pb-1 text-center">
      {/* Sparkle ceremony — fires once on mount */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{ width: s.size, height: s.size, backgroundColor: s.color, marginLeft: -s.size / 2 }}
            initial={{ opacity: 1, y: 0, x: s.x, scale: 0.3 }}
            animate={{ opacity: 0, y: s.targetY, x: s.x + s.drift, scale: 1.4 }}
            transition={{ duration: 1.3 + (s.id % 3) * 0.18, delay: s.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="relative z-[1] mt-2 flex items-center justify-center gap-2">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow logo" className="h-8 w-8" />
        <p className="font-display text-2xl font-extrabold text-[#60A5FA]">PranaFlow</p>
      </div>

      <h2 className="font-display relative z-[1] mt-3 text-[32px] font-extrabold leading-none" style={{ color: 'var(--theme-text-primary)' }}>Beautiful work.</h2>
      <p className="relative z-[1] mt-1 text-base" style={{ color: 'var(--theme-text-secondary)' }}>You completed <span className="font-extrabold text-[#60A5FA]">{settings.rounds}</span> rounds.</p>

      <CharacterBackdrop className="mt-3" glowSizeClass="h-56 w-56">
          <img src="/assets/images/Hold_pose.png" alt="Completion yoga pose" className="relative z-10 mx-auto w-[240px] object-contain" />
      </CharacterBackdrop>

      <section
        className="mt-3 rounded-3xl border p-3 text-left"
        style={{
          borderColor: 'var(--theme-surface-border)',
          backgroundColor: 'var(--theme-surface)',
          boxShadow: completionUi.cardShadow,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full text-[#60A5FA]" style={{ backgroundColor: completionUi.metricIconBg }}>
            <Clock size={20} />
          </span>
          <div>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Total Time</p>
            <p className="text-[28px] font-extrabold" style={{ color: 'var(--theme-text-primary)' }}>{formatTime(durationSeconds)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 border-t pt-3" style={{ borderColor: 'var(--theme-surface-border)' }}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ backgroundColor: completionUi.metricIconBg }}>
            <span className="flex items-center gap-0.5">
              <Wind size={9} color="#60A5FA" />
              <Pause size={9} color="#A78BFA" />
              <Waves size={9} color="#22D3EE" />
            </span>
          </span>
          <div>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Rhythm</p>
            <p className="text-[17px] font-extrabold">
              {settings.boxBreathing ? (
                <>
                  <span style={{ color: 'var(--theme-text-secondary)' }}>Box.</span>
                  <span className="text-[#60A5FA]">{settings.inhaleSeconds}s</span>
                  <span style={{ color: 'var(--theme-text-secondary)' }}>.</span>
                  <span className="text-[#A78BFA]">{settings.holdSeconds}s</span>
                  <span style={{ color: 'var(--theme-text-secondary)' }}>.</span>
                  <span className="text-[#22D3EE]">{settings.exhaleSeconds}s</span>
                </>
              ) : (
                <>
                  <span className="text-[#60A5FA]">{settings.inhaleSeconds}s</span>
                  <span style={{ color: 'var(--theme-text-secondary)' }}> · </span>
                  <span className="text-[#A78BFA]">{settings.holdSeconds}s</span>
                  <span style={{ color: 'var(--theme-text-secondary)' }}> · </span>
                  <span className="text-[#22D3EE]">{settings.exhaleSeconds}s</span>
                </>
              )}
              <span className="ml-1 text-[12px] font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>· {settings.rounds} rounds</span>
            </p>
          </div>
        </div>
      </section>

      <section
        className="mt-3 rounded-3xl border p-3 text-left"
        style={{
          borderColor: 'var(--theme-surface-border)',
          backgroundColor: 'var(--theme-surface)',
          boxShadow: completionUi.cardShadow,
        }}
      >
        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>Take a moment. How do you feel?</p>
        <p className="text-base font-bold" style={{ color: 'var(--theme-text-primary)' }}>How do you feel now?</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {moodConfig.map(({ name, Icon, color }) => {
            const selected = selectedMood === name;
            return (
              <motion.button
                type="button"
                key={name}
                onClick={() => {
                  setSelectedMood(name);
                  onMoodChange?.(name);
                }}
                animate={selected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center text-[11px] font-bold"
                style={selected
                  ? { borderColor: color, color, boxShadow: `0 0 14px ${color}44`, backgroundColor: completionUi.moodSelectedBg }
                  : { borderColor: 'var(--theme-surface-border)', color: 'var(--theme-text-secondary)', backgroundColor: 'var(--theme-surface)' }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full" style={{ backgroundColor: `${color}22`, color }}>
                  <Icon size={16} />
                </span>
                {name}
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="mt-auto space-y-2.5 pt-3">
        <PrimaryButton icon={RefreshCcw} onClick={onRepeat} className="h-[60px]">
          <span className="flex flex-col items-start leading-tight">
            <span>Breathe again</span>
            <span className="text-[11px] font-semibold opacity-75">
              {settings.boxBreathing ? `Box • ${settings.inhaleSeconds}s • ${settings.holdSeconds}s • ${settings.exhaleSeconds}s` : `${settings.inhaleSeconds}s • ${settings.holdSeconds}s • ${settings.exhaleSeconds}s`} • {settings.rounds} rounds
            </span>
          </span>
        </PrimaryButton>
        <PrimaryButton icon={RotateCcw} variant="secondary" onClick={onChangeRhythm} className="h-[46px]">
          Change Rhythm
        </PrimaryButton>
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={onHome}
            aria-label="Go to Home"
            className="grid h-10 w-10 place-items-center rounded-full border transition active:scale-[0.97]"
            style={{ borderColor: 'var(--theme-surface-border)', backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text-secondary)', boxShadow: completionUi.homeButtonShadow }}
          >
            <Home size={16} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
