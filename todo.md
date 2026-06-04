# Reflexio Cotidiana — agent plan

Read first: `AGENTS.md`, `CONSTITUTION.md`. Run `pnpm check` + `pnpm typecheck` when done.

---

## Done

- [x] Question priority: `Severity` LOW / MEDIUM / HIGH on `Question` — `prisma/schema.prisma`, `src/app/settings/DailyLogSettings.tsx`
- [x] StoicBot (rule-based chat, hidden on `/settings`) — `src/app/_components/StoicBot.tsx`, `src/app/_components/layout/MainBody.tsx`
- [x] Missed daily log flow (inline, not dialog) — `src/app/daily-log/MissedDailyContent.tsx`, `src/app/daily-log/page.tsx`
- [x] Daily log questions + reflections (tRPC) — `src/server/api/routers/daily-log.ts`
- [x] Settings: daily-log questions CRUD — `src/app/settings/DailyLogSettings.tsx`, `src/server/api/routers/settings.ts`
- [x] Auth: credentials register/sign-in + OAuth — `src/app/auth/page.tsx`, `src/server/api/routers/auth.ts`, `src/server/auth/config.ts`
- [x] Statistics: monthly heatmap (current month only, API-backed) — `src/app/statistics/page.tsx`, `src/server/api/routers/statistics.ts`
- [x] Goals page placeholder (client mock data only) — `src/app/goals/page.tsx`

---

## Daily log

- [ ] Missed-day **popup dialog** to pick which missed day and start filling it
  - Today: full-page `MissedDailyContent` section in `page.tsx`
  - Use Chakra `Dialog` (see `DailyLogSettings.tsx` delete/edit dialogs)
  - Keep existing tRPC: `getDailyReflections`, `getUsersQuestions`, skip handlers in `MissedDailyContent.tsx`
  - Trigger when `showMissedContentSection` is true; dialog lists 2–4 days ago before question flow

- [ ] **Log area tabs**: Daily / Work / Eyes Health
  - Revert reference UI: `git show 12ed6daf:src/app/daily-log/LogAreaTabs.tsx` + `page.tsx` diff
  - Add `LogAreaTabs.tsx`, wire `activeArea` state in `src/app/daily-log/page.tsx`
  - Work/Eyes: mock questions only until DB exists (see Goals & areas)

- [ ] **Question progress** (answered count, %, steps for ≤8 questions)
  - Revert reference: `git show 12ed6daf:src/app/daily-log/QuestionProgress.tsx`
  - Mount above question content in `page.tsx`; pass `done={currentIndex}`, `total={usersQuestions.length}` (or mock index for non-daily areas)

- [ ] Audit daily-log flows (missed → yesterday auto-skip → questions → comment → all finished)
  - Files: `page.tsx`, `DailyLogQuestion.tsx`, `CommentContent.tsx`, `AllFinishedContent.tsx`, `useLogDateString.ts`

- [ ] Component cleanup: split oversized `page.tsx` state/handlers; align palette/constants with `src/app/constants/`

---

## Auth

- [ ] End-to-end test: sign up → credentials sign-in → session → protected routes → sign out → OAuth providers
  - Files: `src/app/auth/page.tsx`, `src/server/auth/config.ts`, `src/env.js`

- [ ] FE validation: password min length, match repeat on sign-up, surface tRPC errors on form fields
  - `react-hook-form` rules in `auth/page.tsx` (mirror patterns in `DailyLogSettings.tsx`)

- [ ] BE validation: `z.string().min(8)` (or project standard) on `auth.register` / `auth.signIn` inputs
  - `src/server/api/routers/auth.ts`

---

## Settings

- [ ] Remove stale `points` type from `src/app/settings/page.tsx` (`selectedQuestion` type) — use `severity` / `Question` from Prisma

- [ ] **Account settings — profile save**
  - Add `auth.updateProfile` (or `settings.updateUser`) mutation: `name`, `email` for `ctx.session.user.id`
  - Wire `AccountSettings.tsx` `onSaveSettings` (remove `console.log` / TODO)
  - Prefill form from `api.auth.getUser.useQuery()` with `useEffect` + `reset()` from react-hook-form

- [ ] **Account settings — change password**
  - Add `auth.changePassword` protected mutation: `currentPassword`, `newPassword`; `bcryptjs` compare + hash; reject OAuth-only users without `passwordHash`
  - Restore dialog UX from `git show 12ed6daf:src/app/settings/AccountSettings.tsx` (current + new + confirm)
  - Wire Change password button (`onClick` currently empty in `AccountSettings.tsx`)

- [ ] **Goals tab in Settings** (or consolidate with `/goals`)
  - Revert reference: `git show 12ed6daf:src/app/settings/GoalsSettings.tsx`, `FormHeader.tsx` (`SettingsTab` + goals button), `settings/page.tsx`
  - Decide: Settings tab vs single `/goals` page — avoid duplicate mock UIs

---

## Goals (persistence)

- [ ] Prisma models: `Goal`, `GoalStep` (userId, title, emoji, order, completedAt optional)
  - `prisma/schema.prisma` → `pnpm db:generate`
  - tRPC router `src/server/api/routers/goals.ts` — CRUD + step toggle
  - Replace mock state in `src/app/goals/page.tsx` (and Settings goals if kept)

---

## Log areas Work / Eyes (persistence)

- [ ] Schema + API for area-specific questions (or `Question.area` enum: DAILY | WORK | EYES)
  - Wire daily-log tabs to real `getUsersQuestions` filtered by area instead of `MOCK_QUESTIONS` from 12ed6daf

---

## Statistics

- [ ] Month/year navigation for heatmap
  - `selectedMonth` in `src/app/statistics/page.tsx` is never updated — add prev/next month (and optional year picker)
  - Pass updated `Date` to `api.statistics.getStatistics.useQuery({ month })`
  - Build `monthDays` from `selectedMonth`, not always `today`

- [ ] Question filter UI
  - Load user questions from `api.settings.getQuestions` (not hardcoded `questions` array)
  - Checkbox/multi-select bound to `selectedQuestions`; recompute heatmap/averages for subset (extend `statistics` router if needed)

---

## StoicBot / motivation (optional)

- [ ] Decide product direction: keep rule-based StoicBot vs remove vs replace motivation page
  - Motivation route removed in `8b49f96`; do not re-add without explicit decision
  - If AI: new dependency needs explicit approval per `AGENTS.md`

---

## Reverted batch reference

UI prototypes from `12ed6dafd258b4687a6f8691231f642660adbd30` (reverted in `c75d23e`, StoicBot re-added in `2e4e6a1`):

```bash
git show 12ed6daf:src/app/settings/GoalsSettings.tsx
git show 12ed6daf:src/app/daily-log/LogAreaTabs.tsx
git show 12ed6daf:src/app/daily-log/QuestionProgress.tsx
git show 12ed6daf:src/app/settings/AccountSettings.tsx
git show 12ed6daf:src/app/daily-log/page.tsx
```

Adapt to current Chakra 3 + tRPC patterns; do not copy `api.auth.changePassword` calls until mutation exists.
