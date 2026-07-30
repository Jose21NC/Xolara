# CLAUDE.md

This file provides guidance when working with code in this repository.

## Project

Xolara — mobile-first React app for discovering and booking artisanal travel experiences in Nicaragua. UI copy is in **Spanish**; code identifiers are in English.

**Full stack**: Express API + PostgreSQL (via Supabase) + Docker Compose. Auth via JWT (PBKDF2).

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

### Docker — hybrid dev (DB + Auth only)
```bash
docker compose up db auth
```

### Env
```bash
cp backend/.env.example backend/.env
# Ensure DATABASE_URL points to localhost:5433 (Docker port):
# DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres
```

## Architecture — Hybrid: Express API + Supabase

Xolara usa una arquitectura híbrida deliberada: **Supabase** para auth-as-a-service y storage, **Express** para toda la lógica de negocio.

### ¿Por qué Express + Supabase y no solo Supabase?

| Servicio | Supabase lo hace | Por qué Express encima |
|----------|------------------|----------------------|
| **Autenticación** | ✅ GoTrue maneja registros, JWT, sesiones | Express verifica el JWT y extrae roles custom (visitor/traveler/guide/admin) que GoTrue no expone directamente |
| **Base de datos** | ✅ PostgreSQL administrado | Express permite **transacciones ACID reales** — ej: crear una reserva Y generar un passport stamp en la misma transacción, algo que RLS policies no pueden garantizar |
| **Storage** | ✅ Buckets + URLs públicas | Express sirve como proxy de validación (tamaño, tipo MIME) antes de subir a Supabase |
| **Lógica de negocio** | ❌ RLS policies se vuelven complejas con lógica multi-paso | Express centraliza validación (Zod), cálculos (precio total), y reglas de negocio en un solo lugar |
| **API REST** | ❌ PostgREST expone la DB directamente al frontend | Express oculta la estructura de DB, permite endpoints custom, y evita exponer la DB al cliente |

### Data Flow

```
Frontend (React SPA) ──HTTP──▶ Express API ──SQL──▶ PostgreSQL (via Supabase)
                                     │
                          JWT verify ← Supabase GoTrue
                                     │
                          Supabase Storage (imágenes)
```

### Stack components

- **Frontend**: React 19 state machine (`activeTab` + `currentScreen`), no router
- **Backend**: Express 4, TypeScript ESM, 8 route modules (auth, experiences, bookings, likes, passport, guides, config, auth/profile PATCH)
- **Auth**: JWT HS256 via Supabase GoTrue, RBAC (visitor/traveler/guide/admin)
- **Auth flow**: `AuthProvider` wraps the app, `AuthScreen` gates until signed in
- **Database**: PostgreSQL 15 via Supabase, 7 tables, seed data in `supabase/seed.sql`
- **Storage**: Supabase Storage (para subida de imágenes de experiencias)
- **Validation**: Zod 4 en frontend y backend (validación duplicada por seguridad)

### Token storage
- Auth context stores session in `localStorage.xolara_session_v2` as `{user, token}`
- API client reads from same key — aligned
- Token injected as `Authorization: Bearer <token>` on all non-skipAuth requests

### Dev workflow
```bash
# Terminal 1 — DB + Auth
docker compose up db auth

# Terminal 2 — Backend (hot-reload)
cd backend && DATABASE_URL="postgres://postgres:postgres@localhost:5433/postgres" npm run dev

# Terminal 3 — Frontend (hot-reload)
pnpm dev
```

### Data flow
- `App.tsx` loads experiences (public), bookings, likes, config on mount (when authenticated)
- Snake_case DB responses → camelCase frontend types via `mapExperience()` / `mapBooking()`
- Static `EXPERIENCES_DATA` used as fallback if API unavailable
- Optimistic UI updates followed by API confirmation; rollback on failure
- `useAuth()` provides user identity to all screens; `updateUser(partial)` propagates changes globally

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no tailwind.config.js)
- Theme in `src/index.css` `@theme` block
- Brand: `brand-primary` terracotta, `brand-secondary` green, `brand-bg` bone
- Fonts: Syne (headings), Outfit (body)

### Key files
- `src/App.tsx` — Root state machine + API data loading + auth gating
- `src/screens/AuthScreen.tsx` — Login/signup with role selection (traveler/guide)
- `src/contexts/AuthContext.tsx` — Auth provider with session persistence + `updateUser()`
- `src/lib/api.ts` — Typed API client with JWT injection, 7 API modules
- `src/lib/supabase.ts` — Supabase client config (auth + storage)
- `src/components/ComingSoon.tsx` — Reusable "en desarrollo" modal
- `backend/src/routes/` — All Express route handlers
- `supabase/seed.sql` — Database schema + 4 seed experiences
- `docker-compose.yml` — Orchestrates all 5 services

### Token storage
- Auth context stores session in `localStorage.xolara_session_v2` as `{user, token}`
- API client reads from same key — aligned
- Token injected as `Authorization: Bearer <token>` on all non-skipAuth requests
- `updateUser()` also updates localStorage for cross-tab consistency

### Frontend-backend integration status
- **Auth**: ✅ Login, signup, session persistence, JWT injection, profile PATCH
- **Auth session**: ✅ `/me` response updates stale session on load; `updateUser()` propagates edits globally
- **Identity**: ✅ No hardcoded user — reads from `useAuth().user.displayName`
- **Logout**: ✅ En ConfigurationScreen + PassportScreen ActionList
- **Experiences**: ✅ List from API (public), create/edit (guide/admin), liked toggle, delete
- **Bookings**: ✅ Create, list, update (date/time), cancel — ISO date/time format
- **Bookings validation**: ✅ Zod on POST (backend) and PUT (frontend + backend)
- **Likes**: ✅ Toggle, list per user (optimistic + API sync)
- **Config**: ✅ Read, update per user
- **Passport stamps**: ✅ Auto-generated on booking (backend), fetched via `GET /api/passport`; refreshes after new booking
- **Guide info**: ✅ Fetched from `GET /api/guides/:experienceId` with hardcoded fallback
- **FAQ**: ✅ Modal con preguntas del guía, datos desde API
- **Admin panel**: ✅ `AdminPanelScreen` — guide/admin experience CRUD with role gating
- **Map**: ✅ `MapScreen` — wired to ExploreScreen map preview tap
- **Create experience**: ✅ FAB button in ExploreScreen for guides/admins, edit mode soportado
- **Streak**: ✅ Computado desde booking dates (días consecutivos), no hardcodeado
- **Share**: ✅ Web Share API en experiencias; share de perfil ComingSoon para producción
