# Xolara

A mobile-first React app for discovering and booking artisanal, community-centric travel experiences in Nicaragua. UI copy is in **Spanish**; code identifiers are in English.

**Visual-only deliverable** — no backend, no Firebase, no Google Maps. All data is local/seed.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Validation | Zod 4 |
| Package manager | pnpm 11+ |

## Features

- **15+ reusable components** — `ExperienceCard`, `BottomNavBar`, `CategoryPills`, `SearchBar`, `FilterModal`, `HeroSection`, `CTABar`, `PassportStampList`, `ProfileHeader`, `ErrorBoundary`, `PhoneShell`, `TopAppBar`, `SectionHeader`, `InfoStats`, `ImpactDashboard`, `CulturalTipsPopup`, `ActionList`
- **10 screens** — Explore, Experiences Feed, Detail, Reservation, Confirmed, Passport, Profile, Configuration, Create Experience, Map
- **State machine navigation** — single-screen app with no router; `activeTab` + `currentScreen` state drives all navigation
- **Role-based access control** — `visitor`, `traveler`, `guide`, `admin` roles with hierarchical permission checks (`src/lib/roles.ts`)
- **Zod validation** — schemas for bookings, experiences, and app config with Spanish error messages (`src/lib/validation/schemas.ts`)
- **Error boundary** — catches render errors and shows a recoverable UI (`src/components/ErrorBoundary.tsx`)
- **Session management** — 30-minute TTL sessions persisted to `localStorage` (`src/lib/security/session.ts`)
- **Input sanitization** — HTML, input, and URL sanitization utilities (`src/lib/security/sanitize.ts`)
- **Mobile-first design** — optimized for 390px width, rendered inside a centered `PhoneShell` frame
- **Apple-inspired UI** — glass morphism surfaces, custom keyframe animations, `prefers-reduced-motion` and `prefers-reduced-transparency` support
- **Seed data** — 4 curated experiences with community impact details, map pins, and passport stamps

## Prerequisites

- **Node.js** >= 20
- **pnpm** (npm is blocked via `.npmrc`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server on port 3000
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server on port 3000 (host `0.0.0.0`) |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | Type-check only: `tsc --noEmit` |
| `pnpm clean` | Clear Vite cache |

There is **no test runner** and **no eslint** configured. `pnpm lint` runs `tsc --noEmit` — use it to verify type correctness.

## Project Structure

```
src/
├── App.tsx                  # Root — all app state lives here
├── main.tsx                 # Entry point
├── types.ts                 # Shared TypeScript interfaces
├── data.ts                  # Seed data (experiences, map pins, passport stamps)
├── index.css                # Tailwind v4 theme + custom animations
├── components/              # 19 reusable UI components
│   ├── PhoneShell.tsx       # Centered phone frame container
│   ├── BottomNavBar.tsx     # Tab navigation bar
│   ├── ExperienceCard.tsx   # Card for experience listings
│   ├── ErrorBoundary.tsx    # React error boundary
│   ├── FilterModal.tsx      # Category/price filter sheet
│   ├── SearchBar.tsx        # Search input
│   └── ...                  # (13 more components)
├── screens/                 # 10 full-screen views
│   ├── ExploreScreen.tsx    # Home/explore tab
│   ├── DetailScreen.tsx     # Experience detail
│   ├── ReservationScreen.tsx# Booking form
│   ├── ConfirmedScreen.tsx  # Booking confirmation
│   ├── PassportScreen.tsx   # Travel passport stamps
│   ├── ProfileScreen.tsx    # User profile + bookings
│   └── ...                  # (4 more screens)
└── lib/                     # Utilities
    ├── roles.ts             # RBAC: role hierarchy + permission checks
    ├── security/
    │   ├── sanitize.ts      # HTML/input/URL sanitization
    │   └── session.ts       # Session create/get/destroy with TTL
    └── validation/
        └── schemas.ts       # Zod schemas (booking, experience, config)
```

## Architecture

### Single-Screen State Machine

Xolara has **no router**. Navigation is driven by two pieces of state in `App.tsx`:

- **`activeTab`** — `'explore' | 'experiences' | 'passport' | 'profile'` — the bottom nav tabs
- **`currentScreen`** — `'explore' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp'` — full-screen overlays that take precedence over the active tab

`renderScreenContent()` resolves which screen to show: `currentScreen` overlays are checked first, then it falls back to the `activeTab` switch. The bottom nav bar only renders when `currentScreen === 'explore'` (overlays hide it).

Screens are presentational and receive data + callbacks as props from `App.tsx`. All state (bookings, likes, config, filters) is local React state — no Redux, no Context beyond what's there.

### Data Flow

- Experiences: static seed data from `EXPERIENCES_DATA` in `src/data.ts`
- Bookings: managed in local React state, created via `handleConfirmBooking` with generated `bk-<timestamp>` IDs and `XLR-<nnnn>` refs
- `likedExperiences`, `config`, `activeCategory`, `searchQuery`: local React state

## Styling

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is **no `tailwind.config.js`** — the theme is defined in `src/index.css` under the `@theme` block.
- **Brand colors** — `brand-primary` (terracotta `#a8472f`), `brand-secondary` (deep green `#3a674f`), `brand-bg` (bone `#fff8f6`)
- **Typography** — `Syne` for headings, `Outfit` for body text (via Google Fonts)
- **Custom keyframe animations** — `animate-fade-in`, `animate-scale-in`, `animate-slide-up`, `animate-slide-down`
- **Utility classes** — `glass-chrome`, `surface-card`, `transition-apple`, `tap-feedback`, `hide-scrollbar`, `backdrop-blur-ios`
- **Accessibility** — `prefers-reduced-motion` collapses all animations; `prefers-reduced-transparency` makes glass surfaces opaque
- **Apple-like aesthetic** — soft shadows, depth, glass morphism, paper grain overlay

## Import Alias

The `@` import alias maps to the repo root, configured in `vite.config.ts` and `tsconfig.json`:

```ts
import { EXPERIENCES_DATA } from '@/data';
```

## Deployment

Deploy to **Vercel** with zero configuration:

```bash
pnpm build
```

The output is a static `dist/` directory. No environment variables are required — the app has no backend, no API keys, and no server-side logic.

## License

MIT
