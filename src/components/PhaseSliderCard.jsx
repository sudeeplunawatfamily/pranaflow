import { motion } from 'framer-motion';

export default function PhaseSliderCard({
  title,
  subtitle,
  value,
  min = 1,
  max = 10,
  color,
  ariaLabel,
  onChange,
  enabled = true,
  onToggle,
  toggleLabel,
}) {
  return (
    <motion.div
      className="rounded-[22px] border p-4"
      style={{
        background: 'rgba(255,250,242,0.82)',
        borderColor: 'rgba(120,90,55,0.10)',
        boxShadow: '0 12px 30px rgba(75,54,33,0.10)',
        opacity: enabled ? 1 : 0.75,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[17px] font-bold" style={{ color: '#071D36' }}>{title}</p>
          <p className="text-[12px]" style={{ color: '#6E6A66' }}>{subtitle}</p>
        </div>
        <div className="rounded-2xl border px-3 py-1 text-right" style={{ borderColor: `${color}44`, background: `${color}14` }}>
          <p className="text-[24px] font-extrabold leading-none" style={{ color }}>{value}s</p>
        </div>
      </div>

      {typeof onToggle === 'function' ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-3 rounded-full border px-3 py-1 text-[11px] font-bold"
          style={{
            borderColor: 'rgba(120,90,55,0.2)',
            color: enabled ? '#071D36' : '#6E6A66',
            background: enabled ? 'rgba(255,255,255,0.5)' : 'rgba(110,106,102,0.08)',
          }}
        >
          {toggleLabel}
        </button>
      ) : null}

      <div className="mt-3">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          disabled={!enabled}
          aria-label={ariaLabel}
          className="h-2 w-full appearance-none rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
            '--range-color': color,
            '--range-thumb-border': '#FFF8F0',
          }}
        />
        <div className="mt-1 flex items-center justify-between text-[11px]" style={{ color: '#6E6A66' }}>
          <span>{min}</span>
          <span>seconds</span>
          <span>{max}</span>
        </div>
      </div>
    </motion.div>
  );
}
