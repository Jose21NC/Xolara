# Security

> ⚠️ **Seguridad full-stack / Full-stack security**
>
> Xolara ahora tiene backend propio con autenticación JWT real, roles, y hash de contraseñas.
> Las medidas de seguridad cubren frontend (sanitización) y backend (auth, validación, headers).

---

## 1. Autenticación

### 1.1 JWT (JSON Web Token)

- **Algoritmo**: HS256 (HMAC con SHA-256)
- **Firma**: `JWT_SECRET` compartido entre GoTrue y Express
- **Expiración**: 1 hora (configurable via `GOTRUE_JWT_EXP`)
- **Payload**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "aud": "authenticated",
  "user_metadata": {
    "display_name": "Elena Santos",
    "role": "traveler"
  }
}
```

### 1.2 Flujo de auth

```
Cliente                  Express API               PostgreSQL
  │                        │                        │
  │── POST /auth/signin ──▶│                        │
  │                        │── SELECT user ────────▶│
  │                        │◀─ user + hash ─────────│
  │                        │── verifyPassword() ────│
  │                        │── sign JWT ────────────│
  │◀─ { token, user } ─────│                        │
  │                        │                        │
  │── GET /bookings ──────▶│                        │
  │   Authorization: Bearer │                        │
  │                        │── verify(JWT, SECRET)  │
  │                        │── SELECT bookings ────▶│
  │◀─ bookings[] ──────────│◀─ rows ────────────────│
```

### 1.3 Hash de contraseñas

```typescript
// Hash (signup)
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
const stored = `${salt}:${hash}`;

// Verify (signin)
const [salt, hash] = stored.split(':');
const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');
const valid = timingSafeEqual(computed, Buffer.from(hash, 'hex'));
```

Usamos `crypto` nativo de Node.js — sin dependencias externas. PBKDF2 con SHA-512, 1000 iteraciones, salt de 16 bytes.

---

## 2. Control de acceso basado en roles (RBAC)

### 2.1 Jerarquía

```
visitante (0) → viajero (1) → guía (2) → admin (3)
```

### 2.2 Permisos por endpoint

| Endpoint | Rol mínimo | Notas |
|----------|-----------|-------|
| `GET /api/experiences` | — | Público |
| `GET /api/experiences/:id` | — | Público |
| `GET /api/guides/:expId` | — | Público |
| `GET /api/health` | — | Público |
| `POST /api/auth/signup` | — | Público |
| `POST /api/auth/signin` | — | Público |
| `GET /api/auth/me` | Cualquiera autenticado | 🔒 |
| `GET /api/bookings` | Cualquiera autenticado | 🔒 |
| `POST /api/bookings` | traveler+ | 🔒 |
| `POST /api/likes/:expId` | Cualquiera autenticado | 🔒 |
| `POST /api/experiences` | guide+ | 🔒 |
| `PUT /api/experiences/:id` | guide+ (owner) o admin | 🔒 |
| `DELETE /api/experiences/:id` | admin | 🔒 |

### 2.3 Implementación

Middleware JWT (ver `backend/src/middleware/auth.ts`):
```typescript
// Extrae rol del user_metadata del JWT
req.user = {
  userId: payload.sub,
  userRole: payload.user_metadata?.role || 'visitor',
};

// Verificación en ruta
if (req.user!.userRole !== 'guide' && req.user!.userRole !== 'admin') {
  throw new AppError(403, 'Solo guías y administradores pueden crear experiencias');
}
```

---

## 3. Validación de datos

### 3.1 Backend (Zod 4)

Schemas en `backend/src/validators/schemas.ts`:
- `signUpSchema` — email, password (6-100 chars), displayName, role
- `signInSchema` — email, password
- `bookingSchema` — UUID de experiencia, fecha (YYYY-MM-DD), hora (HH:MM), conteos
- `experienceSchema` — título, categoría, ubicación, precio, etc.
- `configSchema` — preferencias del usuario

### 3.2 Frontend (Zod 4)

Schemas en `src/lib/validation/schemas.ts` con mensajes de error en español.
Validación adicional vía `sanitize.ts`:
- `sanitizeHTML()` — escapa HTML entities
- `sanitizeInput()` — remueve <, >, javascript:, on*=
- `sanitizeURL()` — solo permite http/https

### 3.3 SQL Injection

Prevenido por `pg` con parámetros posicionales:
```typescript
// Seguro
await query('SELECT * FROM users WHERE email = $1', [email]);

// Inseguro (nunca hacemos esto)
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 4. Headers de seguridad

### 4.1 Producción (Nginx)

Configurados en `frontend/nginx.conf`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4.2 Vercel (frontend standalone)

Configurados en `vercel.json` con Content-Security-Policy.

### 4.3 CORS

Backend:
```typescript
app.use(cors({ origin: config.corsOrigin, credentials: true }));
```

`CORS_ORIGIN` permite solo el origen del frontend (default `http://localhost:3000`).

---

## 5. Manejo de errores

### 5.1 Error Boundary (frontend)

`src/components/ErrorBoundary.tsx` — clase React que captura errores de renderizado.

### 5.2 Error Handler (backend)

`backend/src/middleware/errorHandler.ts` — middleware Express que captura:
- `AppError` → status code + mensaje (ej: 401, 403, 404)
- `ZodError` → 400 con lista de issues
- Error genérico → 500 (no expone detalles internos)

---

## 6. Buenas prácticas implementadas

- [x] Contraseñas hasheadas con PBKDF2 + SHA-512 + salt
- [x] JWT con expiración (1 hora)
- [x] Rol verificado en cada endpoint protegido
- [x] Validación Zod en frontend y backend
- [x] Sanitización de input en frontend
- [x] SQL parameterized queries (sin concatenación)
- [x] CORS restringido
- [x] Headers de seguridad HTTP
- [x] Error boundary en UI
- [x] Error handler que no filtra internals
- [x] Límite de tamaño en uploads (10MB)

---

## 7. Lo que NO está implementado (próximos pasos)

- [ ] Rate limiting por IP (express-rate-limit)
- [ ] Refresh tokens (GoTrue lo soporta, falta integración)
- [ ] Row Level Security (RLS) en PostgreSQL (actualmente todo pasa por Express)
- [ ] Validación de email (envío de confirmación)
- [ ] Logging estructurado (winston/pino)
- [ ] Tests de seguridad (OWASP ZAP, etc.)
- [ ] HTTPS en desarrollo (mkcert + localhost)
