# Architecture Decision Records

> Durable record of **why** decisions were made.
> Prevents re-proposing patterns that have already been evaluated.
> New ADRs are appended as significant choices arise.

---

## ADR-001: Adoption of Agentic SDLC

**Status:** Accepted
**Date:** 2026-05-20

**Context:** As a solo developer, context is easily lost between sessions. Formalizing the repository contract (AGENTS.MD, CONSTITUTION.md, ARCHITECTURE.md) gives AI agents deterministic guardrails and preserves decisions for future-me.

**Decision:** Adopt the three Golden Files pattern.

**Consequences:** Small upfront cost. Every future agent session starts with shared context instead of guessing.

---

## ADR-002: T3 Stack as Foundation

**Status:** Accepted

**Context:** Needed a full-stack TypeScript framework with type-safe API layer, auth, and database access out of the box.

**Decision:** Use the T3 Stack (Next.js 15 + tRPC 11 + Prisma 6 + NextAuth 5 beta + React 19).

**Consequences:** Strong type safety end-to-end. Locked into the T3 ecosystem conventions, which is acceptable for a personal learning project.

---

## ADR-003: Biome over ESLint + Prettier

**Status:** Accepted

**Context:** Managing ESLint + Prettier configs is friction-heavy. Biome provides linting, formatting, and import sorting in a single fast tool.

**Decision:** Use Biome as the sole linter/formatter.

**Consequences:** Fewer config files. Some niche ESLint rules are unavailable, but Biome's recommended set covers the project's needs.

---

## ADR-004: Chakra UI + styled-components for Styling

**Status:** Accepted

**Context:** The T3 scaffold includes Tailwind, but Chakra UI was chosen because of prior familiarity and preference for component-based styling over utility classes. Some layouts or visual effects are awkward or verbose with Chakra props alone.

**Decision:** Use **Chakra UI 3** as the default for UI and styling. Reach for **styled-components** only when a component's styling becomes too complex for Chakra props to stay readable.

**Consequences:** Consistent styling approach for most UI. Complex components get colocated styled-components without forcing Chakra into prop-heavy patterns. If a migration to another system is ever needed, it can be done incrementally since styles stay colocated with components.

---

## ADR-005: JWT Session Strategy

**Status:** Accepted

**Context:** NextAuth supports both database sessions and JWT. Database sessions add a DB query per request.

**Decision:** Use JWT strategy for sessions.

**Consequences:** Faster auth checks, no session table queries. Trade-off: tokens can't be individually revoked server-side without extra infrastructure.

---

## ADR-006: PostgreSQL as Primary Datastore

**Status:** Accepted

**Context:** Needed a relational database for structured user data, daily logs, and questions with referential integrity.

**Decision:** PostgreSQL, accessed exclusively through Prisma ORM.

**Consequences:** Reliable, well-supported. Prisma migrations handle schema evolution.

---

## ADR-007: No Test Framework Yet

**Status:** Acknowledged

**Context:** This is an active learning project. Testing infrastructure (unit + e2e) is planned but not yet prioritized.

**Decision:** Defer test framework selection. Vitest and Playwright are likely candidates.

**Consequences:** No automated regression safety net for now. To be revisited as the app stabilizes.
