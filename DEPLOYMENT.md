# Nobet — Deployment Guide

## Prerequisites

- **Node.js v22.20.0** (pinned via `.nvmrc` and `.node-version`)
- A [Vercel](https://vercel.com) account
- A [Neon](https://neon.tech) PostgreSQL database already provisioned
- The Git repository pushed to GitHub (or GitLab/Bitbucket)

---

## 1. Database Setup (Neon)

1. Create a new Neon project at [console.neon.tech](https://console.neon.tech)
2. Copy the connection string (it looks like `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
3. Run migrations locally against the production database before the first deploy:

```bash
DATABASE_URL="your-neon-connection-string" pnpm run db:migrate
```

---

## 2. Vercel Project Setup

You need **two Vercel projects** from the same Git repository:

### Project 1: `nobet-api` (Backend)

1. Go to [vercel.com/new](https://vercel.com/new) and import your repository
2. Configure:
   - **Project Name**: `nobet-api`
   - **Root Directory**: `apps/api`
   - **Framework Preset**: `Other`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=@nobet/api`
   - **Output Directory**: _(leave default)_
   - **Install Command**: `cd ../.. && pnpm install`
3. Add environment variables:

   | Variable             | Value                                                      |
   | -------------------- | ---------------------------------------------------------- |
   | `DATABASE_URL`       | Your Neon connection string                                |
   | `BETTER_AUTH_SECRET`  | A strong random secret (`openssl rand -base64 32`)        |
   | `BETTER_AUTH_URL`    | `https://nobet-api.vercel.app` (your API's production URL) |

4. Deploy

### Project 2: `nobet-web` (Frontend)

1. Go to [vercel.com/new](https://vercel.com/new) and import the **same repository**
2. Configure:
   - **Project Name**: `nobet-web`
   - **Root Directory**: `apps/web`
   - **Framework Preset**: `Vite`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=@nobet/web`
   - **Output Directory**: `dist`
   - **Install Command**: `cd ../.. && pnpm install`
3. Add environment variables:

   | Variable       | Value                                                      |
   | -------------- | ---------------------------------------------------------- |
   | `VITE_API_URL` | `https://nobet-api.vercel.app` (your API project's URL)    |

4. Deploy

---

## 3. Vercel Project Configuration Files

### `apps/api/vercel.json`

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@nobet/api",
  "installCommand": "cd ../.. && pnpm install",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/$1" }
  ]
}
```

This rewrites all incoming requests to the serverless catch-all function at `api/[[...route]].ts`.

### `apps/web/vercel.json`

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@nobet/web",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The rewrite ensures client-side routing (TanStack Router) works — all paths fall back to `index.html`.

---

## 4. CORS Configuration

In your Hono API (`apps/api/src/index.ts`), make sure CORS allows requests from your web app's domain:

```typescript
import { cors } from 'hono/cors';

app.use('/*', cors({
  origin: [
    'http://localhost:5173',           // local dev
    'https://nobet-web.vercel.app',    // production
  ],
  credentials: true,
}));
```

Update the origins list when you add custom domains.

---

## 5. Database Migrations

Migrations should **not** run inside serverless functions. Choose one of these approaches:

### Option A: GitHub Actions (recommended)

Add a migration step to your CI/CD pipeline:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: pnpm
      - run: pnpm install
      - name: Run database migrations
        run: pnpm run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Option B: Manual

Run migrations manually before each deploy:

```bash
DATABASE_URL="your-neon-connection-string" pnpm run db:migrate
```

---

## 6. Custom Domains (Optional)

1. In Vercel, go to each project's **Settings → Domains**
2. Add your custom domains:
   - `api.nobet.com` → `nobet-api` project
   - `nobet.com` / `www.nobet.com` → `nobet-web` project
3. Update environment variables to reflect the new domains:
   - `BETTER_AUTH_URL` → `https://api.nobet.com`
   - `VITE_API_URL` → `https://api.nobet.com`
4. Update the CORS origin list in `apps/api/src/index.ts`

---

## 7. Post-Deploy Verification

After both projects are deployed:

1. Visit your API health endpoint (e.g., `https://nobet-api.vercel.app/health`) to confirm the API is running
2. Visit `https://nobet-web.vercel.app` to confirm the web app loads
3. Check that the web app can successfully call the API (auth flows, data fetching)
4. Verify environment variables are correct in the Vercel dashboard if anything fails

---

## Troubleshooting

| Issue                          | Solution                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `MODULE_NOT_FOUND` errors      | Ensure `installCommand` navigates to root (`cd ../..`) so pnpm installs all workspace deps     |
| CORS errors in browser         | Verify your API's CORS config includes the web app's domain                                    |
| Database connection failures   | Confirm `DATABASE_URL` is set in the `nobet-api` project's env vars on Vercel                  |
| Client-side routing 404s       | Ensure `vercel.json` in `apps/web` has the SPA rewrite rule                                    |
| Cold start timeouts            | Check that the serverless function bundle isn't too large; consider excluding dev dependencies  |
| Build fails in monorepo        | Ensure the build/install commands `cd ../..` to the workspace root before running pnpm/turbo    |
