# Deployment Guide

## Prerequisites

- A [Vercel](https://vercel.com) account
- The GitHub repo connected to Vercel

## Setup

1. Go to [vercel.com/new](https://vercel.com/new) and import the `Jose21NC/Xolara` repository.
2. Vercel auto-detects Vite. Confirm the settings:
   - **Framework Preset**: Vite
   - **Install Command**: `pnpm install`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
3. Click **Deploy**.

No environment variables are required.

## Deployments

| Trigger | Branch | Target |
|---------|--------|--------|
| Push to `main` | `main` | Production |
| Push to `develop` | `develop` | Preview |
| Pull Request | any | Preview (per-commit) |

## Custom Domain

1. In the Vercel dashboard, go to **Settings → Domains**.
2. Add your domain and follow the DNS verification steps.
3. Vercel provisions SSL automatically.

## Rollback

1. Go to **Deployments** in the Vercel dashboard.
2. Find the last working deployment.
3. Click **··· → Promote to Production**.

## Performance Notes

- Vite builds are fast (~5s for this project).
- Vercel serves static assets from its global edge network.
- The `dist/` folder is lightweight — no server-side rendering overhead.
