import phasePool from 'virtual:phase-audio-pool';

export const audioAssets = {
  intro: {
    welcome: '/assets/audio/intro/welcome.mp3',
  },
  /**
   * Phase audio uses the anchor + pool strategy (see phaseAudioSelector.js).
   *
   * anchor — plays on rounds 1, 5, 10, 15, 20 …
   * pool   — auto-discovered at build time by the Vite plugin in vite.config.js.
   *          No manual edits needed here.
   *
   * To add a pool file: drop an mp3 named {phase}_{anything}.mp3 into
   * public/assets/audio/phases/ and rebuild (dev mode hot-reloads).
   *   inhale_a.mp3 / hold_a.mp3 / exhale_a.mp3 …
   */
  phases: {
    inhale: { anchor: '/assets/audio/phases/inhale.mp3', pool: phasePool.inhale },
    hold:   { anchor: '/assets/audio/phases/hold.mp3',   pool: phasePool.hold   },
    exhale: { anchor: '/assets/audio/phases/exhale.mp3', pool: phasePool.exhale },
  },
  ticks: {
    tick: '/sounds/wood-tick.mp3',
  },
  ambient: {
    background: '/assets/audio/ambient/ambient.mp3',
  },
  ui: {
    complete: '/assets/audio/ui/complete.mp3',
    chime: '/assets/audio/ui/chime.mp3',
  },
};

