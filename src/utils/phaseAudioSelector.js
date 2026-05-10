/**
 * phaseAudioSelector.js
 *
 * Selects the correct phase voice audio file for a given round using the
 * "anchor + pool" strategy:
 *
 *   Anchor rounds  → always play the anchor file (feels familiar / grounding)
 *   Pool rounds    → randomly pick from the pool (variety keeps it fresh)
 *
 * Anchor rounds: 1, 5, 10, 15, 20 … (round 1 and every multiple of 5 after).
 *
 * File naming convention expected in public/assets/audio/phases/:
 *
 *   inhale.mp3        ← anchor
 *   inhale_a.mp3      ← pool
 *   inhale_b.mp3      ← pool
 *   inhale_c.mp3      ← pool  (add as many as you like)
 *
 *   hold.mp3          ← anchor
 *   hold_a.mp3        ← pool
 *   hold_b.mp3        ← pool
 *
 *   exhale.mp3        ← anchor
 *   exhale_a.mp3      ← pool
 *   exhale_b.mp3      ← pool
 *
 * Adding a new pool file: drop the mp3 into the folder and add its path to
 * the pool array in audioAssets.js — no other code changes needed.
 *
 * Graceful fallback: if the pool is empty (files not added yet) or the
 * selected round is an anchor round, the anchor file is always returned.
 * Missing pool files will fail silently in the audio layer.
 */

/**
 * Returns true when the given round should use the anchor audio.
 * Anchor rounds: 1, 5, 10, 15, 20 …
 *
 * @param {number} round - Current round (1-based).
 * @returns {boolean}
 */
function isAnchorRound(round) {
  return round === 1 || round % 5 === 0;
}

// Track the last pool index used per phase so we never accidentally repeat
// the same pool file twice in a row.
const lastPoolIndex = { inhale: -1, hold: -1, exhale: -1 };

/**
 * Select the audio src for a phase + round combination.
 *
 * @param {string}   phase      - 'inhale' | 'hold' | 'exhale'
 * @param {number}   round      - Current round number (1-based).
 * @param {{ anchor: string, pool: string[] }} phaseAssets
 *   - anchor: path to the anchor mp3
 *   - pool:   array of paths to pool mp3s (may be empty)
 * @returns {string} The audio src to play.
 */
export function selectPhaseAudio(phase, round, phaseAssets) {
  const { anchor, pool } = phaseAssets;

  // Use anchor on milestone rounds or when no pool files are available.
  if (isAnchorRound(round) || pool.length === 0) {
    return anchor;
  }

  // Pick a random pool index, avoiding repeating the previous one.
  let idx;
  if (pool.length === 1) {
    idx = 0;
  } else {
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (idx === lastPoolIndex[phase]);
  }

  lastPoolIndex[phase] = idx;
  return pool[idx];
}
