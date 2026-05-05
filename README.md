# PranaFlow

PranaFlow is a mobile-first guided breathing web app built with React, Vite, Tailwind CSS, and Framer Motion.

The app lets users set a custom inhale, hold, and exhale rhythm, run timed rounds, and review a completion summary.

## Features

- Custom breathing setup with sliders (1-10 seconds per phase)
- Presets screen with predefined rhythm options
- Active breathing session with inhale -> hold -> exhale flow
- Animated character and decorative wellness-style visuals
- Optional audio guidance (phase, count, and UI sounds)
- Local persistence for settings and completed sessions

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS
- Framer Motion
- lucide-react
- Browser Audio API (no SpeechSynthesis API)

## Project Structure

- src/components: UI screens and reusable components
- src/hooks: breathing engine, audio guide, localStorage hooks
- src/data: preset definitions
- src/utils: config and utilities (phase config, audio assets, storage)
- public/assets: real app assets (images/icons/audio)
- public/reference/screens: design reference screenshots

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Run on Mobile Over LAN

Start Vite with host binding:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open on your phone (same Wi-Fi network):

```text
http://YOUR_LOCAL_IP:5173
```

Example:

```text
http://192.168.1.25:5173
```

## Data Persistence

The app stores data in browser localStorage:

- Settings key: pranaflow_settings
- Completed sessions key: pranaflow_sessions

Default settings are normalized and clamped:

- inhaleSeconds: 1-10
- holdSeconds: 1-10
- exhaleSeconds: 1-10
- rounds: 1-20

## Audio Behavior

Expected audio paths are defined in src/utils/audioAssets.js under:

- /assets/audio/intro
- /assets/audio/phases
- /assets/audio/ticks
- /assets/audio/ambient
- /assets/audio/ui

If any file is missing or fails to play, the app continues silently.

## Docker (Windows-Friendly)

Docker is optional. Local npm-based workflow works without Docker.

The repository now includes:

- Dockerfile (production multi-stage build + nginx)
- docker/nginx.conf (SPA fallback config)
- docker-compose.yml (production run)
- Dockerfile.dev (development container)
- docker-compose.dev.yml (development run with live edits)

Production container:

```bash
docker compose up --build
```

Open:

```text
http://localhost:8080
```

Stop:

```bash
docker compose down
```

Development container (optional):

```bash
docker compose -f docker-compose.dev.yml up --build
```

Open:

```text
http://localhost:5173
```

Stop:

```bash
docker compose -f docker-compose.dev.yml down
```

## Notes

- This MVP is frontend-only (no backend, auth, or database).
- Screenshots under public/reference/screens are visual references, not full-screen image backgrounds.
- Character assets should use object-contain to avoid cropping.
