# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Xolara — a mobile-first React app for discovering and booking artisanal, community-centric travel experiences in Nicaragua. UI copy is in **Spanish**; code identifiers are in English.

**Visual-only deliverable** — no backend, no Firebase, no Google Maps. All data is local/seed.

## Commands

```bash
pnpm install        # install deps (pnpm ONLY — npm is blocked via .npmrc)
pnpm run dev        # Vite dev server on port 3000 (host 0.0.0.0)
pnpm run build      # production build to dist/
pnpm run preview    # serve the production build
pnpm run lint       # type-check only: tsc --noEmit (NOT eslint)
pnpm run clean      # clear vite cache
```

There is **no test runner** and **no eslint** configured. `pnpm run lint` runs `tsc --noEmit` — use it to verify type correctness.

**Do NOT use `npm`** — it is blocked in `.npmrc`.

## Architecture

**Single-screen state machine, no router.** `src/App.tsx` is the root and holds all application state (navigation, config, experiences, bookings, likes, filters). Navigation is driven by two pieces of state, not URLs:

- `activeTab`: `'explore' | 'experiences' | 'passport' | 'profile'` — the bottom nav tabs.
- `currentScreen`: `'explore' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp'` — full-screen overlays that take precedence over the active tab.

`renderScreenContent()` resolves which screen to show: `currentScreen` overlays are checked first, then it falls back to the `activeTab` switch. The bottom nav bar only renders when `currentScreen === 'explore'` (overlays hide it). Screens are presentational and receive data + callbacks as props from `App.tsx`.

**Screens** live in `src/screens/`. **Shared types** are in `src/types.ts` (`Experience`, `Booking`, `AppConfig`, `PassportStamp`). **Seed data** is in `src/data.ts` (`EXPERIENCES_DATA`, `MAP_PINS`, `RECENT_PASSPORT_STAMPS`).

**Data flow (all local, no backend):**
- Experiences: static seed data from `EXPERIENCES_DATA` in `src/data.ts`.
- Bookings: managed in local React state in `App.tsx`. Created via `handleConfirmBooking` with a generated `bk-<timestamp>` id and `XLR-<nnnn>` ref.
- `likedExperiences`, `config` (`AppConfig`), `activeCategory`, `searchQuery` are local React state.

## Styling & UI conventions

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js` — the theme is defined in `src/index.css` under `@theme` (brand colors `brand-primary` terracotta, `brand-secondary` deep green, `brand-bg` bone; font-heading Syne, font-body Outfit). Add design tokens there, not in a JS config.
- Custom keyframe animations (`animate-fade-in`, `animate-scale-in`, `animate-slide-up`, etc.) and utilities (`glass-effect`, `backdrop-blur-ios`, `transition-apple`, `tap-feedback`, `hide-scrollbar`) are defined in `src/index.css`. Aesthetic target: Apple-like minimalism (soft shadows, depth, glass). `motion` (Framer Motion) is the preferred animation library for new work.
- The whole app renders inside `PhoneShell` (a centered `max-w-md` phone frame).

## Import alias

The `@` import alias maps to the repo root (`vite.config.ts` + `tsconfig.json` paths).

## Working style

Make surgical, focused edits — return only the changed blocks/lines, not whole files, when only a few lines change; avoid comments on obvious code; only touch the files named in the request.
