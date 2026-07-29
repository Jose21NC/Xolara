# Environment Setup

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | >= 20 | LTS recommended |
| pnpm | >= 11 | **npm is blocked** — do not use |

## Package Manager

This project uses **pnpm exclusively**. The `.npmrc` enforces this:

```ini
engine-strict=true
package-manager-strict=true
```

This means `npm install` will fail. Always use `pnpm`:

```bash
pnpm install
```

## No Environment Variables

Xolara is a **visual-only deliverable** with no backend, no API keys, and no external services. There are no `.env` files and none are needed.

Everything runs client-side:
- All data is seed/static from `src/data.ts`
- Sessions are stored in `localStorage`
- No Firebase, no Google Maps API, no authentication tokens

## Vite Dev Server

The dev server is configured in `package.json`:

```bash
pnpm dev
# Equivalent to: vite --port=3000 --host=0.0.0.0
```

| Setting | Value |
|---------|-------|
| Port | 3000 |
| Host | `0.0.0.0` (accessible from network) |
| HMR | Enabled by default (disable with `DISABLE_HMR=true`) |

Open [http://localhost:3000](http://localhost:3000).

## Build Configuration

```bash
pnpm build      # Production build to dist/
pnpm preview    # Serve the production build locally
pnpm clean      # Remove dist/ and Vite cache
```

The build outputs a static `dist/` directory — suitable for any static host (Vercel, Netlify, GitHub Pages).

## Import Alias

The `@` alias maps to the project root. Configured in both `vite.config.ts` and `tsconfig.json`:

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, '.'),
  },
}

// Usage
import { EXPERIENCES_DATA } from '@/data';
```

## TypeScript

Type-checking is done via:

```bash
pnpm lint    # runs: tsc --noEmit
```

There is no ESLint configured. The `lint` script is strictly for TypeScript type verification.
