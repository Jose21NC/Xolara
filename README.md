# Xolara

Descubre y reserva experiencias turísticas artesanales y comunitarias en Nicaragua.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Self_Hosted-3FCF8E)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript 5.8 + Vite 6 |
| **Estilos** | Tailwind CSS v4 + Motion (Framer Motion) + Lucide React |
| **Validación** | Zod 4 (compartido entre frontend y backend) |
| **Backend** | Express 4.21 + TypeScript (ESM) |
| **Base de datos** | PostgreSQL 16 (vía Supabase) |
| **Autenticación** | Supabase GoTrue (JWT HS256, email/password) |
| **Infraestructura** | Docker Compose (5 servicios) |
| **Admin DB** | Supabase Studio (puerto 3001) |
| **Paquetería** | pnpm 11+ (frontend), npm (backend) |

---

## Arquitectura

```
┌───────────────────────────────────────────────────────┐
│                    Navegador                          │
│              http://localhost:3000                     │
└─────────────────────┬─────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │   Nginx       │  (producción) o Vite Dev Server (desarrollo)
              │  (proxy pass) │
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
   ┌─────▼────┐ ┌────▼────┐ ┌─────▼─────┐
   │  Express │ │ GoTrue  │ │ Supabase  │
   │  API     │ │ Auth    │ │ Studio    │
   │ :4000    │ │ :9999   │ │ :3001     │
   └─────┬────┘ └─────────┘ └───────────┘
         │
   ┌─────▼─────┐
   │ PostgreSQL │
   │     :5432  │
   └───────────┘
```

### Flujo de datos

1. **Frontend** (React SPA) se comunica con **Express API** para todas las operaciones CRUD
2. **Express** verifica JWTs, ejecuta lógica de negocio, y consulta **PostgreSQL** directamente
3. **Supabase GoTrue** maneja el registro/login y emite JWTs firmados con HS256
4. **Supabase Studio** es solo para administración de base de datos (no necesario en runtime)
5. **Nginx** en producción sirve el frontend estático y proxy inverso `/api/` → Express

---

## Empezar

### Prerrequisitos

- Node.js >= 20
- pnpm (frontend) + npm (backend)
- Docker + Docker Compose (para PostgreSQL + Auth)

### 1. Clonar e instalar

```bash
git clone https://github.com/Jose21NC/Xolara.git
cd Xolara

# Frontend
pnpm install

# Backend
cd backend && npm install && cd ..
```

### 2. Variables de entorno

```bash
cp .env.example backend/.env
```

Ajusta `JWT_SECRET` en producción.

### 3. Levantar base de datos + autenticación

```bash
docker compose up db auth studio
```

Esto inicia PostgreSQL (puerto 5432), GoTrue Auth (puerto 9999), y Studio (puerto 3001). La primera vez ejecuta `supabase/seed.sql` que crea las tablas y siembra 4 experiencias.

### 4. Iniciar backend (dev)

```bash
cd backend
npx tsx watch src/index.ts
```

API en `http://localhost:4000`. Health check: `GET /api/health`.

### 5. Iniciar frontend (dev)

```bash
# En otra terminal, desde la raíz
pnpm dev
```

Frontend en `http://localhost:3000`.

---

## Scripts

### Frontend

| Comando | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server en :3000 |
| `pnpm build` | Build producción a `dist/` |
| `pnpm lint` | `tsc --noEmit` |
| `pnpm clean` | Limpia caché Vite |

### Backend

| Comando | Description |
|---------|-------------|
| `npm run dev` | `tsx watch` con hot-reload |
| `npm run build` | `tsc` a `dist/` |
| `npm start` | Node producción desde `dist/` |

### Docker

| Comando | Description |
|---------|-------------|
| `docker compose up db auth` | Solo base de datos + auth (dev) |
| `docker compose up` | Stack completo (producción) |
| `docker compose up --build` | Reconstruir imágenes y arrancar |

---

## Estructura del proyecto

```
Xolara/
├── src/                        # Frontend React
│   ├── App.tsx                 # State machine raíz
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth provider (reemplaza localStorage session)
│   ├── lib/
│   │   ├── api.ts              # Cliente API tipado con JWT
│   │   ├── supabase.ts         # Cliente Supabase JS
│   │   └── validation/         # Zod schemas
│   ├── components/             # 19 UI components
│   └── screens/                # 10 pantallas
├── backend/
│   ├── Dockerfile              # Multi-stage (20-alpine)
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Express app setup
│   │   ├── config.ts           # Env vars tipadas
│   │   ├── routes/             # auth, experiences, bookings, likes, passport, guides, config
│   │   ├── middleware/          # JWT auth + error handler
│   │   ├── validators/         # Zod schemas (servidor)
│   │   └── db/pool.ts          # PostgreSQL connection pool
├── supabase/
│   ├── docker-compose.yml      # Supabase standalone (dev)
│   └── seed.sql                # Schema + seed data
├── frontend/
│   ├── Dockerfile              # Vite build → Nginx
│   └── nginx.conf              # SPA + API proxy
├── scripts/
│   ├── generate-keys.sh        # Genera ANON_KEY + SERVICE_ROLE_KEY
│   └── copy-env.sh             # Setup rápido de .env
├── docker-compose.yml          # Orquesta todo (5 servicios)
└── .env.example                # Variables de entorno
```

---

## API REST

Documentación completa en [`docs/API.md`](docs/API.md).

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ✗ | Registro de usuario |
| POST | `/api/auth/signin` | ✗ | Inicio de sesión |
| GET | `/api/auth/me` | ✓ | Perfil del usuario actual |
| GET | `/api/experiences` | ✗ | Lista de experiencias |
| GET | `/api/experiences/:id` | ✗ | Detalle de experiencia |
| POST | `/api/experiences` | guide+ | Crear experiencia |
| PUT | `/api/experiences/:id` | guide+ | Editar experiencia |
| DELETE | `/api/experiences/:id` | admin | Eliminar experiencia |
| GET | `/api/bookings` | ✓ | Mis reservas |
| POST | `/api/bookings` | traveler+ | Crear reserva (genera XLR- ref y passport stamp) |
| PUT | `/api/bookings/:id` | ✓ | Modificar fecha/hora |
| DELETE | `/api/bookings/:id` | ✓ | Cancelar reserva |
| POST | `/api/likes/:expId` | ✓ | Like/unlike toggle |
| GET | `/api/likes` | ✓ | Mis likes |
| GET | `/api/passport` | ✓ | Mis sellos passport |
| GET | `/api/guides/:expId` | ✗ | Info del guía de una experiencia |
| GET | `/api/config` | ✓ | Mi configuración |
| PUT | `/api/config` | ✓ | Actualizar configuración |
| GET | `/api/health` | ✗ | Health check |

---

## Base de datos

7 tablas en `public`:

| Tabla | Propósito |
|-------|-----------|
| `profiles` | Extiende `auth.users` con nombre, rol, avatar |
| `experiences` | Experiencias turísticas (CRUD, seed de 4) |
| `bookings` | Reservas con ref `XLR-nnnn` y status |
| `likes` | Favoritos por usuario (join table) |
| `passport_stamps` | Sellos generados automáticamente al reservar |
| `app_configs` | Preferencias por usuario |
| `guides` | Perfiles de guías vinculados a experiencias |

El schema completo está en `supabase/seed.sql`.

---

## Seguridad

- **Autenticación**: JWT HS256 via Supabase GoTrue + Express middleware
- **Contraseñas**: PBKDF2 con SHA-512 y salt aleatorio (Node crypto)
- **RBAC**: 4 roles (visitor → traveler → guide → admin) verificados en cada endpoint
- **Sanitización**: `src/lib/security/sanitize.ts` en frontend
- **Validación**: Zod 4 en frontend y backend (schemas independientes)
- **CORS**: Origen configurable via `CORS_ORIGIN`
- **Headers de seguridad**: Configurados en `vercel.json` y `frontend/nginx.conf`

---

## Despliegue

### Docker (recomendado)

```bash
docker compose up --build -d
```

Esto construye y arranca:
1. PostgreSQL + GoTrue Auth + Studio
2. Express API (puerto 4000)
3. Frontend vía Nginx (puerto 3000)

### Vercel (frontend standalone)

```bash
pnpm build
```

El frontend solo se despliega a `dist/`. El backend debe estar en un VPS con Docker.

---

## Licencia

MIT
