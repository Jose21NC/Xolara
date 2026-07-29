# Architecture

## Análisis técnico completo de Xolara

> Este documento describe la arquitectura actual del proyecto, con backend autoalojado
> vía Supabase + Express + Docker. Especifica decisiones técnicas, estructura del
> stack, flujos de datos, y modelo de seguridad.

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend** | React | 19.0 | UI components + state machine |
| | TypeScript | 5.8 | Tipado estático |
| | Vite | 6 | Build tool + dev server |
| | Tailwind CSS | 4.1 | Estilos utility-first |
| | Motion | 12 | Animaciones declarativas |
| | Lucide React | 0.546 | Iconos SVG |
| | Zod | 4.4 | Validación de esquemas (frontend) |
| | @supabase/supabase-js | 2.111 | Cliente Supabase |
| **Backend** | Express | 4.21 | HTTP API REST |
| | TypeScript | 5.8 | Tipado estático |
| | pg | 8.13 | Driver PostgreSQL |
| | jsonwebtoken | 9.0 | Verificación JWT |
| | Zod | 4.4 | Validación de esquemas (backend) |
| | multer | 1.4 | Upload de archivos |
| **Database** | PostgreSQL | 16 | Base de datos relacional |
| | Supabase GoTrue | 2.165 | Autenticación + JWT |
| **Infra** | Docker Compose | 3.8 | Orquestación de servicios |
| | Nginx | latest | Servir SPA + proxy inverso |

---

## 2. Diagrama de contenedores (C4 Nivel 2)

```
┌──────────────────────────────────────────────────────────────────┐
│                         Docker Compose Stack                      │
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐    │
│  │  Frontend    │    │   Backend    │    │  Supabase Auth     │    │
│  │  React SPA   │───▶│  Express API │───▶│  GoTrue :9999     │    │
│  │  Nginx :80   │    │  :4000       │    └─────────┬─────────┘    │
│  └─────────────┘    └──────┬───────┘              │              │
│        ▲                   │                      │              │
│        │                   │                ┌─────▼──────────┐   │
│        │                   └────────────────▶│  PostgreSQL     │   │
│        │                      (SQL directo)  │  :5432          │   │
│        │                                     └─────────────────┘   │
│        │                                     ┌──────────────┐    │
│        └─────────────────────────────────────│  Supabase     │    │
│                 (proxy nginx                  │  Studio       │    │
│                  /api/ → backend)             │  :3001        │    │
│                                               └──────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### Flujo de request típico

1. **Navegador** solicita `GET /api/experiences`
2. **Nginx** (producción) o **Vite** (desarrollo) → reenvía a Express
3. **Express middleware** verifica JWT (si aplica)
4. **Route handler** ejecuta lógica de negocio
5. **pg pool** ejecuta query contra PostgreSQL
6. **Response** vuelve al navegador como JSON

---

## 3. Modelo de datos (PostgreSQL)

### 3.1 Esquema relacional

```
auth.users (manejado por GoTrue)
  ├── id UUID PK
  ├── email TEXT UNIQUE
  ├── encrypted_password TEXT
  └── raw_user_meta_data JSONB

public.profiles
  ├── id UUID PK → auth.users(id)
  ├── display_name TEXT
  ├── role ENUM(visitor|traveler|guide|admin)
  └── avatar_url TEXT

public.experiences
  ├── id UUID PK
  ├── title TEXT
  ├── category ENUM(Crafts|Culinary|Agriculture|Nature|Music)
  ├── price_per_person NUMERIC
  ├── what_you_will_do JSONB
  ├── community_impact_bullets JSONB
  ├── how_to_get_there JSONB
  ├── created_by UUID → profiles(id)
  └── lat/lng NUMERIC, tags TEXT[]

public.bookings
  ├── id UUID PK
  ├── user_id UUID FK → profiles(id)
  ├── experience_id UUID FK → experiences(id)
  ├── date DATE, time TIME
  ├── adults/children_count INTEGER
  ├── total_price NUMERIC
  ├── booking_ref TEXT (XLR-nnnn)
  └── status ENUM(Confirmed|Pending|Completed|Cancelled)

public.likes
  ├── user_id UUID FK → profiles(id)
  ├── experience_id UUID FK → experiences(id)
  └── PRIMARY KEY (user_id, experience_id)

public.passport_stamps
  ├── id UUID PK
  ├── user_id UUID FK → profiles(id)
  ├── title TEXT, category TEXT, date TEXT
  ├── icon_type TEXT, color TEXT
  └── booking_id UUID FK → bookings(id)

public.app_configs
  ├── user_id UUID PK → profiles(id)
  ├── greeting_tone, language, tip_focus TEXT[]
  ├── enable_nica_sound, show_co2_in_lbs BOOLEAN
  └── updated_at TIMESTAMPTZ

public.guides
  ├── id UUID PK
  ├── profile_id UUID FK → profiles(id)
  ├── experience_id UUID FK → experiences(id)
  ├── welcome_msg TEXT
  └── faq JSONB
```

### 3.2 Seed data

El archivo `supabase/seed.sql` contiene:
- DDL completo de las 7 tablas + RLS policies
- 4 experiencias iniciales migradas desde `src/data.ts` (coffee-journey, weaving-workshop, cooking-masterclass, market-walk)

---

## 4. API REST (Express)

### 4.1 Middleware chain

```
Request → CORS → JSON parser → Route → JWT verify (si aplica) → Handler → Response
                                       ↓ (si error)
                                  Error Handler → JSON error response
```

### 4.2 Autenticación

El middleware `auth.ts`:
1. Extrae `Authorization: Bearer <token>` del header
2. Verifica firma HS256 contra `JWT_SECRET` usando `jsonwebtoken`
3. Adjunta `req.user = { userId, userRole, sub, email }`
4. Si el token falta o es inválido → `401`
5. `optionalAuth` es una variante que no rechaza si falta token (usada para rutas públicas que opcionalmente personalizan contenido)

### 4.3 Roles y permisos

Jerarquía: `visitor(0) → traveler(1) → guide(2) → admin(3)`

Verificado en cada endpoint que requiere autorización:

| Endpoint | Rol mínimo |
|----------|-----------|
| `POST /api/bookings` | traveler |
| `POST /api/experiences` | guide |
| `PUT /api/experiences/:id` | guide (owner) o admin |
| `DELETE /api/experiences/:id` | admin |

### 4.4 Validación (Zod)

Schemas en `backend/src/validators/schemas.ts`. Independientes de los del frontend pero equivalentes.

```typescript
export const bookingSchema = z.object({
  experienceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  adultsCount: z.number().int().min(1).max(20),
  childrenCount: z.number().int().min(0).max(15).default(0),
});
```

### 4.5 Manejo de errores

Express 4 no captura errores en `async` handlers por defecto. Usamos `express-async-errors` (monkeypatch de `Promise`). El `errorHandler` middleware captura:

- `AppError` → status code personalizado + mensaje
- `ZodError` → 400 con issues
- Error genérico → 500

---

## 5. Frontend Integration

### 5.1 AuthContext

Reemplaza el session simulado de `localStorage` (`src/lib/security/session.ts`).

**Estado:**
- `user`, `token`, `loading`, `error`
- Persistencia en `localStorage('xolara_session_v2')`
- Verificación de validez del token al montar (`GET /auth/me`)

**Métodos:**
- `signIn(email, password)` → llama a `POST /auth/signin`, guarda token
- `signUp(email, password, displayName, role)` → llama a `POST /auth/signup`
- `signOut()` → limpia localStorage + estado

### 5.2 API Client (`src/lib/api.ts`)

Wrapper tipado sobre `fetch` con:
- Inyección automática de JWT desde localStorage
- Header `Content-Type: application/json`
- Manejo de errores unificado (`ApiError`)
- Módulos por recurso: `authApi`, `experiencesApi`, `bookingsApi`, `likesApi`, `passportApi`, `guidesApi`, `configApi`

### 5.3 Supabase Client (`src/lib/supabase.ts`)

Cliente `@supabase/supabase-js` configurado con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Actualmente no se usa directamente para queries (todo pasa por Express). Disponible para futura integración con Realtime o Storage.

---

## 6. Docker Compose

### 6.1 Servicios

| Servicio | Imagen | Puerto expuesto | Depende de |
|----------|--------|-----------------|------------|
| `db` | supabase/postgres:16.3.0.0 | 5432 | — |
| `auth` | supabase/gotrue:v2.165.0 | 9999 | db (healthy) |
| `studio` | supabase/studio:20250101-6b6c1c6 | 3001 | db (healthy) |
| `backend` | ./backend/Dockerfile | 4000 | db (healthy) |
| `frontend` | ./frontend/Dockerfile | 3000 | backend |

### 6.2 Volúmenes

- `db-data`: Datos persistentes de PostgreSQL
- `uploads-data`: Archivos subidos por usuarios

### 6.3 Entorno de desarrollo (híbrido)

```
Terminal 1:  docker compose up db auth studio         # Supabase en Docker
Terminal 2:  cd backend && npx tsx watch src/index.ts  # Express con hot-reload
Terminal 3:  pnpm dev                                  # Vite con HMR
```

### 6.4 Entorno de producción

```bash
docker compose up --build -d
```

Nginx sirve el frontend en :80 y proxy `/api/` → backend:4000.

---

## 7. Seguridad

| Aspecto | Implementación |
|---------|---------------|
| Autenticación | JWT HS256, verificado con `jsonwebtoken` |
| Hash de contraseñas | PBKDF2 + SHA-512 + salt 16 bytes (Node `crypto`) |
| RBAC | Rol en JWT, verificado en middleware por endpoint |
| Validación de input | Zod 4 en frontend y backend |
| CORS | Origen configurable (`CORS_ORIGIN`) |
| Headers de seguridad | CSP, X-Frame-Options, etc. en `vercel.json` y `nginx.conf` |
| Upload sanitization | `multer` con límite de tamaño (10MB) |
| SQL injection | Prevenido por `pg` con parámetros posicionales ($1, $2) |

---

## 8. Decisiones técnicas

### 8.1 ¿Por qué Express y no PostgREST?

PostgREST genera API automática desde el schema SQL, pero:
- No permite lógica de negocio personalizada (generar booking ref, crear stamps)
- Las RLS policies son complejas de mantener
- Express da control total sobre el middleware y la validación

### 8.2 ¿Por qué Supabase GoTrue y no un auth custom?

GoTrue provee:
- Manejo de JWTs (firma, expiración, refresh)
- Password recovery flow
- Integración con OAuth (futuro)
- Tabla `auth.users` ya tiene triggers y funciones útiles

### 8.3 ¿Por qué npm y no pnpm en backend?

El backend es un proyecto Node.js standalone dentro del monorepo. Usar npm simplifica el Dockerfile (no necesita pnpm). El frontend sigue usando pnpm.

### 8.4 ¿Por qué hash con PBKDF2 y no bcrypt?

`crypto.pbkdf2Sync` es nativo de Node.js — no requiere dependencias adicionales, lo que simplifica el Dockerfile (no necesita `bcrypt` ni `bcryptjs`). SHA-512 con 1000 iteraciones es seguro para este contexto.

---

## 9. Diagramas

Los diagramas Mermaid están en `docs/diagrams/`:
- `class-diagram.mmd` — Tipos de datos + módulos
- `component-diagram.mmd` — Componentes React + servicios backend
- `sequence-diagram.mmd` — Flujo de reserva completo (frontend → API → DB)
- `state-diagram.mmd` — Máquina de estados de navegación
- `er-diagram.mmd` — Modelo entidad-relación de PostgreSQL
