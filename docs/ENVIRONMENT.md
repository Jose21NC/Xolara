# Environment Setup

## Stack completo

Xolara requiere **tres entornos** ejecutándose simultáneamente:

| Entorno | Tecnología | Puerto default |
|---------|-----------|----------------|
| Frontend (dev) | Vite dev server | 3000 |
| Backend (dev) | Express + tsx watch | 4000 |
| Base de datos | Docker (PostgreSQL + GoTrue) | 5433, 9999 |

---

## Prerrequisitos

| Requisito | Versión | Notas |
|-----------|---------|-------|
| Node.js | >= 20 | LTS recomendado |
| pnpm | >= 11 | **npm está bloqueado** para el frontend |
| npm | >= 10 | Usado solo para el backend (separado) |
| Docker | >= 24 | Con Docker Compose v2 |
| Docker Compose | >= 2.20 | Incluido con Docker Desktop |

---

## Variables de entorno

### Archivo raíz `.env.example`

```bash
cp .env.example backend/.env
```

| Variable | Default | Dónde se usa | Descripción |
|----------|---------|-------------|-------------|
| `POSTGRES_PASSWORD` | `postgres` | Docker, backend | Password de PostgreSQL |
| `JWT_SECRET` | `super-secret-jwt-key...` | Docker, backend | Clave para firmar/verificar JWTs |
| `SUPABASE_ANON_KEY` | _(generado)_ | Docker, frontend | Key pública para Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | _(generado)_ | Docker | Key admin para Supabase |
| `GOTRUE_SITE_URL` | `http://localhost:3000` | Docker | URL del frontend para GoTrue |
| `GOTRUE_JWT_EXP` | `3600` | Docker | Expiración JWT en segundos |
| `GOTRUE_MAILER_AUTOCONFIRM` | `true` | Docker | Auto-confirmar emails (dev) |
| `BACKEND_PORT` | `4000` | Backend | Puerto del API Express |
| `CORS_ORIGIN` | `http://localhost:3000` | Backend | Origen permitido para CORS |
| `DATABASE_URL` | `postgres://postgres:...` | Backend | Conexión a PostgreSQL |
| `VITE_SUPABASE_URL` | `http://localhost:9999` | Frontend | URL de GoTrue |
| `VITE_SUPABASE_ANON_KEY` | `''` | Frontend | Key anon de Supabase |
| `VITE_API_URL` | `http://localhost:4000` | Frontend | URL del backend Express |

### Generar claves Supabase

```bash
# Usando el script incluido
scripts/generate-keys.sh "tu-jwt-secret"

# Output:
# SUPABASE_ANON_KEY=eyJ0eXAiOi...
# SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOi...

# Luego copia al .env
```

---

## Entorno de desarrollo

### Opción 1: Un solo comando (recomendado)

```bash
pnpm dev:stack
```

Arranca Docker (PostgreSQL + GoTrue Auth), backend (tsx watch :4000) y frontend (Vite :3000) en paralelo. Ctrl+C detiene todo.

El script `scripts/dev.sh` genera automáticamente las claves JWT si no existe `.env`.

### Opción 2: Híbrido (3 terminales)

```bash
# Terminal 1 — Base de datos + Auth
docker compose up db auth

# Terminal 2 — Backend (hot-reload)
cd backend && cp ../.env.example .env && npx tsx watch src/index.ts

# Terminal 3 — Frontend (hot-reload)
pnpm dev
```

### Opción 3: Todo Docker

```bash
docker compose up --build
```

### Opción 4: Solo Supabase

```bash
cd supabase && docker compose up
```

---

## Conexiones

| Servicio | URL Desarrollo | URL Producción (Docker) |
|----------|---------------|------------------------|
| Frontend | http://localhost:3000 | http://localhost:3000 |
| Backend API | http://localhost:4000/api | http://localhost:3000/api (proxy) |
| PostgreSQL | `postgres://postgres:postgres@localhost:5433/postgres` | `postgres://postgres:...@db:5432/postgres` |
| Supabase Auth | http://localhost:9999 | http://auth:9999 (interno) |
| Supabase Studio | http://localhost:3001 | http://localhost:3001 |

---

## Comandos comunes

### Stack completo

```bash
pnpm dev:stack    # Arranca Docker + Backend + Frontend (1 comando)
```

### Frontend

```bash
pnpm dev          # Dev server :3000
pnpm build        # Build producción a dist/
pnpm lint         # tsc --noEmit
pnpm clean        # Limpiar caché
```

### Backend

```bash
npm run dev       # tsx watch (hot-reload)
npm run build     # tsc a dist/
npm start         # Node producción
```

### Docker

```bash
docker compose up -d            # Iniciar todos los servicios
docker compose up -d db auth    # Solo base + auth
docker compose logs -f backend  # Ver logs del backend
docker compose down             # Detener todo
docker compose down -v          # Detener + borrar volúmenes
```

---

## TypeScript

### Frontend
```bash
pnpm lint    # tsc --noEmit
```
No hay ESLint configurado. `lint` es solo verificación de tipos.

### Backend
```bash
cd backend && npx tsc --noEmit
```

---

## Import alias (frontend)

El alias `@` mapea a la raíz del proyecto:

```typescript
// vite.config.ts + tsconfig.json
import { EXPERIENCES_DATA } from '@/data';
```
