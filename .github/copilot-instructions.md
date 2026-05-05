# GitHub Copilot Instructions for PranaFlow

## Project Overview

PranaFlow is a mobile-first responsive breathing web app.

The app helps users create and follow a custom guided breathing rhythm using:

- Breathe In / Inhale
- Hold
- Breathe Out / Exhale

The user can adjust each phase independently from **1 to 10 seconds** using sliders. The app then guides the user through a breathing session with animated yoga character poses, visual countdowns, optional audio guidance, rounds tracking, and a completion summary.

This is an MVP web app. Do **not** add backend services, authentication, database, server APIs, or cloud sync unless explicitly requested.

---

## Tech Stack

Use:

- React
- Vite
- Tailwind CSS
- Framer Motion
- lucide-react for fallback icons
- Browser Audio API for pre-generated audio files
- localStorage for MVP persistence

Do **not** use Browser SpeechSynthesis API.

The app will use pre-generated audio assets supplied by the project owner.

---

## Project Awareness & Context

Before making code changes, always read:

```text
planning.md
tasks.md
```

Use `planning.md` as the source of truth for:

* product requirements
* screen behavior
* visual direction
* component architecture
* folder structure
* breathing engine behavior
* asset usage
* audio behavior
* interaction rules
* design constraints

Use `tasks.md` as the active implementation tracker.

Always gather context first by reading relevant existing files before changing code.

Never assume missing context. Ask for clarification if requirements are unclear.

---

## Task Management Rules

Always check `tasks.md` before starting work.

When working on any task:

1. Read `planning.md`.
2. Read `tasks.md`.
3. Identify the active task before coding.
4. If a needed task is not listed, add it to `tasks.md`.
5. If new bugs, follow-ups, or implementation subtasks are discovered, add them to `tasks.md`.
6. When a task is completed, immediately update `tasks.md`.
7. Mark completed tasks using `[x]`.
8. Add a short note under the task if the implementation has important details.
9. Do not leave completed work unmarked.
10. Do not silently skip requirements from `planning.md`.

If implementation differs from `planning.md`, either:

* update `planning.md`, or
* add a clear note in `tasks.md` explaining the deviation.

Keep `tasks.md` current throughout development.

---

## Documentation Rules

The project should use these planning files:

```text
planning.md
tasks.md
```

Optional future files may include:

```text
decisions.md
completed.md
```

If a new architectural decision is made, document it either in `planning.md` or in a future `decisions.md`.

If a feature, setup step, or dependency changes, update the relevant documentation.

Do not create excessive documentation files unless they serve a clear purpose.

---

## Reference Screens and Asset Rules

Reference screenshots are located at:

```text
public/reference/screens
```

These screenshots are **visual references only**.

Use them to understand:

* layout
* spacing
* screen hierarchy
* color usage
* typography
* button style
* card style
* character placement
* progress indicators
* mood and visual polish

Do **not** use screenshots as full-screen backgrounds.

Do **not** build the UI by placing screenshot images on the screen.

Rebuild the UI as real React + Tailwind components.

---

## Real App Assets

Actual image assets are located at:

```text
public/assets/images
```

Use these assets in the real UI:

```text
/assets/images/inhale_pose.png
/assets/images/hold_pose.png
/assets/images/exhale_pose.png
```

Actual icon assets are located at:

```text
public/assets/icons
```

Use icon files from this folder where available, especially the lotus logo.

Use `lucide-react` only when an icon asset does not exist.

Audio assets should be located at:

```text
public/assets/audio
```

Expected structure:

```text
public/
  assets/
    audio/
      phases/
        inhale.mp3
        hold.mp3
        exhale.mp3

      counts/
        1.mp3
        2.mp3
        3.mp3
        4.mp3
        5.mp3
        6.mp3
        7.mp3
        8.mp3
        9.mp3
        10.mp3

      ui/
        start.mp3
        complete.mp3
        chime.mp3
```

If an audio file is missing, the app must continue silently without crashing.

---

## Breathing Phase Mapping

Use this exact mapping:

```js
const phaseConfig = {
  inhale: {
    label: 'Inhale',
    displayLabel: 'Breathe In',
    instruction: 'Breathe in slowly',
    image: '/assets/images/inhale_pose.png',
    color: 'blue',
    audio: '/assets/audio/phases/inhale.mp3',
  },
  hold: {
    label: 'Hold',
    displayLabel: 'Hold',
    instruction: 'Hold gently',
    image: '/assets/images/hold_pose.png',
    color: 'purple',
    audio: '/assets/audio/phases/hold.mp3',
  },
  exhale: {
    label: 'Exhale',
    displayLabel: 'Breathe Out',
    instruction: 'Breathe out slowly',
    image: '/assets/images/exhale_pose.png',
    color: 'aqua',
    audio: '/assets/audio/phases/exhale.mp3',
  },
};
```

Pose meaning:

* Inhale: seated meditation pose with hands on knees
* Hold: seated pose with folded hands at chest
* Exhale: seated pose with folded hands raised above head

Always use `object-contain` for character images.

Never crop the character.

Give the exhale pose enough top space so the raised hands and halo are not clipped.

---

## Mobile-First Layout Rules

The app must feel like a native mobile app in a phone browser.

Use a centered mobile shell:

```jsx
<div className="min-h-dvh flex justify-center bg-[#F7FBFF]">
  <main className="relative min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-gradient-to-b from-[#F7FBFF] to-[#EAF6FF]">
    {/* screen content */}
  </main>
</div>
```

Primary design target:

```text
390 × 844
```

Also support:

```text
360px width
375px width
393px width
430px width
```

Rules:

* Use `min-height: 100dvh`.
* Use `max-width: 430px`.
* Avoid horizontal scroll.
* Use mobile-friendly spacing.
* Page padding should usually be `20px` to `24px`.
* Minimum tap target should be `44px`.
* Primary buttons should be `56px` to `72px` tall.
* Rounded corners should generally be `20px` to `32px`.
* Use responsive layout patterns instead of fixed absolute positioning unless necessary.

---

## Visual Design Rules

The visual style should be:

* soft cartoon yoga wellness
* calm
* friendly
* clean
* lightly spiritual
* modern
* polished
* mobile-native

Use:

* white/blue gradient backgrounds
* rounded white cards
* soft blue-tinted shadows
* large readable numbers
* gentle halo glow behind the character
* subtle sparkles, leaves, and wave decorations
* smooth Framer Motion animations

The screenshots in `public/reference/screens` are the visual source of truth. Recreate decorative leaves, halo glow, sparkles, waves, and bottom lotus mark using CSS/SVG so they match the screenshots. Do not use separate generated PNGs for these decorations.

Preferred color tokens:

```css
--primary-blue: #2487EA;
--soft-blue: #8CCAF2;
--accent-blue: #4CA3D8;
--aqua: #20B8C4;
--purple: #8755E8;
--orange: #FF8A2A;
--danger-red: #F74D61;
--text-dark: #071D55;
--text-muted: #657899;
--background: #F7FBFF;
--background-light: #EAF6FF;
--card-white: #FFFFFF;
--soft-border: #D6EAFF;
```

Recommended shadow:

```css
box-shadow: 0 12px 30px rgba(36, 135, 234, 0.12);
```

Typography:

* Prefer `Nunito`, `Nunito Sans`, or `Inter`.
* Prefer `Nunito` or `Nunito Sans` for a softer wellness feel.
* Headings: `800`
* Section titles: `700`
* Body: `400–600`
* Buttons: `700`

Approximate sizing:

```text
Logo text: 32–46px
Main heading: 34–42px
Subtitle: 17–20px
Card labels: 14–18px
Button text: 20–24px
Active count number: 96–120px
Completion time value: 34–42px
```

---

## PranaFlow Decorative Background System

The PranaFlow UI should closely match the reference screenshots in:

```text
public/reference/screens
```

The decoration style is soft, flat, minimal, pastel, and UI-like. It should not look like realistic watercolor artwork or heavy illustration.

Do not use generated PNG assets for the background leaves, sparkles, hue, glow, or waves unless explicitly provided and visually approved.

Instead, recreate these elements using CSS gradients, pseudo-elements, and inline SVG components.

---

## Overall Background

Each screen should use a soft vertical gradient background:

```css
background:
  radial-gradient(circle at 50% 42%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 28%, rgba(234,246,255,0.25) 55%, transparent 72%),
  linear-gradient(180deg, #F8FCFF 0%, #EEF8FF 48%, #EAF6FF 100%);
```

Visual feel:

* top area: almost white with a very light blue tint
* middle: soft blue-white glow behind the character
* bottom: slightly stronger pale blue
* no harsh edges
* no dark gradients
* no texture-heavy background

The background should feel like a calm wellness app, not a poster.

---

## Central Hue / Halo Glow

Behind the yoga character, add a large soft circular hue/glow.

Use CSS, not an image.

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

* centered behind the yoga character
* should be slightly larger than the character torso area
* on active session screens, can be larger: `340px–380px`
* on setup/presets screens, can be smaller: `280px–320px`

Purpose:

* make the character feel luminous
* separate character from background
* create soft spiritual/wellness mood

Avoid:

* hard circular border
* strong blue ring
* dark shadow
* overly bright glow

---

## Background Leaves

The reference screens use very subtle pale-blue leaves on the left and right sides of the screen.

These leaves should feel like flat translucent silhouettes, not detailed watercolor artwork.

Implement as reusable inline SVG components, for example:

```text
<BackgroundLeaves side="left" />
<BackgroundLeaves side="right" />
```

Visual style:

* pale sky blue
* very low opacity
* soft, flat, minimal
* organic stems with oval leaves
* no black outlines
* no heavy veins
* no realistic texture
* no saturated color

Recommended colors:

```css
leafStem: #8CCAF2
leafFill: #BFE7F8
leafFillAlt: #D7F1FA
```

Recommended opacity:

```css
stem opacity: 0.20–0.28
leaf opacity: 0.14–0.24
```

Placement:

### Left leaves

* position: absolute
* left: `-12px` to `8px`
* bottom: `110px` to `220px`, depending on screen
* width: `120px–160px`
* height: auto
* opacity: around `0.18`

### Right leaves

* position: absolute
* right: `-12px` to `8px`
* bottom: `110px` to `220px`
* width: `120px–160px`
* height: auto
* opacity: around `0.18`
* can mirror the left SVG using `scaleX(-1)`

Screen-specific guidance:

* Home: leaves are visible behind the hero character, left and right, around the mid-lower area.
* Setup: leaves are behind the character and timing cards, subtle enough not to reduce readability.
* Presets: leaves sit behind the smaller character and upper card stack.
* Active session: leaves appear along left and right mid-screen behind the character.
* Completion: leaves appear behind the completion character, left and right.

Important:

* Leaves must be decorative and low contrast.
* They should never compete with text, buttons, or cards.
* They should sit behind cards and character, usually with `z-index: 0`.
* Main content should sit at `z-index: 10`.

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
      <path
        d="M52 190 C22 170 18 130 42 104 C70 132 76 168 52 190Z"
        fill="#BFE7F8"
        opacity="0.55"
      />
      <path
        d="M78 145 C52 116 58 82 88 62 C106 96 102 126 78 145Z"
        fill="#D7F1FA"
        opacity="0.52"
      />
      <path
        d="M106 92 C82 62 94 26 130 10 C142 48 132 76 106 92Z"
        fill="#BFE7F8"
        opacity="0.50"
      />
      <path
        d="M36 128 C18 108 14 82 32 62 C52 86 54 112 36 128Z"
        fill="#D7F1FA"
        opacity="0.45"
      />
      <path
        d="M92 164 C116 136 142 132 158 150 C132 172 110 176 92 164Z"
        fill="#BFE7F8"
        opacity="0.42"
      />
    </svg>
  );
}
```

---

## Sparkles / Stars

The reference screens use a few small white and pale-blue sparkles around the character.

They should feel:

* magical but subtle
* calm
* premium
* lightly spiritual
* not childish
* not crowded

Use CSS or inline SVG. Do not use a heavy PNG overlay.

Sparkle colors:

```css
white: rgba(255, 255, 255, 0.85)
paleBlue: rgba(140, 202, 242, 0.45)
aqua: rgba(32, 184, 196, 0.25)
```

Recommended amount:

* Home: 6–9 small sparkles
* Setup: 4–7 sparkles
* Presets: 3–5 sparkles
* Active session: 6–10 sparkles
* Completion: 5–8 sparkles

Sparkle types:

1. Four-point star: `✦`
2. Small circle dot
3. Tiny blurred dot

Placement:

* around the character, not over text
* mostly left/right of character shoulder/head area
* a few near leaves
* avoid placing over buttons/cards

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

Add gentle animation if desired:

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

Do not make sparkles flashy or distracting.

---

## Bottom Waves

The home screen and some lower sections use very soft pale-blue waves near the bottom.

Implement using CSS pseudo-elements or inline SVG.

Visual style:

* very pale blue
* low opacity
* soft layered wave bands
* wide horizontal flow
* no sharp stroke
* background decoration only

Colors:

```css
wave1: rgba(140, 202, 242, 0.16)
wave2: rgba(191, 231, 248, 0.22)
wave3: rgba(234, 246, 255, 0.45)
```

Placement:

* position absolute
* bottom: `0`
* left: `0`
* width: `100%`
* height: `120px–160px`
* z-index: 0

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
      <path
        d="M0 70 C60 35 110 100 180 65 C250 30 300 95 390 55 V150 H0 Z"
        fill="rgba(140, 202, 242, 0.14)"
      />
      <path
        d="M0 95 C70 65 120 125 195 90 C270 55 320 115 390 82 V150 H0 Z"
        fill="rgba(191, 231, 248, 0.20)"
      />
      <path
        d="M0 120 C80 95 140 145 215 112 C285 80 330 132 390 105 V150 H0 Z"
        fill="rgba(234, 246, 255, 0.55)"
      />
    </svg>
  );
}
```

Use bottom waves mostly on:

* Home screen
* Completion screen if needed

Avoid using waves where they interfere with bottom buttons.

---

## Bottom Lotus Icon

The home screen reference includes a small decorative lotus icon near the bottom center, below the main buttons and above/within the wave area.

Use the actual lotus icon from:

```text
/public/assets/icons/logo_lotus.svg
```

Reference it as:

```text
/assets/icons/logo_lotus.svg
```

Placement:

* bottom center
* near bottom wave area
* below buttons
* around `bottom: 26px–44px`
* width: `36px–48px`
* opacity: `0.45–0.70`

Add tiny decorative dots on both sides if desired.

Style:

* blue
* low opacity
* decorative only
* should not be interactive
* `aria-hidden="true"`

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

---

## Decorative Layering / Z-Index

Use a consistent layer system:

```text
z-index 0: background gradient, leaves, waves, sparkles
z-index 1: character halo glow
z-index 5: character image
z-index 10: text, cards, buttons, controls
```

Do not allow decorative elements to cover functional UI.

Use:

```css
pointer-events: none;
```

for all decorative components.

---

## Screen-Specific Decoration Notes

### Home Screen

Decoration should be richest here.

Include:

* central character halo
* left and right pale leaves
* 6–9 sparkles around character
* bottom waves
* bottom lotus mark

The home screen should feel welcoming, spiritual, and polished.

### Setup Screen

Decoration should be more subtle because the screen has controls.

Include:

* small character halo
* faint side leaves behind character
* 3–5 sparkles
* no heavy bottom waves unless they do not interfere with controls

Controls and readability are more important than decoration.

### Presets Screen

Include:

* small character halo
* faint leaves behind character
* very subtle sparkles
* no decoration over preset cards

### Active Session Screens

Include:

* larger character halo
* faint side leaves
* 6–10 sparkles around character
* no bottom waves behind controls unless very subtle

The active session should feel immersive and uncluttered.

### Completion Screen

Include:

* character halo
* side leaves
* sparkles
* optional subtle bottom wave if it does not interfere with action buttons

---

## Important Visual Warning

Do not make the background decorations look like:

* realistic watercolor botanical art
* high-opacity illustrations
* detailed textured leaves
* stock floral clipart
* busy magical stars
* dark or saturated decoration

The correct look is:

* soft
* flat
* minimal
* pale blue
* low opacity
* integrated into the UI background
* similar to the reference screenshots

---

## Required Screens

Implement these screens/states:

1. Home screen
2. Custom breathing setup screen
3. Recommended presets screen
4. Active session — inhale state
5. Active session — hold state
6. Active session — exhale state
7. Completion screen

In code, the active session should be one reusable component that changes based on the current phase.

Suggested screen state:

```js
currentScreen:
  | 'home'
  | 'setup'
  | 'presets'
  | 'session'
  | 'complete';
```

Suggested phase state:

```js
currentPhase:
  | 'inhale'
  | 'hold'
  | 'exhale';
```

---

## Navigation Flow

Use simple React state navigation unless routing is explicitly introduced.

Expected flow:

```text
Home → Start Custom Breathing → Setup
Home → Explore Presets → Presets
Presets → Preset Card → Setup with preset values applied
Presets → Create My Own Rhythm → Setup
Setup → Begin Session → Session
Session → Completed Rounds → Completion
Session → End → Setup or Home
Completion → Repeat Session → Session
Completion → Change Rhythm → Setup
Completion → Home → Home
```

---

## Custom Breathing Setup Rules

This is the most important product screen.

It must include:

* heading: `Set your breathing rhythm`
* subtitle: `Adjust the timing for each phase`
* live pattern preview, for example: `Inhale 4s • Hold 6s • Exhale 5s`
* three side-by-side timing cards:

  * Breathe In
  * Hold
  * Breathe Out
* settings card
* bottom CTA: `Begin Session`

Each timing card must include:

* label
* icon chip
* large selected value such as `4s`
* slider
* min label `1`
* max label `10`
* unit text `seconds`

Slider rules:

```text
min: 1
max: 10
step: 1
```

Each slider must be controlled by React state and must update the preview live.

Timing card colors:

* Breathe In: blue
* Hold: purple
* Breathe Out: aqua/teal

Settings card rows:

1. Rounds

   * range: 1 to 20
   * use minus/value/plus control
2. Voice Guidance

   * toggle on/off
   * controls pre-generated voice/audio playback
3. Sound

   * toggle on/off
   * controls optional chime/ambient sound behavior

Default settings:

```js
const defaultSettings = {
  inhaleSeconds: 4,
  holdSeconds: 6,
  exhaleSeconds: 5,
  rounds: 5,
  voiceEnabled: true,
  soundEnabled: true,
};
```

---

## Presets

Create preset data in:

```text
src/data/presets.js
```

Use this data:

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

Preset behavior:

* On preset click, apply preset values.
* Navigate to setup screen.
* Setup screen should show preset values in sliders and preview.

---

## Breathing Engine Rules

Implement a custom hook:

```text
useBreathingEngine(settings, callbacks)
```

Expected state:

```js
{
  currentPhase,
  currentCount,
  currentRound,
  isRunning,
  isPaused,
  elapsedSeconds,
  totalDurationSeconds,
  phaseDuration,
  phaseProgress,
  totalProgress
}
```

Phase sequence:

```js
[
  { key: 'inhale', label: 'Inhale', duration: inhaleSeconds },
  { key: 'hold', label: 'Hold', duration: holdSeconds },
  { key: 'exhale', label: 'Exhale', duration: exhaleSeconds },
];
```

Cycle logic:

```text
Start at inhale
Count 1 to inhaleSeconds
Move to hold
Count 1 to holdSeconds
Move to exhale
Count 1 to exhaleSeconds
After exhale, increment round
After final round, complete session
```

Timer requirements:

* Avoid multiple active intervals.
* Clear timers on pause, end, completion, and component unmount.
* Use `useRef` for timer IDs.
* Prevent stale closure bugs.
* Clamp counts correctly.
* Do not allow timers to continue after leaving the session screen.
* The breathing timer is the source of truth.
* Audio should follow the timer, not control the timer.

---

## Audio Guidance Rules

Do **not** use Browser SpeechSynthesis API.

Use pre-generated audio files from:

```text
public/assets/audio
```

Expected mapping:

```js
const audioAssets = {
  phases: {
    inhale: '/assets/audio/phases/inhale.mp3',
    hold: '/assets/audio/phases/hold.mp3',
    exhale: '/assets/audio/phases/exhale.mp3',
  },
  counts: {
    1: '/assets/audio/counts/1.mp3',
    2: '/assets/audio/counts/2.mp3',
    3: '/assets/audio/counts/3.mp3',
    4: '/assets/audio/counts/4.mp3',
    5: '/assets/audio/counts/5.mp3',
    6: '/assets/audio/counts/6.mp3',
    7: '/assets/audio/counts/7.mp3',
    8: '/assets/audio/counts/8.mp3',
    9: '/assets/audio/counts/9.mp3',
    10: '/assets/audio/counts/10.mp3',
  },
  ui: {
    start: '/assets/audio/ui/start.mp3',
    complete: '/assets/audio/ui/complete.mp3',
    chime: '/assets/audio/ui/chime.mp3',
  },
};
```

Create a hook:

```text
useAudioGuide()
```

Expected functions:

```js
playAudio(src)
playPhase(phase)
playCount(count)
playChime()
playComplete()
stopAllAudio()
```

Behavior:

* If voice guidance is enabled, play phase audio at phase start.
* Play count audio as each count appears.
* If inhale duration is 4 seconds, play count files 1 through 4 only.
* If hold duration is 6 seconds, play count files 1 through 6 only.
* If exhale duration is 5 seconds, play count files 1 through 5 only.
* If an audio file is missing or fails to play, continue silently.
* Audio playback must not block or control the breathing timer.

Pause behavior:

* On pause, stop or pause currently playing audio.
* Prevent upcoming scheduled audio from playing.
* Pause the breathing timer.

Resume behavior:

* Continue the timer from the current phase/count.
* Resume audio guidance from the next appropriate phase/count event.

End behavior:

* Stop all audio.
* Clear scheduled audio playback.
* Cancel timers.
* Return to setup or home.

Completion behavior:

* Stop breathing audio.
* Optionally play `complete.mp3` if available.
* Save completed session.

Implementation requirements:

* Use the browser `Audio` API.
* Keep refs to current audio instances.
* Stop and reset current audio before playing another file if needed.
* Handle `audio.play()` promise rejection gracefully.
* Mobile browsers may block autoplay before user interaction; session audio should begin only after a user taps `Begin Session`.

---

## Sound Rules

For MVP:

* The sound toggle must exist and persist.
* Optional: play a soft chime on phase change.
* If no sound file is available, keep sound as a saved preference for future use.
* Do not block the app because sound is not implemented.

---

## localStorage Rules

Persist settings under:

```text
pranaflow_settings
```

Shape:

```js
{
  inhaleSeconds: 4,
  holdSeconds: 6,
  exhaleSeconds: 5,
  rounds: 5,
  voiceEnabled: true,
  soundEnabled: true
}
```

Persist completed sessions under:

```text
pranaflow_sessions
```

Shape:

```js
{
  id: string,
  date: ISO string,
  inhaleSeconds: number,
  holdSeconds: number,
  exhaleSeconds: number,
  rounds: number,
  durationSeconds: number,
  moodAfter?: 'Calm' | 'Refreshed' | 'Sleepy' | 'Focused'
}
```

Validation:

* inhaleSeconds: 1–10
* holdSeconds: 1–10
* exhaleSeconds: 1–10
* rounds: 1–20

If localStorage contains invalid data, reset to defaults.

---

## Animation Rules

Use Framer Motion.

Page transitions:

```text
fade in
y: 8px to 0
duration: 0.25s
```

Character animation by phase:

Inhale:

```text
scale 1 → 1.04
duration = inhaleSeconds
ease = easeInOut
glow expands
```

Hold:

```text
subtle pulse
scale [1.02, 1.025, 1.02]
duration ~2s repeating
glow pulses
```

Exhale:

```text
scale 1.04 → 1
duration = exhaleSeconds
ease = easeInOut
glow contracts
```

Button interactions:

```text
tap scale: 0.97
```

Card interactions:

```text
tap scale: 0.98
```

---

## Accessibility Rules

* Use semantic buttons.
* Sliders must have aria labels:

  * `Breathe in seconds`
  * `Hold seconds`
  * `Breathe out seconds`
* Toggles must be keyboard accessible.
* Buttons must have accessible labels.
* Do not rely only on color; always show text labels.
* Ensure text contrast is readable.
* Avoid tiny tap targets.

---

## Suggested File Structure

Prefer this structure:

```text
src/
  App.jsx
  main.jsx
  index.css

  components/
    AppShell.jsx
    Header.jsx
    HomeScreen.jsx
    BreathingSetup.jsx
    PresetsScreen.jsx
    BreathingSession.jsx
    CompletionScreen.jsx
    TimingSliderCard.jsx
    SettingsCard.jsx
    PresetCard.jsx
    ProgressBar.jsx
    CircularProgress.jsx
    PrimaryButton.jsx
    ToggleSwitch.jsx

  hooks/
    useBreathingEngine.js
    useAudioGuide.js
    useLocalStorage.js

  data/
    presets.js

  utils/
    storage.js
    formatTime.js
    phaseConfig.js
    audioAssets.js
```

Existing public structure:

```text
public/
  reference/
    screens/
      PF_screen1_home.png
      PF_screen2_custom_setup.png
      PF_screen3_presets.png
      PF_screen4_active_inhale.png
      PF_screen5_active_hold.png
      PF_screen6_active_exhale.png
      PF_screen7_completion.png

  assets/
    images/
      inhale_pose.png
      hold_pose.png
      exhale_pose.png

    icons/
      logo_lotus.svg

    audio/
      phases/
        inhale.mp3
        hold.mp3
        exhale.mp3

      counts/
        1.mp3
        2.mp3
        3.mp3
        4.mp3
        5.mp3
        6.mp3
        7.mp3
        8.mp3
        9.mp3
        10.mp3

      ui/
        start.mp3
        complete.mp3
        chime.mp3
```

---

## Code Quality Rules

* Keep code modular.
* Do not put all logic in `App.jsx`.
* Prefer small reusable components.
* Prefer custom hooks for timer, audio, and localStorage behavior.
* Avoid timer bugs and duplicate intervals.
* Clear timers on unmount.
* Stop all audio when leaving session.
* Build real interactive controls, not static mockups.
* Match reference screens closely while keeping the UI responsive.
* Screenshots are reference only.
* Images, icons, and audio are actual reusable assets.
* Prioritize the custom breathing setup as the central product feature.
* Keep the experience calm, premium, polished, and mobile-native.

---

## When Unsure

If implementation details conflict:

1. Follow `planning.md`.
2. Check `tasks.md` for active task details.
3. Preserve the core product behavior:

   * custom timing sliders
   * inhale → hold → exhale breathing engine
   * correct pose per phase
   * pre-generated audio guidance
   * mobile-first visual design
4. Add unresolved questions or follow-ups to `tasks.md`.

Do not invent missing requirements.
Ask for clarification when needed.
