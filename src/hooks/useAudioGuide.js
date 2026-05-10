import { useCallback, useRef } from 'react';
import { audioAssets } from '../utils/audioAssets';
import { selectPhaseAudio } from '../utils/phaseAudioSelector';
import {
  playVoicePhase,
  stopVoicePhase,
  pauseVoicePhase,
  resumeVoicePhase,
  startAmbientHowl,
  pauseAmbientHowl,
  resumeAmbientHowl,
  stopAmbientHowl,
} from '../utils/audioManager';

const VOICE_VOLUME = 0.92;
const TICK_VOLUME = 0.65;
const AMBIENT_VOLUME = 0.27;
const HALFWAY_WATCHDOG_MS = 2500;
const IOS_RETRY_DELAY_MS = 120;

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

function prepareAudioElement(audio) {
  if (!audio) return;
  audio.preload = 'auto';
  audio.playsInline = true;
  audio.setAttribute('playsinline', 'true');
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

  // Voice and ambient are now managed by Howler inside audioManager.
  stopVoicePhase();
  stopAmbientHowl();

  stopInstance(globalTickAudio);
  globalTickAudio = null;
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
    ({ interrupt = true } = {}) => {
      // Voice is managed by Howler in audioManager.
      if (interrupt) stopVoicePhase();
    },
    []
  );

  const pauseVoice = useCallback(() => { pauseVoicePhase(); }, []);

  const resumeVoice = useCallback(() => { resumeVoicePhase(); }, []);

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
      // Reuse a single voice element across phases for better iOS Safari reliability.
      stopVoice({ reset: false, interrupt: true });
      const token = voiceTokenRef.current;

      return new Promise((resolve) => {
        try {
          const audio = voiceAudioRef.current || new Audio();
          prepareAudioElement(audio);
          audio.loop = loop;
          audio.volume = volume;
          let halfwayResolved = false;
          let halfwayIntervalId = null;
          let halfwayWatchdogId = null;
          let retriedPlay = false;

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

          audio.src = src;
          audio.load();

          audio.onended = () => {
            if (token !== voiceTokenRef.current) return;
            clearHalfwayWatchers();
            resolveActiveVoice('ended');
          };

          audio.onerror = () => {
            if (token !== voiceTokenRef.current) return;
            clearHalfwayWatchers();
            resolveActiveVoice('error');
          };

          const startPlayback = () => {
            if (token !== voiceTokenRef.current) return;

            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {
                if (token !== voiceTokenRef.current) return;

                if (!retriedPlay) {
                  retriedPlay = true;
                  setTimeout(() => {
                    if (token !== voiceTokenRef.current) return;
                    audio.load();
                    startPlayback();
                  }, IOS_RETRY_DELAY_MS);
                  return;
                }

                clearHalfwayWatchers();
                resolveActiveVoice('play-failed');
              });
            }
          };

          startPlayback();

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
          prepareAudioElement(audio);
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
      prepareAudioElement(audio);
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

  // Phase voice goes through Howler so it shares the same AudioContext as ticks/ambient.
  // This eliminates iOS Safari's concurrent-stream blocking across phase transitions.
  // round is passed so the anchor+pool selector can pick the right file.
  const playPhase = useCallback(
    (phase, round = 1) => {
      const src = selectPhaseAudio(phase, round, audioAssets.phases[phase]);
      return playVoicePhase(src);
    },
    []
  );

  const playTick = useCallback(() => {
    const src = audioAssets.ticks.tick;
    if (!src) return;

    try {
      stopInstance(tickAudioRef.current);
      const tick = new Audio(src);
      tick.volume = TICK_VOLUME;
      prepareAudioElement(tick);
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

  // Ambient runs through Howler (same AudioContext as voice + ticks).
  const startAmbient = useCallback(() => {
    startAmbientHowl(audioAssets.ambient.background);
  }, []);

  const pauseAmbient = useCallback(() => { pauseAmbientHowl(); }, []);

  const resumeAmbient = useCallback(() => { resumeAmbientHowl(); }, []);

  const stopAmbient = useCallback(() => { stopAmbientHowl(); }, []);

  const playComplete = useCallback(
    () => playAudio(audioAssets.ui.complete, { channel: 'voice', volume: VOICE_VOLUME, waitForEnd: false }),
    [playAudio]
  );

  const playChime = useCallback(
    () => playAudio(audioAssets.ui.chime, { channel: 'sfx', volume: 0.4 }),
    [playAudio]
  );

  const stopAllAudio = useCallback(() => {
    stopGlobalAudio(); // stops intro HTML Audio + Howler voice + Howler ambient + tick
    introAudioRef.current = globalIntroAudio;
    tickAudioRef.current = globalTickAudio;
    introResolverRef.current = globalIntroResolver;
    introTokenRef.current = globalIntroToken;
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
