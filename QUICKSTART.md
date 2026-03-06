# Quick Start Guide

Get Nobet running locally in 5 minutes.

## 1. Prerequisites

```bash
# Check Node.js version (should be 22.20.0)
node --version

# Install pnpm if not already installed
npm install -g pnpm
```

## 2. Install Dependencies

```bash
pnpm install
```

> **Note**: If you get a pnpm store version error, run `pnpm install` again - this happens when switching between different pnpm versions.

## 3. Setup Environment

```bash
# API environment variables
cp apps/api/.env.example apps/api/.env

# Web environment variables
cp apps/web/.env.example apps/web/.env
```

The default `.env.example` files are pre-configured for local Docker PostgreSQL.

## 4. Start Database (Docker)

```bash
# Start PostgreSQL in Docker
pnpm run docker:up

# Verify it's running
docker compose ps
```

## 5. Run Database Migrations

```bash
# Generate migration files from schema
pnpm run db:generate

# Apply migrations to database
pnpm run db:migrate
```

> **Note**: The database commands automatically load the `.env` file from `apps/api/`. Make sure Docker is running before running migrations.

## 6. Start Development Servers

```bash
pnpm run dev
```

This starts:
- **API**: http://localhost:3000
- **Web App**: http://localhost:5173

## 7. Verify It Works

Open http://localhost:5173 in your browser. You should see:
- Welcome message
- API health check showing "Status: ok"
- Current timestamp from the API

## Next Steps

### View Database with Drizzle Studio

```bash
pnpm run db:studio
```

Opens at http://localhost:4983

### Code Quality & Formatting

```bash
# Check and fix linting issues
pnpm run lint:fix

# Format all code
pnpm run format

# Check formatting (useful for CI)
pnpm run format:check
```

> **Note**: This project uses [Biome](https://biomejs.dev/) instead of ESLint + Prettier for faster linting and formatting.

### Build for Production

```bash
pnpm turbo run build --filter="@nobet/api" --filter="@nobet/web"
```

### Add shadcn/ui Components

```bash
cd apps/web
npx shadcn@latest add button
```

### Stop Docker Services

```bash
# Stop (data persists)
pnpm run docker:down

# Stop and delete all data
pnpm run docker:reset
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5173 are in use:
- API port: Change in `apps/api/src/index.ts`
- Web port: Change in `apps/web/vite.config.ts` or use `--port` flag

### Database Connection Failed

Make sure Docker is running:
```bash
docker compose ps
```

If PostgreSQL isn't running:
```bash
pnpm run docker:up
```

### Module Not Found Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules
pnpm install
```

### Type Errors in Web App

If you see `trpc` showing as `any` type or TypeScript errors about missing types:

1. **Build the API first** to generate TypeScript declaration files:
```bash
pnpm turbo run build --filter="@nobet/api"
```

2. **Restart the TypeScript server** in your IDE:
   - VS Code/Cursor: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

3. **Restart the dev server** to pick up new types:
```bash
# Stop the current dev server (Ctrl+C), then:
pnpm run dev
```

### Environment Variables Not Loading

If `import.meta.env.VITE_API_URL` is undefined:

1. Make sure `apps/web/.env` exists (not `apps/web/.env.example`)
2. Restart the dev server (Vite only loads `.env` at startup)
3. Verify the variable is prefixed with `VITE_` (required for Vite)

If API can't connect to the database:

1. Make sure `apps/api/.env` exists with `DATABASE_URL`
2. Restart the API dev server
3. Check Docker is running if using local PostgreSQL

### `.js` Files in Source Directories

If you see `.js` files appearing next to your `.ts`/`.tsx` files:

1. Delete them: `find apps/web/src -name "*.js" -delete`
2. These are already ignored in `.gitignore`
3. This shouldn't happen with `noEmit: true` in tsconfig

### Build Fails with "Conflicting Routes"

If TanStack Router reports duplicate routes:

1. Check for `.js` files in your routes directory
2. Delete them and ensure your `tsconfig.json` has `"noEmit": true`

## Using Neon Instead of Docker

1. Create account at [console.neon.tech](https://console.neon.tech)
2. Create a project and copy the connection string
3. Update `apps/api/.env`:
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```
4. Run migrations: `pnpm run db:migrate`
5. Skip the `docker:up` command

That's it! You're ready to start building.
