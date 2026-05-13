import { motion } from 'framer-motion';
import { Wind, Repeat2 } from 'lucide-react';

export default function BreathingMethodSelector({ isBoxBreathing, onToggle, theme = 'night' }) {
  const isNight = theme === 'night';
  const inhaleAccent = isNight ? '#60A5FA' : '#4A8FE7';
  const holdAccent = isNight ? '#A78BFA' : '#8B6AD8';

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
        className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all border`}
        style={{
          borderColor: !isBoxBreathing ? inhaleAccent : 'var(--theme-surface-border)',
          boxShadow: !isBoxBreathing ? `0 0 12px ${inhaleAccent}44` : 'none',
          backgroundColor: !isBoxBreathing
            ? isNight
              ? 'rgba(96,165,250,0.15)'
              : 'rgba(74,143,231,0.08)'
            : isNight ? 'var(--theme-surface)' : 'rgba(255,250,242,0.88)',
          color: !isBoxBreathing ? inhaleAccent : 'var(--theme-text-secondary)',
        }}
      >
        <Wind size={16} strokeWidth={2} />
        <span>Natural</span>
      </motion.button>

      {/* Box Breathing Button */}
      <div className="flex-1 relative">
        <motion.button
          type="button"
          onClick={() => onToggle(true)}
          whileActive={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all border`}
          style={{
            borderColor: isBoxBreathing ? holdAccent : 'var(--theme-surface-border)',
            boxShadow: isBoxBreathing ? `0 0 12px ${holdAccent}44` : 'none',
            backgroundColor: isBoxBreathing
              ? isNight
                ? 'rgba(167,139,250,0.15)'
                : 'rgba(139,106,216,0.08)'
              : isNight ? 'var(--theme-surface)' : 'rgba(255,250,242,0.88)',
            color: isBoxBreathing ? holdAccent : 'var(--theme-text-secondary)',
          }}
        >
          <Repeat2 size={16} strokeWidth={2} />
          <span>Box</span>
        </motion.button>
        <span className="absolute -top-2 -right-2 bg-[#F74D61] text-white text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
          New!
        </span>
      </div>
    </motion.div>
  );
}
