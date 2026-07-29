# Git Branching Strategy

## Branch Model

| Branch | Propósito | Origen | Deploy |
|--------|-----------|--------|--------|
| `main` | Código listo para producción | PR desde `develop` | Producción |
| `develop` | Integración de trabajo en curso | PR desde `feature/*` / `fix/*` | Preview |
| `feature/*` | Nuevas características | `develop` | — |
| `fix/*` | Corrección de bugs | `develop` | — |

## Nomenclatura

- `feature/<descripcion-corta>` — ej. `feature/supabase-backend`
- `fix/<descripcion-corta>` — ej. `fix/jwt-expiration`

## Flujo de trabajo

```
feature/* ──PR──▶ develop ──PR──▶ main
fix/*    ──PR──▶ develop ──PR──▶ main
```

1. Crear rama desde `develop` para todo trabajo
2. Abrir PR contra `develop`
3. CI debe pasar (lint + build) antes de merge
4. Aprobación de al menos 1 reviewer
5. Merge a `develop`
6. Periódicamente, PR de `develop` a `main` para release

## Conventional Commits

| Prefix | Uso |
|--------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Bug fix |
| `chore:` | Build, tooling, dependencias |
| `docs:` | Documentación |
| `refactor:` | Cambio que no es fix ni feature |
| `style:` | Formato, linting |

## PR Requirements

- Descripción clara de qué cambió y por qué
- Checklist: lint pasa, build pasa, self-review, sin console.log
- Sin conflictos con la rama target
- Tests (cuando existan) deben pasar

## Stack actual

- **Frontend**: React 19 + TypeScript + Vite + Tailwind v4 → pnpm
- **Backend**: Express 4 + TypeScript + PostgreSQL → npm (proyecto separado)
- **Infra**: Docker Compose multi-servicio
