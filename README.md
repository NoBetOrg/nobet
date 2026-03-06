# Nobet

A full-stack TypeScript monorepo built with modern web technologies.

## Stack

- **Frontend**: React + Vite + TanStack Router + Tailwind CSS v4
- **Backend**: Hono + tRPC + Better Auth
- **Database**: PostgreSQL (Neon serverless) + Drizzle ORM
- **Monorepo**: pnpm workspaces + Turborepo
- **Tooling**: Biome (linting/formatting), TypeScript, Vitest, Playwright

## Project Structure

```
nobet/
├── apps/
│   ├── api/          # Hono + tRPC backend
│   └── web/          # React SPA frontend
├── packages/
│   ├── api-client/   # tRPC React hooks
│   ├── db/           # Drizzle ORM + schema
│   └── shared/       # Shared code (schemas, types, utils)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js v22.20.0 (see `.nvmrc`)
- pnpm (install with `npm install -g pnpm`)
- Docker (optional, for local PostgreSQL)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nobet
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# API environment variables
cp apps/api/.env.example apps/api/.env

# Web environment variables
cp apps/web/.env.example apps/web/.env
```

Edit the `.env` files and configure your environment variables.

### Database Setup

#### Option A: Local PostgreSQL (Docker)

Start the local PostgreSQL container:
```bash
pnpm run docker:up
```

The default connection string in `.env.example` is already configured for local Docker.

#### Option B: Neon (Cloud)

1. Create a Neon project at [console.neon.tech](https://console.neon.tech)
2. Copy your connection string
3. Update `DATABASE_URL` in `apps/api/.env`

### Running Migrations

Generate and run Drizzle migrations:
```bash
pnpm run db:generate
pnpm run db:migrate
```

### Development

Start all apps in development mode:
```bash
pnpm run dev
```

This starts:
- API server at `http://localhost:3000`
- Web app at `http://localhost:5173`

### Building

Build all packages:
```bash
pnpm run build
```

Build specific apps:
```bash
pnpm turbo run build --filter="@nobet/web"
pnpm turbo run build --filter="@nobet/api"
```

> **Important**: The API must be built first before the web app can access tRPC types. The build process generates TypeScript declaration files that the frontend uses for type safety.

### Testing & Code Quality

Run tests:
```bash
pnpm run test
```

Check code quality:
```bash
# Check for linting issues
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix

# Format all code
pnpm run format

# Check if code needs formatting
pnpm run format:check
```

> **Note**: This project uses [Biome](https://biomejs.dev/) which replaces both ESLint and Prettier with a single, faster tool.

### Pre-commit Hooks

The project automatically formats and lints your code before each commit using Husky and lint-staged. See [PRECOMMIT.md](./PRECOMMIT.md) for details.

If a commit is blocked due to linting errors:
```bash
pnpm run lint:fix  # Fix all auto-fixable issues
git add .          # Stage the fixes
git commit -m "your message"
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start all apps in development mode |
| `pnpm run build` | Build all packages |
| `pnpm run lint` | Lint all packages (check for issues) |
| `pnpm run lint:fix` | Fix linting issues automatically |
| `pnpm run format` | Format all code with Biome |
| `pnpm run format:check` | Check if code is formatted correctly |
| `pnpm run test` | Run all tests |
| `pnpm run db:generate` | Generate Drizzle migration files |
| `pnpm run db:migrate` | Apply database migrations |
| `pnpm run db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm run docker:up` | Start Docker services |
| `pnpm run docker:down` | Stop Docker services |
| `pnpm run docker:reset` | Stop services and remove volumes |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel.

## Architecture Notes

### Type Safety Across the Monorepo

The project uses TypeScript extensively with end-to-end type safety:

- **API → Client**: The `@nobet/api` exports TypeScript declaration files (`.d.ts`) that the `@nobet/api-client` imports to provide fully-typed tRPC hooks
- **Build Order**: The API must be built before other packages can access its types
- **Type Imports**: The web app gets automatic type inference for all API endpoints through tRPC

### Environment Variables

Environment variables are handled differently in Node.js and Vite:

- **Node.js (API)**: Uses `dotenv` to load `apps/api/.env`
- **Vite (Web)**: Loads `apps/web/.env` automatically
- **Vite Variables**: Must be prefixed with `VITE_` to be accessible in client code (e.g., `VITE_API_URL`)
- **Location**: Each app has its own `.env` file in its directory

### Database Client

The database client (`@nobet/db`) uses a lazy initialization pattern with a Proxy to ensure environment variables are loaded before the database connection is established. This allows it to work correctly whether imported in the API or during migrations.

## Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get up and running in 5 minutes
- [Project Initial Setup](./project-initial-setup.md) - Complete technical specification
- [Deployment Guide](./DEPLOYMENT.md) - Vercel deployment instructions

## License

ISC
