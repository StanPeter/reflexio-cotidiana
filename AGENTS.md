# AGENTS.MD

> Bootloader and router for AI agents working in this repository.

## 1. Context Routing

Before starting any task, read the relevant files:

| Task type | Read first |
|---|---|
| Any code change | `CONSTITUTION.md` |
| Architectural decision | `ARCHITECTURE.md` |
| Data model change | `prisma/schema.prisma` |
| Auth change | `src/server/auth/config.ts` |
| Environment / secrets | `src/env.js` |

**Rule check:** Before making any architectural decision, state which section of `CONSTITUTION.md` governs that decision.

## 2. Operational Commands

| Verb | Command |
|---|---|
| dev | `pnpm dev` |
| build | `pnpm build` |
| typecheck | `pnpm typecheck` |
| lint | `pnpm check` |
| lint:fix | `pnpm check:write` |
| db:migrate (dev) | `pnpm db:generate` |
| db:migrate (deploy) | `pnpm db:migrate` |
| install | `pnpm install` |

Always append non-interactive / run-once flags where applicable.

## 3. Git Flow

- **Human commits only** -- the developer stages, commits, and pushes. Agents **MUST NOT** run git commands that create or alter commits (`git add`, `git commit`, `git commit --amend`, `git rebase`, `git cherry-pick`, etc.) unless the developer explicitly asks in that prompt.
- **Solo developer** -- no Jira, no ticket IDs required.
- Branch naming: `<type>/<short-description>` (e.g. `feat/goals-page`, `fix/auth-redirect`).
- Commit messages: imperative mood, concise (e.g. "Add goals page placeholder").
- Keep commits atomic -- one logical change per commit.

## 4. Meta-Directives

- **MUST NOT** introduce new 3rd-party dependencies without explicit approval.
- **MUST NOT** implement speculative abstractions -- keep it simple.
- **MUST NOT** silently remove working code or tests.
- **MUST** run `pnpm check` before considering a task complete.
- **MUST** run `pnpm typecheck` after any TypeScript changes.
- **MUST** use existing patterns in the codebase as reference for new code.

## 5. Project Context

This is a **personal learning project** -- a daily reflection / habit-tracking app called *Reflexio Cotidiana*. The priority is:

1. Working software over perfect architecture.
2. Consistency over novelty -- use what's already in the codebase.
3. Learn by building -- document decisions in `ARCHITECTURE.md` as they happen.
