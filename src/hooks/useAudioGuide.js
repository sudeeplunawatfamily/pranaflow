import { useCallback, useRef } from 'react';
import { audioAssets } from '../utils/audioAssets';

const VOICE_VOLUME = 0.92;
const TICK_VOLUME = 0.45;
const AMBIENT_VOLUME = 0.27;

function stopInstance(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

export default function useAudioGuide() {
  const voiceAudioRef = useRef(null);
  const tickAudioRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const voiceResolverRef = useRef(null);
  const voiceTokenRef = useRef(0);

  const resolveActiveVoice = useCallback((result) => {
    if (!voiceResolverRef.current) return;
    const resolver = voiceResolverRef.current;
    voiceResolverRef.current = null;
    resolver(result);
  }, []);

  const stopVoice = useCallback(
    ({ reset = true, interrupt = true } = {}) => {
      const voice = voiceAudioRef.current;
      if (voice) {
        voice.pause();
        if (reset) voice.currentTime = 0;
      }

      if (reset) {
        voiceAudioRef.current = null;
      }

      if (interrupt) {
        voiceTokenRef.current += 1;
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
          voiceAudioRef.current = audio;
          voiceResolverRef.current = resolve;

          audio.onended = () => {
            if (token !== voiceTokenRef.current) return;
            voiceAudioRef.current = null;
            resolveActiveVoice('ended');
          };

          audio.onerror = () => {
            if (token !== voiceTokenRef.current) return;
            voiceAudioRef.current = null;
            resolveActiveVoice('error');
          };

          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              if (token !== voiceTokenRef.current) return;
              voiceAudioRef.current = null;
              resolveActiveVoice('play-failed');
            });
          }

          if (!waitForEnd) {
            resolveActiveVoice('started');
          }
        } catch {
          voiceAudioRef.current = null;
          resolveActiveVoice('runtime-error');
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
  }, [resolveActiveVoice, stopVoice]);

  const playVoice = useCallback(
    (src) => playAudio(src, { channel: 'voice', volume: VOICE_VOLUME, waitForEnd: true }),
    [playAudio]
  );

  const playIntro = useCallback(
    () => playVoice(audioAssets.intro.welcome),
    [playVoice]
  );

  const playPhase = useCallback(
    (phase) => playVoice(audioAssets.phases[phase]),
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
    stopVoice({ reset: true, interrupt: true });
    stopTick();
    stopAmbient();
  }, [stopAmbient, stopTick, stopVoice]);

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
    stopVoice,
    pauseVoice,
    resumeVoice,
    stopTick,
    stopAllAudio,
  };
}
