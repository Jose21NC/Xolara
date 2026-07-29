# Security Practices

> ⚠️ **AVISO — Seguridad del frontend / Client-side security only**
>
> Xolara es una app **100% frontend** sin backend. Todas las medidas de seguridad aquí documentadas
> operan exclusivamente en el navegador y **no reemplazan** seguridad de servidor.
> Los roles, sesiones, y saneamiento son simulados/localStorage — no hay autenticación real.
>
> *Xolara is a **100% frontend** app with no backend. All security measures documented here
> operate exclusively in the browser and **do not replace** server-side security.
> Roles, sessions, and sanitization are simulated/localStorage — there is no real authentication.*

## Overview

Xolara is a client-only application with no backend. Security focuses on **input sanitization**, **session integrity**, **role-based access control**, and **XSS prevention**.

---

## Input Sanitization

**File:** `src/lib/security/sanitize.ts`

Three layers of defense against malicious input:

### `sanitizeHTML(input)`

Escapes HTML entities by creating a DOM element, setting `textContent`, and reading `innerHTML`. Prevents injection of raw HTML into the UI.

```ts
sanitizeHTML('<script>alert("xss")</script>')
// → "&lt;script&gt;alert("xss")&lt;/script&gt;"
```

### `sanitizeInput(input)`

Strips dangerous patterns from user input:
- Removes `<` and `>` characters
- Removes `javascript:` protocol (case-insensitive)
- Removes `on*=` event handler attributes
- Trims whitespace

### `sanitizeURL(url)`

Validates URLs using the `URL` constructor:
- Rejects anything that isn't a valid URL
- Only allows `http:` and `https:` protocols
- Returns empty string `""` on invalid URLs

---

## Session Management

**File:** `src/lib/security/session.ts`

Sessions are stored in `localStorage` with a **30-minute TTL**.

| Behavior | Detail |
|----------|--------|
| Storage key | `xolara_session` |
| TTL | 30 minutes (`30 * 60 * 1000` ms) |
| Auto-refresh | `getSession()` refreshes `lastActivity` on every access |
| Expiry | Session is removed if `lastActivity` exceeds TTL |
| On error | Corrupted session data is silently removed |

Session data:

```ts
{
  userId: "user-<uuid8>",
  role: 'visitor' | 'traveler' | 'guide' | 'admin',
  displayName: string,
  createdAt: number,    // epoch ms
  lastActivity: number  // epoch ms, refreshed on access
}
```

---

## Role-Based Access Control

**File:** `src/lib/roles.ts`

Four roles with hierarchical permissions:

```
visitor (0) → traveler (1) → guide (2) → admin (3)
```

| Resource | Min Role | Description |
|----------|----------|-------------|
| `explore` | visitor | Browse experiences |
| `detail` | visitor | View experience detail |
| `book` | traveler | Create a booking |
| `create-experience` | guide | Create new experiences |
| `manage-bookings` | guide | Manage booking list |
| `admin` | admin | Full access |

`hasPermission(userRole, requiredRole)` returns `true` if the user's role level >= the required level.

---

## Error Boundary

**File:** `src/components/ErrorBoundary.tsx`

A React class component that catches unhandled render errors:
- Catches errors in the component tree via `componentDidCatch`
- Logs error details to console
- Shows a fallback UI with a retry button ("Intentar de nuevo")
- Custom `fallback` prop is supported for per-instance overrides

Wraps the entire app in `App.tsx`:

```tsx
<ErrorBoundary>
  <PhoneShell>...</PhoneShell>
</ErrorBoundary>
```

---

## Zod Validation

**File:** `src/lib/validation/schemas.ts`

All user-facing forms are validated with Zod 4 schemas before data is processed:

- **`bookingSchema`** — validates date, time, adult/child counts, total price
- **`experienceSchema`** — validates title, category, location, price, image URL format
- **`configSchema`** — validates greeting tone, language, tip focus

Validation runs synchronously before any state mutation. Invalid data is rejected with Spanish error messages.

---

## Deployment Security

### Content Security Policy (Vercel)

For production deployment on Vercel, add CSP headers via `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com https://lh3.googleusercontent.com data:; connect-src 'self'"
        }
      ]
    }
  ]
}
```

---

## What's NOT Here

By design, Xolara avoids common server-side vulnerabilities:

- **No backend** — no SQL injection, no SSRF, no authentication bypass
- **No API keys in frontend** — nothing to leak
- **No cookies** — sessions use `localStorage` only
- **No external auth** — no OAuth tokens to manage
- **No database** — all data is static seed

The main attack surface is **XSS via user input**, which is mitigated by the sanitization layer.
