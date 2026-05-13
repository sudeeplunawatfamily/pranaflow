import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

function OptionChips({ options, selected, onSelect }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="rounded-full border px-3 py-1.5 text-[12px] font-semibold"
            style={{
              borderColor: active ? 'rgba(7,29,54,0.45)' : 'rgba(120,90,55,0.16)',
              background: active ? 'rgba(7,29,54,0.92)' : 'rgba(255,250,242,0.8)',
              color: active ? '#FFFFFF' : '#6E6A66',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function SoundSettingsSheet({
  open,
  section,
  onClose,
  voiceEnabled,
  soundEnabled,
  voiceChoice,
  ambientChoice,
  tickChoice,
  onVoiceToggle,
  onSoundToggle,
  onVoiceChoice,
  onAmbientChoice,
  onTickChoice,
}) {
  if (!section) return null;

  const titles = {
    voice: 'Voice Guidance',
    ambient: 'Ambient Sound',
    tick: 'Tick Sound',
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close sheet"
            className="absolute inset-0 z-40 bg-[#071D36]/35"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <GlassCard className="rounded-t-[30px] p-4">
              <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[#CDBCA7]" />
              <h3 className="font-serif-display text-[24px] font-bold" style={{ color: '#071D36' }}>{titles[section]}</h3>

              {section === 'voice' ? (
                <>
                  <OptionChips
                    options={[
                      { label: 'On', value: 'on' },
                      { label: 'Off', value: 'off' },
                    ]}
                    selected={voiceEnabled ? 'on' : 'off'}
                    onSelect={(value) => onVoiceToggle(value === 'on')}
                  />
                  <OptionChips
                    options={[
                      { label: 'Hindi Calm Voice', value: 'hindi-calm' },
                      { label: 'English Soft Voice', value: 'english-soft' },
                    ]}
                    selected={voiceChoice}
                    onSelect={onVoiceChoice}
                  />
                </>
              ) : null}

              {section === 'ambient' ? (
                <>
                  <OptionChips
                    options={[
                      { label: 'Off', value: 'off' },
                      { label: 'Ocean Waves', value: 'ocean-waves' },
                      { label: 'Rain', value: 'rain' },
                      { label: 'Forest', value: 'forest' },
                      { label: 'Soft Om', value: 'soft-om' },
                      { label: 'Temple Chime', value: 'temple-chime' },
                    ]}
                    selected={ambientChoice}
                    onSelect={(value) => {
                      onAmbientChoice(value);
                      onSoundToggle(value !== 'off' || tickChoice !== 'off');
                    }}
                  />
                </>
              ) : null}

              {section === 'tick' ? (
                <OptionChips
                  options={[
                    { label: 'Soft Chime', value: 'soft-chime' },
                    { label: 'Wooden Tap', value: 'wooden-tap' },
                    { label: 'Bell', value: 'bell' },
                    { label: 'Off', value: 'off' },
                  ]}
                  selected={tickChoice}
                  onSelect={(value) => {
                    onTickChoice(value);
                    onSoundToggle(value !== 'off' || ambientChoice !== 'off');
                  }}
                />
              ) : null}
            </GlassCard>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
