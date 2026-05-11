import { motion } from 'framer-motion';

const HOLD_OFF_BG = 'rgba(255,255,255,0.03)';
const HOLD_OFF_BORDER = 'rgba(255,255,255,0.08)';
const HOLD_OFF_COLOR = '#64748B';

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
  // Hold-toggle props (only used when isHoldCard is true)
  isHoldCard = false,
  holdEnabled = true,
  onToggleHold,
  isBoxBreathing = false,
}) {
  const isAtMin = value <= minValue;
  const isAtMax = value >= maxValue;

  // When this is the hold card and hold is disabled, use muted styling
  const isDisabled = isHoldCard && !holdEnabled;
  const activeColor = isDisabled ? HOLD_OFF_COLOR : color;

  const cardStyle = isDisabled
    ? {
        background: HOLD_OFF_BG,
        border: `2px solid ${HOLD_OFF_BORDER}`,
        boxShadow: 'none',
        opacity: 0.75,
        cursor: isHoldCard && !isBoxBreathing ? 'pointer' : 'default',
      }
    : {
        background: `linear-gradient(145deg, var(--theme-surface) 0%, ${color}08 100%)`,
        border: `2px solid ${color}20`,
        boxShadow: `0 8px 32px ${color}15, inset 0 1px 0 ${color}10`,
        cursor: isHoldCard && !isBoxBreathing ? 'pointer' : 'default',
      };

  const handleCardClick = () => {
    if (isHoldCard && !isBoxBreathing && onToggleHold) {
      onToggleHold();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-visible rounded-3xl px-3 pt-8 pb-7 shadow-xl transition-all duration-200"
      style={cardStyle}
      role={isHoldCard && !isBoxBreathing ? 'button' : undefined}
      aria-pressed={isHoldCard && !isBoxBreathing ? holdEnabled : undefined}
      aria-label={isHoldCard && !isBoxBreathing ? 'Toggle hold phase' : undefined}
      tabIndex={isHoldCard && !isBoxBreathing ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (isHoldCard && !isBoxBreathing && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Plus button at top center — only when hold is enabled or not the hold card */}
      {(!isHoldCard || holdEnabled) && (
        <motion.button
          type="button"
          aria-label={`Increase ${ariaLabel}`}
          onClick={(e) => {
            e.stopPropagation();
            onIncrease();
          }}
          disabled={isAtMax}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition-all disabled:opacity-40 group overflow-hidden z-20"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            cursor: isAtMax ? 'default' : 'pointer',
            border: `2px solid ${color}dd`,
            boxShadow: isAtMax ? 'none' : `0 2px 6px ${color}40`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-lg leading-none relative z-10">+</span>
        </motion.button>
      )}

      {/* Value display in middle */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <Icon size={16} style={{ color: activeColor }} />
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: activeColor }}>
            {isDisabled ? 'Hold' : label}
          </span>
        </div>

        <motion.div
          key={isDisabled ? 'off' : value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div
            className="text-center font-black leading-none"
            style={{
              fontSize: '28px',
              color: activeColor,
              textShadow: isDisabled ? 'none' : `0 2px 4px ${color}30`,
            }}
          >
            {isDisabled ? 'OFF' : `${value}s`}
          </div>
        </motion.div>

        {/* Box breathing hint when hold card is locked on */}
        {isHoldCard && isBoxBreathing && (
          <span className="text-[8px] text-center leading-tight mt-0.5" style={{ color: activeColor, opacity: 0.7 }}>
            Box on
          </span>
        )}
      </div>

      {/* Minus button at bottom center — only when hold is enabled or not the hold card */}
      {(!isHoldCard || holdEnabled) && (
        <motion.button
          type="button"
          aria-label={`Decrease ${ariaLabel}`}
          onClick={(e) => {
            e.stopPropagation();
            onDecrease();
          }}
          disabled={isAtMin}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all disabled:opacity-40 group overflow-hidden z-20"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
            color,
            cursor: isAtMin ? 'default' : 'pointer',
            border: `2px solid ${color}30`,
            boxShadow: isAtMin ? 'none' : `0 2px 6px ${color}25`,
          }}
        >
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-lg leading-none relative z-10">−</span>
        </motion.button>
      )}
    </motion.div>
  );
}
