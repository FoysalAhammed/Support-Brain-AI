# AGENTS.md — SupportBrain AI

Read this first. It tells you what exists, how to run/verify it, and the traps —
so you do **not** need to re-explore the codebase before working.

> Full detail: [`docs/PROJECT_CONTEXT.md`](./docs/PROJECT_CONTEXT.md)
> Product spec (the original master prompt): [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md)

## What this is

SupportBrain AI — a frontend-only, mock-backed SaaS demo of a RAG-enabled,
multi-agent, omnichannel customer-support platform. University project,
deployable to Vercel as-is. There is **no backend**: every page reads from
`src/services/*` which return mock data with small `sleep()` delays. Swapping in
a real API later is a service-level change only.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4 (tokens in `src/app/globals.css`)
- shadcn-style UI primitives in `src/components/ui`
- lucide-react icons · sonner toasts
- `motion` (Framer Motion successor) for animation — marketing pages only

## Commands

```bash
npm run dev        # dev server
npm run typecheck  # tsc --noEmit  (use this constantly)
npm run build      # production build (also type-checks)
npm start          # serve the production build
```

## Demo credentials

- Support console: `demo@supportbrain.ai` / `demo123`
- Platform admin (for `/admin`, requires an `admin@` email): `admin@supportbrain.ai` / `admin123`

## Routes

```
/                      /login  /register  /forgot-password
/pricing               /chat
/dashboard             /dashboard/inbox   /dashboard/inbox/[conversationId]
/dashboard/agent       /dashboard/knowledge  /dashboard/knowledge/[sourceId]
/dashboard/channels    /dashboard/analytics  /dashboard/team
/dashboard/billing     /dashboard/settings
/admin                 /admin/organizations  /admin/organizations/[id]
```

## Architecture rules (follow these)

- **Pages are thin.** A route's `page.tsx` either renders a client feature
  component or `await`s services and passes data down. Never hardcode data in a
  page/component — go through `src/services/*`.
- **Client components only where needed.** Interactive views are `"use client"`;
  marketing/static sections stay server-rendered. Server sections are wrapped in
  small client animation primitives (`src/components/marketing/anim.tsx`).
- **State:** React state + context only (auth/theme live in
  `src/components/providers`). No Redux. Service module state is in-memory.
- **Animations:** use `motion` only via the `anim.tsx` primitives
  (`MotionRoot`/`Reveal`/`Stagger`/`Counter`/`Float`). transform/opacity only,
  `LazyMotion` for bundle size, `prefers-reduced-motion` respected. **Do not add
  three.js/gsap.**
- **Styling:** use the design tokens (`bg-card`, `text-muted-foreground`,
  `bg-primary-soft`, status colours success/warning/destructive/accent). Reuse
  `src/components/ui/*` — do not invent new primitives.
- **Do not add dependencies** without a clear reason.

## Known traps (save yourself an hour)

1. **`NODE_ENV=production` is set in this environment.** npm then *skips
   devDependencies*, breaking the build (Tailwind disappears). Fix:
   `npm install --include=dev`.
2. **Never delete `.next` while a `next start`/`next dev` is running.** Windows
   file locks leave a half-deleted `.next`; the next build then references
   missing chunks (`Cannot find module './vendor-chunks/...'`) and routes 500.
   Kill the server first, then `rm -rf .next && npm run build`.
3. **A killed `npm start` leaves a zombie `node` on port 3000.** Always confirm
   the port is free (`Get-NetTCPConnection -LocalPort 3000 -State Listen`) before
   starting, or you'll test a stale build.
4. **Folders starting with `_` are private in the App Router** and are not
   routable (e.g. an `api/_verify` route 404s). Don't name routes with `_`.

## Verify before finishing

```bash
npm run typecheck && npm run build
# then boot and smoke-test the routes you touched
```

## Current status

All routes above are implemented and build/typecheck clean. The knowledge
ingestion pipeline (Website/Facebook → crawl → chunk → embed → index → RAG) is
the centrepiece and is fully wired. See `docs/PROJECT_CONTEXT.md` for the
per-area breakdown and the list of known limitations / next steps.
