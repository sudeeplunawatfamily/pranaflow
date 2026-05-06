import { Howl, Howler } from 'howler';

const REGULAR_TICK_VOLUME = 0.42;
const FINAL_TICK_VOLUME = 0.56;

// Howler instances for tick sounds
let regularTick = null;
let finalTick = null;
let audioEnabled = true;
let tickVolume = REGULAR_TICK_VOLUME;

/**
 * Initialize Howler instances for tick sounds.
 * Should be called once on app startup or on Begin Session.
 */
export function initAudio() {
  // Only initialize once
  if (regularTick && finalTick) {
    return;
  }

  regularTick = new Howl({
    src: ['/sounds/wood-tick.mp3'],
    volume: tickVolume,
    rate: 1.0,
    html5: false,
    preload: true,
    onloaderror: (id, error) => {
      console.warn('Failed to load regular tick audio:', error);
    },
  });

  finalTick = new Howl({
    src: ['/sounds/wood-tick.mp3'],
    volume: FINAL_TICK_VOLUME,
    rate: 1.18,
    html5: false,
    preload: true,
    onloaderror: (id, error) => {
      console.warn('Failed to load final tick audio:', error);
    },
  });
}

/**
 * Unlock audio context for mobile browsers.
 * Should be called after a user gesture (e.g., Begin Session tap).
 */
export async function unlockAudio() {
  try {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      await Howler.ctx.resume();
    }
  } catch (error) {
    console.warn('Failed to unlock audio context:', error);
  }
}

/**
 * Play a tick sound.
 * @param {boolean} isLastSecond - If true, plays the final/high-pitched tick. Otherwise plays regular tick.
 */
export function playTick(isLastSecond = false) {
  if (!audioEnabled) return;

  // Ensure audio is initialized
  if (!regularTick || !finalTick) {
    initAudio();
  }

  try {
    if (isLastSecond) {
      // Stop any currently playing regular tick before playing final tick
      if (regularTick && regularTick.playing()) {
        regularTick.stop();
      }
      finalTick.play();
    } else {
      // Stop any currently playing final tick before playing regular tick
      if (finalTick && finalTick.playing()) {
        finalTick.stop();
      }
      regularTick.play();
    }
  } catch (error) {
    console.warn('Error playing tick sound:', error);
  }
}

/**
 * Stop all audio playback (both tick sounds).
 */
export function stopAllAudio() {
  try {
    if (regularTick) {
      regularTick.stop();
    }
    if (finalTick) {
      finalTick.stop();
    }
  } catch (error) {
    console.warn('Error stopping audio:', error);
  }
}

/**
 * Enable or disable audio playback.
 * When disabled, all audio stops immediately.
 * @param {boolean} enabled - Whether audio should be enabled.
 */
export function setAudioEnabled(enabled) {
  audioEnabled = enabled;
  if (!enabled) {
    stopAllAudio();
  }
}

/**
 * Check if audio is currently enabled.
 * @returns {boolean} Whether audio is enabled.
 */
export function isAudioEnabled() {
  return audioEnabled;
}

/**
 * Set the volume for regular tick sounds.
 * @param {number} volume - Volume level (0 to 1).
 */
export function setTickVolume(volume) {
  tickVolume = Math.max(0, Math.min(1, volume));
  if (regularTick) {
    regularTick.volume(tickVolume);
  }
  if (finalTick) {
    finalTick.volume(Math.max(0, Math.min(1, tickVolume + 0.14)));
  }
}

/**
 * Clean up and unload Howler instances.
 * Can be called on app unmount or session end.
 */
export function cleanupAudio() {
  try {
    if (regularTick) {
      regularTick.stop();
      regularTick.unload();
      regularTick = null;
    }
    if (finalTick) {
      finalTick.stop();
      finalTick.unload();
      finalTick = null;
    }
  } catch (error) {
    console.warn('Error during audio cleanup:', error);
  }
}
