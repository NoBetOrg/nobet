# Nobet — Project Initial Setup

## Overview

Nobet is a full-stack TypeScript application using a monorepo architecture. The backend serves as a standalone API that will be consumed by multiple clients: a React web app (initially) and mobile apps via Expo/React Native (in the future).

---

## Tech Stack

### Backend

| Concern              | Technology                  |
| -------------------- | --------------------------- |
| Runtime              | Node.js v22.20.0 (LTS)      |
| Language             | TypeScript                  |
| API Framework        | Hono                        |
| API Protocol         | tRPC                        |
| ORM                  | Drizzle ORM                 |
| Migrations           | Drizzle Kit                 |
| Validation           | Zod                         |
| Auth                 | Better Auth                 |
| Database             | PostgreSQL (Neon serverless) |

### Frontend (Web)

| Concern              | Technology                  |
| -------------------- | --------------------------- |
| Framework            | React                       |
| Build Tool           | Vite                        |
| Language             | TypeScript                  |
| Styling              | Tailwind CSS v4             |
| Component Library    | shadcn/ui                   |
| Routing              | TanStack Router             |
| API Client           | tRPC + TanStack Query       |
| Forms                | React Hook Form + Zod       |
| Client State         | Zustand (when needed)       |

### Monorepo & Tooling

| Concern              | Technology                  |
| -------------------- | --------------------------- |
| Package Manager      | pnpm                        |
| Monorepo Orchestrator| Turborepo                   |
| Linting & Formatting | Biome                       |
| Testing              | Vitest (unit) + Playwright (E2E) |
| Deployment (Web+API) | Vercel                      |

---

## Monorepo Structure

```
nobet/
├── apps/
│   ├── web/                      # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── components/       # UI components
│   │   │   ├── routes/           # TanStack Router route definitions
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities, helpers
│   │   │   ├── stores/           # Zustand stores (if needed)
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                      # Hono + tRPC backend
│       ├── src/
│       │   ├── routes/           # tRPC routers (organized by domain)
│       │   ├── middleware/       # Hono middleware (auth, logging, cors)
│       │   ├── trpc/
│       │   │   ├── router.ts     # Root tRPC router (merges all sub-routers)
│       │   │   ├── context.ts    # tRPC context creation (db, session, etc.)
│       │   │   └── trpc.ts       # tRPC instance initialization
│       │   └── index.ts          # Hono app entry point
│       ├── api/
│       │   └── [[...route]].ts   # Vercel serverless catch-all entry
│       ├── tsconfig.json
│       ├── vercel.json
│       └── package.json
│
├── packages/
│   ├── db/                       # Database layer (Drizzle)
│   │   ├── src/
│   │   │   ├── schema/           # Drizzle table definitions (one file per domain)
│   │   │   ├── client.ts         # Database connection (Neon serverless driver)
│   │   │   └── index.ts          # Re-exports
│   │   ├── drizzle/              # Generated migration SQL files
│   │   ├── drizzle.config.ts     # Drizzle Kit configuration
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── shared/                   # Shared code across all apps
│   │   ├── src/
│   │   │   ├── schemas/          # Zod schemas (validation + type inference)
│   │   │   ├── types/            # Shared TypeScript types
│   │   │   ├── utils/            # Pure utility functions
│   │   │   └── constants.ts      # Shared constants
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api-client/               # tRPC client configuration
│       ├── src/
│       │   ├── trpc.ts           # tRPC React client setup
│       │   └── provider.tsx      # QueryClient + tRPC provider component
│       ├── tsconfig.json
│       └── package.json
│
├── turbo.json                    # Turborepo pipeline configuration
├── pnpm-workspace.yaml           # pnpm workspace definition
├── tsconfig.base.json            # Shared TypeScript base config
├── biome.json                    # Biome linter/formatter config
├── .gitignore
├── .env.example                  # Environment variable template
└── package.json                  # Root package.json (workspace scripts)
```

---

## Package Internal Names

| Directory            | Package Name        |
| -------------------- | ------------------- |
| `apps/web`           | `@nobet/web`        |
| `apps/api`           | `@nobet/api`        |
| `packages/db`        | `@nobet/db`         |
| `packages/shared`    | `@nobet/shared`     |
| `packages/api-client`| `@nobet/api-client` |

---

## Package Dependency Graph

```
@nobet/web
  ├── @nobet/api-client   (tRPC hooks + provider)
  └── @nobet/shared       (Zod schemas, types, utils)

@nobet/api
  ├── @nobet/db           (Drizzle schema + client)
  └── @nobet/shared       (Zod schemas, types, utils)

@nobet/api-client
  └── @nobet/api          (type-only import of the tRPC AppRouter type)

@nobet/db
  └── (no internal dependencies)

@nobet/shared
  └── (no internal dependencies)
```

---

## Key Configuration Files

### `pnpm-workspace.yaml`

Defines which directories are part of the workspace:
- `apps/*`
- `packages/*`

### `turbo.json`

Defines the build/dev/lint/test pipeline with proper dependency ordering:
- `build` — depends on `^build` (build dependencies first)
- `dev` — runs all apps in parallel (persistent)
- `lint` — runs independently
- `test` — runs independently
- `db:generate` — generates Drizzle migrations
- `db:migrate` — runs Drizzle migrations

### `tsconfig.base.json`

Shared compiler options extended by all packages:
- `strict: true`
- `target: ES2022`
- `module: ESNext`
- `moduleResolution: bundler`
- Path aliases configured per package

### `biome.json`

Single configuration at the root for consistent formatting and linting across all packages.

---

## Environment Variables

All environment variables are defined in the root `.env` file and referenced by the apps that need them.

| Variable              | Used By    | Description                        |
| --------------------- | ---------- | ---------------------------------- |
| `DATABASE_URL`        | `@nobet/db`| Neon PostgreSQL connection string  |
| `BETTER_AUTH_SECRET`  | `@nobet/api`| Secret for Better Auth sessions   |
| `BETTER_AUTH_URL`     | `@nobet/api`| Base URL of the API                |
| `VITE_API_URL`        | `@nobet/web`| API URL for the tRPC client        |

---

## Development Workflow

### First-time setup

1. Install pnpm globally (if not installed): `npm install -g pnpm`
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and fill in values
4. **(Optional)** Start local Docker services: `pnpm run docker:up` (see [Local Docker Setup](#local-docker-setup-optional) below)
5. Generate Drizzle migrations: `pnpm run db:generate`
6. Run migrations against the database: `pnpm run db:migrate`
7. Start all apps in development mode: `pnpm run dev`

### Common commands (from root)

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `pnpm run dev`        | Start all apps in dev mode (via Turborepo)     |
| `pnpm run build`      | Build all apps and packages                    |
| `pnpm run lint`       | Lint all packages with Biome                   |
| `pnpm run test`       | Run all tests with Vitest                      |
| `pnpm run db:generate`| Generate Drizzle migration files from schema   |
| `pnpm run db:migrate` | Apply pending migrations to the database       |
| `pnpm run db:studio`  | Open Drizzle Studio (database GUI)             |
| `pnpm run docker:up`  | Start local Docker services (PostgreSQL)       |
| `pnpm run docker:down`| Stop local Docker services                     |
| `pnpm run docker:reset`| Stop services and remove data volumes         |

---

## Local Docker Setup (Optional)

A `docker-compose.yml` is provided for running development dependencies locally. This is **entirely optional** — you can also connect directly to a remote Neon database during development.

### When to use it

- You want a fully offline local development environment
- You want to avoid using your Neon free-tier quota during development
- You need a disposable database you can reset quickly

### Services

| Service    | Image               | Port  | Description                        |
| ---------- | ------------------- | ----- | ---------------------------------- |
| `postgres` | `postgres:17-alpine`| 5432  | Local PostgreSQL database          |

### Usage

```bash
# Start local services
pnpm run docker:up

# Verify PostgreSQL is running
docker compose ps

# Stop services (data persists)
pnpm run docker:down

# Stop services and delete all data
pnpm run docker:reset
```

### Local database connection

When using the local Docker PostgreSQL, set this in your `.env`:

```
DATABASE_URL=postgresql://nobet:nobet@localhost:5432/nobet
```

This is already the default in `.env.example`. Switch to the Neon connection string when you want to use the remote database instead.

> **Note:** The local PostgreSQL uses the standard `pg` driver (TCP connection), while Neon uses its HTTP-based serverless driver. Drizzle ORM supports both — ensure `@nobet/db` is configured to use the appropriate driver based on the connection string. For local development, `postgres` from the `postgres` package or `pg` works; for Neon, use `@neondatabase/serverless`.

---

## Deployment

### Vercel Setup

Two Vercel projects are created from the same Git repository:

| Vercel Project | Root Directory | Framework Preset | Purpose           |
| -------------- | -------------- | ---------------- | ----------------- |
| `nobet-web`    | `apps/web`     | Vite             | React SPA         |
| `nobet-api`    | `apps/api`     | Other            | Serverless API    |

Both projects share the same environment variables configured in Vercel's dashboard.

### Database

PostgreSQL is hosted on **Neon** (serverless). The `@nobet/db` package uses Neon's HTTP-based serverless driver (`@neondatabase/serverless`) which is compatible with Vercel's serverless functions (no persistent connections needed).

---

## Future Expansion

### Mobile App (planned)

A new `apps/mobile` directory will be added using **Expo (React Native)**. It will:
- Import `@nobet/api-client` for tRPC hooks (same typed API calls as web)
- Import `@nobet/shared` for Zod schemas, types, and utilities
- Use Expo Router for navigation
- Use NativeWind (Tailwind for React Native) for styling
- Be built and deployed via Expo Application Services (EAS)

No backend changes will be required — the same tRPC API serves both web and mobile.

### Public API (if needed)

REST endpoints with OpenAPI documentation can be added alongside tRPC in the same Hono app under `/api/v1/*`, using `@hono/zod-openapi`. This allows third-party consumers without affecting the internal tRPC layer.
