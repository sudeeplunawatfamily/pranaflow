import { useState } from 'react';
import AppShell from './components/AppShell';
import BreathingSetup from './components/BreathingSetup';
import BreathingSession from './components/BreathingSession';
import CompletionScreen from './components/CompletionScreen';
import HomeScreen from './components/HomeScreen';
import PresetsScreen from './components/PresetsScreen';
import { presets } from './data/presets';
import useLocalStorage from './hooks/useLocalStorage';
import { defaultSettings, normalizeSettings, STORAGE_KEYS } from './utils/storage';

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [persistedSettings, setPersistedSettings] = useLocalStorage(STORAGE_KEYS.settings, defaultSettings);
  const [settings, setSettings] = useState(() => normalizeSettings(persistedSettings));
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.sessions, []);
  const [sessionResult, setSessionResult] = useState({ durationSeconds: 0, moodAfter: undefined });
  const [sessionPhaseColor, setSessionPhaseColor] = useState(null);

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

  return (
    <AppShell phaseColor={sessionPhaseColor}>
      {currentScreen === 'home' ? (
        <HomeScreen onStartCustom={goSetup} onExplorePresets={goPresets} sessions={sessions} />
      ) : null}

      {currentScreen === 'setup' ? (
        <BreathingSetup
          settings={settings}
          setSettings={setAndPersistSettings}
          onBack={goHome}
          onBeginSession={() => setCurrentScreen('session')}
        />
      ) : null}

      {currentScreen === 'presets' ? (
        <PresetsScreen
          presets={presets}
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
          onEnd={() => {
            setSessionPhaseColor(null);
            setCurrentScreen('setup');
          }}
          onComplete={({ durationSeconds }) => {
            setSessionPhaseColor(null);
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
          durationSeconds={sessionResult.durationSeconds}
          onMoodChange={(moodAfter) => {
            setSessionResult((prev) => ({ ...prev, moodAfter }));
            setSessions((prev) => {
              if (!prev.length) return prev;
              const [first, ...rest] = prev;
              return [{ ...first, moodAfter }, ...rest];
            });
          }}
          onRepeat={() => setCurrentScreen('session')}
          onChangeRhythm={() => setCurrentScreen('setup')}
          onHome={goHome}
        />
      ) : null}
    </AppShell>
  );
}
