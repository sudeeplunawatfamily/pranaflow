import { motion } from 'framer-motion';
import { Wind, Repeat2 } from 'lucide-react';

export default function BreathingMethodSelector({ isBoxBreathing, onToggle, theme = 'night' }) {
  const isNight = theme === 'night';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2.5 mb-3"
    >
      {/* Natural Button */}
      <motion.button
        type="button"
        onClick={() => onToggle(false)}
        whileActive={{ scale: 0.97 }}
        className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
          !isBoxBreathing
            ? 'border-[#60A5FA] shadow-[0_0_12px_rgba(96,165,250,0.3)]'
            : 'border-[var(--theme-surface-border)]'
        }`}
        style={{
          backgroundColor: !isBoxBreathing
            ? isNight
              ? 'rgba(96,165,250,0.15)'
              : 'rgba(36,135,234,0.08)'
            : 'var(--theme-surface)',
          color: !isBoxBreathing ? '#60A5FA' : 'var(--theme-text-secondary)',
        }}
      >
        <Wind size={16} strokeWidth={2} />
        <span>Natural</span>
      </motion.button>

      {/* Box Breathing Button */}
      <motion.button
        type="button"
        onClick={() => onToggle(true)}
        whileActive={{ scale: 0.97 }}
        className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
          isBoxBreathing
            ? 'border-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.3)]'
            : 'border-[var(--theme-surface-border)]'
        }`}
        style={{
          backgroundColor: isBoxBreathing
            ? isNight
              ? 'rgba(167,139,250,0.15)'
              : 'rgba(135,85,232,0.08)'
            : 'var(--theme-surface)',
          color: isBoxBreathing ? '#A78BFA' : 'var(--theme-text-secondary)',
        }}
      >
        <Repeat2 size={16} strokeWidth={2} />
        <span>Box</span>
      </motion.button>
    </motion.div>
  );
}
