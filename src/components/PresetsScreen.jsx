import { motion } from 'framer-motion';
import { ChevronRight, Moon, Scale, Sparkles, Sprout, Target, Waves, Wind, Zap } from 'lucide-react';
import CharacterBackdrop from './CharacterBackdrop';
import Header from './Header';
import PrimaryButton from './PrimaryButton';

const iconMap = {
  calm: Waves,
  focus: Target,
  sleep: Moon,
  beginner: Sprout,
  balance: Scale,
  flow: Wind,
  coherent: Zap,
};

const colorMap = {
  blue: '#2487EA',
  aqua: '#20B8C4',
  purple: '#8755E8',
  orange: '#FF8A2A',
  teal: '#18AEB8',
  green: '#10B981',
  indigo: '#6366F1',
};

export default function PresetsScreen({ presets, savedRhythm, onBack, onSelectPreset, onCreateCustom, theme = 'night', onToggleTheme }) {
  const isDay = theme === 'day';
  const allPresets = savedRhythm ? [savedRhythm, ...presets] : presets;

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="pb-2">
      <Header showBack onBack={onBack} showHelp theme={theme} onToggleTheme={onToggleTheme} />
      <h2
        className={isDay ? 'font-serif-display relative z-[1] text-[34px] font-bold leading-none' : 'font-display relative z-[1] text-[34px] font-extrabold leading-none'}
        style={{ color: 'var(--theme-text-primary)' }}
      >
        {isDay ? 'Presets' : 'Recommended Presets'}
      </h2>
      <p className="relative z-[1] mt-2 text-[16px]" style={{ color: 'var(--theme-text-secondary)' }}>
        {isDay ? 'Choose a preset and make it yours.' : 'Choose a rhythm based on how you want to feel'}
      </p>

      <CharacterBackdrop className="mt-5" glowSizeClass="h-56 w-56">
          <img src="/assets/images/Hold_pose.png" alt="Breathing presets pose" className="relative z-10 mx-auto w-[245px] object-contain" />
      </CharacterBackdrop>

      <div className="mt-4 space-y-3">
        {allPresets.map((preset) => {
          const Icon = iconMap[preset.id] || Waves;
          const color = colorMap[preset.color] || (isDay ? '#4A8FE7' : '#60A5FA');

          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="flex w-full items-center gap-3 rounded-3xl p-4 text-left border border-l-4"
              style={{
                borderLeftColor: color,
                borderColor: isDay ? 'rgba(120,90,55,0.12)' : 'var(--theme-surface-border)',
                backgroundColor: isDay ? 'rgba(255,250,242,0.88)' : 'var(--theme-surface)',
                boxShadow: isDay ? '0 10px 24px rgba(75,54,33,0.10)' : '0 10px 24px rgba(15,23,42,0.2)',
                backdropFilter: isDay ? 'blur(8px)' : undefined,
              }}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ color, backgroundColor: `${color}22` }}>
                <Icon size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold" style={{ color: 'var(--theme-text-primary)' }}>
                  {preset.name} <span className="font-bold" style={{ color: 'var(--theme-text-secondary)' }}>{preset.pattern}</span>
                </span>
                <span className="block truncate text-sm" style={{ color: 'var(--theme-text-secondary)' }}>{preset.description}</span>
              </span>
              <ChevronRight size={20} style={{ color: isDay ? '#4A8FE7' : '#60A5FA' }} />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5">
        <PrimaryButton icon={Sparkles} variant="secondary" onClick={onCreateCustom} className="h-[53px] text-[16px]">
          {isDay ? 'Design My Pranayam' : 'Design My Pranayam'}
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
