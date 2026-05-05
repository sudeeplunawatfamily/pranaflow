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

## UI Enhancement Tasks

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

## Docker / Infrastructure Fix (done by Claude Code, 2026-05-03)

- [x] I01: Fix browser caching of audio files — split nginx.conf cache rules: JS/CSS get `immutable` (1 year), images get 7-day non-immutable, audio gets 1-hour `must-revalidate` so swapped mp3s are picked up after a rebuild + cache clear.

Notes:
- S01–S05 complete: All session screen improvements applied to BreathingSession.jsx; ambient volume updated in useAudioGuide.js.
- I01 complete: docker/nginx.conf updated; requires `docker compose up --build` + "Clear site data" in browser DevTools on first deploy after change.

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

## Documentation Tasks

- [x] D01: Add detailed decorative background system guidance to planning and Copilot instructions.
- [x] D02: Create root README with setup, scripts, mobile LAN run instructions, and Docker notes.
- [x] D03: Add executable Docker setup files (prod and optional dev variants) and align README commands.

Notes:
- D01 complete: Added a detailed decorative background system spec covering halo glow, leaves, sparkles, waves, bottom lotus, layering, and screen-specific usage to both planning and Copilot instructions.
- D02 complete: Added README.md with project overview, prerequisites, run/build commands, localStorage/audio behavior, mobile-on-LAN testing, and Windows Docker guidance.
- D03 complete: Added Dockerfile, Dockerfile.dev, docker-compose.yml, docker-compose.dev.yml, .dockerignore, docker/nginx.conf, and updated README with executable Docker commands.

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
