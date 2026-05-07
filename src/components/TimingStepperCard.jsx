import { motion } from 'framer-motion';

export default function TimingStepperCard({
  label,
  value,
  onIncrease,
  onDecrease,
  icon: Icon,
  color = '#60A5FA',
  ariaLabel = 'timing control',
  minValue = 1,
  maxValue = 10,
}) {
  const isAtMin = value <= minValue;
  const isAtMax = value >= maxValue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        border: `1px solid ${color}66`,
      }}
    >
      {/* Top increment button */}
      <motion.button
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        onClick={onIncrease}
        disabled={isAtMax}
        whileActive={{ scale: 0.98 }}
        whileHover={{ scale: isAtMax ? 1 : 1.05 }}
        className="h-11 w-full flex items-center justify-center font-bold text-white transition-all disabled:opacity-50 group"
        style={{
          backgroundColor: color,
          cursor: isAtMax ? 'default' : 'pointer',
          boxShadow: isAtMax ? 'none' : 'inset 0 1px 2px rgba(255,255,255,0.2)',
        }}
      >
        <span className="text-lg leading-none group-hover:scale-125 transition-transform">+</span>
      </motion.button>

      {/* Middle card */}
      <motion.div
        className="flex flex-col items-center gap-2.5 px-3 py-3.5"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderTop: `1px solid ${color}33`,
          borderBottom: `1px solid ${color}33`,
        }}
      >
        {/* Icon */}
        <div
          className="grid h-8 w-8 place-items-center rounded-full transition-all"
          style={{
            backgroundColor: `${color}22`,
            color,
          }}
        >
          <Icon size={14} strokeWidth={2} />
        </div>

        {/* Label */}
        <p
          className="text-[12px] font-bold leading-tight text-center"
          style={{ color: 'var(--theme-text-primary)' }}
        >
          {label}
        </p>

        {/* Large duration text with pulse animation */}
        <motion.p
          key={value}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="text-center font-extrabold leading-none"
          style={{
            fontSize: '26px',
            color,
          }}
        >
          {value}s
        </motion.p>
      </motion.div>

      {/* Bottom decrement button */}
      <motion.button
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        onClick={onDecrease}
        disabled={isAtMin}
        whileActive={{ scale: 0.98 }}
        whileHover={{ scale: isAtMin ? 1 : 1.05 }}
        className="h-11 w-full flex items-center justify-center font-bold transition-all disabled:opacity-50 group"
        style={{
          backgroundColor: `${color}22`,
          color,
          cursor: isAtMin ? 'default' : 'pointer',
          boxShadow: isAtMin ? 'none' : `inset 0 1px 2px ${color}33`,
        }}
      >
        <span className="text-lg leading-none group-hover:scale-125 transition-transform">−</span>
      </motion.button>
    </motion.div>
  );
}
