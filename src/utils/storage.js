export const STORAGE_KEYS = {
  settings: 'pranaflow_settings',
  sessions: 'pranaflow_sessions',
  savedRhythm: 'pranaflow_saved_rhythm',
  memory: 'pranaflow_memory',
};

export const defaultSettings = {
  inhaleSeconds: 4,
  holdSeconds: 6,
  exhaleSeconds: 5,
  rounds: 5,
  voiceEnabled: true,
  soundEnabled: true,
};

export const defaultSavedRhythm = null;

export const defaultMemory = {
  lastRhythm: null,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const normalizeBoolean = (value, fallback) => (typeof value === 'boolean' ? value : fallback);

export function normalizeSettings(candidate) {
  if (!candidate || typeof candidate !== 'object') return defaultSettings;

  return {
    inhaleSeconds: clamp(Number(candidate.inhaleSeconds) || defaultSettings.inhaleSeconds, 1, 10),
    holdSeconds: clamp(Number(candidate.holdSeconds) || defaultSettings.holdSeconds, 1, 10),
    exhaleSeconds: clamp(Number(candidate.exhaleSeconds) || defaultSettings.exhaleSeconds, 1, 10),
    rounds: clamp(Number(candidate.rounds) || defaultSettings.rounds, 1, 20),
    voiceEnabled: normalizeBoolean(candidate.voiceEnabled, defaultSettings.voiceEnabled),
    soundEnabled: normalizeBoolean(candidate.soundEnabled, defaultSettings.soundEnabled),
  };
}

export function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and serialization failures for MVP.
  }
}
