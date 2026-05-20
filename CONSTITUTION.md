# Constitution

> This document is the **source of truth** for the repository's semantic rules.
> It supersedes all other project documentation. Agents and contributors MUST comply.

## 1. Owned Domains

- **DailyLog** -- daily yes/no habit tracking questions
- **DailyReflection** -- freeform journaling with mood rating
- **Goals** -- personal goal setting (planned)
- **Settings** -- user preferences and question management
- **Auth** -- registration, login (credentials + OAuth)

## 2. Invariants (Always / Never)

### Data Access

- Always access the database through **Prisma** -- no raw SQL.
- Always scope queries by `userId` -- never expose cross-user data.
- Always use `protectedProcedure` for any tRPC route that touches user data.
- Always validate inputs with **Zod** schemas in tRPC procedures.

### Security

- Never commit secrets or `.env` files.
- Never expose the Prisma client to client-side code (`server-only` guard).
- Never store plain-text passwords -- use `bcryptjs` for hashing.
- Environment variables must be validated through `@t3-oss/env-nextjs`.

### Architecture

- Never create REST endpoints -- all API surface goes through **tRPC**.
- Never import server code from client components without `server-only`.
- Always use the `@/` path alias -- no deep relative imports (`../../`).

## 3. Coding Conventions

| Area | Convention |
|---|---|
| Formatter / Linter | **Biome** (single tool, no ESLint/Prettier) |
| Component files | PascalCase (`DailyLogQuestion.tsx`) |
| Variables & functions | camelCase |
| Hooks | `use` prefix, camelCase (`useLogDateString`) |
| Components | Functional components only (React 19) |
| Styling | Chakra UI components + inline style props |
| Imports | Auto-sorted by Biome |

### File Organization

```
src/
  app/                    # Next.js App Router pages & components
    _components/          # Shared components (UI/, layout/)
    <route>/              # Route-specific components colocated with page.tsx
  server/
    api/routers/          # One tRPC router file per domain
    api/trpc.ts           # tRPC initialization & middleware
    auth/                 # NextAuth configuration
    db.ts                 # Prisma client singleton
  trpc/                   # Client-side tRPC setup
prisma/
  schema.prisma           # Single source of truth for data models
```

## 4. Governance

- All changes MUST comply with these invariants.
- Agents MUST cite the specific section of this Constitution that governs their implementation choice.
- When a rule becomes outdated, update this document -- do not silently ignore it.
