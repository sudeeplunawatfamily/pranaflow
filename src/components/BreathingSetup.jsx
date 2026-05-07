import { motion } from 'framer-motion';
import { Minus, Music, Pause, Plus, Play, RefreshCcw, Volume2, Waves, Wind, Repeat2 } from 'lucide-react';
import { useMemo } from 'react';
import { formatTime } from '../utils/formatTime';
import Header from './Header';
import PrimaryButton from './PrimaryButton';

const phaseCards = [
  { key: 'inhaleSeconds', label: 'Breathe In', color: '#2487EA', Icon: Wind, ariaLabel: 'Breathe in seconds' },
  { key: 'holdSeconds', label: 'Hold', color: '#8755E8', Icon: Pause, ariaLabel: 'Hold seconds' },
  { key: 'exhaleSeconds', label: 'Breathe Out', color: '#20B8C4', Icon: Waves, ariaLabel: 'Breathe out seconds' },
];

export default function BreathingSetup({ settings, setSettings, onBack, onBeginSession, onSaveRhythm, theme = 'night', onToggleTheme }) {
  const isNight = theme === 'night';
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const rhythmTotal = settings.inhaleSeconds + settings.holdSeconds + settings.exhaleSeconds;
  const cycleExtra = settings.boxBreathing ? 4 : 0;
  const estimatedSeconds = settings.rounds * (rhythmTotal + cycleExtra);

  const rhythmMeaning = useMemo(() => {
    if (settings.exhaleSeconds > settings.inhaleSeconds) return 'Longer exhales to calm your body';
    if (settings.inhaleSeconds > settings.exhaleSeconds) return 'Longer inhales to gently energize your mind';
    return 'Balanced breathing for relaxation';
  }, [settings.exhaleSeconds, settings.inhaleSeconds]);

  const setupUi = useMemo(() => {
    if (isNight) {
      return {
        iconChipBg: '#334155',
        iconChipPrimary: '#60A5FA',
        iconChipSound: '#22D3EE',
        sliderTrack: '#334155',
        toggleOff: '#334155',
        toggleThumb: '#E2E8F0',
        pillShadow: '0 8px 18px rgba(15,23,42,0.45)',
        rhythmCardShadow: '0 10px 24px rgba(15,23,42,0.2)',
        phaseCardShadow: '0 8px 20px rgba(15,23,42,0.18)',
        valuePillShadow: '0 6px 16px rgba(15,23,42,0.5)',
        settingsCardShadow: '0 12px 30px rgba(15,23,42,0.22)',
        setupHalo: 'radial-gradient(circle, rgba(226,232,240,0.20) 0%, rgba(96,165,250,0.18) 30%, rgba(167,139,250,0.10) 55%, rgba(34,211,238,0.08) 72%, transparent 100%)',
      };
    }

    return {
      iconChipBg: '#EAF6FF',
      iconChipPrimary: '#2487EA',
      iconChipSound: '#2487EA',
      sliderTrack: '#DDEEFE',
      toggleOff: '#D6EAFF',
      toggleThumb: '#FFFFFF',
      pillShadow: '0 8px 18px rgba(36,135,234,0.12)',
      rhythmCardShadow: '0 10px 24px rgba(36,135,234,0.14)',
      phaseCardShadow: '0 8px 20px rgba(36,135,234,0.12)',
      valuePillShadow: '0 6px 16px rgba(36,135,234,0.16)',
      settingsCardShadow: '0 12px 30px rgba(36,135,234,0.14)',
      setupHalo: 'radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.72) 30%, rgba(205,235,255,0.48) 56%, rgba(140,202,242,0.16) 76%, transparent 100%)',
    };
  }, [isNight]);

  const meaningPill = useMemo(() => {
    const light = !isNight;

    if (settings.exhaleSeconds > settings.inhaleSeconds) {
      return {
        Icon: Waves,
        textColor: light ? '#0B5E72' : '#BDEFF6',
        iconColor: light ? '#20B8C4' : '#22D3EE',
        borderColor: light ? '#BFEFF3' : 'rgba(34,211,238,0.38)',
        bg: light
          ? 'linear-gradient(135deg, rgba(32,184,196,0.14) 0%, rgba(32,184,196,0.06) 55%, rgba(255,255,255,0.88) 100%)'
          : 'linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(34,211,238,0.06) 50%, rgba(30,41,59,0.86) 100%)',
      };
    }

    if (settings.inhaleSeconds > settings.exhaleSeconds) {
      return {
        Icon: Wind,
        textColor: light ? '#184B8A' : '#D4E8FF',
        iconColor: light ? '#2487EA' : '#60A5FA',
        borderColor: light ? '#CFE6FB' : 'rgba(96,165,250,0.38)',
        bg: light
          ? 'linear-gradient(135deg, rgba(36,135,234,0.14) 0%, rgba(36,135,234,0.06) 55%, rgba(255,255,255,0.88) 100%)'
          : 'linear-gradient(135deg, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0.06) 50%, rgba(30,41,59,0.86) 100%)',
      };
    }

    return {
      Icon: Pause,
      textColor: light ? '#5B3B95' : '#E7DDFF',
      iconColor: light ? '#8755E8' : '#A78BFA',
      borderColor: light ? '#E3D8FF' : 'rgba(167,139,250,0.38)',
      bg: light
        ? 'linear-gradient(135deg, rgba(135,85,232,0.14) 0%, rgba(135,85,232,0.06) 55%, rgba(255,255,255,0.88) 100%)'
        : 'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(167,139,250,0.06) 50%, rgba(30,41,59,0.86) 100%)',
    };
  }, [isNight, settings.exhaleSeconds, settings.inhaleSeconds]);

  const MeaningIcon = meaningPill.Icon;

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col pb-1">
      <div className="flex flex-1 flex-col justify-center gap-3 max-[740px]:justify-start">
        <Header showBack onBack={onBack} showHelp theme={theme} onToggleTheme={onToggleTheme} />

        <h2 className="font-display text-[29px] font-extrabold leading-none" style={{ color: 'var(--theme-text-primary)' }}>Set your breathing rhythm</h2>
        <p className="mt-1 text-[15px]" style={{ color: 'var(--theme-text-secondary)' }}>Adjust the timing for each phase</p>
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2.5 shadow-[0_8px_18px_rgba(15,23,42,0.45)]"
          style={{ borderColor: meaningPill.borderColor, background: meaningPill.bg, boxShadow: setupUi.pillShadow }}
        >
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{ color: meaningPill.iconColor, backgroundColor: 'color-mix(in srgb, var(--theme-bg-app) 28%, transparent)' }}
          >
            <MeaningIcon size={14} />
          </span>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: meaningPill.textColor }}>
            {rhythmMeaning}
          </p>
        </div>

        {/* Proportional rhythm bar — segment width reflects actual phase duration */}
        <div
          className="mt-1.5 w-full rounded-2xl p-2.5 border"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-surface-border)',
            boxShadow: setupUi.rhythmCardShadow,
          }}
        >
          <div className="flex h-5 w-full overflow-hidden rounded-full">
            {[
              { key: 'inhale', seconds: settings.inhaleSeconds, color: '#60A5FA' },
              { key: 'hold', seconds: settings.holdSeconds, color: '#A78BFA' },
              { key: 'exhale', seconds: settings.exhaleSeconds, color: '#22D3EE' },
              ...(settings.boxBreathing ? [{ key: 'hold-box', seconds: 4, color: '#A78BFA' }] : []),
            ].map(({ key, seconds, color }) => (
              <div
                key={key}
                className="flex items-center justify-center overflow-hidden text-[9px] font-extrabold text-white transition-all duration-300"
                style={{ width: `${(seconds / (rhythmTotal + cycleExtra)) * 100}%`, backgroundColor: color }}
              >
                {seconds}s
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex">
            {[
              { key: 'inhale', label: 'In', Icon: Wind, seconds: settings.inhaleSeconds, color: '#60A5FA' },
              { key: 'hold', label: 'Hold', Icon: Pause, seconds: settings.holdSeconds, color: '#A78BFA' },
              { key: 'exhale', label: 'Out', Icon: Waves, seconds: settings.exhaleSeconds, color: '#22D3EE' },
              ...(settings.boxBreathing ? [{ key: 'hold-box', label: 'Hold', Icon: Pause, seconds: 4, color: '#A78BFA' }] : []),
            ].map(({ key, label, Icon, seconds, color }) => (
              <div key={key} className="flex items-center justify-center gap-1 overflow-hidden" style={{ width: `${(seconds / (rhythmTotal + cycleExtra)) * 100}%` }}>
                <Icon size={9} color={color} />
                <span className="text-[9px] font-bold" style={{ color }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: setupUi.setupHalo }}
          />
          <img src="/assets/images/Inhale_pose.png" alt="Breathing setup pose" className="relative z-10 w-[210px] object-contain" />
        </div>

        <div className="mt-0.5 grid grid-cols-3 gap-1.5">
          {phaseCards.map(({ key, label, color, Icon, ariaLabel }) => (
            <article
              key={key}
              className="rounded-[20px] border p-2"
              style={{ borderColor: `${color}66`, backgroundColor: 'var(--theme-surface)', boxShadow: setupUi.phaseCardShadow }}
            >
              <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>{label}</p>
              <span className="mt-1.5 grid h-7 w-7 place-items-center rounded-full" style={{ backgroundColor: `${color}22`, color }}>
                <Icon size={13} />
              </span>
              <button
                type="button"
                aria-label={`Tap to increase ${ariaLabel}`}
                onClick={() => update(key, settings[key] >= 10 ? 1 : settings[key] + 1)}
                className="mt-1 flex w-full flex-col items-center rounded-xl border px-1 py-1.5 shadow-[0_6px_16px_rgba(15,23,42,0.5)] transition active:scale-[0.98]"
                style={{ borderColor: `${color}35`, backgroundColor: `${color}10`, boxShadow: setupUi.valuePillShadow }}
              >
                <span className="text-[18px] font-extrabold leading-none" style={{ color }}>
                  {settings[key]}s
                </span>
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                  <Plus size={9} strokeWidth={2.6} />
                </span>
              </button>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                aria-label={ariaLabel}
                value={settings[key]}
                onChange={(e) => update(key, Number(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  accentColor: color,
                  '--range-color': color,
                  '--range-thumb-border': isNight ? '#0F172A' : '#FFFFFF',
                  '--range-thumb-glow': isNight
                    ? 'color-mix(in srgb, var(--range-color) 55%, transparent)'
                    : 'color-mix(in srgb, var(--range-color) 40%, white)',
                  backgroundColor: setupUi.sliderTrack,
                }}
              />
              <div className="mt-0.5 flex justify-between text-[9px]" style={{ color: 'var(--theme-text-secondary)' }}>
                <span>1</span>
                <span>10</span>
              </div>
            </article>
          ))}
        </div>

        <section
          className="mt-0.5 rounded-[20px] p-2.5 border"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-surface-border)',
            boxShadow: setupUi.settingsCardShadow,
          }}
        >
          <div className="flex items-center justify-between border-b py-2.5" style={{ borderColor: 'var(--theme-surface-border)' }}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: setupUi.iconChipBg, color: setupUi.iconChipPrimary }}>
                <RefreshCcw size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>Rounds</p>
                <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Total breathing cycles</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Decrease rounds"
                className="grid h-8 w-8 place-items-center rounded-full border"
                style={{ borderColor: 'var(--theme-surface-border)', color: 'var(--theme-brand)', backgroundColor: 'color-mix(in srgb, var(--theme-bg-app) 22%, var(--theme-surface))' }}
                onClick={() => update('rounds', Math.max(1, settings.rounds - 1))}
              >
                <Minus size={14} />
              </button>
              <p className="w-7 text-center text-[15px] font-extrabold" style={{ color: 'var(--theme-text-primary)' }}>{settings.rounds}</p>
              <button
                type="button"
                aria-label="Increase rounds"
                className="grid h-8 w-8 place-items-center rounded-full border"
                style={{ borderColor: 'var(--theme-surface-border)', color: 'var(--theme-brand)', backgroundColor: 'color-mix(in srgb, var(--theme-bg-app) 22%, var(--theme-surface))' }}
                onClick={() => update('rounds', Math.min(20, settings.rounds + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b py-2.5" style={{ borderColor: 'var(--theme-surface-border)' }}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: setupUi.iconChipBg, color: setupUi.iconChipPrimary }}>
                <Repeat2 size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>Box Breathing</p>
                <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Add 4s hold after exhale</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.boxBreathing}
              className={`h-7 w-12 rounded-full p-1 transition ${settings.boxBreathing ? 'bg-[#60A5FA] shadow-[0_0_14px_rgba(96,165,250,0.5)]' : ''}`}
              style={settings.boxBreathing ? undefined : { backgroundColor: setupUi.toggleOff }}
              onClick={() => update('boxBreathing', !settings.boxBreathing)}
              aria-label="Toggle box breathing"
            >
              <span className={`block h-5 w-5 rounded-full transition ${settings.boxBreathing ? 'translate-x-5' : ''}`} style={{ backgroundColor: setupUi.toggleThumb }} />
            </button>
          </div>

          <div className="flex items-center justify-between border-b py-2.5" style={{ borderColor: 'var(--theme-surface-border)' }}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: setupUi.iconChipBg, color: setupUi.iconChipPrimary }}>
                <Volume2 size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>Voice Guidance</p>
                <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Hear gentle instructions</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.voiceEnabled}
              className={`h-7 w-12 rounded-full p-1 transition ${settings.voiceEnabled ? 'bg-[#60A5FA] shadow-[0_0_14px_rgba(96,165,250,0.5)]' : ''}`}
              style={settings.voiceEnabled ? undefined : { backgroundColor: setupUi.toggleOff }}
              onClick={() => update('voiceEnabled', !settings.voiceEnabled)}
              aria-label="Toggle voice guidance"
            >
              <span className={`block h-5 w-5 rounded-full transition ${settings.voiceEnabled ? 'translate-x-5' : ''}`} style={{ backgroundColor: setupUi.toggleThumb }} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: setupUi.iconChipBg, color: setupUi.iconChipSound }}>
                <Music size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--theme-text-primary)' }}>Sound</p>
                <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Ambient sounds</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              className={`h-7 w-12 rounded-full p-1 transition ${settings.soundEnabled ? 'bg-[#22D3EE] shadow-[0_0_14px_rgba(34,211,238,0.45)]' : ''}`}
              style={settings.soundEnabled ? undefined : { backgroundColor: setupUi.toggleOff }}
              onClick={() => update('soundEnabled', !settings.soundEnabled)}
              aria-label="Toggle sound"
            >
              <span className={`block h-5 w-5 rounded-full transition ${settings.soundEnabled ? 'translate-x-5' : ''}`} style={{ backgroundColor: setupUi.toggleThumb }} />
            </button>
          </div>
        </section>
      </div>

      <div className="mt-2 pt-1">
        <PrimaryButton icon={Play} onClick={onBeginSession} className="h-[51px] text-[16px]">
          Begin Session
        </PrimaryButton>
        <PrimaryButton icon={RefreshCcw} variant="secondary" onClick={onSaveRhythm} className="mt-2 h-[44px] text-[14px]">
          Save Rhythm
        </PrimaryButton>
        <p className="mt-1.5 text-center text-[12px]" style={{ color: 'var(--theme-text-secondary)' }}>
          ≈ {formatTime(estimatedSeconds)} total
        </p>
      </div>
    </motion.section>
  );
}
