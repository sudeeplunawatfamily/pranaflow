import { motion } from 'framer-motion';
import { Minus, Music, Pause, Plus, Play, RefreshCcw, Volume2, Waves, Wind, Repeat2, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { formatTime } from '../utils/formatTime';
import Header from './Header';
import PrimaryButton from './PrimaryButton';
import TimingStepperCard from './TimingStepperCard';
import BreathingMethodSelector from './BreathingMethodSelector';

const phaseCards = [
  { key: 'inhaleSeconds', label: 'Breathe In', color: '#60A5FA', Icon: Wind, ariaLabel: 'Breathe in seconds' },
  { key: 'holdSeconds', label: 'Hold', color: '#A78BFA', Icon: Pause, ariaLabel: 'Hold seconds' },
  { key: 'exhaleSeconds', label: 'Breathe Out', color: '#22D3EE', Icon: Waves, ariaLabel: 'Breathe out seconds' },
];

export default function BreathingSetup({ settings, setSettings, onBack, onBeginSession, onSaveRhythm, theme = 'night', onToggleTheme }) {
  const isNight = theme === 'night';
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const rhythmTotal = settings.inhaleSeconds + settings.holdSeconds + settings.exhaleSeconds;
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

  const setupHalo = useMemo(() => {
    if (isNight) {
      return 'radial-gradient(circle, rgba(226,232,240,0.20) 0%, rgba(96,165,250,0.18) 30%, rgba(167,139,250,0.10) 55%, rgba(34,211,238,0.08) 72%, transparent 100%)';
    }
    return 'radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.72) 30%, rgba(205,235,255,0.48) 56%, rgba(140,202,242,0.16) 76%, transparent 100%)';
  }, [isNight]);

  // Pattern indicator: determine quality based on rhythm
  const patternIndicator = useMemo(() => {
    const exhaleBonus = settings.exhaleSeconds - settings.inhaleSeconds;
    const inhaleBonus = settings.inhaleSeconds - settings.exhaleSeconds;

    if (Math.abs(exhaleBonus) < 2) {
      return { label: 'Balanced', icon: '⚖️', color: isNight ? '#A78BFA' : '#8755E8' };
    }
    if (exhaleBonus > 2) {
      return { label: 'Calm', icon: '🧘', color: isNight ? '#22D3EE' : '#20B8C4' };
    }
    return { label: 'Energizing', icon: '⚡', color: isNight ? '#60A5FA' : '#2487EA' };
  }, [settings.exhaleSeconds, settings.inhaleSeconds, isNight]);



  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex min-h-[calc(100dvh-32px)] flex-col pb-1">
      <div className="flex flex-1 flex-col justify-start">
        {/* Header */}
        <Header showBack onBack={onBack} showHelp theme={theme} onToggleTheme={onToggleTheme} />

        {/* Title Section */}
        <h2 className="font-display text-[29px] font-extrabold leading-none mt-3" style={{ color: 'var(--theme-text-primary)' }}>Set your breathing rhythm</h2>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--theme-text-secondary)' }}>Adjust the timing for each phase</p>

        {/* Breathing Method Selector */}
        <div className="mt-3">
          <BreathingMethodSelector isBoxBreathing={settings.boxBreathing} onToggle={(isBox) => update('boxBreathing', isBox)} theme={theme} />
        </div>



        {/* Rhythm Pill with Enhanced Styling */}
        <div
          className="mt-3 w-full rounded-2xl p-3 border transition-all"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: isNight ? 'rgba(96,165,250,0.3)' : 'rgba(36,135,234,0.2)',
            boxShadow: isNight
              ? '0 0 20px rgba(96,165,250,0.15), inset 0 1px 2px rgba(96,165,250,0.1)'
              : '0 4px 12px rgba(36,135,234,0.08)',
          }}
        >
          <div className="flex h-6 w-full overflow-hidden rounded-full gap-0.5">
            {[
              { key: 'inhale', seconds: settings.inhaleSeconds, color: '#60A5FA' },
              { key: 'hold', seconds: settings.holdSeconds, color: '#A78BFA' },
              { key: 'exhale', seconds: settings.exhaleSeconds, color: '#22D3EE' },
              ...(settings.boxBreathing ? [{ key: 'hold-box', seconds: 4, color: '#A78BFA' }] : []),
            ].map(({ key, seconds, color }) => (
              <motion.div
                key={key}
                className="flex items-center justify-center overflow-hidden text-[9px] font-extrabold text-white transition-all duration-300"
                style={{
                  width: `${(seconds / (rhythmTotal + cycleExtra)) * 100}%`,
                  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                  boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1)`,
                }}
                initial={{ opacity: 0.8, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {seconds}s
              </motion.div>
            ))}
          </div>

          {/* Pattern Indicator Below Rhythm Pill */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
              {[settings.inhaleSeconds, settings.holdSeconds, settings.exhaleSeconds].join('-')}s
            </span>
            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${patternIndicator.color}22`,
                border: `1px solid ${patternIndicator.color}55`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{patternIndicator.icon}</span>
              <span className="text-[10px] font-semibold" style={{ color: patternIndicator.color }}>
                {patternIndicator.label}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Character Illustration with Breathing Animation */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="h-[190px] w-[190px] rounded-full"
                style={{ background: setupHalo }}
              />
            </motion.div>
            <img src="/assets/images/Inhale_pose.png" alt="Breathing setup pose" className="relative z-10 w-[210px] object-contain" />
          </div>
        </motion.div>



        {/* Timing Stepper Cards with Enhanced Styling */}
        <motion.div
          className="mt-6 grid grid-cols-3 gap-1.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {phaseCards.map(({ key, label, color, Icon, ariaLabel }, index) => (
            <div key={key} className="relative group">
              {/* Hover Glow Background */}
              <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: isNight
                    ? `radial-gradient(circle, ${color}33 0%, ${color}0 70%)`
                    : `radial-gradient(circle, ${color}22 0%, ${color}0 70%)`,
                  zIndex: -1,
                }}
              />
              <TimingStepperCard
                label={label}
                value={settings[key]}
                onIncrease={() => update(key, Math.min(10, settings[key] + 1))}
                onDecrease={() => update(key, Math.max(1, settings[key] - 1))}
                icon={Icon}
                color={color}
                ariaLabel={ariaLabel}
                minValue={1}
                maxValue={10}
              />

            </div>
          ))}
        </motion.div>



        {/* Audio Toggles & Rounds - Single row alignment */}
        <motion.div
          className="mt-6 flex items-end justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Voice Guidance Circular Button */}
          <motion.button
            type="button"
            role="switch"
            aria-checked={settings.voiceEnabled}
            whileActive={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 transition-all group"
            onClick={() => update('voiceEnabled', !settings.voiceEnabled)}
            aria-label="Toggle voice guidance"
            title="Enable voice guidance for breathing instructions"
          >
            <motion.div
              className="grid h-11 w-11 place-items-center rounded-full border transition-all group-hover:scale-110"
              style={{
                backgroundColor: settings.voiceEnabled
                  ? '#60A5FA'
                  : isNight
                  ? '#334155'
                  : '#EAF6FF',
                borderColor: settings.voiceEnabled
                  ? '#60A5FA'
                  : 'var(--theme-surface-border)',
                boxShadow: settings.voiceEnabled
                  ? isNight
                    ? '0 0 12px rgba(96,165,250,0.5)'
                    : '0 0 8px rgba(36,135,234,0.3)'
                  : 'none',
                color: settings.voiceEnabled
                  ? '#FFFFFF'
                  : isNight
                  ? '#60A5FA'
                  : '#2487EA',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 size={18} strokeWidth={2} />
            </motion.div>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Voice</span>
          </motion.button>

          {/* Ambient Sound Circular Button */}
          <motion.button
            type="button"
            role="switch"
            aria-checked={settings.soundEnabled}
            whileActive={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 transition-all group"
            onClick={() => update('soundEnabled', !settings.soundEnabled)}
            aria-label="Toggle ambient sound"
            title="Enable ambient OM sound during session"
          >
            <motion.div
              className="grid h-11 w-11 place-items-center rounded-full border transition-all group-hover:scale-110"
              style={{
                backgroundColor: settings.soundEnabled
                  ? '#22D3EE'
                  : isNight
                  ? '#334155'
                  : '#EAF6FF',
                borderColor: settings.soundEnabled
                  ? '#22D3EE'
                  : 'var(--theme-surface-border)',
                boxShadow: settings.soundEnabled
                  ? isNight
                    ? '0 0 12px rgba(34,211,238,0.5)'
                    : '0 0 8px rgba(32,184,196,0.3)'
                  : 'none',
                color: settings.soundEnabled
                  ? '#FFFFFF'
                  : isNight
                  ? '#22D3EE'
                  : '#20B8C4',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Music size={18} strokeWidth={2} />
            </motion.div>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Sound</span>
          </motion.button>

          {/* Rounds Control - Matching structure */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Decrease rounds by 5"
                className="grid h-11 w-11 place-items-center rounded-full border transition-all hover:scale-110"
                style={{
                  borderColor: 'var(--theme-surface-border)',
                  color: 'var(--theme-brand)',
                  backgroundColor: isNight ? '#334155' : '#EAF6FF',
                }}
                onClick={decrementRounds}
              >
                <Minus size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Reset rounds to 1"
                className="grid h-11 w-11 place-items-center rounded-full border font-bold text-sm transition-all hover:scale-110"
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  borderColor: 'var(--theme-surface-border)',
                  color: 'var(--theme-text-primary)',
                  cursor: 'pointer',
                }}
                onClick={() => update('rounds', 1)}
              >
                {settings.rounds}
              </button>
              <button
                type="button"
                aria-label="Increase rounds by 5"
                className="grid h-11 w-11 place-items-center rounded-full border transition-all hover:scale-110"
                style={{
                  borderColor: 'var(--theme-brand)',
                  color: '#FFFFFF',
                  backgroundColor: 'var(--theme-brand)',
                  boxShadow: isNight ? '0 0 12px rgba(36,135,234,0.4)' : '0 0 8px rgba(36,135,234,0.3)',
                }}
                onClick={incrementRounds}
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Rounds</span>
          </div>
        </motion.div>



        {/* Duration Breakdown Card */}
        <motion.div
          className="mt-6 rounded-xl p-3 border"
          style={{
            backgroundColor: isNight
              ? 'rgba(96,165,250,0.08)'
              : 'rgba(36,135,234,0.05)',
            borderColor: isNight
              ? 'rgba(96,165,250,0.2)'
              : 'rgba(36,135,234,0.15)',
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Per Round</p>
              <p className="text-[13px] font-bold mt-0.5" style={{ color: 'var(--theme-text-primary)' }}>
                {formatTime(rhythmTotal + cycleExtra)}
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--theme-surface-border)', borderRight: '1px solid var(--theme-surface-border)' }}>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Total Breaths</p>
              <p className="text-[13px] font-bold mt-0.5" style={{ color: 'var(--theme-text-primary)' }}>
                {settings.rounds * (settings.boxBreathing ? 4 : 3)}
              </p>
            </div>
            <div>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>Session Time</p>
              <p className="text-[13px] font-bold mt-0.5" style={{ color: 'var(--theme-text-primary)' }}>
                {formatTime(estimatedSeconds)}
              </p>
            </div>
          </div>
        </motion.div>


      </div>

      {/* CTA Buttons - Enhanced with Better Layout */}
      <motion.div
        className="mt-auto pt-4 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <PrimaryButton
          icon={Play}
          onClick={onBeginSession}
          className="h-[56px] text-[16px] font-bold shadow-lg hover:shadow-xl transition-shadow"
        >
          Begin Session
        </PrimaryButton>
        <div className="flex gap-2">
          <PrimaryButton
            icon={RefreshCcw}
            variant="secondary"
            onClick={onSaveRhythm}
            className="flex-1 h-[44px] text-[13px]"
          >
            Save Rhythm
          </PrimaryButton>
        </div>
      </motion.div>
    </motion.section>
  );
}
