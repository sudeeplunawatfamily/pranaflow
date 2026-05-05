# PranaFlow Planning

## Project Overview

PranaFlow is a mobile-first responsive breathing web app focused on calm, guided breathwork.

Core purpose:
- Let users define a custom breathing rhythm with independent inhale, hold, and exhale durations.
- Run a guided breathing session with phase visuals, count-based pacing, optional audio guidance, rounds tracking, and completion summary.

MVP constraints:
- No backend.
- No authentication.
- No database.
- No cloud sync.
- No Browser SpeechSynthesis API.

## Tech Stack

Use:
- React
- Vite
- Tailwind CSS
- Framer Motion
- lucide-react (fallback icons only)
- Browser Audio API (pre-generated audio files)
- localStorage (MVP persistence)

Do not use:
- Browser SpeechSynthesis API
- Server-side APIs for MVP

## Source Files And Asset Locations

Reference-only screenshots:
- /public/reference/screens

Real UI images:
- /public/assets/images/Inhale_pose.png
- /public/assets/images/Hold_pose.png
- /public/assets/images/Exhale_pose.png

Real icons:
- /public/assets/icons
- Prioritize lotus/PranaFlow logo icon where available
- /public/assets/icons/leaf_cluster.svg — SVG file with bezier-curve leaf shapes used by CharacterBackdrop

Audio assets:
- /public/assets/audio/intro/welcome.mp3
- /public/assets/audio/phases/inhale.mp3
- /public/assets/audio/phases/hold.mp3
- /public/assets/audio/phases/exhale.mp3
- /public/assets/audio/ticks/tick.mp3
- /public/assets/audio/ambient/ambient.mp3
- /public/assets/audio/ui/complete.mp3
- /public/assets/audio/ui/chime.mp3

Asset handling rules:
- Screenshots are visual references only.
- Build all screens with real React + Tailwind components.
- Do not place screenshots as full-screen backgrounds.
- Missing audio must fail silently and never break timer/session flow.

## Reference Screens And Required States

Reference images in /public/reference/screens:
- PF_screen1_home.png
- PF_screen2_custom_setup.png
- PF_screen3_presets.png
- PF_screen4_active_inhale.png
- PF_screen5_active_hold.png
- PF_screen6_active_exhale.png
- PF_screen7_completion.png

Required app screens/states:
1. Home (shows last session summary if available)
2. Custom Breathing Setup (proportional bar, tappable values, duration estimate)
3. Recommended Presets
4. Session Countdown (3-2-1 "Get ready" before active session)
5. Active Session (Inhale state)
6. Active Session (Hold state)
7. Active Session (Exhale state)
8. Completion (includes rhythm stats row)

Implementation notes:
- Use one reusable session component for inhale/hold/exhale; swap content by phase.
- Countdown is rendered as a full-screen overlay before engine.start() is called.
- Completion screen displays both total time and the rhythm pattern used.

## Routing And Screen State

Use simple React state navigation unless React Router already exists.

Suggested screen state:
- home
- setup
- presets
- session
- complete

Suggested phase state:
- inhale
- hold
- exhale

Navigation flow:
- Home -> Start Custom Breathing -> Setup
- Home -> Explore Presets -> Presets
- Presets -> Preset click -> Setup (preset values applied)
- Presets -> Create my own rhythm -> Setup
- Setup -> Begin Session -> Session
- Session -> End -> Setup or Home
- Session -> Completed rounds -> Completion
- Completion -> Repeat Session -> Session (same settings)
- Completion -> Change Rhythm -> Setup
- Completion -> Home -> Home

## Product Behavior

Customizable settings:
- inhaleSeconds: 1 to 10 (tappable increments on timing cards)
- holdSeconds: 1 to 10 (tappable increments on timing cards)
- exhaleSeconds: 1 to 10 (tappable increments on timing cards)
- rounds: 1 to 20 (adjustable with ± buttons)
- voiceEnabled: boolean (toggle switch)
- soundEnabled: boolean (toggle switch)

Default settings:
- inhaleSeconds: 4
- holdSeconds: 6
- exhaleSeconds: 5
- rounds: 5
- voiceEnabled: true
- soundEnabled: true

Setup screen shows:
- Proportional rhythm bar with phase-width segments
- Estimated total duration (e.g., ≈ 3 min 45 sec)

Guided session behavior:
1. If voiceEnabled, show intro audio screen with animated lotus icon and welcome message: "Welcome to PranaFlow" + quote "Breathe is life, let's master it". If voiceEnabled is false, skip to step 2.
2. After intro finishes (or immediately if skipped), show 3-2-1 countdown screen ("Get ready") before session starts.
3. Show current phase and corresponding yoga pose.
4. Display visual per-second counting.
5. Optionally play pre-generated phase and count audio.
6. Loop inhale -> hold -> exhale for selected rounds.
7. Show completion summary with rhythm stats when final round ends.

## Breathing Phase Mapping

Defined in `src/utils/phaseConfig.js`. Colors are hex values used directly for inline styles, borders, and CSS variables.

```js
export const phaseConfig = {
  inhale: {
    label: 'Inhale',
    displayLabel: 'Breathe In',
    instruction: 'Breathe in slowly',
    image: '/assets/images/Inhale_pose.png',
    color: '#2487EA',
  },
  hold: {
    label: 'Hold',
    displayLabel: 'Hold',
    instruction: 'Hold gently',
    image: '/assets/images/Hold_pose.png',
    color: '#8755E8',
  },
  exhale: {
    label: 'Exhale',
    displayLabel: 'Breathe Out',
    instruction: 'Breathe out slowly',
    image: '/assets/images/Exhale_pose.png',
    color: '#20B8C4',
  },
};

export const phaseOrder = ['inhale', 'hold', 'exhale'];
```

Audio paths are kept separately in `src/utils/audioAssets.js`, not in phaseConfig.

Pose notes:
- Inhale: seated meditation pose, hands on knees.
- Hold: seated pose, folded hands at chest.
- Exhale: seated pose, folded hands raised above head.

Image rules:
- Always use object-contain.
- Never crop the character.
- Ensure extra top space for exhale so raised hands/halo are visible.

## Audio Mapping And Behavior

Use this mapping:

```js
const audioAssets = {
  intro: {
    welcome: '/assets/audio/intro/welcome.mp3',
  },
  phases: {
    inhale: '/assets/audio/phases/inhale.mp3',
    hold: '/assets/audio/phases/hold.mp3',
    exhale: '/assets/audio/phases/exhale.mp3',
  },
  ticks: {
    tick: '/assets/audio/ticks/tick.mp3',
  },
  ambient: {
    background: '/assets/audio/ambient/ambient.mp3',
  },
  ui: {
    complete: '/assets/audio/ui/complete.mp3',
    chime: '/assets/audio/ui/chime.mp3',
  },
};
```

Audio rules:
- Timer is source of truth.
- Audio follows timer events.
- Audio must never control or delay timer.
- If voiceEnabled is true:
  - Play phase clip at phase start.
  - Play count clip on each visual count.
- Count clips only play up to current phase duration.
- Missing/failed audio should continue silently.

Hook requirement:
- Implement useAudioGuide() with three independent audio layers:
  - **voice layer** — phase instruction clips; async, awaitable
  - **tick layer** — per-second count beeps
  - **ambient layer** — looping background audio

Volume constants (in useAudioGuide.js):
- `VOICE_VOLUME = 0.92`
- `TICK_VOLUME = 0.45`
- `AMBIENT_VOLUME = 0.27`

Exported API:
- `playIntro()` — async, resolves when intro audio ends (or immediately if unavailable); called fire-and-forget during countdown
- `playPhase(phase)` — async, resolves when phase clip ends
- `playTick()` — play current count tick
- `startAmbient()` — begin looping ambient audio
- `pauseAmbient()` / `resumeAmbient()` / `stopAmbient()`
- `pauseVoice()` / `resumeVoice()` / `stopVoice()`
- `stopTick()`
- `playComplete()` — fire-and-forget completion sound
- `stopAllAudio()` — stops all three layers immediately

Session timing rules:
- If voiceEnabled: intro audio plays on its own screen; countdown begins after intro completes.
- If voiceEnabled is false: intro screen is skipped; countdown starts immediately.
- If voiceEnabled: each phase start is gated behind `await playPhase(phase)` before count begins.
- Tick plays on each visual count update when soundEnabled.
- Session unmount stops tick + ambient only; complete.mp3 continues across screen transition.

Implementation requirements:
- Use browser Audio API.
- Track active audio with refs.
- Handle audio.play() promise rejection gracefully (fail silently).
- Stop all audio on pause, end, and unmount.

## Breathing Engine

Hook requirement:
- Implement useBreathingEngine(settings, callbacks)

State shape:
- currentPhase: inhale | hold | exhale
- currentCount: number
- currentRound: number
- isRunning: boolean
- isPaused: boolean
- elapsedSeconds: number
- totalDurationSeconds: number
- phaseDuration: number
- phaseProgress: 0 to 1
- totalProgress: 0 to 1

Phase sequence:

```js
[
  { key: 'inhale', label: 'Inhale', duration: inhaleSeconds },
  { key: 'hold', label: 'Hold', duration: holdSeconds },
  { key: 'exhale', label: 'Exhale', duration: exhaleSeconds },
]
```

Cycle rules:
- Start at inhale.
- Count 1..inhaleSeconds.
- Move to hold, count 1..holdSeconds.
- Move to exhale, count 1..exhaleSeconds.
- After exhale, increment round.
- After final round, complete session.

Timer quality requirements:
- Avoid duplicate active intervals.
- Clear timers on pause/end/complete/unmount.
- Use refs for timer IDs.
- Prevent stale closure bugs.
- Clamp count to valid range.
- Stop timers when leaving session screen.

## Global Layout And Responsiveness

Layout target:
- Mobile-first shell centered on desktop.
- Feels like native phone app in browser.

Outer wrapper:
- min-height: 100vh or 100dvh
- display: flex
- justify-content: center
- light blue/white background

Main shell:
- width: 100%
- max-width: 430px
- min-height: 100dvh
- position: relative
- overflow-x: hidden
- soft blue-white gradient background

Device targets:
- 390 x 844
- 393 x 852
- 430 x 932
- iPhone Safari
- Android Chrome

Spacing/system:
- Page padding: 20px to 24px
- Primary buttons: 56px to 72px
- Tap targets: minimum 44px
- Rounded corners: 20px to 32px
- Avoid horizontal scrolling
- box-sizing: border-box
- overflow-x: hidden

Timing cards responsiveness:
- Use repeat(3, minmax(0, 1fr))
- Gap: 8px to 10px
- Reduce typography on narrow widths
- Do not wrap cards unless width < 340px

## Visual Design System

Visual direction:
- Soft cartoon yoga wellness
- Calm, friendly, clean, lightly spiritual
- Polished mobile-native look
- White/blue gradients, rounded cards, soft shadows, halo glow

Decorative directive:
- The screenshots in `public/reference/screens` are the visual source of truth.
- Recreate decorative leaves, halo glow, sparkles, waves, and bottom lotus mark using CSS/SVG so they match the screenshots.
- Do not use separate generated PNGs for these decorations.

Color tokens:
- primaryBlue: #2487EA
- softBlue: #8CCAF2
- accentBlue: #4CA3D8
- aqua: #20B8C4 (or #18AEB8)
- purple: #8755E8
- orange: #FF8A2A
- dangerRed: #F74D61
- textDark: #071D55
- textMuted: #657899
- background: #F7FBFF
- backgroundLight: #EAF6FF
- cardWhite: #FFFFFF
- softBorder: #D6EAFF
- shadow: 0 12px 30px rgba(36, 135, 234, 0.12)

Typography:
- Display / headings: Comfortaa 700/800 (Google Fonts) — use `font-display` utility class
- Body: Nunito Sans 400/600/700/800
- Import both via Google Fonts in index.css
- `.font-display` class defined in index.css maps to Comfortaa → Nunito fallback
- Headings: 800
- Section titles: 700
- Body: 400 to 600
- Buttons: 700

Type scale (approx):
- Logo: 32 to 46
- Main heading: 34 to 42
- Subtitle: 17 to 20
- Card labels: 14 to 18
- Button text: 20 to 24
- Active count: 96 to 120
- Completion value: 34 to 42

## Decorative Background System

The PranaFlow UI should closely match the reference screenshots in `/public/reference/screens`.

Decoration style:
- Soft
- Flat
- Minimal
- Pastel
- UI-like
- Not realistic watercolor
- Not heavy illustration

Do not use generated PNG assets for background leaves, sparkles, hue, glow, or waves unless explicitly provided and visually approved.

Build these decorative elements with CSS gradients, pseudo-elements, and inline SVG components.

### Overall Background

Each screen should use a soft vertical gradient background:

```css
background:
  radial-gradient(circle at 50% 42%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 28%, rgba(234,246,255,0.25) 55%, transparent 72%),
  linear-gradient(180deg, #F8FCFF 0%, #EEF8FF 48%, #EAF6FF 100%);
```

Visual feel:
- Top area almost white with very light blue tint
- Middle area soft blue-white glow behind character
- Bottom area slightly stronger pale blue
- No harsh edges
- No dark gradients
- No texture-heavy background

### Central Hue / Halo Glow

Behind the yoga character, add a large soft circular hue/glow using CSS, not an image.

Approximate styling:

```css
.character-halo {
  position: absolute;
  width: 310px;
  height: 310px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(255, 255, 255, 0.78) 32%,
    rgba(205, 235, 255, 0.48) 58%,
    rgba(140, 202, 242, 0.16) 78%,
    rgba(140, 202, 242, 0) 100%
  );
  filter: blur(2px);
}
```

Placement:
- Centered behind yoga character
- Slightly larger than torso area
- Active session screens: 340px to 380px
- Setup and presets screens: 280px to 320px

Avoid:
- Hard circular border
- Strong blue ring
- Dark shadow
- Overly bright glow

### Background Leaves

Use reusable inline SVG components, for example `BackgroundLeaves side="left"` and `BackgroundLeaves side="right"`.

Style:
- Pale sky blue
- Very low opacity
- Soft, flat, minimal
- Organic stems with oval leaves
- No black outlines
- No heavy veins
- No realistic texture
- No saturated color

Recommended colors:
- leafStem: #8CCAF2
- leafFill: #BFE7F8
- leafFillAlt: #D7F1FA

Recommended opacity:
- Stem opacity: 0.20 to 0.28
- Leaf opacity: 0.14 to 0.24

Placement:
- Left: absolute, left -12px to 8px, bottom 110px to 220px, width 120px to 160px
- Right: absolute, right -12px to 8px, bottom 110px to 220px, width 120px to 160px
- Right side may mirror left using `scaleX(-1)`

Screen guidance:
- Home: visible left and right behind hero character in mid-lower area
- Setup: behind character and timing cards, subtle enough to preserve readability
- Presets: behind smaller character and upper card stack
- Active session: left and right mid-screen behind character
- Completion: behind completion character, left and right

Requirements:
- Decorative and low contrast
- Never compete with text, buttons, or cards
- Decorative layers at z-index 0
- Main content at z-index 10

Example SVG direction:

```jsx
function BackgroundLeaves({ side = 'left', className = '' }) {
  const mirrorClass = side === 'right' ? 'scale-x-[-1]' : '';

  return (
    <svg
      className={`pointer-events-none absolute bottom-32 ${side === 'left' ? 'left-[-8px]' : 'right-[-8px]'} w-36 opacity-20 ${mirrorClass} ${className}`}
      viewBox="0 0 160 260"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M44 238 C54 180 70 120 106 54"
        stroke="#8CCAF2"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M52 190 C22 170 18 130 42 104 C70 132 76 168 52 190Z" fill="#BFE7F8" opacity="0.55" />
      <path d="M78 145 C52 116 58 82 88 62 C106 96 102 126 78 145Z" fill="#D7F1FA" opacity="0.52" />
      <path d="M106 92 C82 62 94 26 130 10 C142 48 132 76 106 92Z" fill="#BFE7F8" opacity="0.50" />
      <path d="M36 128 C18 108 14 82 32 62 C52 86 54 112 36 128Z" fill="#D7F1FA" opacity="0.45" />
      <path d="M92 164 C116 136 142 132 158 150 C132 172 110 176 92 164Z" fill="#BFE7F8" opacity="0.42" />
    </svg>
  );
}
```

### Sparkles / Stars

Use CSS or inline SVG. Do not use heavy PNG overlays.

Sparkle feel:
- Magical but subtle
- Calm
- Premium
- Lightly spiritual
- Not childish
- Not crowded

Sparkle colors:
- white: rgba(255, 255, 255, 0.85)
- paleBlue: rgba(140, 202, 242, 0.45)
- aqua: rgba(32, 184, 196, 0.25)

Recommended amount:
- Home: 6 to 9
- Setup: 4 to 7
- Presets: 3 to 5
- Active session: 6 to 10
- Completion: 5 to 8

Sparkle types:
- Four-point star `✦`
- Small circle dot
- Tiny blurred dot

Placement:
- Around character, not over text
- Mostly left and right of shoulder/head area
- A few near leaves
- Avoid buttons and cards

Example component:

```jsx
function Sparkles({ variant = 'default' }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <span className="absolute left-[18%] top-[34%] text-xl text-white/80">✦</span>
      <span className="absolute right-[19%] top-[38%] text-lg text-white/70">✦</span>
      <span className="absolute left-[28%] top-[44%] h-1.5 w-1.5 rounded-full bg-white/80" />
      <span className="absolute right-[29%] top-[50%] h-1.5 w-1.5 rounded-full bg-[#8CCAF2]/50" />
      <span className="absolute left-[13%] top-[53%] text-sm text-[#8CCAF2]/50">✦</span>
      <span className="absolute right-[12%] top-[47%] h-1 w-1 rounded-full bg-white/70" />
    </div>
  );
}
```

Optional gentle animation:

```css
@keyframes sparklePulse {
  0%, 100% {
    opacity: 0.35;
    transform: scale(0.92);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.08);
  }
}
```

Use animation sparingly:

```css
animation: sparklePulse 3.5s ease-in-out infinite;
```

### Bottom Waves

Use CSS pseudo-elements or inline SVG.

Style:
- Very pale blue
- Low opacity
- Soft layered wave bands
- Wide horizontal flow
- No sharp stroke
- Background decoration only

Colors:
- wave1: rgba(140, 202, 242, 0.16)
- wave2: rgba(191, 231, 248, 0.22)
- wave3: rgba(234, 246, 255, 0.45)

Placement:
- Absolute bottom 0 left 0 width 100%
- Height 120px to 160px
- z-index 0

Example SVG component:

```jsx
function BottomWaves() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 z-0 h-36 w-full opacity-80"
      viewBox="0 0 390 150"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 70 C60 35 110 100 180 65 C250 30 300 95 390 55 V150 H0 Z" fill="rgba(140, 202, 242, 0.14)" />
      <path d="M0 95 C70 65 120 125 195 90 C270 55 320 115 390 82 V150 H0 Z" fill="rgba(191, 231, 248, 0.20)" />
      <path d="M0 120 C80 95 140 145 215 112 C285 80 330 132 390 105 V150 H0 Z" fill="rgba(234, 246, 255, 0.55)" />
    </svg>
  );
}
```

Use waves mostly on:
- Home screen
- Completion screen if needed

Avoid waves where they interfere with bottom buttons.

### Bottom Lotus Icon

Use the actual lotus icon from `/public/assets/icons/logo_lotus.svg`, referenced as `/assets/icons/logo_lotus.svg`.

Placement:
- Bottom center
- Near bottom wave area
- Below buttons
- Around bottom 26px to 44px
- Width 36px to 48px
- Opacity 0.45 to 0.70

Optional decorative dots on both sides are acceptable.

Example:

```jsx
function BottomLotusMark() {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 opacity-60" aria-hidden="true">
      <span className="h-1 w-1 rounded-full bg-[#2487EA]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#8CCAF2]" />
      <img src="/assets/icons/logo_lotus.svg" alt="" className="h-10 w-10" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#8CCAF2]" />
      <span className="h-1 w-1 rounded-full bg-[#2487EA]" />
    </div>
  );
}
```

### Decorative Layering / Z-Index

Use a consistent layer system:
- z-index 0: background gradient, leaves, waves, sparkles
- z-index 1: character halo glow
- z-index 5: character image
- z-index 10: text, cards, buttons, controls

All decorative elements should use `pointer-events: none`.

### Screen-Specific Decoration Notes

Home screen:
- Richest decoration
- Include central halo, left and right leaves, 6 to 9 sparkles, bottom waves, bottom lotus mark
- Welcoming, spiritual, polished
- Keep the brand block compact so the hero content starts earlier on mobile.
- Use a strong two-line emotional headline with a shorter supporting sentence.
- Keep the primary CTA visually dominant; secondary action should feel clearly lighter.
- Place last-session or trust/supporting metadata near the CTA stack rather than inside the hero copy.
- Add a soft base/stage under the character so the pose feels grounded rather than floating.

Setup screen:
- More subtle because of controls
- Include small halo, faint side leaves, 3 to 5 sparkles
- Avoid heavy bottom waves if they interfere with controls

Presets screen:
- Small halo
- Faint leaves behind character
- Very subtle sparkles
- No decoration over preset cards

Active session screens:
- Larger halo
- Faint side leaves
- 6 to 10 sparkles around character
- No bottom waves behind controls unless extremely subtle

Completion screen:
- Halo
- Side leaves
- Sparkles
- Optional subtle bottom wave if it does not interfere with action buttons

### Important Visual Warning

Do not make background decoration look like:
- Realistic watercolor botanical art
- High-opacity illustrations
- Detailed textured leaves
- Stock floral clipart
- Busy magical stars
- Dark or saturated decoration

Correct look:
- Soft
- Flat
- Minimal
- Pale blue
- Low opacity
- Integrated into UI background
- Similar to the reference screenshots

## Icon Rules

Primary icon source:
- /public/assets/icons (use lotus logo where available)

Fallback icon source:
- lucide-react

Candidate fallback icons:
- Play, Pause, Square, ChevronLeft, HelpCircle, RotateCcw, Home
- Volume2, Music, RefreshCcw, Target, Moon, Leaf, Sprout
- Scale, Clock, Sparkles, Waves, Hourglass

Do not hardcode icon file path without verifying file existence.

## Screen Specifications

### Screen 1: Home

Purpose:
- Landing screen with two choices: custom setup or presets.

Key elements:
- Top logo area (lotus + PranaFlow)
- Tagline: Set your rhythm. Follow your breath. Feel lighter.
- Supporting copy
- Hero character using inhale image with glow/decorative accents
- Primary CTA: Start Custom Breathing -> setup
- Secondary CTA: Explore Presets -> presets

### Screen 2: Custom Breathing Setup

Purpose:
- Core screen for rhythm customization.

Key elements:
- Header with back/logo/help
- Heading + subtitle
- Live pattern preview pill
- Character image + glow
- Three side-by-side timing slider cards:
  - Breathe In (blue)
  - Hold (purple)
  - Breathe Out (aqua/teal)
  - The selected value should read as a visible tap target, not plain text; include a subtle visual affordance that suggests it can be changed by tap.
  - Do not repeat a separate "seconds" label under the card; the value itself already carries the `s` suffix.
- Settings card rows:
  - Rounds (1..20, minus/value/plus)
  - Voice Guidance toggle
  - Sound toggle
- Bottom CTA: Begin Session

### Screen 3: Recommended Presets

Purpose:
- Quick-start rhythms.

Key elements:
- Shared header
- Heading + subtitle
- Character and glow
- Five tappable preset cards
- Bottom CTA: Create my own rhythm -> setup

Preset behavior:
- On card tap apply inhale/hold/exhale values and navigate to setup.

### Screen 4/5/6: Active Session

Component:
- One BreathingSession component adapting by phase.

Layout:
- Header at top
- Progress card below header
- Middle zone: `flex-1 flex-col items-center justify-center` — vertically centers character + pill + countdown + instruction in remaining space
- Pause/Resume + End buttons pinned at bottom

Key elements:
- Progress card (white card with shadow):
  - Circular round badge with glow ring — "Rnd" label + round number
  - "Session Progress" label + "N / M" count with N in phase color
  - Gradient progress bar (8px) with glow
  - Round pip dots below bar (≤ 10 rounds only)
- Animated breathing ring — 294px neutral, expands/contracts/pulses with phase
- Phase character image (310px wide) inside CharacterBackdrop — scale animation follows phase
- Phase pill — tinted background, spring bounce entrance on phase change, `font-display` label
- Large countdown number — pulses on every tick, `font-display`, phase color
- Phase instruction text
- Controls: Pause/Resume and End

onPhaseChange callback:
- Called on every phase transition with the phase's hex color
- App.jsx stores as `sessionPhaseColor` and passes to AppShell for background tinting

Pause behavior:
- Pause timers
- Pause/stop audio
- Prevent queued audio while paused
- Resume from current phase/count

End behavior:
- Cancel timers
- Stop all audio
- Clear scheduled audio
- Navigate to setup/home
- Save completed sessions only (MVP)

### Screen 7: Completion

Purpose:
- Completion summary + optional mood check-in.

Key elements:
- Logo area (inline, with lotus icon)
- Title "Beautiful work." + rounds summary with rounds count in bold blue
- Sparkle ceremony: 12 colored orbs burst upward on mount (useMemo positions, fires once)
- Character (Hold_pose.png) with CharacterBackdrop halo
- Total time card (formatted via formatTime)
- Mood check-in grid (4 columns, icon above label):
  - Calm (blue #2487EA)
  - Refreshed (aqua #20B8C4)
  - Sleepy (purple #8755E8)
  - Focused (orange #FF8A2A)
  - Selected mood gets tinted background + colored border + spring-bounce animation
- Bottom actions:
  - Repeat Session
  - Change Rhythm
  - Home

Completion audio:
- Plays complete.mp3 on session end (started from session screen before transition).
- Session unmount stops tick + ambient only; complete.mp3 continues playing.
- Missing file must fail silently.

## Preset Data

Create src/data/presets.js:

```js
export const presets = [
  {
    id: 'calm',
    name: 'Calm',
    pattern: '4-4-6',
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 6,
    description: 'Relax and slow down',
    color: 'blue',
  },
  {
    id: 'focus',
    name: 'Focus',
    pattern: '4-2-4',
    inhaleSeconds: 4,
    holdSeconds: 2,
    exhaleSeconds: 4,
    description: 'Reset your attention',
    color: 'aqua',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    pattern: '4-7-8',
    inhaleSeconds: 4,
    holdSeconds: 7,
    exhaleSeconds: 8,
    description: 'Wind down gently',
    color: 'purple',
  },
  {
    id: 'beginner',
    name: 'Beginner',
    pattern: '3-3-3',
    inhaleSeconds: 3,
    holdSeconds: 3,
    exhaleSeconds: 3,
    description: 'Start simple',
    color: 'orange',
  },
  {
    id: 'balance',
    name: 'Balance',
    pattern: '5-5-5',
    inhaleSeconds: 5,
    holdSeconds: 5,
    exhaleSeconds: 5,
    description: 'Equal breathing rhythm',
    color: 'teal',
  },
];
```

## localStorage Plan

Settings key:
- pranaflow_settings

Settings shape:

```js
{
  inhaleSeconds: 4,
  holdSeconds: 6,
  exhaleSeconds: 5,
  rounds: 5,
  voiceEnabled: true,
  soundEnabled: true,
}
```

Sessions key:
- pranaflow_sessions

Session shape:

```js
{
  id: string,
  date: ISO string,
  inhaleSeconds: number,
  holdSeconds: number,
  exhaleSeconds: number,
  rounds: number,
  durationSeconds: number,
  moodAfter?: 'Calm' | 'Refreshed' | 'Sleepy' | 'Focused',
}
```

Validation:
- inhaleSeconds, holdSeconds, exhaleSeconds clamped to 1..10
- rounds clamped to 1..20
- Invalid stored data resets to defaults

## Actual File Structure

```text
src/
  App.jsx              — screen state, sessionPhaseColor, createSessionId(), storage wiring
  main.jsx
  index.css            — Google Fonts import (Comfortaa + Nunito Sans), .font-display, custom range thumb CSS

  components/
    AppShell.jsx        — phaseColor prop, dynamic gradient background
    Header.jsx
    HomeScreen.jsx
    BreathingSetup.jsx  — inline timing cards + settings rows + sliders with --range-color CSS var
    PresetsScreen.jsx   — inline preset cards with colored left-border accent
    BreathingSession.jsx — breathing ring, phase pill, countdown, onPhaseChange
    CompletionScreen.jsx — sparkle ceremony, mood grid, onMoodChange
    CharacterBackdrop.jsx — reusable halo glow + SVG leaf_cluster.svg decorations + sparkles + waves + lotus
    PrimaryButton.jsx   — primary/secondary/danger variants, hover lift animation

  hooks/
    useBreathingEngine.js  — async Promise-based loop (no setInterval), callbacks: onBeforeSessionStart, onBeforePhaseStart, onCount, onPause, onResume, onComplete
    useAudioGuide.js       — 3-layer audio: voice (async/awaitable), tick, ambient
    useLocalStorage.js     — thin read/write wrapper around storage.js

  data/
    presets.js

  utils/
    storage.js         — defaultSettings, normalizeSettings, STORAGE_KEYS
    formatTime.js
    phaseConfig.js     — phaseConfig (hex colors), phaseOrder
    audioAssets.js     — audio path mapping

public/
  reference/
    screens/           — original reference screenshots (visual reference only)
    actual_screenshots/ — screenshots of current implementation

  assets/
    images/
      Inhale_pose.png
      Hold_pose.png
      Exhale_pose.png

    icons/
      logo_lotus.svg
      leaf_cluster.svg  — bezier-curve leaf shapes used by CharacterBackdrop

    audio/
      phases/
        inhale.mp3
        hold.mp3
        exhale.mp3
      counts/
        1.mp3 … 10.mp3
      ui/
        start.mp3
        complete.mp3
        chime.mp3

Dockerfile               — production nginx build
docker-compose.yml
Dockerfile.dev           — dev server with hot reload
docker-compose.dev.yml
docker/nginx.conf        — split cache: JS/CSS immutable 1y, images 7d, audio 1h must-revalidate
```

## Component Contracts

Note: TimingSliderCard, SettingsCard, PresetCard, ProgressBar, CircularProgress, and ToggleSwitch were not created as separate files — their content was inlined into the parent screen components.

AppShell props:
- children
- phaseColor: string | null — hex color from current session phase; drives dynamic background gradient tint (appended with `22` for 13% alpha)

Header props:
- showBack
- onBack
- showHelp
- logoPath
- title

PrimaryButton props:
- children
- icon
- variant: primary | secondary | danger
- onClick
- className

CharacterBackdrop props:
- children
- className
- glowSizeClass: Tailwind h-*/w-* classes for halo size (default 'h-64 w-64')

BreathingSession props:
- settings
- onComplete
- onEnd
- onPhaseChange: (hexColor: string) => void — called on each phase change with the phase's hex color

CompletionScreen props:
- settings
- durationSeconds
- onRepeat
- onChangeRhythm
- onHome
- onMoodChange: (mood: string) => void — called when user selects a mood

## Animation Guidelines

Use Framer Motion.

Page transitions:
- fade in, y: 8 → 0, duration: 0.25s

Character by phase:
- Inhale: scale 1 → 1.04, duration inhaleSeconds, easeInOut
- Hold: scale [1.02, 1.025, 1.02], subtle repeating pulse
- Exhale: scale 1.04 → 1, duration exhaleSeconds, easeInOut

Breathing ring (BreathingSession):
- Absolutely centered behind CharacterBackdrop, `border-2 rounded-full`
- Neutral/paused size: 294px — matches CharacterBackdrop halo (h-64 × scale(1.15) ≈ 294px)
- Inhale: animates to 324px (expanding outward beyond halo)
- Exhale: animates to 258px (contracting inside halo)
- Hold: oscillates [286, 302] px, opacity [0.75, 0.4, 0.75] on infinite reverse loop
- Paused: static 294px, opacity 0.35
- Border color: `${phase.color}99` (60% alpha)
- Transition duration follows `engine.phaseDuration`

Phase-tinted background (AppShell):
- During session, AppShell receives current phase hex color via `phaseColor` prop
- Gradient bottom color becomes `${phaseColor}22` (13% alpha)
- CSS `transition: background 0.8s ease` animates the shift smoothly
- Resets to `#D8EDFF` when session ends

Phase pill entrance:
- `key={engine.currentPhase}` causes remount on phase change
- `initial={{ scale: 0.7, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}`
- Spring ease `[0.34, 1.56, 0.64, 1]`, duration 0.35s

Countdown number:
- `key={engine.currentCount}` causes remount on each tick
- `initial={{ scale: 1.18, opacity: 0.65 }}` → `animate={{ scale: 1, opacity: 1 }}`
- duration 0.28s, easeOut

Progress card (BreathingSession):
- Entire progress area wrapped in `rounded-2xl bg-white/90 px-3 py-3 shadow-[0_8px_22px_rgba(36,135,234,0.12)]`
- Round badge: `h-[58px] w-[58px]` circle, colored border, double glow ring (`box-shadow: 0 0 0 4px ${phase.color}1a, 0 4px 14px ${phase.color}44`), "Rnd" label + round number stacked inside
- Progress bar: `h-2` (8px), `linear-gradient(90deg, ${phase.color}88 0%, ${phase.color} 100%)` fill, glow `boxShadow: '0 0 8px ${phase.color}99'`
- Round pips: row of `h-1.5 flex-1` pill segments below bar, one per round; completed = phase color at 55% opacity, active = phase color with glow, upcoming = `#DDEEFE`; only shown when `settings.rounds <= 10`

Completion sparkle ceremony:
- 12 colored orbs burst upward on CompletionScreen mount
- Positions deterministic via `useMemo` (index-based arithmetic, no Math.random)
- `initial={{ opacity: 1, y: 0 }}` → `animate={{ opacity: 0, y: targetY }}` — fires once, no repeat
- Colors cycle through brand palette: blue, aqua, purple, orange

Mood buttons (CompletionScreen):
- `animate={selected ? { scale: [1, 1.1, 1] } : { scale: 1 }}`
- `whileTap={{ scale: 0.9 }}`
- Spring ease `[0.34, 1.56, 0.64, 1]`

Interaction:
- Buttons tap scale: 0.97
- Buttons hover: scale 1.02, y -1
- Cards tap scale: 0.98

Slider thumbs:
- Custom CSS in index.css via `::-webkit-slider-thumb` / `::-moz-range-thumb`
- 20px, white border, drop shadow, color from `--range-color` CSS variable
- `--range-color` set as inline style on each range input using phase/card color

## Accessibility Requirements

- Use semantic buttons.
- Sliders must include aria-label:
  - Breathe in seconds
  - Hold seconds
  - Breathe out seconds
- Toggles must be keyboard accessible.
- Ensure readable text contrast.
- Do not rely on color alone; always include text labels.
- Provide meaningful alt text for character images.

## Data Validation Rules

Clamp and validate:
- inhaleSeconds: 1..10
- holdSeconds: 1..10
- exhaleSeconds: 1..10
- rounds: 1..20

If localStorage data is invalid:
- Reset to defaults.

## Implementation Status

All screens, logic, and polish are complete. The following summarizes what was built:

1. Assets verified, Vite + React + Tailwind + Framer Motion scaffolded.
2. AppShell, global styles, Comfortaa font, custom slider CSS.
3. Home, Setup, Presets, Session, Completion screens — all implemented.
4. Breathing engine (async Promise-based loop, no setInterval).
5. Pause / resume / end with full audio lifecycle handling.
6. Completion screen with duration, mood check-in, session save.
7. localStorage persistence for settings and completed sessions.
8. 3-layer audio guide (voice/tick/ambient) with instruction-gated phase timing.
9. Animation polish: breathing ring, phase tint, pill spring entrance, countdown pulse, sparkle ceremony.
10. Accessibility: switch semantics, aria-labels, keyboard targets.
11. Docker: prod and dev variants with nginx.

Key implementation decisions:
- Session completion triggered by explicit final-round completion state, not elapsed-time threshold.
- `createSessionId()` falls back to timestamp+random string when `crypto.randomUUID` is unavailable.
- Session screen unmount stops tick + ambient only so `complete.mp3` plays across screen transition.
- Breathing ring neutral size (294px) matches CharacterBackdrop halo (h-64 × scale(1.15)).
- Phase background tint uses CSS `transition: background 0.8s ease` on inline style (avoids Framer Motion color interpolation through black issue).
- Session middle content (character → instruction) wrapped in `flex-1 justify-center` so vertical space is centered rather than pooling below the instruction text.
- nginx.conf splits cache by file type: JS/CSS `immutable` (1 year), images 7 days, audio 1 hour `must-revalidate` — prevents stale audio after Docker rebuilds with swapped mp3 files.
- Audio levels: voice 0.92, tick 0.45, ambient 0.27.

## Quality Requirements

- Keep code modular and maintainable.
- Prefer small reusable components.
- Avoid putting all logic in App.jsx.
- Prevent duplicate intervals and timer drift bugs.
- Clear timers and audio on unmount/navigation.
- Do not use SpeechSynthesis API.
- Do not add useSpeechGuide.
- Use useAudioGuide (3-layer: voice/tick/ambient) for all audio playback.
- Session end/unmount: stop tick + ambient, allow complete.mp3 to finish.
- Use phaseConfig hex colors (#2487EA, #8755E8, #20B8C4) for all phase-colored UI.
- Use `.font-display` (Comfortaa) on main headings and countdown; Nunito Sans for body.
- Use `--range-color` CSS variable on slider inputs to drive custom thumb color.
- Build real interactive controls (not static mocks).
- Match screenshot style while keeping responsive implementation.
- Prioritize custom breathing setup as central feature.
- Maintain calm, premium, mobile-native UX.
