# API Reference

> ⚠️ **AVISO — Proyecto visual / Visual-only project**
>
> Xolara es una aplicación **100% visual** sin backend, sin base de datos, y sin API HTTP real.
> Todo lo documentado aquí son **tipos internos de TypeScript, datos semilla, y utilidades del frontend**.
> No existe servidor, ni endpoints REST, ni persistencia externa.
>
> *Xolara is a **100% visual** application with no backend, no database, and no real HTTP API.
> Everything documented here are **internal TypeScript types, seed data, and frontend utilities**.
> There is no server, no REST endpoints, and no external persistence.*

All data in Xolara is local/seed. There is no HTTP backend. This document covers the internal data types, seed data, validation schemas, security utilities, and component APIs.

## Data Types

Defined in `src/types.ts`.

### `Experience`

```ts
interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  category: 'Crafts' | 'Culinary' | 'Music' | 'Nature' | 'Agriculture';
  duration: string;
  durationHours: number;
  groupSize: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  image: string;
  aboutCommunity: string;
  whatYouWillDo: { title: string; desc: string }[];
  authenticityScore: number;
  communityImpactText: string;
  communityImpactBullets: string[];
  howToGetThere: {
    title: string;
    description: string;
    mapImage: string;
  };
  tags: string[];
  galleryImages: string[];
  lat?: number;
  lng?: number;
  createdBy?: string;
  hostName?: string;
  createdAt?: any;
}
```

### `Booking`

```ts
interface Booking {
  id: string;           // "bk-<timestamp>"
  userId?: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  date: string;
  time: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  bookingRef: string;   // "XLR-<nnnn>"
  confirmedAt: string;  // ISO timestamp
  createdAt?: any;
  status: 'Confirmed' | 'Pending' | 'Completed';
}
```

### `PassportStamp`

```ts
interface PassportStamp {
  id: string;
  title: string;
  category: string;
  date: string;
  iconType: 'mountain' | 'utensils' | 'palette' | 'coffee';
  color: string;
}
```

### `AppConfig`

```ts
interface AppConfig {
  greetingTone: 'traditional' | 'formal' | 'slang';
  language: 'es' | 'en' | 'bilingual';
  tipFocus: string[];
  enableNicaSound: boolean;
  showCo2InLbs: boolean;
}
```

---

## Seed Data

Defined in `src/data.ts`.

### `EXPERIENCES_DATA`

`Experience[]` — 4 curated experiences:

| ID | Title | Category | Location | Price |
|----|-------|----------|----------|-------|
| `coffee-journey` | Ruta del Café Orgánico en Matagalpa | Agriculture | Matagalpa | $55 |
| `weaving-workshop` | Cerámica Ancestral de San Juan de Oriente | Crafts | Masaya | $35 |
| `cooking-masterclass` | Cocina Colonial y Taller del Vigorón | Culinary | Granada | $40 |
| `market-walk` | Senderismo Eco-Volcánico y Reforestación | Nature | Volcán Masaya | $48 |

### `MAP_PINS`

Array of map pin objects with `id`, `top`, `left` (percentage positions), `icon`, `color`, and `title`.

### `RECENT_PASSPORT_STAMPS`

`PassportStamp[]` — 3 sample stamps (Volcán Mombacho, Granada Gastronómico, Cerámica Masaya).

---

## Validation Schemas

Defined in `src/lib/validation/schemas.ts`. Uses **Zod 4**.

### `bookingSchema`

```ts
{
  experienceId: string (min 1),
  date: string (min 1),
  time: string (min 1),
  adultsCount: int (1–20),
  childrenCount: int (0–15),
  totalPrice: number (> 0)
}
```

Exported as `BookingInput`.

### `experienceSchema`

```ts
{
  title: string (3–100 chars),
  category: 'Crafts' | 'Culinary' | 'Agriculture' | 'Nature' | 'Music',
  location: string (2–100 chars),
  duration: string (min 1),
  pricePerPerson: number (1–1000),
  aboutCommunity: string (10–500 chars),
  image: string (URL, must end in image extension or be Unsplash)
}
```

Exported as `ExperienceInput`.

### `configSchema`

```ts
{
  greetingTone: 'traditional' | 'formal' | 'slang',
  language: 'es' | 'en' | 'bilingual',
  tipFocus: string[] (min 1),
  enableNicaSound: boolean,
  showCo2InLbs: boolean
}
```

Exported as `ConfigInput`.

### `validate()`

Generic helper that wraps `schema.safeParse()` and returns `{ success: true; data: T } | { success: false; errors: string[] }` with Spanish error messages.

---

## Security Utilities

### `sanitize` — `src/lib/security/sanitize.ts`

| Function | Description |
|----------|-------------|
| `sanitizeHTML(input)` | Escapes HTML entities by setting `textContent` and reading `innerHTML` |
| `sanitizeInput(input)` | Strips `<`, `>`, `javascript:` protocol, and `on*=` event handlers |
| `sanitizeURL(url)` | Validates URL with `new URL()`, allows only `http:` / `https:` protocols; returns `""` on failure |

### `session` — `src/lib/security/session.ts`

Session object stored in `localStorage` under key `xolara_session`:

```ts
interface Session {
  userId: string;    // "user-<uuid8>"
  role: Role;
  displayName: string;
  createdAt: number;
  lastActivity: number;
}
```

| Function | Description |
|----------|-------------|
| `createSession(role?, displayName?)` | Creates a new session, persists to `localStorage` |
| `getSession()` | Reads session, checks 30-min TTL, refreshes `lastActivity`, returns `null` if expired |
| `destroySession()` | Removes session from `localStorage` |
| `isSessionValid()` | Returns `true` if a valid (non-expired) session exists |

### `roles` — `src/lib/roles.ts`

```ts
type Role = 'visitor' | 'traveler' | 'guide' | 'admin';
```

| Function | Description |
|----------|-------------|
| `hasPermission(userRole, requiredRole)` | Checks if `userRole` >= `requiredRole` in hierarchy (0–3) |
| `canAccess(userRole, resource)` | Maps resource string to required role, checks permission |
| `getRoleName(role)` | Returns Spanish display name ("Visitante", "Viajero", "Guía Local", "Administrador") |

**Resource permissions:**

| Resource | Min Role |
|----------|----------|
| `explore` | visitor |
| `detail` | visitor |
| `book` | traveler |
| `create-experience` | guide |
| `manage-bookings` | guide |
| `admin` | admin |

---

## State Management

All state lives in `App.tsx` as local React state. No Redux, no Context API.

| State | Type | Purpose |
|-------|------|---------|
| `activeTab` | `'explore' \| 'experiences' \| 'passport' \| 'profile'` | Bottom nav tab |
| `currentScreen` | `'explore' \| 'detail' \| 'reservation' \| 'confirmed' \| 'configuration' \| 'create_exp'` | Full-screen overlay |
| `session` | `Session` | Current user session |
| `config` | `AppConfig` | App preferences |
| `experiences` | `Experience[]` | Seed data (immutable) |
| `selectedExperienceId` | `string` | Currently viewed experience |
| `bookings` | `Booking[]` | User bookings |
| `activeBookingId` | `string \| null` | Currently selected booking |
| `likedExperiences` | `string[]` | Liked experience IDs |
| `activeCategory` | `string` | Active filter category |
| `searchQuery` | `string` | Explore tab search |
| `experienceSearchTerm` | `string` | Experiences tab search |

---

## Component API

### `PhoneShell`

```ts
interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
}
```

Centered `max-w-md` phone frame with ambient background layer.

### `BottomNavBar`

```ts
interface BottomNavBarProps {
  activeTab: 'explore' | 'experiences' | 'passport' | 'profile';
  onTabClick: (tab: NavItem['key']) => void;
}
```

### `ExperienceCard`

```ts
interface ExperienceCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  country: string;
  rating: number;
  pricePerPerson: number;
  aboutCommunity: string;
  isLiked: boolean;
  onSelect: (id: string) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}
```

### `ErrorBoundary`

```ts
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

Class component that catches render errors and shows a recoverable UI with a retry button.
