# PranaFlow Detailed Project Brief

## 1) Project Summary
PranaFlow is a mobile-first guided breathing web app focused on calm, visual breathwork sessions.

Core value:
- Users configure a breathing rhythm with three phases: inhale, hold, exhale.
- The app runs timed rounds with visual phase guidance, count progression, optional audio, and completion recap.

MVP scope:
- Frontend-only React app.
- No backend, auth, database, or cloud sync.
- Persistence is local browser storage.

## 2) Product Goals and Constraints
Goals:
- Fast, low-friction breathing session setup.
- Reliable timer engine with pause/resume/end behavior.
- Calm visual language that feels like a mobile wellness app.
- Graceful handling when audio files are missing or blocked.

Constraints:
- Browser Audio API only (no SpeechSynthesis API).
- Works primarily in phone browser dimensions with centered app shell.
- Session timing must be source-of-truth; audio must follow timer, never control it.

## 3) Tech Stack
- React 18
- Vite 6
- Tailwind CSS 3
- Framer Motion 11
- lucide-react icons

Key package scripts:
- `npm run dev`
- `npm run build`
- `npm run preview`

## 4) High-Level Architecture
Single-page app with internal screen state (no React Router).

Main layers:
- Presentation: screen components in `src/components`.
- Session logic: hooks in `src/hooks` (`useBreathingEngine`, `useAudioGuide`, `useLocalStorage`).
- Config/data: `src/utils` and `src/data`.
- Assets: `public/assets`.

Top-level screen controller:
- `src/App.jsx`
- Tracks active screen, settings, session history, saved rhythm, and lightweight app memory.

## 5) Navigation and Screen State
Screen state enum used in app:
- `home`
- `setup`
- `presets`
- `session`
- `complete`

Flow implemented:
- Home -> Setup (custom)
- Home -> Presets
- Presets -> Setup (selected preset values applied)
- Setup -> Session
- Session -> Setup (end)
- Session -> Complete (auto on all rounds complete)
- Complete -> Session (repeat)
- Complete -> Setup (change rhythm)
- Complete -> Home

## 6) Data Model
Settings object (`pranaflow_settings`):
- `inhaleSeconds` (1..10)
- `holdSeconds` (1..10)
- `exhaleSeconds` (1..10)
- `rounds` (1..20)
- `voiceEnabled` (boolean)
- `soundEnabled` (boolean)

Saved custom rhythm (`pranaflow_saved_rhythm`):
- `id` (`your-rhythm`)
- `name` (`Your Rhythm`)
- `pattern` (e.g. `4-6-5`)
- `inhaleSeconds`
- `holdSeconds`
- `exhaleSeconds`
- `description`
- `color`
- `isCustom`

Lightweight memory (`pranaflow_memory`):
- `lastRhythm` (inhale/hold/exhale)

Completed sessions array (`pranaflow_sessions`) entries:
- `id` (UUID or fallback generated string)
- `date` (ISO string)
- `inhaleSeconds`
- `holdSeconds`
- `exhaleSeconds`
- `rounds`
- `durationSeconds`
- `moodAfter` (optional: Calm/Refreshed/Sleepy/Focused)

Normalization and validation:
- Implemented in `src/utils/storage.js`.
- Numeric values are clamped to valid ranges.
- Boolean toggles default safely when missing in older saved data.
- Default shapes also exist for saved rhythm and memory containers.

## 7) Breathing Engine (Core Timing Logic)
Hook: `src/hooks/useBreathingEngine.js`

Responsibilities:
- Owns phase, count, round, running/paused state, elapsed time.
- Executes deterministic phase loop: inhale -> hold -> exhale across rounds.
- Exposes controls: `start`, `pause`, `resume`, `end`, `reset`.
- Emits lifecycle callbacks for UI/audio orchestration.

Exposed state:
- `currentPhase`
- `currentCount`
- `currentRound`
- `isRunning`
- `isPaused`
- `elapsedSeconds`
- `totalDurationSeconds`
- `phaseDuration`
- `phaseProgress`
- `totalProgress`

Important reliability strategies:
- `runTokenRef` cancels stale async loops when end/reset/unmount happens.
- Pause uses resolver queue to unblock waits cleanly on resume/end.
- Uses small-step waits (100ms chunks) to remain responsive to pause/end.
- Guard against double-start (`if (isRunningRef.current) return`) for strict mode stability.

## 8) Audio System
Hook: `src/hooks/useAudioGuide.js`

Audio layers:
- Voice layer: intro and phase prompts.
- Tick layer: per-second tick during count progression.
- Ambient layer: looping background sound.

Audio asset map:
- Defined in `src/utils/audioAssets.js`.
- Intro: `/assets/audio/intro/welcome.mp3`
- Phases: inhale/hold/exhale in `/assets/audio/phases/`
- Tick: `/assets/audio/ticks/tick.mp3`
- Ambient: `/assets/audio/ambient/ambient.mp3`
- UI: complete/chime in `/assets/audio/ui/`

Key API:
- `playIntro()`
- `playPhase(phase)`
- `playTick()`
- `startAmbient()` / `pauseAmbient()` / `resumeAmbient()` / `stopAmbient()`
- `pauseVoice()` / `resumeVoice()` / `stopVoice()`
- `playComplete()`
- `stopAllAudio()`

Resilience behavior:
- Every playback path handles failures silently.
- Missing files or blocked autoplay must not crash or block timer flow.

## 9) Session Runtime Orchestration
Component: `src/components/BreathingSession.jsx`

Internal session stages:
- `intro`: optional welcome audio screen.
- `countdown`: 3-2-1 get-ready screen.
- `breathing`: active engine loop.

Current sequencing:
1. If voice enabled: play intro, then go to countdown.
2. If voice disabled: skip intro, go straight to countdown.
3. After countdown reaches 0: enter breathing stage and call engine start.
4. For each phase start: play phase voice first (if enabled), then start ambient (if enabled).
5. On each count tick: play tick sound (if sound enabled).
6. Pause/resume syncs engine and audio layers.
7. Completion stops session sounds, optionally plays complete sound, then routes to completion screen.

Recent fix (already committed):
- Voice prompts for inhale/hold/exhale were reordered to run before ambient start/resume to prevent initial phase voice loss after countdown on stricter mobile autoplay/audio-focus behavior.

## 10) UI Screens and Key Behaviors
Home (`src/components/HomeScreen.jsx`):
- Brand lockup, updated hero copy, character art, primary CTA and secondary presets CTA.
- Shows rhythm-forward resume chip and smart suggestion text using memory context.
- Uses presets, not intent chips, as the quick-start path.

Setup (`src/components/BreathingSetup.jsx`):
- Three timing cards with sliders and tappable value increment.
- Proportional rhythm preview bar reflecting inhale/hold/exhale proportions.
- Dynamic meaning insight pill that changes by inhale/exhale balance.
- Character + glow remains on setup (functional preview module was reverted).
- Rounds stepper (1..20).
- Voice and sound toggles.
- Save Rhythm action.
- Estimated total session duration.

Presets (`src/components/PresetsScreen.jsx`):
- Preset cards with icon, color accent, pattern, and description.
- Includes persisted custom preset entry (`Your Rhythm`) when available.
- Selecting preset writes inhale/hold/exhale to settings and routes to setup.

Session (`src/components/BreathingSession.jsx`):
- Intro and countdown transitions.
- Centered character with halo and simplified single-ring phase animation (clean filled circle + border glow).
- Round progress card, progress bar, pip indicators.
- Per-phase progress indicator (in addition to total session progress).
- Phase label, large count number pulse, instruction text.
- Pause/resume and end controls.

Completion (`src/components/CompletionScreen.jsx`):
- Completion messaging and decorative sparkle burst.
- Total time card, rhythm recap, and total breaths.
- Dynamic insight line based on inhale vs exhale.
- Mood selection buttons.
- Actions: repeat this rhythm, try deeper version (+1 hold), save this rhythm, change rhythm, home.

## 11) Visual and Layout System
Mobile shell:
- Implemented in `src/components/AppShell.jsx`.
- Uses centered layout with max width 430px and `min-h-dvh`.

Decorative background system:
- Shared in `src/components/CharacterBackdrop.jsx`.
- Includes halo glow, mirrored leaf assets, sparkles, bottom waves, lotus mark.

Typography:
- Defined in `src/index.css`.
- Uses Comfortaa for display headings and Nunito Sans/Nunito for body.

Animation:
- Framer Motion used across screen transitions, button interactions, count pulse, breathing ring/character phase movement, and completion sparkle ceremony.

## 12) Preset Catalog
Data source: `src/data/presets.js`

Implemented presets:
- Calm: 4-4-6
- Focus: 4-2-4
- Sleep: 4-7-8
- Beginner: 3-3-3
- Balance: 5-5-5

Descriptions are benefit-led (nervous-system calming, attention, deep rest, beginner-safe, stability).

## 13) Utility Functions and Helpers
- `src/utils/formatTime.js`: seconds -> human-readable `X min Y sec` or `Y sec`.
- `src/hooks/useLocalStorage.js`: sync React state to localStorage key.
- `src/utils/storage.js`: storage keys, defaults, normalization, safe read/write.

## 14) Current Project Status (from task tracker)
Core build is complete:
- Main product screens, timer engine, audio system, persistence, and major polish passes are done.
- Multiple bugfixes and visual improvements already landed.

Scope addendum status:
- SA01-SA15 are implemented and tracked as complete.
- Includes completion insights/metrics/CTAs, saved rhythm support, per-phase session progress, and memory-backed home suggestions.

Active/pending design follow-ups in `tasks.md`:
- DF04 Setup screen restructuring.
- DF05 Timing card simplification.
- DF06 Settings hierarchy improvements.
- DF07 Presets hero compression.
- DF08 Preset card personality pass.
- DF09 Shared spacing/card system normalization.
- DF10 Shared signature motif across screens.

## 15) Running and Deployment
Local development:
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173`

LAN/mobile testing:
- `npm run dev -- --host 0.0.0.0 --port 5173`

Production build:
- `npm run build`
- `npm run preview`

Docker files are present for production and dev workflows.

## 16) Important Asset and Folder Notes
Primary asset roots used by app code:
- `public/assets/images`
- `public/assets/icons`
- `public/assets/audio`
- `public/reference/screens` (reference-only)

There is also a legacy typo folder `public/assests` in the repo tree; app code should continue to use `public/assets` paths.

## 17) Known Product Rules Worth Preserving
- Keep breathing timer as single source of truth.
- Never let audio timing drive phase progression.
- On unmount/end, clear running timer/audio state to avoid ghost playback.
- Maintain case-correct image paths (`Inhale_pose.png`, `Hold_pose.png`, `Exhale_pose.png`).
- Preserve mobile-first spacing/tap targets and no horizontal overflow.

## 18) If You Hand This To Another LLM
Share these files first for best context fidelity:
- `planning.md`
- `tasks.md`
- `src/App.jsx`
- `src/components/BreathingSession.jsx`
- `src/hooks/useBreathingEngine.js`
- `src/hooks/useAudioGuide.js`
- `src/components/BreathingSetup.jsx`
- `src/components/HomeScreen.jsx`
- `src/components/PresetsScreen.jsx`
- `src/components/CompletionScreen.jsx`
- `src/utils/storage.js`
- `src/utils/phaseConfig.js`
- `src/utils/audioAssets.js`

Prompt tip for external assistant:
- Ask it to preserve existing architecture and only change behavior required by the specific task.
- Ask it to update `tasks.md` whenever implementation status changes.

## 19) Snippet Appendix (High-Signal Reference)
This appendix includes compact snippets that explain runtime behavior and safe modification points.

### A) App-Level Screen Routing and Session Completion
Why this matters:
- This is the main state machine for app navigation and where completed sessions are persisted.

Source:
- `src/App.jsx`

```jsx
const [savedRhythm, setSavedRhythm] = useLocalStorage(STORAGE_KEYS.savedRhythm, defaultSavedRhythm);
const [memory, setMemory] = useLocalStorage(STORAGE_KEYS.memory, defaultMemory);

const rememberSessionEntry = (source) => {
	setMemory((prev) => ({
		...prev,
		lastRhythm: {
			inhaleSeconds: source.inhaleSeconds,
			holdSeconds: source.holdSeconds,
			exhaleSeconds: source.exhaleSeconds,
		},
	}));
};
```

Safe-modification notes:
- Keep completion write path atomic (create record, prepend, route to complete).
- Preserve `setSessionPhaseColor(null)` when leaving session to avoid stale tinted background.

Regression risks:
- Missing memory/saved-rhythm updates breaks home resume suggestions and custom preset surfacing.

### B) Core Breathing Engine Loop
Why this matters:
- This loop defines the source-of-truth timing semantics for round/phase/count progression.

Source:
- `src/hooks/useBreathingEngine.js`

```js
for (let round = 1; round <= rounds; round += 1) {
	setCurrentRound(round);
	callbacksRef.current.onRoundChange?.(round);

	for (const phase of phaseOrder) {
		setCurrentPhase(phase);
		setCurrentCount(1);
		callbacksRef.current.onPhaseChange?.(phase);

		await waitWhilePaused(token);
		if (!isRunningRef.current || runTokenRef.current !== token) return;

		await callbacksRef.current.onBeforePhaseStart?.(phase);

		await waitWhilePaused(token);
		if (!isRunningRef.current || runTokenRef.current !== token) return;

		const duration = getPhaseDuration(phase);

		for (let count = 1; count <= duration; count += 1) {
			setCurrentCount(count);
			callbacksRef.current.onCount?.(count);

			const shouldContinue = await waitOneSecond(token);
			if (!shouldContinue) return;

			setElapsedSeconds((prev) => Math.min(prev + 1, totalDurationSeconds));
		}
	}
}
```

Safe-modification notes:
- Keep `onBeforePhaseStart` before count loop to preserve instruction-gated phase behavior.
- Keep token checks after pause/await boundaries to prevent stale async continuation.

Regression risks:
- Removing token checks can cause ghost timers after screen transitions.

### C) Session Stage Orchestration (Intro -> Countdown -> Breathing)
Why this matters:
- Explains when engine starts and how intro/countdown are separated from active breathing.

Source:
- `src/components/BreathingSession.jsx`

```jsx
const [sessionPhase, setSessionPhase] = useState('intro'); // 'intro' | 'countdown' | 'breathing'

useEffect(() => {
	if (sessionPhase === 'intro' && !introPlayedRef.current && settings.voiceEnabled) {
		introPlayedRef.current = true;
		audio.playIntro().then(() => setSessionPhase('countdown')).catch(() => setSessionPhase('countdown'));
	} else if (sessionPhase === 'intro' && !settings.voiceEnabled) {
		setSessionPhase('countdown');
	}
}, [sessionPhase, settings.voiceEnabled, audio]);

useEffect(() => {
	if (sessionPhase !== 'countdown') return;
	if (countdown > 0) {
		const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}
	setSessionPhase('breathing');
}, [sessionPhase, countdown]);

useEffect(() => {
	if (sessionPhase === 'breathing') {
		engine.start();
	}
	return () => {
		if (sessionPhase === 'breathing') {
			engine.end();
			audio.stopTick();
			audio.stopAmbient();
		}
	};
}, [sessionPhase]);
```

Safe-modification notes:
- Keep countdown and engine lifecycle in separate effects.
- Only start engine in `breathing` phase.

Regression risks:
- Coupling countdown cleanup with engine start can prematurely end sessions.

### D) Audio Layering and Voice Priority
Why this matters:
- Documents the recent bugfix behavior: phase voice must get priority over ambient during phase transitions.

Source:
- `src/components/BreathingSession.jsx`

```jsx
const engine = useBreathingEngine(settings, {
	onBeforePhaseStart: async (phase) => {
		if (settings.voiceEnabled) {
			await audio.playPhase(phase);
		}

		if (settings.soundEnabled) {
			audio.startAmbient();
		}
	},
	onCount: () => {
		if (settings.soundEnabled) {
			audio.playTick();
		}
	},
	onResume: () => {
		audio.resumeVoice();
		if (settings.soundEnabled) {
			audio.resumeAmbient();
		}
	},
});
```

Safe-modification notes:
- Preserve voice-first ordering in `onBeforePhaseStart` and `onResume`.

Regression risks:
- Ambient-first ordering can cause missed phase prompts on stricter mobile autoplay/focus behavior.

### E) Audio Asset Contract
Why this matters:
- This defines all expected media paths used by runtime audio calls.

Source:
- `src/utils/audioAssets.js`

```js
export const audioAssets = {
	intro: { welcome: '/assets/audio/intro/welcome.mp3' },
	phases: {
		inhale: '/assets/audio/phases/inhale.mp3',
		hold: '/assets/audio/phases/hold.mp3',
		exhale: '/assets/audio/phases/exhale.mp3',
	},
	ticks: { tick: '/assets/audio/ticks/tick.mp3' },
	ambient: { background: '/assets/audio/ambient/ambient.mp3' },
	ui: {
		complete: '/assets/audio/ui/complete.mp3',
		chime: '/assets/audio/ui/chime.mp3',
	},
};
```

Safe-modification notes:
- Keep this map as the single source for asset URLs.

Regression risks:
- Path mismatches silently disable corresponding audio events.

### F) Storage Schema + Normalization
Why this matters:
- This protects app stability against malformed or stale localStorage payloads.

Source:
- `src/utils/storage.js`

```js
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
```

Safe-modification notes:
- Maintain clamp ranges and boolean fallback behavior.

Regression risks:
- Missing boolean fallback can unintentionally disable audio for existing users.
- Missing default containers can cause null-shape runtime errors in Home/Presets integrations.

### G) Preset Data Contract
Why this matters:
- This is the canonical structure consumed by presets UI and setup application logic.

Source:
- `src/data/presets.js`

```js
export const presets = [
	{
		id: 'calm',
		name: 'Calm',
		pattern: '4-4-6',
		inhaleSeconds: 4,
		holdSeconds: 4,
		exhaleSeconds: 6,
		description: 'Longer exhales to calm your nervous system',
		color: 'blue',
	},
	// ... focus, sleep, beginner, balance
];
```

Safe-modification notes:
- Keep field names stable (`inhaleSeconds`, `holdSeconds`, `exhaleSeconds`) to avoid setup mapping breaks.

Regression risks:
- Inconsistent preset shape causes silent fallback or incomplete setup prefill.
