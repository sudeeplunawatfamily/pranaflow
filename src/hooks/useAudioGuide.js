import { useCallback, useRef } from 'react';
import { audioAssets } from '../utils/audioAssets';

const VOICE_VOLUME = 0.92;
const TICK_VOLUME = 0.65;
const AMBIENT_VOLUME = 0.27;
const HALFWAY_WATCHDOG_MS = 2500;

let globalIntroAudio = null;
let globalVoiceAudio = null;
let globalTickAudio = null;
let globalAmbientAudio = null;
let globalIntroResolver = null;
let globalVoiceResolver = null;
let globalIntroToken = 0;
let globalVoiceToken = 0;

function stopInstance(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

function resolveGlobalVoice(result) {
  if (!globalVoiceResolver) return;
  const resolver = globalVoiceResolver;
  globalVoiceResolver = null;
  resolver(result);
}

function resolveGlobalIntro(result) {
  if (!globalIntroResolver) return;
  const resolver = globalIntroResolver;
  globalIntroResolver = null;
  resolver(result);
}

export function stopGlobalAudio() {
  if (globalIntroAudio) {
    globalIntroAudio.pause();
    globalIntroAudio.currentTime = 0;
  }
  globalIntroAudio = null;
  globalIntroToken += 1;
  resolveGlobalIntro('stopped');

  if (globalVoiceAudio) {
    globalVoiceAudio.pause();
    globalVoiceAudio.currentTime = 0;
  }
  globalVoiceAudio = null;
  globalVoiceToken += 1;
  resolveGlobalVoice('stopped');

  stopInstance(globalTickAudio);
  globalTickAudio = null;

  stopInstance(globalAmbientAudio);
  globalAmbientAudio = null;
}

export default function useAudioGuide() {
  const introAudioRef = useRef(globalIntroAudio);
  const voiceAudioRef = useRef(globalVoiceAudio);
  const tickAudioRef = useRef(globalTickAudio);
  const ambientAudioRef = useRef(globalAmbientAudio);
  const introResolverRef = useRef(globalIntroResolver);
  const voiceResolverRef = useRef(globalVoiceResolver);
  const introTokenRef = useRef(globalIntroToken);
  const voiceTokenRef = useRef(globalVoiceToken);

  const resolveActiveIntro = useCallback((result) => {
    resolveGlobalIntro(result);
    introResolverRef.current = globalIntroResolver;
  }, []);

  const resolveActiveVoice = useCallback((result) => {
    resolveGlobalVoice(result);
    voiceResolverRef.current = globalVoiceResolver;
  }, []);

  const stopIntro = useCallback(
    ({ reset = true, interrupt = true } = {}) => {
      const intro = introAudioRef.current;
      if (intro) {
        intro.pause();
        if (reset) intro.currentTime = 0;
      }

      if (reset) {
        introAudioRef.current = null;
        globalIntroAudio = null;
      }

      if (interrupt) {
        introTokenRef.current += 1;
        globalIntroToken = introTokenRef.current;
        resolveActiveIntro('stopped');
      }
    },
    [resolveActiveIntro]
  );

  const stopVoice = useCallback(
    ({ reset = true, interrupt = true } = {}) => {
      const voice = voiceAudioRef.current;
      if (voice) {
        voice.pause();
        if (reset) voice.currentTime = 0;
      }

      if (reset) {
        voiceAudioRef.current = null;
        globalVoiceAudio = null;
      }

      if (interrupt) {
        voiceTokenRef.current += 1;
        globalVoiceToken = voiceTokenRef.current;
        resolveActiveVoice('stopped');
      }
    },
    [resolveActiveVoice]
  );

  const pauseVoice = useCallback(() => {
    const voice = voiceAudioRef.current;
    if (!voice) return;
    voice.pause();
  }, []);

  const resumeVoice = useCallback(() => {
    const voice = voiceAudioRef.current;
    if (!voice) return;

    try {
      const playPromise = voice.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silent failure keeps the flow running.
        });
      }
    } catch {
      // Ignore voice resume errors.
    }
  }, []);

  const playAudio = useCallback((src, options = {}) => {
    if (!src) return Promise.resolve('missing-src');

    const {
      volume = 1,
      loop = false,
      waitForEnd = false,
      resolveAtHalfway = false,
      channel = 'voice',
    } = options;

    if (channel === 'voice') {
      stopVoice({ reset: true, interrupt: true });
      const token = voiceTokenRef.current;

      return new Promise((resolve) => {
        try {
          const audio = new Audio(src);
          audio.loop = loop;
          audio.volume = volume;
          let halfwayResolved = false;
          let halfwayIntervalId = null;
          let halfwayWatchdogId = null;

          const clearHalfwayWatchers = () => {
            if (halfwayIntervalId) {
              clearInterval(halfwayIntervalId);
              halfwayIntervalId = null;
            }

            if (halfwayWatchdogId) {
              clearTimeout(halfwayWatchdogId);
              halfwayWatchdogId = null;
            }
          };

          const resolveHalfway = (result) => {
            if (!resolveAtHalfway || halfwayResolved || token !== voiceTokenRef.current) return;
            halfwayResolved = true;
            clearHalfwayWatchers();
            resolveActiveVoice(result);
          };

          const checkHalfway = () => {
            const { duration, currentTime } = audio;
            if (!Number.isFinite(duration) || duration <= 0) return;

            if (currentTime >= duration / 2) {
              resolveHalfway('halfway');
            }
          };

          voiceAudioRef.current = audio;
          voiceResolverRef.current = resolve;
          globalVoiceAudio = audio;
          globalVoiceResolver = resolve;

          audio.onended = () => {
            if (token !== voiceTokenRef.current) return;
            clearHalfwayWatchers();
            voiceAudioRef.current = null;
            globalVoiceAudio = null;
            resolveActiveVoice('ended');
          };

          audio.onerror = () => {
            if (token !== voiceTokenRef.current) return;
            clearHalfwayWatchers();
            voiceAudioRef.current = null;
            globalVoiceAudio = null;
            resolveActiveVoice('error');
          };

          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              if (token !== voiceTokenRef.current) return;
              clearHalfwayWatchers();
              voiceAudioRef.current = null;
              globalVoiceAudio = null;
              resolveActiveVoice('play-failed');
            });
          }

          if (waitForEnd && resolveAtHalfway) {
            halfwayIntervalId = setInterval(checkHalfway, 80);
            halfwayWatchdogId = setTimeout(() => {
              resolveHalfway('halfway-watchdog');
            }, HALFWAY_WATCHDOG_MS);
          }

          if (!waitForEnd) {
            resolveActiveVoice('started');
          }
        } catch {
          voiceAudioRef.current = null;
          globalVoiceAudio = null;
          resolveActiveVoice('runtime-error');
        }
      });
    }

    if (channel === 'intro') {
      stopIntro({ reset: true, interrupt: true });
      const token = introTokenRef.current;

      return new Promise((resolve) => {
        try {
          const audio = new Audio(src);
          audio.loop = loop;
          audio.volume = volume;
          introAudioRef.current = audio;
          introResolverRef.current = resolve;
          globalIntroAudio = audio;
          globalIntroResolver = resolve;

          audio.onended = () => {
            if (token !== introTokenRef.current) return;
            introAudioRef.current = null;
            globalIntroAudio = null;
            resolveActiveIntro('ended');
          };

          audio.onerror = () => {
            if (token !== introTokenRef.current) return;
            introAudioRef.current = null;
            globalIntroAudio = null;
            resolveActiveIntro('error');
          };

          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              if (token !== introTokenRef.current) return;
              introAudioRef.current = null;
              globalIntroAudio = null;
              resolveActiveIntro('play-failed');
            });
          }

          if (!waitForEnd) {
            resolveActiveIntro('started');
          }
        } catch {
          introAudioRef.current = null;
          globalIntroAudio = null;
          resolveActiveIntro('runtime-error');
        }
      });
    }

    try {
      const audio = new Audio(src);
      audio.loop = loop;
      audio.volume = volume;
      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silent failure for non-voice channels.
        });
      }
    } catch {
      // Ignore runtime audio errors for non-voice channels.
    }

    return Promise.resolve('started');
  }, [resolveActiveIntro, resolveActiveVoice, stopIntro, stopVoice]);

  const playVoice = useCallback(
    (src, options = {}) => playAudio(src, {
      channel: 'voice',
      volume: VOICE_VOLUME,
      waitForEnd: true,
      ...options,
    }),
    [playAudio]
  );

  const playIntro = useCallback(
    () => playAudio(audioAssets.intro.welcome, { channel: 'intro', volume: VOICE_VOLUME, waitForEnd: true }),
    [playAudio]
  );

  const playPhase = useCallback(
    (phase) => playVoice(audioAssets.phases[phase], { resolveAtHalfway: true }),
    [playVoice]
  );

  const playTick = useCallback(() => {
    const src = audioAssets.ticks.tick;
    if (!src) return;

    try {
      stopInstance(tickAudioRef.current);
      const tick = new Audio(src);
      tick.volume = TICK_VOLUME;
      tickAudioRef.current = tick;
      globalTickAudio = tick;
      const playPromise = tick.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silent failure: missing file or playback restrictions.
        });
      }
    } catch {
      // Ignore tick audio runtime errors.
    }
  }, []);

  const stopTick = useCallback(() => {
    stopInstance(tickAudioRef.current);
    tickAudioRef.current = null;
    globalTickAudio = null;
  }, []);

  const startAmbient = useCallback(() => {
    const src = audioAssets.ambient.background;
    if (!src) return;

    try {
      if (!ambientAudioRef.current) {
        const ambient = new Audio(src);
        ambient.loop = true;
        ambient.volume = AMBIENT_VOLUME;
        ambientAudioRef.current = ambient;
        globalAmbientAudio = ambient;
      }

      const playPromise = ambientAudioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silent failure for ambient playback.
        });
      }
    } catch {
      // Ignore ambient runtime errors.
    }
  }, []);

  const pauseAmbient = useCallback(() => {
    if (!ambientAudioRef.current) return;
    ambientAudioRef.current.pause();
  }, []);

  const resumeAmbient = useCallback(() => {
    if (!ambientAudioRef.current) return;

    try {
      const playPromise = ambientAudioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Silent failure for ambient resume.
        });
      }
    } catch {
      // Ignore ambient resume errors.
    }
  }, []);

  const stopAmbient = useCallback(() => {
    stopInstance(ambientAudioRef.current);
    ambientAudioRef.current = null;
    globalAmbientAudio = null;
  }, []);

  const playComplete = useCallback(
    () => playAudio(audioAssets.ui.complete, { channel: 'voice', volume: VOICE_VOLUME, waitForEnd: false }),
    [playAudio]
  );

  const playChime = useCallback(
    () => playAudio(audioAssets.ui.chime, { channel: 'sfx', volume: 0.4 }),
    [playAudio]
  );

  const stopAllAudio = useCallback(() => {
    stopGlobalAudio();
    introAudioRef.current = globalIntroAudio;
    voiceAudioRef.current = globalVoiceAudio;
    tickAudioRef.current = globalTickAudio;
    ambientAudioRef.current = globalAmbientAudio;
    introResolverRef.current = globalIntroResolver;
    voiceResolverRef.current = globalVoiceResolver;
    introTokenRef.current = globalIntroToken;
    voiceTokenRef.current = globalVoiceToken;
  }, []);

  return {
    playAudio,
    playVoice,
    playIntro,
    playPhase,
    playTick,
    playComplete,
    playChime,
    startAmbient,
    pauseAmbient,
    resumeAmbient,
    stopAmbient,
    stopIntro,
    stopVoice,
    pauseVoice,
    resumeVoice,
    stopTick,
    stopAllAudio,
  };
}
