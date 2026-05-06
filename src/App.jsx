import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import BreathingSetup from './components/BreathingSetup';
import BreathingSession from './components/BreathingSession';
import CompletionScreen from './components/CompletionScreen';
import HomeScreen from './components/HomeScreen';
import PresetsScreen from './components/PresetsScreen';
import { presets } from './data/presets';
import useLocalStorage from './hooks/useLocalStorage';
import { stopGlobalAudio } from './hooks/useAudioGuide';
import { initAudio, unlockAudio, stopAllAudio as stopTickAudio } from './utils/audioManager';
import {
  defaultMemory,
  defaultSavedRhythm,
  defaultSettings,
  defaultTheme,
  normalizeSettings,
  STORAGE_KEYS,
} from './utils/storage';

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const primeAudioPlayback = () => {
  try {
    const primer = new Audio('/assets/audio/ui/chime.mp3');
    primer.volume = 0;
    const playPromise = primer.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          primer.pause();
          primer.currentTime = 0;
        })
        .catch(() => {
          // Ignore autoplay-prime failures; runtime continues silently.
        });
    }
  } catch {
    // Ignore audio prime runtime errors.
  }

  // Initialize and unlock Howler.js audio context for tick sounds
  initAudio();
  unlockAudio().catch(() => {
    // Ignore audio unlock failures; runtime continues silently.
  });
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [persistedSettings, setPersistedSettings] = useLocalStorage(STORAGE_KEYS.settings, defaultSettings);
  const [settings, setSettings] = useState(() => normalizeSettings(persistedSettings));
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.sessions, []);
  const [savedRhythm, setSavedRhythm] = useLocalStorage(STORAGE_KEYS.savedRhythm, defaultSavedRhythm);
  const [memory, setMemory] = useLocalStorage(STORAGE_KEYS.memory, defaultMemory);
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, defaultTheme);
  const [sessionResult, setSessionResult] = useState({ durationSeconds: 0, moodAfter: undefined });
  const [sessionPhaseColor, setSessionPhaseColor] = useState(null);

  useEffect(() => {
    if (currentScreen !== 'session') {
      stopGlobalAudio();
      stopTickAudio();
      setSessionPhaseColor(null);
    }
  }, [currentScreen]);

  const setAndPersistSettings = (updater) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const normalized = normalizeSettings(next);
      setPersistedSettings(normalized);
      return normalized;
    });
  };

  const goSetup = () => setCurrentScreen('setup');
  const goPresets = () => setCurrentScreen('presets');
  const goHome = () => setCurrentScreen('home');
  const toggleTheme = () => setTheme((prev) => (prev === 'night' ? 'day' : 'night'));

  const buildRhythm = (source) => ({
    inhaleSeconds: source.inhaleSeconds,
    holdSeconds: source.holdSeconds,
    exhaleSeconds: source.exhaleSeconds,
  });

  const rememberSessionEntry = (source) => {
    setMemory((prev) => ({
      ...prev,
      lastRhythm: buildRhythm(source),
    }));
  };

  const saveRhythm = (source, name = 'Your Rhythm') => {
    setSavedRhythm({
      id: 'your-rhythm',
      name,
      pattern: `${source.inhaleSeconds}-${source.holdSeconds}-${source.exhaleSeconds}`,
      inhaleSeconds: source.inhaleSeconds,
      holdSeconds: source.holdSeconds,
      exhaleSeconds: source.exhaleSeconds,
      description: 'Your saved breathing pattern',
      color: 'blue',
      isCustom: true,
    });
  };

  return (
    <AppShell phaseColor={sessionPhaseColor} theme={theme}>
      {currentScreen === 'home' ? (
        <HomeScreen
          onStartCustom={goSetup}
          onExplorePresets={goPresets}
          memory={memory}
          sessions={sessions}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : null}

      {currentScreen === 'setup' ? (
        <BreathingSetup
          settings={settings}
          setSettings={setAndPersistSettings}
          theme={theme}
          onToggleTheme={toggleTheme}
          onBack={goHome}
          onSaveRhythm={() => saveRhythm(settings)}
          onBeginSession={() => {
            rememberSessionEntry(settings);
            primeAudioPlayback();
            setCurrentScreen('session');
          }}
        />
      ) : null}

      {currentScreen === 'presets' ? (
        <PresetsScreen
          presets={presets}
          savedRhythm={savedRhythm}
          theme={theme}
          onToggleTheme={toggleTheme}
          onBack={goHome}
          onCreateCustom={goSetup}
          onSelectPreset={(preset) => {
            setAndPersistSettings((prev) => ({
              ...prev,
              inhaleSeconds: preset.inhaleSeconds,
              holdSeconds: preset.holdSeconds,
              exhaleSeconds: preset.exhaleSeconds,
            }));
            setCurrentScreen('setup');
          }}
        />
      ) : null}

      {currentScreen === 'session' ? (
        <BreathingSession
          settings={settings}
          onPhaseChange={setSessionPhaseColor}
          theme={theme}
          onToggleTheme={toggleTheme}
          onEnd={() => {
            setCurrentScreen('setup');
          }}
          onComplete={({ durationSeconds }) => {
            const completed = {
              id: createSessionId(),
              date: new Date().toISOString(),
              inhaleSeconds: settings.inhaleSeconds,
              holdSeconds: settings.holdSeconds,
              exhaleSeconds: settings.exhaleSeconds,
              rounds: settings.rounds,
              durationSeconds,
            };

            setSessions((prev) => [completed, ...prev]);
            setSessionResult((prev) => ({ ...prev, durationSeconds }));
            setCurrentScreen('complete');
          }}
        />
      ) : null}

      {currentScreen === 'complete' ? (
        <CompletionScreen
          settings={settings}
          theme={theme}
          durationSeconds={sessionResult.durationSeconds}
          onMoodChange={(moodAfter) => {
            setSessionResult((prev) => ({ ...prev, moodAfter }));
            setSessions((prev) => {
              if (!prev.length) return prev;
              const [first, ...rest] = prev;
              return [{ ...first, moodAfter }, ...rest];
            });
          }}
          onRepeat={() => {
            rememberSessionEntry(settings);
            setCurrentScreen('session');
          }}
          onChangeRhythm={() => setCurrentScreen('setup')}
          onHome={goHome}
        />
      ) : null}
    </AppShell>
  );
}
