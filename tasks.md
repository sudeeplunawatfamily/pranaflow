# Tasks

## Assistant Working Rules

- Always read `.github/copilot-instructions.md` first.
- Always refer to `planning.md` before implementation.
- Always update this `tasks.md` file once a task is complete.
- Add newly discovered bugs, subtasks, and follow-ups here.
- Mark completed tasks with `[x]`.

## Active Implementation Tasks

- [x] T01: Verify asset folders and file paths from planning.
- [x] T02: Scaffold Vite + React app in current workspace.
- [x] T03: Install and configure Tailwind CSS.
- [x] T04: Install Framer Motion and lucide-react.
- [x] T05: Create base app shell and mobile-first global styles.
- [x] T06: Build Home screen static UI.
- [x] T07: Build Setup screen static UI with working sliders/settings controls.
- [x] T08: Build Presets screen static UI and preset selection behavior.
- [x] T09: Build Session screen static UI with phase variants.
- [x] T10: Implement breathing engine hook and session timer flow.
- [x] T11: Add pause/resume/end behavior and cleanup.
- [x] T12: Build Completion screen with duration summary and mood selection.
- [x] T13: Add localStorage persistence for settings and completed sessions.
- [x] T14: Implement useAudioGuide with pre-generated audio assets.
- [x] T15: Add animation polish, responsiveness, and accessibility checks.
- [x] T16: Refactor audio + timer flow to support independent voice, tick, and ambient layers with instruction-gated phase timing.

## In Progress

- [x] All currently tracked tasks completed.

## UI/UX Redesign Tasks

- [x] T34: Implement mobile-first redesign of Setup screen ("Set your breathing rhythm").
  - Created `TimingStepperCard.jsx` component (vertical +/− stepper replacing sliders).
  - Created `BreathingMethodSelector.jsx` component (Custom vs Box Breathing toggle).
  - Refactored `BreathingSetup.jsx` with new layout structure.
  - Moved Box Breathing control from settings panel to top method selector.
  - Updated rounds to use 5-step increment logic (1→5→10→15→20).
  - Simplified settings section to show only Voice Guidance and Ambient Sound (OM default preserved).
  - Ensured full theme compatibility (dark/light modes).
  - Verified all seven use cases (Custom, Box Breathing, editing, rounds, audio, save/load, session start).
  - All existing breathing engine, audio, and persistence behavior preserved.
- [x] T35: Replace pill-style audio toggles with compact circular button toggles.
  - Converted Voice Guidance and Ambient Sound from h-7 w-12 pills to h-10 w-10 circular buttons.
  - Buttons fill with phase colors when active (#60A5FA for Voice, #22D3EE for Sound).
  - Show icons inside circles (Volume2 and Music).
  - Displays label text below each button ("Voice" and "Sound").
  - Theme-aware (respects dark/light mode color schemes).
  - Saves significant vertical space on setup screen.
  - Maintains all existing audio functionality and state management.
- [x] T36: Implement all 12 UI enhancement suggestions for Setup screen.
  - Suggestion 1: Enhanced Rhythm Pill with gradient overlay and glow effects (theme-aware shadows).
  - Suggestion 2: Added animated pattern indicator showing "Calm", "Balanced", or "Energizing" based on rhythm.
  - Suggestion 3: Added visual section dividers (6 divider lines) for better hierarchy.
  - Suggestion 4: Added micro-animations to Timing Stepper Cards (hover scale, button glow).
  - Suggestion 5: Added breathing animation pulse to character illustration (scale breathing effect).
  - Suggestion 6: Enhanced Rounds control with progress bar visualization (fills 0-100% for rounds 1-20).
  - Suggestion 7: Added helpful tooltip hints ("Tap ± to adjust" on first card).
  - Suggestion 8: Improved audio toggle visibility with larger buttons (h-11 w-11), On/Off status text, hover effects.
  - Suggestion 9: Added Duration Breakdown Card showing per-round time, total breaths, total session time.
  - Suggestion 10: Theme-specific enhancements (stronger glow in dark mode, softer shadows in light mode).
  - Suggestion 11: Improved CTA layout (Begin Session h-56 with stronger shadow, Save Rhythm as secondary).
  - Suggestion 12: Added Session Preview/Summary Pill showing exact rhythm pattern and confirmation message.
  - All enhancements are fully theme-aware and work in both dark/light modes.
  - Build verified: No TypeScript/JSX errors.
  - No breaking changes to other app screens or functionality.

- [x] T37: Add holdEnabled — toggleable Hold phase via Hold card tap.
  - Added `holdEnabled: true` to `defaultSettings` and `normalizeSettings` (backward-compat: missing = true).
  - `TimingStepperCard` now accepts `isHoldCard`, `holdEnabled`, `onToggleHold`, `isBoxBreathing` props.
    - Tapping card body toggles hold when `isHoldCard && !isBoxBreathing`.
    - +/− buttons use `e.stopPropagation()` so they don't toggle the card.
    - Disabled state: muted glass bg, no glow, shows "OFF" value, hides +/− buttons.
  - `BreathingSetup` wires holdEnabled toggle; forces holdEnabled=true when box breathing turns ON.
  - Rhythm pill, pattern text, per-round time, total breaths, and session time all exclude Hold when disabled.
  - `useBreathingEngine` builds conditional phase cycle: [inhale, (hold?), exhale, (box-hold?)].
  - `totalDurationSeconds` excludes hold duration when holdEnabled is false.
  - All existing presets updated with `holdEnabled: true, boxBreathing: false`.
  - Two new no-hold presets added: Flow (5-5) and Coherent (5-5) with holdEnabled: false.
  - `App.jsx` onSelectPreset applies holdEnabled + boxBreathing from preset; saveRhythm persists holdEnabled.
  - PresetsScreen icon/color maps extended for flow (Wind/green) and coherent (Zap/indigo).
  - Build verified: ✓ 1971 modules transformed, no errors.

## Run Tasks

- [x] R01: Start local dev server (`npm run dev`).
- [x] R02: Stop local dev server.
- [x] R03: Start local dev server again after bugfix.

## Bug Fix Tasks

- [x] B01: Fix session completion transition after final round.
- [x] B02: Center session phase pill/icons to match PF_screen4 reference.
- [x] B03: Reduce vertical overflow so primary screens fit on mobile without scrolling.
- [x] B04: Fix completion routing when `crypto.randomUUID` is unavailable on some browsers/devices.
- [x] B05: Fix completion audio being cut off when navigating from session to completion screen.
- [x] B06: Ensure settings normalization uses default booleans when persisted toggle fields are missing.
- [x] B07: Align README/planning audio documentation with current intro/phases/ticks/ambient audio architecture.
- [x] B08: Move intro audio playback to countdown phase (plays during 3-2-1 "Get ready") instead of gating session start behind it.
- [x] B09: Fix breathing engine stopping immediately after starting during countdown→breathing transition.
- [x] B10: Sync count number animation with tick sound (reduce animation duration).
- [x] B11: Fix image asset path casing so character images render on case-sensitive paths.
- [x] B12: Make timing-card tap targets visually obvious so users know the duration value is interactive.
- [x] B13: Remove redundant "seconds" helper text from timing cards to reduce visual clutter.
- [x] B14: Add subtle corner mandala ornaments to the home screen background for first-pass review (later reverted per feedback).
- [x] B15: Add `.gitignore` and untrack committed dependency/build/system artifacts (`node_modules`, `dist`, `.DS_Store`).
- [x] B16: Fix phase voice prompts not playing after countdown until manual pause/resume.
- [x] B17: Enforce strict session-scoped audio so all audio stops immediately outside session flow.
- [x] B18: Fix ambient audio race on End and polish intro Skip control styling.
- [x] B19: Stabilize intro welcome flow so fast intro-audio failure does not instantly skip the welcome screen.
- [x] B20: Prevent strict-mode cleanup from cutting intro audio on welcome screen mount.
- [x] B21: Restore voice-guidance reliability with one-time retry for intro and phase prompts.
- [x] B22: Decouple intro audio from voice guidance and ambient controls.
- [x] B23: Improve voice-guidance playback reliability by priming audio on Begin Session user tap.
- [x] B24: Add watchdog timeouts for intro and phase voice waits so session flow never stalls on missing audio end events.
- [x] B25: Fix intro replay/stall regression by simplifying intro playback to single-run with watchdog transition.
- [x] B26: Refactor phase voice guidance to direct-start playback path (no end-event dependency).
- [x] B27: Fix strict-mode session-active flag regression that disabled phase voice callbacks.
- [x] B28: Restore phase voice gating so each phase timer starts after its voice prompt finishes.
- [x] B29: Replace header help action with compact Day/Night icon toggle in the top-right corner.
- [x] B30: Add the same compact Day/Night icon toggle to the Home screen top-right corner.
- [x] B31: Remove dark-mode hardcoded surfaces from session phase timer/progress pills in Day theme.
- [x] B32: Remove dark-mode hardcoded surfaces/shadows from Completion screen in Day theme.
- [x] B33: Differentiate halo effects between Day and Night themes across shared character backdrops.
- [x] B34: Start phase timer at midpoint of phase voice guidance instead of waiting for full prompt completion.
- [x] B35: Improve iPhone/Safari phase voice reliability by ducking ambient during phase prompts and applying iOS-friendly Audio element flags.
- [x] B36: Fix stale UI updates on Vercel by removing immutable caching from non-hashed public image/icon assets.
- [x] B37: Harden iPhone phase voice playback by reusing a persistent voice audio element and adding internal replay retry.

Notes:
- B01 complete: Session completion now triggers from explicit final-round completion state in the breathing engine instead of depending on elapsed-time threshold matching.
- B02 complete: Wrapped phase pill in a centered flex container on the session screen so inhale/hold/exhale indicator sits at screen center.
- B03 complete: Tightened shell padding, reduced vertical spacing, scaled hero/pose art and typography, and anchored action groups with `mt-auto` so primary screens fit mobile viewports more cleanly.
- B04 complete: Replaced direct `crypto.randomUUID()` usage with a safe `createSessionId()` helper that falls back to timestamp/random IDs when `crypto.randomUUID` is unavailable, preventing completion callback failures on unsupported environments.
- B05 complete: Changed session unmount cleanup to stop only tick and ambient layers so `complete.mp3` can continue playing across the session-to-completion screen transition.
- B06 complete: `normalizeSettings` now falls back to default `voiceEnabled`/`soundEnabled` values when stored data omits these keys, preventing unintended audio toggles turning off.
- B07 complete: Updated README and planning audio sections to document intro/ticks/ambient/phases/ui structure used by the current implementation.
- B08 complete: Refactored session flow to: intro screen (listen to audio) → countdown screen (3-2-1 Get ready) → breathing engine. Intro and countdown are now separate distinct phases instead of overlapping. Uses sessionPhase state ('intro' | 'countdown' | 'breathing') to manage transitions. If voiceEnabled is false, intro screen is skipped. Intro screen shows animated lotus icon with welcome message and quote: "Breathe is life, let's master it".
- B09 complete: Fixed breathing engine stopping immediately after starting. Separated countdown effect from engine start/end logic: countdown effect only manages 3-2-1 ticker and transitions to 'breathing' phase; separate effect handles engine.start() on 'breathing' phase entry and engine.end() on phase exit. Prevents cleanup function from killing engine during countdown→breathing transition.
- B10 complete: Synced count number animation with tick sound. Reduced count pulse animation duration from 0.28s (was too slow) to 0.08s so the visual update happens almost instantly when tick sound plays. Now perfectly synchronized.
- B11 complete: Fixed image path casing mismatches across HomeScreen, BreathingSetup, PresetsScreen, CompletionScreen, and phaseConfig. The actual files in public/assets/images use capitalized names (`Inhale_pose.png`, `Hold_pose.png`, `Exhale_pose.png`), so lowercase paths failed on case-sensitive asset resolution.
- B12 complete: Styled each timing value as a tinted bordered control with a subtle plus-icon cue so the increment-on-tap behavior is visually discoverable without adding heavy instructional text.
- B13 complete: Removed the small "seconds" label under each timing slider card because the large value already includes the `s` suffix and the extra unit text added unnecessary clutter.
- B14 complete: Added cropped mandala line art to the upper-right and lower-left corners of the home screen for review, then removed it per feedback (current state: no mandala on home screen).
- B15 complete: Added root `.gitignore` and removed previously tracked `node_modules`, `dist`, and `.DS_Store` files from Git index so future commits stay clean and lightweight.
- B16 complete: Reordered session audio lifecycle so phase voice prompts run before ambient start/resume; this avoids initial phase voice playback being blocked on stricter mobile audio focus/autoplay behavior immediately after countdown.
- B17 complete: Added a global audio stop guard tied to app screen state so any transition away from the session screen (Back/Home/End/Completion) immediately stops voice, tick, and ambient audio with no carry-over.
- B18 complete: Added a session-flow active guard in `BreathingSession` so pending async phase callbacks cannot restart ambient after End/navigation; refreshed intro Skip button to a compact gradient pill with stronger visual affordance.
- B19 complete: Added a minimum intro display window and guarded delayed transition to countdown so the welcome screen remains visible and no longer disappears immediately when intro audio resolves/fails too quickly.
- B20 complete: Removed session mount/unmount audio-stop cleanup in `BreathingSession` (which fired during React dev strict-mode remount), preserving intro playback while keeping explicit exit/completion/app-level non-session audio stops.
- B21 complete: Added one-time retry logic for intro and per-phase voice clips when `Audio.play()` returns transient failures (`play-failed`, `runtime-error`, `error`) so guidance is more resilient across browser audio-focus/autoplay edge cases.
- B22 complete: Added an independent intro audio channel in `useAudioGuide`, made intro flow independent of voice/sound toggles, and changed intro Skip to stop only intro audio while phase guidance remains controlled by Voice Guidance toggle and ambient/tick by Sound toggle.
- B23 complete: Added a muted audio prime on Begin Session (same user gesture) to unlock browser audio playback for intro and phase voice prompts on stricter autoplay-policy environments; also fixed `useAudioGuide` channel callback dependencies to avoid stale closure issues.
- B24 complete: Wrapped intro and phase voice awaits with timeout guards plus one retry so countdown and breathing progression continue even if an audio `onended` signal never arrives; this fixes cases where intro appears finished but countdown does not auto-advance.

## Feature Implementation Tasks

- [x] F01: Implement Box Breathing MVP on Custom Breathing Setup screen.
  - Added `boxBreathing: false` state to defaultSettings in storage.js
  - Updated `normalizeSettings()` to handle boxBreathing boolean
  - Updated `useBreathingEngine` to conditionally add second 4s hold phase after exhale
  - Modified phase cycle generation in engine start() to include: `phases.push({ phase: 'hold', duration: 4 })` when boxBreathing is true
  - Updated totalDurationSeconds calculation to include extra 4 seconds per round when boxBreathing is enabled: `rounds * (cycleTime + extraBoxHold)`
  - Added Box Breathing toggle in BreathingSetup settings card between Rounds and Voice Guidance (uses Repeat2 icon)
  - Updated pattern preview bar to show the 4-second hold segment when boxBreathing is ON
  - Second hold phase reuses existing hold phase key ('hold') and visual/audio behavior
  - Completion screen correctly displays total time including the extra 4 seconds per round
  - All existing functionality remains unchanged when boxBreathing is OFF (default)
- B25 complete: Removed intro replay-on-timeout behavior and stabilized transition cleanup/dependencies in `BreathingSession`, preventing intro infinite-loop behavior and restoring automatic intro -> countdown progression.
- B26 complete: Updated `useAudioGuide.playPhase()` to a direct playback path that returns on successful start instead of waiting on `ended`, and aligned session phase-start logic with immediate guidance playback plus one retry.
- B27 complete: Updated `BreathingSession` mount/unmount effect to set `sessionFlowActiveRef.current = true` on setup (not cleanup only), preventing strict-mode remount behavior from leaving the flag stuck false and silently bypassing phase voice playback.
- B28 complete: Reverted `useAudioGuide.playPhase()` to end-aware voice playback (`playVoice`) so `useBreathingEngine` waits for phase prompt completion before beginning per-second counts/ticks.
- B29 complete: Moved Day/Night control to the top-right header slot (replacing Help icon) and removed the older larger Home-screen toggle pill.
- B30 complete: Added a matching compact top-right Day/Night icon on Home and wired it to the shared persisted theme toggle handler.
- B31 complete: Replaced hardcoded slate session timer/progress surfaces (`#334155` tracks and inactive pips) with day/night-aware values and softened Day-mode progress card shadow.
- B32 complete: Replaced Completion screen hardcoded dark card/icon/mood/home-button surfaces with day/night-aware values and wired Completion to use the shared `theme` prop.
- B34 complete: Updated `useAudioGuide.playPhase()` to resolve phase gating at halfway playback with a watchdog fallback, so the breathing count starts mid-prompt while keeping intro audio end-based.
- B35 complete: Updated `BreathingSession.onBeforePhaseStart` to pause ambient before phase voice playback and restart ambient afterward; added `preload='auto'` and `playsinline` flags on app audio elements in `useAudioGuide` to reduce iOS playback inconsistencies across phase transitions.
- B36 complete: Updated `vercel.json` cache headers to keep immutable caching only for `/assets/*.js|*.css`, while `/assets/*` images/icons now use short `must-revalidate` caching so UI asset changes appear without hard refresh.
- B37 complete: Updated `useAudioGuide` voice channel to reuse one persistent `Audio` element across phase transitions (instead of creating a new element each phase) and added a short internal replay retry after reload when `play()` fails, improving Safari/iPhone phase prompt continuity.

## Audio Feature Tasks

- [x] A01: Add procedural ocean breath guide sounds that dynamically match each phase duration.
  - Created `src/utils/breathGuideAudio.js` with Web Audio API noise generation.
  - Routes through `Howler.ctx` / `Howler.masterGain` — same AudioContext as voice/ambient.
  - Inhale arc: 450 Hz → 2200 Hz (at 80%) → 1600 Hz — low → high → lower-high brightness.
  - Exhale arc: 1500 Hz → 2100 Hz (at 25%) → 350 Hz — higher-low → high → low brightness.
  - Hold phases are silent (intentional — avoids rushing-feeling during hold).
  - Duration always sourced from actual phase timer (never hardcoded).
  - Added `playBreathGuide`, `stopBreathGuide`, `pauseBreathGuide`, `resumeBreathGuide` exports to `audioManager.js`.
  - Integrated into `BreathingSession.jsx`: starts on count=1, pauses on pause, resumes for remaining duration, stops on exit/complete/unmount.
  - Added `breathGuideMode: 'ocean'` setting to `storage.js` defaults and normalization.
  - Added "Guide" circular toggle button to `BreathingSetup.jsx` (green when on, matches Voice/Sound style).
  - Build verified: no errors, 2.15s clean build.

## UI Enhancement Tasks
- [x] F01: Implement reliable session audio using Howler.js with per-second wooden tick sounds.

Notes:
- F01 complete: Installed Howler.js dependency. Created `src/utils/audioManager.js` with Howler.js-based tick playback. Integrated audioManager into BreathingSession to play regular tick each second, final/high-pitched tick on the last second of each phase. Audio initializes on Begin Session and unlocks browser audio context for mobile. Sound toggle enables/disables tick playback. Audio stops completely when exiting session (Back/End/Navigation). Audio file: `/public/sounds/wood-tick.mp3` (0.25 volume regular, 0.35 volume final at 1.18x playback rate). Build validates successfully.
- [x] U01: Add decorative leaf-sketch background and stronger white hue behind character images.
- [x] U02: Increase white hue intensity directly behind PNG character images.
- [x] U03: Increase white hue brightness one more level.
- [x] U04: Make the glow core pure white.
- [x] U05: Rework decorative backdrop to match flatter screenshot style using CSS/SVG shapes.
- [x] U06: Redesign leaves, waves, and bottom lotus decoration to better match screenshots.
- [x] U07: Reduce all app button sizes by approximately 15%.
- [x] U08: Further compact Custom Setup screen layout so it fits mobile heights with minimal/no scrolling.
- [x] U09: Rebalance Custom Setup vertical distribution to avoid top cramming and lower empty space.
- [x] U10: Center-distribute Custom Setup content area on normal heights while preserving fit on shorter screens.
- [x] U11: Widen setup rhythm preview bar and increase spacing between setup content sections.
- [x] U12: Apply Night Calm visual theme overhaul across app surfaces, accents, and controls.
- [x] U13: Add persisted Day/Night theme toggle from Home screen.

## Visual Polish — Reference Matching (done by Claude Code)

- [x] VP01: Stack home screen logo centered above title (was inline/horizontal).
- [x] VP02: Enlarge home screen CharacterBackdrop glow (`h-64→h-72`) and pose image (`w-280px→w-300px`) to better match reference proportions.
- [x] VP03: Fix setup screen CharacterBackdrop halo bleeding over rhythm preview pill — replaced shared CharacterBackdrop with a self-contained inline radial glow div so bleed is impossible.
- [x] VP04: Fix session screen round badge to show current round number instead of countdown tick value.
- [x] VP05: Fix session round badge border to use full phase color (was 40% opacity).
- [x] VP06: Change completion screen mood grid from 2×2 to a single 4-column row with each mood showing icon above label.
- [x] VP07: Highlight rounds count in blue on completion screen ("You completed **5** rounds.").
- [x] VP08: Add per-mood colors to completion screen mood items (blue/teal/purple/orange).
- [x] VP09: Raise CharacterBackdrop leaf opacity from 0.32 to 0.55 for better visibility.
- [x] VP10: Recreate leaf decorations as a proper SVG file (`/public/assets/icons/leaf_cluster.svg`) using bezier-curve leaf shapes instead of rotated ellipses; update CharacterBackdrop to reference the file via `<img>` tags.
- [x] VP11: Fix CharacterBackdrop halo/leaves overflowing upward and hiding text above — reduced primary disc scale (1.30→1.15) and outer ring scale (1.68→1.20) with increased blur (14px→22px) so gradient fades to transparent before reaching container boundary; moved leaf vertical position from `bottom-14` to `bottom-8`; added `relative z-[1]` to all content sitting above CharacterBackdrop in HomeScreen, PresetsScreen, CompletionScreen, and BreathingSession.
- [x] VP12: Remove `overflow-hidden` from CharacterBackdrop root — it clipped the radial gradient mid-fade creating a visible hard-edged rectangle; z-index approach is used instead to protect text.

Notes:
- VP01–VP12 complete: All changes made by Claude Code in session dated 2026-05-03, comparing `/public/reference/actual_screenshots/` against `/public/reference/screens/` reference images.

## Design Beautification Tasks (done by Claude Code, 2026-05-03)

- [x] B06: Add animated breathing ring that expands/contracts with inhale/hold/exhale phases (BreathingSession.jsx).
- [x] B07: Add phase-tinted background — AppShell gradient `to-` color shifts to the current phase color during session (AppShell.jsx, App.jsx).
- [x] B08: Pulse countdown number on each tick using Framer Motion key-based animation (BreathingSession.jsx).
- [x] B09: Enlarge phase pill — tinted background, bigger icon and text, spring bounce entrance on phase change (BreathingSession.jsx).
- [x] B10: Custom slider thumbs — larger (20px), white border, drop shadow, per-phase color via CSS variable (index.css, BreathingSetup.jsx).
- [x] B11: Add colored left-border accent to each preset card (PresetsScreen.jsx).
- [x] B12: Add glow box-shadow to progress bar fill using phase color (BreathingSession.jsx).
- [x] B13: Add Comfortaa display font for main headings and countdown number (index.css, HomeScreen, BreathingSetup, PresetsScreen, CompletionScreen, BreathingSession).
- [x] B14: Enhance primary button gradient (deeper blue to sky blue) and add lift on hover (PrimaryButton.jsx).
- [x] B15: Completion ceremony — 12 colored sparkle orbs burst upward from character area on screen mount (CompletionScreen.jsx).
- [x] B16: Mood button spring-bounce animation on selection (CompletionScreen.jsx).

## Session UI & Audio Tweaks (done by Claude Code, 2026-05-03)

- [x] S01: Align breathing ring neutral size (294px) with CharacterBackdrop halo (h-64 × scale(1.15) ≈ 294px) so ring and halo are visually the same diameter at rest.
- [x] S02: Center session content vertically — wrap character, phase pill, countdown, and instruction in a `flex-1 justify-center` block so dead space is distributed evenly above and below instead of pooling at the bottom.
- [x] S03: Beautify session progress area — wrap in soft white card with shadow, add phase-colored glow ring to round badge, add "Rnd" label inside badge, make progress bar taller (8px) with gradient fill, add round pip dots below bar (shown when rounds ≤ 10).
- [x] S04: Increase session character image size from 280px to 310px (backdrop unchanged).
- [x] S05: Raise ambient audio volume from 0.18 to 0.27.
- [x] S06: Increase Howler-based session tick volume so regular and final ticks are easier to hear.

## Docker / Infrastructure Fix (done by Claude Code, 2026-05-03)

- [x] I01: Fix browser caching of audio files — split nginx.conf cache rules: JS/CSS get `immutable` (1 year), images get 7-day non-immutable, audio gets 1-hour `must-revalidate` so swapped mp3s are picked up after a rebuild + cache clear.
- [x] I02: Prevent stale app updates on mobile by disabling cache for HTML app shell documents (`index.html` and other `.html` paths) so new hashed bundles are discovered on launch.
- [x] I03: Add equivalent Vercel cache-header rules in `vercel.json` so HTML is never cached and release updates show on phones without hard refresh.

Notes:
- S01–S05 complete: All session screen improvements applied to BreathingSession.jsx; ambient volume updated in useAudioGuide.js.
- S06 complete: Increased centralized Howler tick volume defaults in audioManager.js; final tick remains louder than the regular tick.
- I01 complete: docker/nginx.conf updated; requires `docker compose up --build` + "Clear site data" in browser DevTools on first deploy after change.
- I02 complete: Updated nginx cache headers for HTML documents to `no-store/no-cache/must-revalidate` while preserving aggressive caching for hashed JS/CSS, so existing mobile users pick up new releases without manual hard refresh.
- I03 complete: Added `vercel.json` header rules: HTML (`/`, `/index.html`, `/*.html`) set to no-store/no-cache; hashed `/assets/*` immutable cache; audio (`/assets/audio/*`, `/sounds/*`) short revalidation cache.

## Improvement Tasks (Session 2)

- [x] I01: Add 3-2-1 countdown before session starts with "Get ready" screen.
- [x] I02: Show estimated total session duration (e.g., ~3 min 45 sec) below Begin Session button.
- [x] I03: Replace text rhythm preview with proportional segmented bar (width = phase duration).
- [x] I04: Add rhythm stats row to completion screen (shows inhale/hold/exhale pattern + rounds).
- [x] I05: Add last session summary tag on Home screen (time, rounds, mood).
- [x] I06: Make timing card values tappable to increment (1-10 wraps to 1).
- [x] I07: Simplify session phase display (remove bouncy pill, show minimal icon + label).
- [x] I08: Update Repeat Session button to show rhythm pattern in two lines.
- [x] I09: Add guard to useBreathingEngine.start() to prevent double-start.
- [x] I10: Add eslint-disable comments to countdown useEffect explaining stable-ref deps.

Notes:
- I01-I08 complete: All UX/feature enhancements applied across HomeScreen, BreathingSetup, BreathingSession, CompletionScreen.
- I09-I10 complete: Code quality improvements in useBreathingEngine.js and BreathingSession.jsx.
- Build passes cleanly with all changes integrated.

## Design Follow-up Tasks

- [x] DF01: Home screen hierarchy pass — tighten top branding area, strengthen headline/subtitle relationship, and move last-session summary closer to the CTA region.
- [x] DF02: Home hero grounding — add a soft visual base/stage under the character so the pose feels anchored rather than floating.
- [x] DF03: Home CTA differentiation — increase visual separation between primary and secondary actions so "Start Custom Breathing" remains the dominant path.
- [x] DF11: Increase home brand focus by enlarging "PranaFlow" title and shifting downstream hero content lower.
- [ ] DF04: Setup screen restructuring — make the rhythm preview the primary focal element and reduce the pose art interruption between preview and controls.
- [ ] DF05: Setup timing card simplification — increase emphasis on the selected duration values and reduce secondary text clutter inside the three phase cards.
- [ ] DF06: Setup settings hierarchy — make rounds visually more important than voice/sound toggles and introduce a clearer section break for session options.
- [ ] DF07: Presets hero compression — reduce top hero height so the first preset cards appear sooner on mobile screens.
- [ ] DF08: Preset card personality pass — add subtle color-wash treatment and convert preset patterns into clearer visual badges.
- [ ] DF09: Shared spacing/card system pass — normalize vertical rhythm, card shadows, border treatment, and chip styling across home/setup/presets.
- [ ] DF10: Shared signature motif — introduce one recurring PranaFlow visual motif beyond the halo glow (for example a soft breath ribbon or wave band) across primary screens.

Notes:
- DF01-DF10 added from 2026-05-05 design review of current home, setup, and presets screens. These are follow-up visual/product-polish tasks, not regressions.
- DF01-DF03 complete: Home screen now uses a tighter brand block, a stronger two-line hero headline, a softer supporting paragraph, last-session/trust messaging near the CTA stack, a soft stage under the character, and a clearer primary-versus-secondary action split with an "or" divider.
- Home screen follow-up: Simplified the hero layout into a stable centered block after the first pass caused a layout regression; kept the new hierarchy/CTA treatment while removing the riskier absolute hero grounding structure.
- DF11 complete: Increased "PranaFlow" heading size (`36px` -> `44px`) and added extra vertical spacing before subheading/hero content so the brand lockup remains the primary focal point.

## Scope Addendum Tasks (May 2026)

- [x] SA01: Add/verify critical phase breathing animation behavior in session (expand-hold-contract clarity).
- [x] SA02: Add dynamic completion insight line based on inhale/exhale balance.
- [x] SA03: Home quick-start direction revised to rely on presets instead of intent chips.
- [x] SA04: Ensure setup estimated duration strictly uses `(inhale + hold + exhale) x rounds`.
- [x] SA05: Update preset descriptions to benefit-led copy (Calm/Focus/Sleep/Beginner/Balance).
- [x] SA06: Apply microcopy updates across screens (home headline, phase text, completion CTA labels).
- [x] SA07: Replace Home last-session summary with rhythm-forward "resume last rhythm" messaging.
- [x] SA08: Add setup dynamic meaning header tied to current rhythm pattern.
- [x] SA09: Add setup mini breathing preview animation that reflects current phase timings.
- [x] SA10: Add "Save Rhythm" flow and persist as "Your Rhythm" preset.
- [x] SA11: Add per-phase progress indicator on session screen (in addition to total progress).
- [x] SA12: Expand completion metrics to include total breaths and rhythm used.
- [x] SA13: Add completion actions for "Repeat this rhythm", "Try deeper version (+1 sec hold)", and "Save this rhythm".
- [x] SA14: Add/confirm local memory persistence for last rhythm, last intent (optional), and voice preference.
- [x] SA15: Add smart Home suggestion module (quick reset or continue last rhythm).

Notes:
- SA01-SA06 follow the explicitly requested priority order.
- SA07-SA15 capture the remaining approved scope additions from the planning addendum.
- Keep explicit non-goals unchanged: no login/signup, no streak tracking, no heavy analytics dashboard, no excessive preset expansion.
- SA01 complete: Breathing session now includes stronger phase-readability via an added animated inner glow layer while preserving expand/hold/contract ring behavior.
- SA02 complete: Completion screen now shows a dynamic insight line derived from inhale/exhale balance and displays total breaths.
- SA03 complete: Removed the intent-chip approach and kept Home focused on custom setup plus presets as the only quick-start paths.
- SA04 complete: Setup estimate already uses `settings.rounds * (inhale + hold + exhale)` and was validated as canonical.
- SA05 complete: Preset descriptions were updated to benefit-led wording for calm/focus/sleep/beginner/balance.
- SA06 complete: Home headline, phase instruction copy, and completion primary CTA label were updated to the approved microcopy direction.
- SA07 complete: Home now displays rhythm-forward resume copy in the format "Inhale-Hold-Exhale (x-y-z)".
- SA08 complete: Setup now shows a dynamic meaning header that adapts to inhale/exhale balance.
- SA08 refinement: Styled the dynamic meaning header as a tinted insight pill with adaptive icon/color treatment for calming (exhale-heavy), energizing (inhale-heavy), and balanced rhythms.
- SA09 complete: Setup now includes an animated mini breathing preview that cycles inhale->hold->exhale with durations derived from current settings.
- SA09 refinement: Replaced setup character/backdrop area with the improved functional preview (phase label, live countdown, and rhythm chips) so the section is guidance-first instead of decorative.
- SA10 complete: Added Save Rhythm actions; saved custom rhythm is persisted and surfaced in presets as "Your Rhythm".
- SA11 complete: Added a per-phase progress bar in the session content area while preserving total session progress UI.
- SA12 complete: Completion metrics include rhythm details and total breaths count.
- SA13 complete: Completion CTAs now include "Repeat this rhythm", "Try deeper version (+1 sec hold)", and "Save this rhythm" (plus existing navigation actions).
- SA12-SA13 refinement: Completion was intentionally simplified for emotional closure: removed total-breaths and insight line, reduced actions to primary (Breathe again), secondary (Change Rhythm), and tertiary text Home.
- SA13 refinement: Updated tertiary Home action to a compact circular icon button for a cleaner low-emphasis exit control.
- SA14 complete: Added local memory persistence for `lastRhythm`; voice preference remains persisted via settings storage.
- SA15 complete: Home suggestion behavior was simplified further; the extra suggestion line was removed and Home now keeps only the rhythm-forward resume chip when relevant.

## Documentation Tasks

- [x] D01: Add detailed decorative background system guidance to planning and Copilot instructions.
- [x] D02: Create root README with setup, scripts, mobile LAN run instructions, and Docker notes.
- [x] D03: Add executable Docker setup files (prod and optional dev variants) and align README commands.
- [x] D04: Create `detailed_pranaflow.md` as a full project handoff brief for external assistant context.
- [x] D05: Add high-signal code snippet appendix to `detailed_pranaflow.md` for external assistant handoff quality.
- [x] D06: Refresh `detailed_pranaflow.md` to reflect post-scope-addendum implementation state.

Notes:
- D01 complete: Added a detailed decorative background system spec covering halo glow, leaves, sparkles, waves, bottom lotus, layering, and screen-specific usage to both planning and Copilot instructions.
- D02 complete: Added README.md with project overview, prerequisites, run/build commands, localStorage/audio behavior, mobile-on-LAN testing, and Windows Docker guidance.
- D03 complete: Added Dockerfile, Dockerfile.dev, docker-compose.yml, docker-compose.dev.yml, .dockerignore, docker/nginx.conf, and updated README with executable Docker commands.
- D04 complete: Added `detailed_pranaflow.md` documenting architecture, state flow, screen behavior, timer/audio orchestration, storage schema, assets, run commands, and current pending design follow-ups.
- D05 complete: Added a snippet appendix with compact, behavior-critical extracts (routing, breathing loop, intro/countdown orchestration, audio sequencing, storage normalization, and presets contract) plus safe-modification and regression-risk notes.
- D06 complete: Updated `detailed_pranaflow.md` to match current code behavior (intent-chip direct starts, saved rhythm + memory persistence, setup insight pill + character restoration, simplified session ring + phase progress, completion metrics/insight/expanded CTAs).

Notes:
- U01 complete: Added reusable character backdrop with layered white glow, subtle sparkles, and side leaf-sketch SVG elements, applied to Home, Setup, Presets, Session, and Completion screens.
- U02 complete: Increased centered white hue intensity and added a soft white drop-glow directly around PNG character content via shared CharacterBackdrop.
- U03 complete: Expanded and intensified glow layers and raised PNG drop-glow to produce a visibly brighter white hue behind all character images.
- U04 complete: Added an explicit solid white center core and updated radial stops so the center remains pure white.
- U05 complete: Replaced line-art decorative treatment with flatter pale-blue SVG leaf silhouettes, CSS radial halo, sparse SVG sparkles, and subtle bottom waves in shared CharacterBackdrop.
- U06 complete: Refined side leaves to larger soft silhouettes, added layered bottom waves, and introduced a subtle bottom lotus mark using the real lotus SVG asset.
- U07 complete: Reduced global PrimaryButton base height, radius, padding, icon-chip size, and text sizing; scaled all explicit per-screen PrimaryButton height/text overrides by roughly 15%.
- U08 complete: Compressed setup headings, preview pill, timing cards, settings card rows/toggles, and spacing; added a short-height responsive rule to hide the decorative setup character at <=740px height for improved fit.
- U09 complete: Removed forced bottom push on setup CTA, relaxed row spacing, and adjusted short-height hide threshold to <=680px so screen content is more evenly distributed vertically.
- U10 complete: Wrapped setup content in a `flex-1` zone with `justify-center` on normal heights and `justify-start` on <=740px heights; adjusted setup character hide threshold to <=620px so medium/tall screens use vertical space more evenly.
- U11 complete: Expanded rhythm preview bar to full-width centered row and increased vertical spacing between subtitle, preview bar, slider cards, and settings section.
- U12 complete: Reskinned the app to a dark Night Calm palette (#0F172A→#1E293B) while preserving structure/layout; updated shell gradients, cards, text colors, button variants, sliders, phase accents (inhale #60A5FA, hold #A78BFA, exhale #22D3EE), character halo/ambient particles, and luminous progress styling.
- U13 complete: Added a Home-screen theme toggle (Day/Night), persisted the selection in localStorage (`pranaflow_theme`), and wired AppShell/shared controls (Header/PrimaryButton) to react to the selected theme while keeping existing layout/component structure unchanged.

Notes:
- T01 complete: Found `public/assests` (typo) and `public/references` instead of planned `public/assets` and `public/reference`.
- T01 follow-up: Existing image files are `Inhale_pose.png`, `Hold_pose.png`, `Exhale_pose.png` (capitalized first letter). Use normalized paths or map config carefully.
- T01 follow-up: Audio folder is not present yet under public.
- T02-T05 complete: Manual non-interactive Vite scaffold created, dependencies installed, and production build passes.
- Asset normalization complete: Added expected `public/assets` and `public/reference` folders and copied current assets/screens into those paths.
- T06-T08 complete: Home, Setup, and Presets screens are implemented and connected with state navigation and preset-to-setup value mapping.
- T09-T12 complete: Session and Completion screens are integrated; breathing timer runs inhale->hold->exhale across rounds with pause/resume/end and completion routing.
- T13 complete: Settings and completed sessions now persist via localStorage keys `pranaflow_settings` and `pranaflow_sessions`.
- T14 complete: `useAudioGuide` implemented with browser Audio API and integrated into session phase/count/start/complete events with silent-failure behavior.
- T15 complete: Added final accessibility polish (switch semantics, aria state), slider color cues, typography improvements, and verified production build.
- T16 complete: Reworked audio into independent voice/tick/ambient layers, updated audio asset mapping/paths, gated session start and phase timers behind intro/phase voice completion when voice is enabled, aligned tick playback to visible count updates, and added pause/resume/end/complete audio lifecycle handling for all layers.
