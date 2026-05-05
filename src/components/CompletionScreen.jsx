import { motion } from 'framer-motion';
import { Clock, Home, Leaf, Moon, Pause, RefreshCcw, RotateCcw, Smile, Target, Waves, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatTime } from '../utils/formatTime';
import CharacterBackdrop from './CharacterBackdrop';
import PrimaryButton from './PrimaryButton';

const moodConfig = [
  { name: 'Calm', Icon: Smile, color: '#2487EA' },
  { name: 'Refreshed', Icon: Leaf, color: '#20B8C4' },
  { name: 'Sleepy', Icon: Moon, color: '#8755E8' },
  { name: 'Focused', Icon: Target, color: '#FF8A2A' },
];

const SPARKLE_COLORS = ['#2487EA', '#20B8C4', '#8755E8', '#FF8A2A', '#2487EA', '#20B8C4'];

export default function CompletionScreen({ settings, durationSeconds, onRepeat, onChangeRhythm, onHome, onMoodChange }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const sparkles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((i % 6) - 2.5) * 38,
      targetY: -70 - (i % 3) * 28,
      drift: i % 2 === 0 ? 14 : -14,
      delay: i * 0.07,
      color: SPARKLE_COLORS[i % 6],
      size: 6 + (i % 3) * 4,
    })),
    []
  );

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="relative flex min-h-[calc(100dvh-32px)] flex-col pb-1 text-center">
      {/* Sparkle ceremony — fires once on mount */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{ width: s.size, height: s.size, backgroundColor: s.color, marginLeft: -s.size / 2 }}
            initial={{ opacity: 1, y: 0, x: s.x, scale: 0.3 }}
            animate={{ opacity: 0, y: s.targetY, x: s.x + s.drift, scale: 1.4 }}
            transition={{ duration: 1.3 + (s.id % 3) * 0.18, delay: s.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="relative z-[1] mt-2 flex items-center justify-center gap-2">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow logo" className="h-8 w-8" />
        <p className="font-display text-2xl font-extrabold text-[#2487EA]">PranaFlow</p>
      </div>

      <h2 className="font-display relative z-[1] mt-3 text-[32px] font-extrabold leading-none text-[#071D55]">Beautiful work.</h2>
      <p className="relative z-[1] mt-1 text-base text-[#657899]">You completed <span className="font-extrabold text-[#2487EA]">{settings.rounds}</span> rounds.</p>

      <CharacterBackdrop className="mt-3" glowSizeClass="h-56 w-56">
          <img src="/assets/images/Hold_pose.png" alt="Completion yoga pose" className="relative z-10 mx-auto w-[240px] object-contain" />
      </CharacterBackdrop>

      <section className="mt-3 rounded-3xl bg-white p-3 text-left shadow-[0_12px_30px_rgba(36,135,234,0.12)]">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF6FF] text-[#2487EA]">
            <Clock size={20} />
          </span>
          <div>
            <p className="text-sm text-[#657899]">Total Time</p>
            <p className="text-[28px] font-extrabold text-[#071D55]">{formatTime(durationSeconds)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-[#E8F3FF] pt-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF6FF]">
            <span className="flex items-center gap-0.5">
              <Wind size={9} color="#2487EA" />
              <Pause size={9} color="#8755E8" />
              <Waves size={9} color="#20B8C4" />
            </span>
          </span>
          <div>
            <p className="text-sm text-[#657899]">Rhythm</p>
            <p className="text-[17px] font-extrabold">
              <span className="text-[#2487EA]">{settings.inhaleSeconds}s</span>
              <span className="text-[#657899]"> · </span>
              <span className="text-[#8755E8]">{settings.holdSeconds}s</span>
              <span className="text-[#657899]"> · </span>
              <span className="text-[#20B8C4]">{settings.exhaleSeconds}s</span>
              <span className="ml-1 text-[12px] font-semibold text-[#657899]">· {settings.rounds} rounds</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-3 rounded-3xl bg-white p-3 text-left shadow-[0_12px_30px_rgba(36,135,234,0.12)]">
        <p className="text-base font-bold text-[#071D55]">How do you feel now?</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {moodConfig.map(({ name, Icon, color }) => {
            const selected = selectedMood === name;
            return (
              <motion.button
                type="button"
                key={name}
                onClick={() => {
                  setSelectedMood(name);
                  onMoodChange?.(name);
                }}
                animate={selected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center text-[11px] font-bold ${selected ? 'bg-[#EAF6FF]' : 'border-[#D6EAFF]'}`}
                style={selected ? { borderColor: color, color } : { borderColor: '#D6EAFF', color: '#657899' }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full" style={{ backgroundColor: `${color}22`, color }}>
                  <Icon size={16} />
                </span>
                {name}
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="mt-auto space-y-2.5 pt-3">
        <PrimaryButton icon={RefreshCcw} onClick={onRepeat} className="h-[60px]">
          <span className="flex flex-col items-start leading-tight">
            <span>Repeat Session</span>
            <span className="text-[11px] font-semibold opacity-75">{settings.inhaleSeconds}s · {settings.holdSeconds}s · {settings.exhaleSeconds}s · {settings.rounds} rounds</span>
          </span>
        </PrimaryButton>
        <PrimaryButton icon={RotateCcw} variant="secondary" onClick={onChangeRhythm} className="h-[46px]">
          Change Rhythm
        </PrimaryButton>
        <PrimaryButton icon={Home} variant="secondary" onClick={onHome} className="h-[46px]">
          Home
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
