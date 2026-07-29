# API Reference

> ⚠️ **AVISO — Backend autoalojado / Self-hosted backend**
>
> Xolara ahora tiene un backend propio (Express + PostgreSQL) que corre en Docker.
> Todos los endpoints listados aquí son funcionales y están implementados en `backend/src/routes/`.
> La API corre en `http://localhost:4000/api/` en desarrollo, o `/api/` en producción (proxy Nginx).

---

## Autenticación

Todas las rutas marcadas con 🔒 requieren header `Authorization: Bearer <JWT>`.

### `POST /api/auth/signup`

Registro de nuevo usuario. Crea registro en `auth.users` + `public.profiles`.

**Body:**
```json
{
  "email": "elena@example.com",
  "password": "mi-clave-segura",
  "displayName": "Elena Santos",
  "role": "traveler"
}
```
`role` puede ser `"traveler"` (default) o `"guide"`.

**Response** `201`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "elena@example.com",
    "displayName": "Elena Santos",
    "role": "traveler"
  }
}
```

### `POST /api/auth/signin`

Inicio de sesión.

**Body:**
```json
{
  "email": "elena@example.com",
  "password": "mi-clave-segura"
}
```

**Response** `200`: Mismo formato que signup.

### `GET /api/auth/me` 🔒

Perfil del usuario autenticado.

**Response** `200`:
```json
{
  "id": "uuid",
  "display_name": "Elena Santos",
  "role": "traveler",
  "avatar_url": null,
  "created_at": "2026-07-28T..."
}
```

---

## Experiencias

### `GET /api/experiences`

Lista todas las experiencias. Sin paginación (volumen pequeño).

**Response** `200`:
```json
[
  {
    "id": "a0000000-...",
    "title": "Ruta del Café Orgánico en Matagalpa",
    "location": "Matagalpa, Selva Negra",
    "country": "Nicaragua",
    "category": "Agriculture",
    "duration": "5 Horas",
    "duration_hours": 5,
    "rating": 4.95,
    "price_per_person": 55,
    "image": "https://images.unsplash.com/...",
    "tags": ["Matagalpa", "Café", "Sostenibilidad"],
    ...
  }
]
```

### `GET /api/experiences/:id`

Detalle completo de una experiencia (incluye `what_you_will_do`, `community_impact_bullets`, `how_to_get_there`).

### `POST /api/experiences` 🔒 (role: guide+)

Crear nueva experiencia.

**Body:**
```json
{
  "title": "Taller de Cacao Artesanal",
  "category": "Culinary",
  "location": "Masaya",
  "duration": "3 Horas",
  "durationHours": 3,
  "groupSize": "Máx 6 personas",
  "pricePerPerson": 30,
  "aboutCommunity": "Descripción del impacto...",
  "tags": ["Cacao", "Tradición"]
}
```

### `PUT /api/experiences/:id` 🔒 (role: guide+, solo propia o admin)

Actualizar campos parciales.

### `DELETE /api/experiences/:id` 🔒 (role: admin)

Eliminar experiencia.

---

## Reservas

### `GET /api/bookings` 🔒

Lista las reservas del usuario autenticado. Incluye `experience_title` y `experience_image` mediante JOIN.

### `POST /api/bookings` 🔒 (role: traveler+)

Crear una reserva. Genera automáticamente:
- `id`: UUID
- `booking_ref`: formato `XLR-nnnn`
- `status`: `'Confirmed'`
- `confirmed_at`: timestamp actual
- **Passport stamp**: se crea automáticamente en la tabla `passport_stamps`

**Body:**
```json
{
  "experienceId": "uuid-de-la-experiencia",
  "date": "2026-08-15",
  "time": "09:00",
  "adultsCount": 2,
  "childrenCount": 1
}
```
`totalPrice` se calcula en backend: `(adultsCount + childrenCount) * experience.price_per_person`.

### `PUT /api/bookings/:id` 🔒

Actualizar fecha y/o hora de la reserva. Solo el dueño.

**Body:** (al menos uno)
```json
{
  "date": "2026-08-20",
  "time": "11:30"
}
```

### `DELETE /api/bookings/:id` 🔒

Cancelar reserva (cambia status a `'Cancelled'`). No borra el registro.

---

## Likes

### `POST /api/likes/:experienceId` 🔒

Toggle like/unlike. Si no existe like → lo crea. Si existe → lo elimina.

**Response:**
```json
{ "liked": true }
// o
{ "liked": false }
```

### `GET /api/likes` 🔒

Lista los IDs de experiencias likeadas por el usuario.

**Response:**
```json
["uuid-1", "uuid-2"]
```

---

## Pasaporte

### `GET /api/passport` 🔒

Lista los sellos (`passport_stamps`) del usuario. Se generan automáticamente al crear una reserva confirmada.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Cerámica Ancestral de San Juan de Oriente",
    "category": "Crafts",
    "date": "Reciente",
    "icon_type": "palette",
    "color": "#a03f28"
  }
]
```

---

## Guías

### `GET /api/guides/:experienceId`

Información del guía asociado a una experiencia.

**Response:**
```json
{
  "id": "uuid",
  "name": "Néstor Guerrero",
  "avatar": "https://...",
  "welcome": "¡Hola! Soy Néstor...",
  "faq": {
    "¿Qué ropa debo usar?": "Te sugiero venir con ropa cómoda..."
  }
}
```
Retorna `null` si no hay guía asignado.

---

## Configuración

### `GET /api/config` 🔒

Configuración del usuario. Si no existe, retorna valores por defecto.

### `PUT /api/config` 🔒

Actualizar configuración. Solo campos enviados.

**Body:**
```json
{
  "greetingTone": "formal",
  "language": "es",
  "tipFocus": ["nature", "crafts"],
  "enableNicaSound": false,
  "showCo2InLbs": true
}
```

---

## Salud

### `GET /api/health`

Health check público.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-28T..."
}
```

---

## Códigos de error

| Status | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Datos inválidos (Zod validation) |
| 401 | Token faltante, inválido o expirado |
| 403 | Rol insuficiente para la operación |
| 404 | Recurso no encontrado |
| 409 | Conflicto (email ya registrado) |
| 500 | Error interno del servidor |

**Formato de error:**
```json
{
  "error": "Mensaje descriptivo en español",
  "details": [ ... ]  // solo en errores de validación
}
```
