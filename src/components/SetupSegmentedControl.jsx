import { motion } from 'framer-motion';

const baseBg = 'rgba(255,250,242,0.86)';
const activeBg = 'linear-gradient(135deg, rgba(7,29,54,0.94) 0%, rgba(14,42,73,0.96) 100%)';

export default function SetupSegmentedControl({ options, value, onChange }) {
  return (
    <div
      className="grid grid-cols-2 gap-1 rounded-[20px] border p-1"
      style={{
        background: baseBg,
        borderColor: 'rgba(120,90,55,0.12)',
      }}
      role="tablist"
      aria-label="Breathing mode"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[13px] font-bold"
            style={{
              background: isActive ? activeBg : 'transparent',
              color: isActive ? '#FFFFFF' : '#6E6A66',
              boxShadow: isActive ? '0 8px 20px rgba(7,29,54,0.25)' : 'none',
            }}
          >
            {option.icon ? <option.icon size={16} /> : null}
            <span>{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
