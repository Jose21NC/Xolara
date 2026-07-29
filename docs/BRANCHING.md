# Git Branching Strategy

## Branch Model

| Branch | Purpose | Source | Deploys to |
|--------|---------|--------|------------|
| `main` | Production-ready code | PR from `develop` | Production |
| `develop` | Integration branch for ongoing work | PR from `feature/*` / `fix/*` | Preview |
| `feature/*` | New features | `develop` | — |
| `fix/*` | Bug fixes | `develop` | — |

## Naming Conventions

- Feature branches: `feature/<short-description>` (e.g. `feature/booking-flow`)
- Fix branches: `fix/<short-description>` (e.g. `fix/date-format-bug`)

## Workflow

1. Branch off `develop` for all work.
2. Open a PR back into `develop`.
3. After review + CI green, merge into `develop`.
4. Periodically, `develop` is promoted to `main` via PR for production release.

```
feature/* ──PR──▶ develop ──PR──▶ main
fix/*    ──PR──▶ develop ──PR──▶ main
```

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use case |
|--------|----------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Build, tooling, dependencies |
| `docs:` | Documentation only |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `style:` | Formatting, missing semicolons, etc. |
| `test:` | Adding or updating tests |

## PR Requirements

- Clear description of what changed and why.
- At least 1 approval required.
- CI must pass (lint + build).
- No merge conflicts with the target branch.
