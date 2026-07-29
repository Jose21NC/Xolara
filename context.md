# Contexto de Desarrollo — Xolara

**Estado**: MVP funcional con backend completo.

## Stack

| Capa | Stack |
|------|-------|
| **Frontend** | React 19 + TypeScript 5.8 + Vite 6 + Tailwind v4 + Motion + Lucide + Zod 4 |
| **Backend** | Express 4 + TypeScript ESM + PostgreSQL 16 |
| **Auth** | Supabase GoTrue (JWT HS256) |
| **Infra** | Docker Compose (5 servicios) |
| **Paquetería** | pnpm (frontend), npm (backend) |

## Dev workflow

```bash
# Terminal 1 — Base de datos + Auth
docker compose up db auth

# Terminal 2 — Backend (hot-reload)
cd backend && cp ../.env.example .env && npm run dev

# Terminal 3 — Frontend (hot-reload)
pnpm dev
```

## Directivas

- No explicar código obvio
- Solo entregar bloques modificados
- Estética Apple-like (minimalista, profundidad, sombras suaves)
- pnpm para frontend, npm para backend
- UI copy en español, código en inglés

## Archivos clave

- `src/App.tsx` — State machine raíz
- `src/contexts/AuthContext.tsx` — Auth provider (JWT)
- `src/lib/api.ts` — Cliente API tipado
- `backend/src/routes/` — Rutas Express (auth, experiences, bookings, likes, passport, guides, config)
- `supabase/seed.sql` — Schema + seed data
- `docker-compose.yml` — Orquestación de servicios
