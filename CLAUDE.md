# CLAUDE.md

This file provides guidance when working with code in this repository.

## Project

Xolara — mobile-first React app for discovering and booking artisanal travel experiences in Nicaragua. UI copy is in **Spanish**; code identifiers are in English.

**Now with a full backend**: Express API + PostgreSQL (via Supabase) + Docker Compose.

## Commands

### Frontend (pnpm ONLY — npm is blocked via `.npmrc`)
```bash
pnpm install        # Install deps
pnpm dev            # Vite dev server :3000
pnpm build          # Build to dist/
pnpm lint           # tsc --noEmit
pnpm clean          # Clear Vite cache
```

### Backend (npm — separate project, no .npmrc restriction)
```bash
cd backend
npm install
npm run dev         # tsx watch (hot-reload) :4000
npm run build       # tsc compile to dist/
npm start           # Run compiled production

npx tsc --noEmit    # Type-check only
```

### Docker
```bash
docker compose up               # Full stack
docker compose up db auth       # Database + Auth only (hybrid dev)
docker compose up --build       # Rebuild + start
```

## Architecture

### Frontend → Express API → PostgreSQL

```
Frontend (React SPA) ──HTTP──▶ Express API ──SQL──▶ PostgreSQL
                                     │
                               JWT verify ← GoTrue Auth
```

- **Frontend**: React 19 state machine (`activeTab` + `currentScreen`), no router
- **Backend**: Express 4, TypeScript ESM, 7 route modules (auth, experiences, bookings, likes, passport, guides, config)
- **Auth**: JWT HS256, PBKDF2 password hashing, RBAC (visitor/traveler/guide/admin)
- **Database**: PostgreSQL 15 via Supabase, 7 tables, seed data in `supabase/seed.sql`

### Dev workflow
```bash
# Single command (starts everything)
pnpm dev:stack

# Or hybrid (3 terminals)
# Terminal 1 — DB + Auth
docker compose up db auth

# Terminal 2 — Backend (hot-reload)
cd backend && cp ../.env.example .env && npm run dev

# Terminal 3 — Frontend (hot-reload)
pnpm dev
```

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no tailwind.config.js)
- Theme in `src/index.css` `@theme` block
- Brand: `brand-primary` terracotta, `brand-secondary` green, `brand-bg` bone
- Fonts: Syne (headings), Outfit (body)

### Key files
- `src/App.tsx` — Root state machine
- `src/contexts/AuthContext.tsx` — Auth provider (replaces simulated localStorage session)
- `src/lib/api.ts` — Typed API client with JWT injection
- `backend/src/routes/` — All Express route handlers
- `supabase/seed.sql` — Database schema + 4 seed experiences
- `docker-compose.yml` — Orchestrates all 5 services
