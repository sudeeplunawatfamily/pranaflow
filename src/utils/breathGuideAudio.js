/**
 * breathGuideAudio.js
 *
 * Procedural soft wind breath guide sounds via the Web Audio API.
 *
 * Design notes
 * ─────────────
 * • All nodes route through Howler.masterGain, sharing the same AudioContext
 *   as voice and ambient audio — one iOS unlock gesture covers everything.
 *
 * • Duration always comes from the actual phase timer, never hardcoded.
 *
 * • Hold phases are silent — sound during hold feels like it's rushing the user.
 *
 * Sound design — Soft Wind
 * ────────────────────────
 * Pink noise → two gentle lowpass filters in series.
 *
 * Pink noise has more low-mid energy than white noise — it's the texture
 * closest to real wind and breath.  Two lowpass filters in series give a
 * steeper, softer roll-off than one filter alone, removing any residual hiss.
 *
 * Filter frequency arc (very low range — stays in "airy shhh" territory):
 *
 *   Inhale: 80 Hz → 320 Hz (at midpoint) → 220 Hz
 *     Filter opens as air fills the lungs.  Small dip at the end is a gentle
 *     non-visual "inhale resolved" cue.
 *
 *   Exhale: 240 Hz → 280 Hz (at 25%) → 60 Hz
 *     Starts open, brief early lift releases tension, then slowly closes to
 *     near-silence for a full, satisfying release.
 *
 * Gain envelope (both phases): perfect triangle — equal rise and equal fall,
 * each exactly half the phase duration.  Peak lands at the exact midpoint.
 *
 * Modes (extensible)
 * ─────
 *   'off'  – no guide sound
 *   'wind' – soft wind whoosh (implemented here)
 *   Future: 'hum', 'bowl', 'flute'
 */

import { Howler } from 'howler';

// ─── Internal state ───────────────────────────────────────────────────────────

/** Currently active Web Audio nodes. */
let activeNodes = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a 3-second mono pink-noise AudioBuffer (Voss-McCartney approximation).
 * Looped inside a BufferSourceNode so it runs for any phase duration.
 */
function createPinkNoiseBuffer(ctx) {
  const sr = ctx.sampleRate;
  const len = sr * 3;
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + w * 0.5362) * 0.11;
  }
  return buf;
}

// ─── Stop helper ─────────────────────────────────────────────────────────────

function disconnectActiveNodes(fadeSeconds = 0.20) {
  if (!activeNodes) return;
  const { source, filterA, filterB, gain } = activeNodes;
  activeNodes = null;

  try {
    const ctx = Howler.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);

    source.stop(now + fadeSeconds + 0.01);

    setTimeout(() => {
      try { source.disconnect(); } catch { /**/ }
      try { filterA.disconnect(); } catch { /**/ }
      try { filterB.disconnect(); } catch { /**/ }
      try { gain.disconnect(); } catch { /**/ }
    }, (fadeSeconds + 0.06) * 1000);
  } catch {
    try { source.disconnect(); } catch { /**/ }
    try { filterA?.disconnect(); } catch { /**/ }
    try { filterB?.disconnect(); } catch { /**/ }
    try { gain.disconnect(); } catch { /**/ }
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Play a soft wind breath guide sound for the current phase.
 *
 * @param {Object} opts
 * @param {'inhale'|'exhale'|'hold'} opts.phase
 * @param {number}                   opts.duration    - Phase duration in seconds (from the engine).
 * @param {'off'|'wind'}             opts.soundType
 * @param {number}                  [opts.volume=0.42]
 */
export function playBreathGuide({ phase, duration, soundType = 'wind', volume = 0.42 }) {
  stopBreathGuide();

  if (soundType === 'off') return;
  // Hold is intentionally silent.
  if (phase === 'hold') return;
  if (phase !== 'inhale' && phase !== 'exhale') return;

  const ctx = Howler.ctx;
  if (!ctx) { console.warn('breathGuideAudio: Howler.ctx not available'); return; }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  try {
    const now = ctx.currentTime;
    const D = Math.max(duration, 0.5);
    const endAt = now + D;

    // ── Node graph ──────────────────────────────────────────────────────────
    // PinkNoise → filterA (fixed pre-warmup) → filterB (modulated) → gain → masterGain
    //
    // filterA: fixed lowpass at 500 Hz — strips residual high-freq hiss from
    //   the pink noise so the raw source already sounds warm before modulation.
    //
    // filterB: modulated lowpass — its cutoff follows the breath arc (60–320 Hz)
    //   so the wind gently opens on inhale and closes on exhale.
    //   Very low Q (0.4) = wide, smooth roll-off with zero resonance.

    const source = ctx.createBufferSource();
    source.buffer = createPinkNoiseBuffer(ctx);
    source.loop = true;

    const filterA = ctx.createBiquadFilter();
    filterA.type = 'lowpass';
    filterA.frequency.value = 500;
    filterA.Q.value = 0.4;

    const filterB = ctx.createBiquadFilter();
    filterB.type = 'lowpass';
    filterB.Q.value = 0.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);

    source.connect(filterA);
    filterA.connect(filterB);
    filterB.connect(gain);
    gain.connect(Howler.masterGain);

    // ── Filter arc automation ───────────────────────────────────────────────

    if (phase === 'inhale') {
      /**
       * Inhale: wind opens as air fills the lungs.
       * filterB cutoff: 80 Hz → 320 Hz (at 80% of D) → 220 Hz
       * The small final dip is a gentle non-visual "inhale resolved" cue.
       */
      const peakAt = now + D * 0.80;
      filterB.frequency.setValueAtTime(80, now);
      filterB.frequency.linearRampToValueAtTime(320, peakAt);
      filterB.frequency.linearRampToValueAtTime(220, endAt);
    } else {
      /**
       * Exhale: wind starts open, brief early lift, then closes to silence.
       * filterB cutoff: 240 Hz → 280 Hz (at 25% of D) → 60 Hz
       */
      const peakAt = now + D * 0.25;
      filterB.frequency.setValueAtTime(240, now);
      filterB.frequency.linearRampToValueAtTime(280, peakAt);
      filterB.frequency.linearRampToValueAtTime(60, endAt);
    }

    // ── Gain envelope — equal triangle (rise = fall = D/2) ─────────────────
    // Peak at exact midpoint so the swell mirrors the timer symmetrically.
    // Inhale opens the filter much wider than exhale (320 Hz vs 280 Hz peak),
    // so more energy passes through and it sounds louder at the same gain value.
    // Compensate by scaling inhale peak down so both phases feel equal in level.
    const HALF = D * 0.5;
    const peakVolume = phase === 'inhale' ? volume * 0.55 : volume;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakVolume, now + HALF);
    gain.gain.linearRampToValueAtTime(0, endAt);

    // ── Start and auto-stop ─────────────────────────────────────────────────
    source.start(now);
    source.stop(endAt); // stops exactly when the phase timer ends

    activeNodes = { source, filterA, filterB, gain };

    source.onended = () => {
      if (activeNodes && activeNodes.source === source) activeNodes = null;
      try { source.disconnect(); } catch { /**/ }
      try { filterA.disconnect(); } catch { /**/ }
      try { filterB.disconnect(); } catch { /**/ }
      try { gain.disconnect(); } catch { /**/ }
    };

  } catch (err) {
    console.warn('breathGuideAudio: failed to start —', err);
    activeNodes = null;
  }
}

/** Stop with anti-click fade. Safe to call when nothing is playing. */
export function stopBreathGuide() {
  disconnectActiveNodes(0.20);
}

/** Pause: fade out and stop. Caller restarts for remaining duration on resume. */
export function pauseBreathGuide() {
  disconnectActiveNodes(0.15);
}

/**
 * Resume wind guide for the remaining phase duration after a pause.
 *
 * @param {Object} opts
 * @param {'inhale'|'exhale'|'hold'} opts.phase
 * @param {number}                   opts.remainingSeconds
 * @param {'off'|'wind'}             opts.soundType
 * @param {number}                  [opts.volume]
 */
export function resumeBreathGuide({ phase, remainingSeconds, soundType = 'wind', volume = 0.42 }) {
  playBreathGuide({ phase, duration: remainingSeconds, soundType, volume });
}

