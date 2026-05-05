import { motion } from 'framer-motion';
import { ChevronRight, Moon, Scale, Sparkles, Sprout, Target, Waves } from 'lucide-react';
import CharacterBackdrop from './CharacterBackdrop';
import Header from './Header';
import PrimaryButton from './PrimaryButton';

const iconMap = {
  calm: Waves,
  focus: Target,
  sleep: Moon,
  beginner: Sprout,
  balance: Scale,
};

const colorMap = {
  blue: '#2487EA',
  aqua: '#20B8C4',
  purple: '#8755E8',
  orange: '#FF8A2A',
  teal: '#18AEB8',
};

export default function PresetsScreen({ presets, onBack, onSelectPreset, onCreateCustom }) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="pb-2">
      <Header showBack onBack={onBack} showHelp />
      <h2 className="font-display relative z-[1] text-[34px] font-extrabold leading-none text-[#071D55]">Recommended Presets</h2>
      <p className="relative z-[1] mt-2 text-[18px] text-[#657899]">Choose a rhythm based on how you want to feel</p>

      <CharacterBackdrop className="mt-5" glowSizeClass="h-56 w-56">
          <img src="/assets/images/Inhale_pose.png" alt="Breathing presets pose" className="relative z-10 mx-auto w-[245px] object-contain" />
      </CharacterBackdrop>

      <div className="mt-4 space-y-3">
        {presets.map((preset) => {
          const Icon = iconMap[preset.id] || Waves;
          const color = colorMap[preset.color] || '#2487EA';

          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-[0_10px_24px_rgba(36,135,234,0.13)] border-l-4"
              style={{ borderLeftColor: color }}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ color, backgroundColor: `${color}1f` }}>
                <Icon size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold text-[#071D55]">
                  {preset.name} <span className="font-bold text-[#657899]">{preset.pattern}</span>
                </span>
                <span className="block truncate text-sm text-[#657899]">{preset.description}</span>
              </span>
              <ChevronRight size={20} className="text-[#2487EA]" />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5">
        <PrimaryButton icon={Sparkles} variant="secondary" onClick={onCreateCustom} className="h-[53px] text-[16px]">
          Create my own rhythm
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
