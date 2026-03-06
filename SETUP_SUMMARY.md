# Setup Summary

This document summarizes the complete setup of the Nobet monorepo and key issues resolved during initial development.

## Project Structure

The monorepo is now fully configured with:

- **Root**: pnpm workspaces, Turborepo, Biome, shared TypeScript config
- **apps/api**: Hono + tRPC backend with TypeScript declaration files
- **apps/web**: React + Vite + TanStack Router frontend
- **packages/db**: Drizzle ORM with lazy initialization pattern
- **packages/api-client**: tRPC React hooks with type safety
- **packages/shared**: Shared schemas, types, and utilities

## Key Configuration Decisions

### 1. TypeScript Configuration

**API (`apps/api/tsconfig.json`)**:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false,
    "declaration": true,
    "declarationMap": true
  }
}
```

- Generates `.d.ts` files for type exports to other packages
- Outputs compiled JS and types to `dist/`

**Web (`apps/web/tsconfig.json`)**:
```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

- Type-checking only, no JS emission (Vite handles compilation)
- Prevents `.js` files from appearing in source directories

**API Client (`packages/api-client/tsconfig.json`)**:
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "dependencies": {
    "@nobet/api": "workspace:*"
  }
}
```

- Includes Vite client types for `import.meta.env`
- Depends on API package for tRPC type imports

### 2. Environment Variables

**Location**: All environment variables in `.env` at workspace root.

**Node.js (API)**:
- Uses `dotenv` package
- Explicit `dotenv.config()` at the top of `apps/api/src/index.ts`
- Resolves `.env` path relative to workspace root

**Vite (Web)**:
- Configured with `envDir: path.resolve(__dirname, '../../')` in `vite.config.ts`
- Loads `.env` from workspace root (not `apps/web/`)
- Variables must be prefixed with `VITE_` for client access

### 3. Database Client Pattern

The database client uses **lazy initialization with a Proxy** to ensure environment variables are loaded before connection:

```typescript
// packages/db/src/client.ts
let _db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePostgres> | null = null;

function initializeDb() {
  if (_db) return _db;
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  // Initialize based on connection string
  const isNeon = DATABASE_URL.includes('neon.tech');
  _db = isNeon ? drizzleNeon(...) : drizzlePostgres(...);
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof initializeDb>, {
  get(_target, prop) {
    const instance = initializeDb();
    return instance[prop as keyof typeof instance];
  },
});
```

This allows the module to be imported without immediately accessing `process.env`.

### 4. API Type Exports

The API package properly exports types for consumption:

```json
// apps/api/package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./router": {
      "types": "./dist/trpc/router.d.ts",
      "default": "./dist/trpc/router.js"
    }
  }
}
```

The api-client imports types from the built declarations:

```typescript
// packages/api-client/src/trpc.ts
import type { AppRouter } from '@nobet/api/router';
```

## Issues Resolved

### 1. TypeScript Compilation Issues

**Problem**: `.js` files appearing in source directories, causing duplicate routes in TanStack Router.

**Solution**:
- Added `noEmit: true` to `apps/web/tsconfig.json` and `apps/web/tsconfig.node.json`
- Updated `.gitignore` to exclude `**/*.js` and `**/*.js.map` from source directories

### 2. tRPC Types Showing as `any`

**Problem**: The `trpc` client in the web app had no type inference.

**Solution**:
- Added `declaration: true` to API's tsconfig
- Updated API's package.json to export types from `dist/` instead of `src/`
- Added `@nobet/api` as a dependency in `@nobet/api-client`
- Changed import to use package export: `import type { AppRouter } from '@nobet/api/router'`

### 3. Environment Variable Loading

**Problem**: `DATABASE_URL` was undefined when running migrations or dev server.

**Solutions**:
- Added `dotenv-cli` to wrap drizzle-kit commands
- Eventually replaced with explicit `dotenv.config()` in API entry point
- Implemented lazy database client initialization pattern

**Problem**: `VITE_API_URL` was undefined in web app.

**Solution**:
- Configured `envDir` in `vite.config.ts` to point to workspace root
- Added fallback value in provider: `const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'`

### 4. Vite Types for `import.meta.env`

**Problem**: TypeScript error "Property 'env' does not exist on type 'ImportMeta'".

**Solution**:
- Added `vite` as dev dependency in `@nobet/api-client`
- Added `"types": ["vite/client"]` to api-client's tsconfig

### 5. Biome Configuration

**Issues**:
- `noNonNullAssertion` rule flagging necessary code in `drizzle.config.ts`
- Auto-generated `routeTree.gen.ts` file had style violations

**Solutions**:
- Disabled `style.noNonNullAssertion` rule in `biome.json`
- Added `**/routeTree.gen.ts` to `files.ignore` in `biome.json`

## Development Workflow

### First Time Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start database (optional Docker)
pnpm run docker:up

# Run migrations
pnpm run db:generate
pnpm run db:migrate

# Build API to generate types
pnpm run build --filter="@nobet/api"

# Start dev servers
pnpm run dev
```

### Daily Development

```bash
# Start everything
pnpm run dev

# In separate terminals:
pnpm run db:studio  # Database GUI
```

### Before Committing

```bash
# Format and lint
pnpm run format
pnpm run lint:fix

# Build to verify
pnpm run build
```

## Important Notes

1. **Build Order**: The API must be built before the web app can access tRPC types
2. **Restart Dev Server**: Changes to `.env` require restarting the dev server
3. **Type Changes**: After modifying API router, rebuild API and restart TS server in IDE
4. **Docker**: PostgreSQL must be running before migrations (if using local Docker)

## Architecture Highlights

- **Type Safety**: Full end-to-end type safety from database → API → client
- **Monorepo**: Shared configuration and dependencies with isolated workspaces
- **Environment**: Single `.env` file at root, loaded by both Node.js and Vite
- **Tooling**: Biome for unified linting/formatting (replaces ESLint + Prettier)
- **Deployment**: Ready for Vercel with proper environment variable handling

## Next Steps

- Add authentication flows with Better Auth
- Implement user-facing features
- Add E2E tests with Playwright
- Set up CI/CD with GitHub Actions
- Configure production environment variables in Vercel
