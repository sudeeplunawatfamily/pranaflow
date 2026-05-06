import { motion } from 'framer-motion';
import { Minus, Music, Pause, Plus, Play, RefreshCcw, Volume2, Waves, Wind } from 'lucide-react';
import { useMemo } from 'react';
import { formatTime } from '../utils/formatTime';
import Header from './Header';
import PrimaryButton from './PrimaryButton';

const phaseCards = [
  { key: 'inhaleSeconds', label: 'Breathe In', color: '#2487EA', Icon: Wind, ariaLabel: 'Breathe in seconds' },
  { key: 'holdSeconds', label: 'Hold', color: '#8755E8', Icon: Pause, ariaLabel: 'Hold seconds' },
  { key: 'exhaleSeconds', label: 'Breathe Out', color: '#20B8C4', Icon: Waves, ariaLabel: 'Breathe out seconds' },
];

export default function BreathingSetup({ settings, setSettings, onBack, onBeginSession, onSaveRhythm }) {
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const rhythmTotal = settings.inhaleSeconds + settings.holdSeconds + settings.exhaleSeconds;
  const estimatedSeconds = settings.rounds * rhythmTotal;

  const rhythmMeaning = useMemo(() => {
    if (settings.exhaleSeconds > settings.inhaleSeconds) return 'Longer exhales to calm your body';
    if (settings.inhaleSeconds > settings.exhaleSeconds) return 'Longer inhales to gently energize your mind';
    return 'Balanced breathing for relaxation';
  }, [settings.exhaleSeconds, settings.inhaleSeconds]);

  const meaningPill = useMemo(() => {
    if (settings.exhaleSeconds > settings.inhaleSeconds) {
      return {
        Icon: Waves,
        textColor: '#0B5E72',
        iconColor: '#20B8C4',
        borderColor: '#BFEFF3',
        bg: 'linear-gradient(135deg, rgba(32,184,196,0.14) 0%, rgba(32,184,196,0.06) 55%, rgba(255,255,255,0.88) 100%)',
      };
    }

    if (settings.inhaleSeconds > settings.exhaleSeconds) {
      return {
        Icon: Wind,
        textColor: '#184B8A',
        iconColor: '#2487EA',
        borderColor: '#CFE6FB',
        bg: 'linear-gradient(135deg, rgba(36,135,234,0.14) 0%, rgba(36,135,234,0.06) 55%, rgba(255,255,255,0.88) 100%)',
      };
    }

    return {
      Icon: Pause,
      textColor: '#5B3B95',
      iconColor: '#8755E8',
      borderColor: '#E3D8FF',
      bg: 'linear-gradient(135deg, rgba(135,85,232,0.14) 0%, rgba(135,85,232,0.06) 55%, rgba(255,255,255,0.88) 100%)',
    };
  }, [settings.exhaleSeconds, settings.inhaleSeconds]);

  const MeaningIcon = meaningPill.Icon;

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col pb-1">
      <div className="flex flex-1 flex-col justify-center gap-3 max-[740px]:justify-start">
        <Header showBack onBack={onBack} showHelp />

        <h2 className="font-display text-[29px] font-extrabold leading-none text-[#071D55]">Set your breathing rhythm</h2>
        <p className="mt-1 text-[15px] text-[#657899]">Adjust the timing for each phase</p>
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2.5 shadow-[0_8px_18px_rgba(36,135,234,0.08)]"
          style={{ borderColor: meaningPill.borderColor, background: meaningPill.bg }}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/85" style={{ color: meaningPill.iconColor }}>
            <MeaningIcon size={14} />
          </span>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: meaningPill.textColor }}>
            {rhythmMeaning}
          </p>
        </div>

        {/* Proportional rhythm bar — segment width reflects actual phase duration */}
        <div className="mt-1.5 w-full rounded-2xl bg-white p-2.5 shadow-[0_8px_22px_rgba(36,135,234,0.14)]">
          <div className="flex h-5 w-full overflow-hidden rounded-full">
            {[
              { key: 'inhale', seconds: settings.inhaleSeconds, color: '#2487EA' },
              { key: 'hold', seconds: settings.holdSeconds, color: '#8755E8' },
              { key: 'exhale', seconds: settings.exhaleSeconds, color: '#20B8C4' },
            ].map(({ key, seconds, color }) => (
              <div
                key={key}
                className="flex items-center justify-center overflow-hidden text-[9px] font-extrabold text-white transition-all duration-300"
                style={{ width: `${(seconds / rhythmTotal) * 100}%`, backgroundColor: color }}
              >
                {seconds}s
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex">
            {[
              { key: 'inhale', label: 'In', Icon: Wind, seconds: settings.inhaleSeconds, color: '#2487EA' },
              { key: 'hold', label: 'Hold', Icon: Pause, seconds: settings.holdSeconds, color: '#8755E8' },
              { key: 'exhale', label: 'Out', Icon: Waves, seconds: settings.exhaleSeconds, color: '#20B8C4' },
            ].map(({ key, label, Icon, seconds, color }) => (
              <div key={key} className="flex items-center justify-center gap-1 overflow-hidden" style={{ width: `${(seconds / rhythmTotal) * 100}%` }}>
                <Icon size={9} color={color} />
                <span className="text-[9px] font-bold" style={{ color }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 28%, rgba(220,240,255,0.72) 58%, rgba(155,210,250,0.18) 82%, transparent 100%)' }}
          />
          <img src="/assets/images/Inhale_pose.png" alt="Breathing setup pose" className="relative z-10 w-[210px] object-contain" />
        </div>

        <div className="mt-0.5 grid grid-cols-3 gap-1.5">
          {phaseCards.map(({ key, label, color, Icon, ariaLabel }) => (
            <article key={key} className="rounded-[20px] border bg-white p-2 shadow-[0_8px_20px_rgba(36,135,234,0.12)]" style={{ borderColor: `${color}55` }}>
              <p className="text-[11px] font-bold leading-tight text-[#071D55]">{label}</p>
              <span className="mt-1.5 grid h-7 w-7 place-items-center rounded-full" style={{ backgroundColor: `${color}22`, color }}>
                <Icon size={13} />
              </span>
              <button
                type="button"
                aria-label={`Tap to increase ${ariaLabel}`}
                onClick={() => update(key, settings[key] >= 10 ? 1 : settings[key] + 1)}
                className="mt-1 flex w-full flex-col items-center rounded-xl border px-1 py-1.5 shadow-[0_6px_16px_rgba(36,135,234,0.08)] transition active:scale-[0.98]"
                style={{ borderColor: `${color}35`, backgroundColor: `${color}10` }}
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
                className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#DDEEFE]"
                style={{ accentColor: color, '--range-color': color }}
              />
              <div className="mt-0.5 flex justify-between text-[9px] text-[#657899]">
                <span>1</span>
                <span>10</span>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-0.5 rounded-[20px] bg-white p-2.5 shadow-[0_12px_30px_rgba(36,135,234,0.12)]">
          <div className="flex items-center justify-between border-b border-[#E8F3FF] py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF6FF] text-[#2487EA]">
                <RefreshCcw size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight text-[#071D55]">Rounds</p>
                <p className="text-[11px] text-[#657899]">Total breathing cycles</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Decrease rounds"
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D6EAFF] text-[#2487EA]"
                onClick={() => update('rounds', Math.max(1, settings.rounds - 1))}
              >
                <Minus size={14} />
              </button>
              <p className="w-7 text-center text-[15px] font-extrabold text-[#071D55]">{settings.rounds}</p>
              <button
                type="button"
                aria-label="Increase rounds"
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D6EAFF] text-[#2487EA]"
                onClick={() => update('rounds', Math.min(20, settings.rounds + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[#E8F3FF] py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF6FF] text-[#2487EA]">
                <Volume2 size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight text-[#071D55]">Voice Guidance</p>
                <p className="text-[11px] text-[#657899]">Hear gentle instructions</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.voiceEnabled}
              className={`h-7 w-12 rounded-full p-1 transition ${settings.voiceEnabled ? 'bg-[#2487EA]' : 'bg-[#D6EAFF]'}`}
              onClick={() => update('voiceEnabled', !settings.voiceEnabled)}
              aria-label="Toggle voice guidance"
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition ${settings.voiceEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF6FF] text-[#2487EA]">
                <Music size={12} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight text-[#071D55]">Sound</p>
                <p className="text-[11px] text-[#657899]">Ambient sounds</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              className={`h-7 w-12 rounded-full p-1 transition ${settings.soundEnabled ? 'bg-[#2487EA]' : 'bg-[#D6EAFF]'}`}
              onClick={() => update('soundEnabled', !settings.soundEnabled)}
              aria-label="Toggle sound"
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition ${settings.soundEnabled ? 'translate-x-5' : ''}`} />
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
        <p className="mt-1.5 text-center text-[12px] text-[#657899]">
          ≈ {formatTime(estimatedSeconds)} total
        </p>
      </div>
    </motion.section>
  );
}
