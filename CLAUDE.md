# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Xolara — a mobile-first React app for booking artisanal, community-centric travel experiences (Nicaragua-focused). UI copy is in **Spanish**; code identifiers are in English. Originated as a Google AI Studio applet.

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server on port 3000 (host 0.0.0.0)
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # type-check only: tsc --noEmit (NOT eslint)
npm run clean      # rm -rf dist server.js
```

There is **no test runner** configured. `npm run lint` runs `tsc --noEmit` — use it to verify type correctness. The `eslint` config (`eslint.config.js`) only lints `firestore.rules` via `@firebase/eslint-plugin-security-rules`, not the TS/TSX source.

## Architecture

**Single-screen state machine, no router.** `src/App.tsx` is the root and holds essentially all application state (navigation, config, experiences, bookings, likes, filters). Navigation is driven by two pieces of state, not URLs:

- `activeTab`: `'explore' | 'experiences' | 'passport' | 'profile'` — the bottom nav tabs.
- `currentScreen`: `'explore' | 'map' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp'` — full-screen overlays that take precedence over the active tab.

`renderScreenContent()` resolves which screen to show: `currentScreen` overlays are checked first, then it falls back to the `activeTab` switch. The bottom nav bar only renders when `currentScreen === 'explore'` (overlays hide it). Screens are presentational and receive data + callbacks as props from `App.tsx` — they do not own navigation or fetch their own lists.

**Screens** live in `src/screens/`. **Shared types** are in `src/types.ts` (`Experience`, `Booking`, `AppConfig`, `PassportStamp`). **Seed data** is in `src/data.ts` (`EXPERIENCES_DATA`, `MAP_PINS`, `RECENT_PASSPORT_STAMPS`).

**Data flow (Firestore-backed, seed-data fallback):**
- Experiences: `App.tsx` seeds state from `EXPERIENCES_DATA`, then subscribes to the `experiences` collection via `onSnapshot`. The Firestore snapshot **overrides** the seed only when it returns ≥1 doc (so the app still renders offline / before data exists).
- Bookings: subscribed per-user; the `bookings` query fetches and then filters client-side by `user.uid`. Cleared when no user. Created via `setDoc` in `handleConfirmBooking` with a generated `bk-<timestamp>` id and `XLR-<nnnn>` ref.
- `likedExperiences`, `config` (`AppConfig`), `activeCategory`, `searchQuery` are **local-only** React state — not persisted to Firestore.

## Firebase

- `src/firebase.ts` initializes the app from `firebase-applet-config.json` (committed; this is an AI Studio applet config, not a secret-bearing file). Note Firestore uses a **named database**: `getFirestore(app, firebaseConfig.firestoreDatabaseId)`, not the default DB.
- `src/contexts/FirebaseContext.tsx` (`FirebaseProvider`, wrapped around `<App/>` in `main.tsx`) exposes `useFirebase()` → `{ user, loading, signIn, logOut }`. Its `signIn` uses **Google popup** auth.
- `firestore.rules` is the security source of truth and is intentionally strict (default-deny `match /{document=**}`, then per-collection allow rules with structural validation helpers like `isValidExperience`/`isValidBooking`). `security_spec.md` documents the intended invariants. When changing what gets written to `users`/`experiences`/`bookings`, the rules' required-keys and field-size/type checks must be kept in sync or writes will be rejected.

Note: `src/screens/LoginScreen.tsx` exists and uses **email/password** auth directly (`signInWithEmailAndPassword`), but it is currently **not imported by `App.tsx`** and diverges from the context's Google-popup `signIn`. Reconcile these if wiring up login.

## Styling & UI conventions

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js` — the theme is defined in `src/index.css` under `@theme` (brand colors `brand-primary` terracotta, `brand-secondary` deep green, `brand-bg` bone; serif `Literata`, sans `Inter`). Add design tokens there, not in a JS config.
- Custom keyframe animations (`animate-fade-in`, `animate-scale-in`, `animate-slide-up`, etc.) and utilities (`glass-effect`, `backdrop-blur-ios`, `transition-apple`, `tap-feedback`, `hide-scrollbar`) are defined in `src/index.css`. Aesthetic target: Apple-like minimalism (soft shadows, depth, glass). `motion` (Framer Motion) is the preferred animation library for new work.
- The whole app renders inside `PhoneShell` (a centered `max-w-md` phone frame).

## External keys / env

- **Google Maps** (`src/screens/MapScreen.tsx`, via `@vis.gl/react-google-maps` `APIProvider`): read at runtime from `import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY`. `MapScreen` degrades gracefully (`hasValidKey` check) and shows in-app instructions when the key is missing. `vite.config.ts` also defines `process.env.GOOGLE_MAPS_PLATFORM_KEY`.
- `@google/genai` (Gemini) is a dependency and `GEMINI_API_KEY`/`VITE_GEMINI_API_KEY` env vars exist, but Gemini is **not currently called anywhere in `src/`**.
- The `@` import alias maps to the repo root (`vite.config.ts` + `tsconfig.json` paths). `.env*` files are gitignored except `.env.example`.

## Working style (from .clinerules / context.md)

The repo's own directives ("Caveman" mode): make surgical, focused edits — return only the changed blocks/lines, not whole files, when only a few lines change; avoid comments on obvious code; only touch the files named in the request.
