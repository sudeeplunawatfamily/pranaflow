import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * phaseAudioPoolPlugin
 *
 * Scans public/assets/audio/phases/ at build time and exposes a virtual
 * module `virtual:phase-audio-pool` that contains the pool arrays for each
 * breathing phase.
 *
 * Convention: anchor files have no suffix (inhale.mp3), pool files have an
 * underscore suffix (inhale_a.mp3, inhale_b.mp3, …).
 *
 * Usage: just drop a new mp3 with the correct name into the folder.
 * In dev mode the page hot-reloads automatically when files are added/removed.
 */
function phaseAudioPoolPlugin() {
  const VIRTUAL = 'virtual:phase-audio-pool';
  const RESOLVED = '\0' + VIRTUAL;
  const PHASES_DIR = 'public/assets/audio/phases';
  const PHASES = ['inhale', 'hold', 'exhale'];

  function buildPool() {
    const pool = Object.fromEntries(PHASES.map((p) => [p, []]));
    try {
      const files = fs
        .readdirSync(PHASES_DIR)
        .filter((f) => f.endsWith('.mp3'))
        .sort(); // sort for deterministic order
      for (const phase of PHASES) {
        pool[phase] = files
          .filter((f) => f.startsWith(phase + '_'))
          .map((f) => `/assets/audio/phases/${f}`);
      }
    } catch {
      // Folder doesn't exist yet — return empty pools, anchor always plays.
    }
    return pool;
  }

  return {
    name: 'phase-audio-pool',
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED;
    },
    load(id) {
      if (id === RESOLVED) {
        return `export default ${JSON.stringify(buildPool())}`;
      }
    },
    configureServer(server) {
      // Re-scan and reload when mp3 files are added/removed in dev mode.
      const absDir = path.resolve(PHASES_DIR);
      server.watcher.add(absDir);
      server.watcher.on('all', (event, file) => {
        if (file.startsWith(absDir) && file.endsWith('.mp3')) {
          const mod = server.moduleGraph.getModuleById(RESOLVED);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), phaseAudioPoolPlugin()],
});
