import { Howl, Howler } from 'howler';
import {
  playBreathGuide as _playBreathGuide,
  pauseBreathGuide as _pauseBreathGuide,
  resumeBreathGuide as _resumeBreathGuide,
  stopBreathGuide as _stopBreathGuide,
} from './breathGuideAudio';

// Prevent iOS from suspending the AudioContext between phase transitions.
// This is critical for audio to work reliably across all phases on iOS Safari.
Howler.autoSuspend = false;

const REGULAR_TICK_VOLUME = 0.42;
const FINAL_TICK_VOLUME = 0.56;

// Howler instances for tick sounds
let regularTick = null;
let finalTick = null;
let audioEnabled = true;
let tickVolume = REGULAR_TICK_VOLUME;

// Pre-warm Howl instances for each phase audio so iOS unlocks them
// during the "Begin Session" gesture rather than lazily at phase start.
const PHASE_AUDIO_SRCS = [
  '/assets/audio/intro/welcome.mp3',
  '/assets/audio/phases/inhale.mp3',
  '/assets/audio/phases/hold.mp3',
  '/assets/audio/phases/exhale.mp3',
  '/assets/audio/ambient/ambient.mp3',
];
let prewarmHowls = [];

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
    html5: true,
    preload: true,
    onloaderror: (id, error) => {
      console.warn('Failed to load regular tick audio:', error);
    },
  });

  finalTick = new Howl({
    src: ['/sounds/wood-tick.mp3'],
    volume: FINAL_TICK_VOLUME,
    rate: 1.18,
    html5: true,
    preload: true,
    onloaderror: (id, error) => {
      console.warn('Failed to load final tick audio:', error);
    },
  });

  // Pre-warm all phase audio so iOS <audio> elements are unlocked by
  // the current user gesture and are ready to play without delay.
  if (prewarmHowls.length === 0) {
    prewarmHowls = PHASE_AUDIO_SRCS.map(
      (src) =>
        new Howl({
          src: [src],
          volume: 0,
          html5: true,
          preload: true,
        })
    );
  }
}

/**
 * Unlock audio context for mobile browsers.
 * Should be called after a user gesture (e.g., Begin Session tap).
 */
export async function unlockAudio() {
  try {
    // Resume Web Audio context if present (covers html5:false Howl instances if any remain).
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      await Howler.ctx.resume();
    }
  } catch (error) {
    console.warn('Failed to unlock audio context:', error);
  }

  // On iOS Safari, html5:true Howl instances use <audio> elements that also need
  // a silent play triggered within a user gesture to be fully unlocked.
  // Howler handles this internally via autoUnlock, but we force it here as a
  // belt-and-suspenders measure by calling Howler's internal unlock path.
  try {
    if (typeof Howler._unlockAudio === 'function') {
      Howler._unlockAudio();
    }
  } catch {
    // Ignore — internal Howler API, may not exist in all versions.
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

// ─── Voice phase (Howler) ───────────────────────────────────────────────────
// Using Howler keeps voice in the same AudioContext as ticks and ambient,
// so iOS Safari never blocks a new voice clip because of a concurrent stream.

const VOICE_VOLUME = 0.92;
let voiceHowl = null;
let voiceHowlToken = 0;

/**
 * Play a phase voice clip through Howler.
 * Resolves at the halfway point so the breathing timer can start mid-prompt.
 */
export function playVoicePhase(src) {
  voiceHowlToken += 1;
  const token = voiceHowlToken;
  if (voiceHowl) {
    try { voiceHowl.stop(); voiceHowl.unload(); } catch { /* ignore */ }
    voiceHowl = null;
  }

  return new Promise((resolve) => {
    try {
      let halfwayResolved = false;
      let intervalId = null;
      let watchdogId = null;

      const cleanup = () => {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
        if (watchdogId) { clearTimeout(watchdogId); watchdogId = null; }
      };

      const settle = (result) => {
        if (token !== voiceHowlToken) return;
        cleanup();
        resolve(result);
      };

      const howl = new Howl({
        src: [src],
        volume: VOICE_VOLUME,
        html5: true,
        preload: true,
        onplay: () => {
          if (token !== voiceHowlToken) return;
          // Poll every 80ms to detect halfway point using actual audio metadata.
          intervalId = setInterval(() => {
            if (token !== voiceHowlToken) { cleanup(); return; }
            if (halfwayResolved) return;
            const dur = howl.duration();
            const pos = typeof howl.seek() === 'number' ? howl.seek() : 0;
            if (dur > 0 && pos >= dur / 2) {
              halfwayResolved = true;
              settle('halfway');
            }
          }, 80);
          // Watchdog: resolve after 2.5 s if duration metadata never arrives.
          watchdogId = setTimeout(() => {
            if (!halfwayResolved) settle('halfway-watchdog');
          }, 2500);
        },
        onend: () => {
          if (token !== voiceHowlToken) return;
          cleanup();
          if (!halfwayResolved) settle('ended');
        },
        onloaderror: () => {
          if (token !== voiceHowlToken) return;
          cleanup();
          settle('error');
        },
        onplayerror: () => {
          if (token !== voiceHowlToken) return;
          cleanup();
          settle('play-failed');
        },
      });

      voiceHowl = howl;
      howl.play();
    } catch {
      resolve('runtime-error');
    }
  });
}

export function stopVoicePhase() {
  voiceHowlToken += 1;
  if (voiceHowl) {
    try { voiceHowl.stop(); voiceHowl.unload(); } catch { /* ignore */ }
    voiceHowl = null;
  }
}

export function pauseVoicePhase() {
  try { voiceHowl?.pause(); } catch { /* ignore */ }
}

export function resumeVoicePhase() {
  try { if (voiceHowl && !voiceHowl.playing()) voiceHowl.play(); } catch { /* ignore */ }
}

// ─── Ambient (Howler) ────────────────────────────────────────────────────────
// Ambient runs in the same AudioContext so it never blocks voice clips.

const AMBIENT_VOLUME = 0.27;
let ambientHowl = null;

export function startAmbientHowl(src) {
  if (ambientHowl) {
    try { if (!ambientHowl.playing()) ambientHowl.play(); } catch { /* ignore */ }
    return;
  }
  try {
    ambientHowl = new Howl({ src: [src], loop: true, volume: AMBIENT_VOLUME, html5: true, preload: true });
    ambientHowl.play();
  } catch { /* ignore */ }
}

export function pauseAmbientHowl() {
  try { ambientHowl?.pause(); } catch { /* ignore */ }
}

export function resumeAmbientHowl() {
  try { if (ambientHowl && !ambientHowl.playing()) ambientHowl.play(); } catch { /* ignore */ }
}

export function stopAmbientHowl() {
  try {
    if (ambientHowl) { ambientHowl.stop(); ambientHowl.unload(); ambientHowl = null; }
  } catch { /* ignore */ }
}

// ─── Stop all ────────────────────────────────────────────────────────────────

/**
 * Stop all audio playback (ticks, voice, ambient, breath guide).
 */
export function stopAllAudio() {
  try {
    if (regularTick) regularTick.stop();
    if (finalTick) finalTick.stop();
  } catch (error) {
    console.warn('Error stopping tick audio:', error);
  }
  stopVoicePhase();
  stopAmbientHowl();
  _stopBreathGuide();
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
    if (regularTick) { regularTick.stop(); regularTick.unload(); regularTick = null; }
    if (finalTick) { finalTick.stop(); finalTick.unload(); finalTick = null; }
  } catch (error) {
    console.warn('Error during audio cleanup:', error);
  }
  stopVoicePhase();
  stopAmbientHowl();
}

// ─── Breath Guide (procedural ocean sound) ────────────────────────────────────
// These thin wrappers expose the breathGuideAudio module through the central
// audio manager so all audio lifecycle is coordinated in one place.

/**
 * Start a procedural breath guide sound for the current phase.
 *
 * @param {Object} opts
 * @param {'inhale'|'exhale'|'hold'} opts.phase
 * @param {number}                   opts.duration   - Phase duration in seconds.
 * @param {'off'|'ocean'}            opts.soundType  - Guide mode.
 * @param {number}                  [opts.volume]    - Volume override (0–1).
 */
export function playBreathGuide(opts) {
  if (!audioEnabled) return;
  _playBreathGuide(opts);
}

/** Stop the current breath guide sound (with anti-click fade). */
export function stopBreathGuide() {
  _stopBreathGuide();
}

/** Pause/suspend the breath guide sound. */
export function pauseBreathGuide() {
  _pauseBreathGuide();
}

/**
 * Resume the breath guide for the remaining phase duration after a pause.
 *
 * @param {Object} opts
 * @param {'inhale'|'exhale'|'hold'} opts.phase
 * @param {number}                   opts.remainingSeconds
 * @param {'off'|'ocean'}            opts.soundType
 * @param {number}                  [opts.volume]
 */
export function resumeBreathGuide(opts) {
  if (!audioEnabled) return;
  _resumeBreathGuide(opts);
}
