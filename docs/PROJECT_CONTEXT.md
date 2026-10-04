# SupportBrain AI — Project Context & Handoff

Snapshot of the whole build so work can resume without re-exploring.
Companion files: [`AGENTS.md`](../AGENTS.md) (quick rules) ·
[`MASTER_PROMPT.md`](./MASTER_PROMPT.md) (original spec).

Last updated: end of the session that added the marketing pages, chat
full-screen mode, Messenger-style direction, delivery ticks and order-status
badges.

---

## 1. What this project is

Frontend-only SaaS demo for a university project:

**SupportBrain AI — a RAG-enabled multi-agent SaaS platform for intelligent
omnichannel customer support.**

No backend. All data comes from mock services in `src/services/*` with small
simulated delays. The customer flow (connect knowledge → crawl → chunk → embed →
index → RAG answers → agent → inbox → human handoff → analytics) is fully
demonstrable.

Deploy target: Vercel (static prerender + server-rendered dynamic routes).

---

## 2. Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router), React 19 |
| Language | TypeScript (strict, `@/*` → `src/*`) |
| Styling | Tailwind CSS v4 + design tokens in `src/app/globals.css` |
| UI | shadcn-style primitives in `src/components/ui` |
| Icons | lucide-react |
| Toasts | sonner |
| Animation | `motion` (v14, Framer Motion) — marketing pages only |
| Charts | hand-rolled SVG in `src/components/charts` (no chart lib) |

---

## 3. How to run

```bash
npm install --include=dev   # NOTE: NODE_ENV=production is set here, so plain
                            # `npm install` skips devDependencies (breaks Tailwind)
npm run dev
npm run typecheck
npm run build
npm start
```

Demo logins:
- Console — `demo@supportbrain.ai` / `demo123`
- Admin (`/admin`, needs an `admin@` email) — `admin@supportbrain.ai` / `admin123`

---

## 4. Directory map

```
src/
├── app/            routes (see §5)
├── components/
│   ├── ui/         primitives (button, card, dialog, select, table, tabs, …)
│   ├── layout/     console-shell (sidebar+topbar+auth gate), nav-config, page-header, stat-card
│   ├── providers/  auth-provider, theme-provider, app-providers
│   ├── knowledge/  add-knowledge-dialog, crawl-pipeline, knowledge-test-panel,
│   │               knowledge-base-view, source-detail-view/-sheet/-loader
│   ├── inbox/      inbox-view, conversation-thread, conversation-view,
│   │               customer-panel, order-status
│   ├── agent/      agent-workspace (config + playground)
│   ├── channels/   channels-view (+ live widget configurator)
│   ├── analytics/  analytics-view
│   ├── team/ billing/ settings/  *-view
│   ├── chat/       customer-chat (public /chat)
│   └── marketing/  site-header/-footer, product-tour, pricing-cards/-section, anim
├── services/       auth, crawler, knowledge, conversations, agents, analytics,
│                   channels, organizations, team, billing   ← the data boundary
├── data/           mock-* datasets + time helpers
├── types/          domain types
├── hooks/          use-debounced-value, use-media-query, use-mounted
└── lib/utils.ts    cn(), sleep(), formatters, initials(), titleCase()
```

---

## 5. Routes (all implemented)

```
/                      marketing landing (hero, product tour, features, RAG,
                       architecture, testimonials, pricing, FAQ, CTA)
/pricing               plans + monthly/yearly toggle + comparison table + FAQ
/login /register /forgot-password   auth (route group `(auth)`, shared layout)
/chat                  public customer-facing AI chat
/demo/store            fake business site showing the embeddable floating widget
/dashboard             overview KPIs + charts + recent conversations/sources
/dashboard/inbox       conversation list + thread + details (full-screen mode)
/dashboard/inbox/[conversationId]   standalone conversation + full-screen
/dashboard/agent       agent config (identity/instructions/behaviour/knowledge/model) + playground
/dashboard/knowledge   knowledge base + Add Knowledge flow
/dashboard/knowledge/[sourceId]     source detail (overview/content/pages/chunks/RAG/activity)
/dashboard/channels    connect dialogs + website widget configurator
/dashboard/analytics   date-range filter + KPIs + charts + top questions
/dashboard/team        invite / role / deactivate / remove
/dashboard/billing     plan, usage meters, invoices, change/cancel plan
/dashboard/settings    profile/org/AI/API keys/notifications/security
/admin                 platform overview (admin only)
/admin/organizations   tenant table
/admin/organizations/[id]   tenant detail
/admin/settings        developer platform-owner console (models, flags, limits)
```

---

## 6. The centrepiece: knowledge ingestion → RAG

`src/services/crawler.ts` is the important one. Public surface:

```ts
validateUrl(url)                 detectSource(url) -> { type, domain, name, valid, estimatedPages, estimatedChunks }
buildStages()                    createJob(detection)
runCrawl(url, onUpdate, isCancelled?)   // drives the 8 stages with delays, emits job snapshots
getCrawlStatus/getDiscoveredContent/getChunks/getEmbeddingStatus
buildJobFromSource(source)       getSourceDetails(id)
contentSections(job, sourceId?)  askKnowledge(job, question, sourceId?) -> RagAnswer
```

- Stages: `DETECTING → CRAWLING → EXTRACTING → CLEANING → CHUNKING → EMBEDDING →
  INDEXING → READY`. `DEMO_SPEED` (0.4) keeps the whole run ~6s.
- Deterministic mock results in `src/data/mock-crawl-results.ts`
  (page catalogues + `pageContent` snippets + `buildContentSections`).
- Add Knowledge dialog (`components/knowledge/add-knowledge-dialog.tsx`):
  Website/Facebook → live detection card → Start → animated pipeline → results →
  tabs (pages / content / chunks & embeddings / RAG test).
- RAG test UI (`knowledge-test-panel.tsx`): Question → Retrieve → Context →
  Answer flow, confidence, retrieved sources, retrieval trace.
- `knowledgeService.createSource(...)` appends new sources to in-memory state so
  they appear in the list after a crawl.

Reference verified output: website `https://example.com` → 28 pages,
~1,476 content blocks, ~5,604 chunks, index **ready**; Facebook
`facebook.com/examplebusiness` → 8 sections; RAG "What services…" → 87%,
retrieved Services / About Us / FAQ.

---

## 7. Services (the mock backend boundary)

| Service | Highlights |
| --- | --- |
| `auth` | localStorage session, demo + admin logins, register, reset |
| `crawler` | see §6 |
| `knowledge` | sources/sections/activity, corpus-backed `ask()`, `createSource`, `syncSource` |
| `conversations` | list/filter, get, messages, sendMessage, takeOver, setStatus, assign, **setOrderStatus**, stats |
| `agents` | get/update agent, toggleKnowledge, `testAgent()` (uses knowledge RAG) |
| `analytics` | overview by date range, admin overview, org list |
| `channels` | list/connect/disconnect, widget config |
| `team` | list/invite/updateRole/setStatus/remove |
| `billing` | plans, state, changePlan, cancelPlan |
| `organizations` | list/get/current/stats |
| `platform` | admin models / feature flags / plan limits (`/admin/settings`) |

All are plain objects with async methods — the exact shape to replace with
`fetch("/api/...")` calls later.

---

## 8. Inbox conventions (chat behaviour)

- **Direction:** customer messages on the **left**; support on the **right**
  (both AI and human). AI bubble = accent tint, labelled "AI Agent"; human
  bubble = solid primary, labelled with the agent's name.
- **Delivery ticks:** outbound messages show `Sent` → `Delivered` → `Seen`
  (accent colour when read). Derived in `MessageBubble` (last outbound =
  Delivered, earlier = Seen).
- **Order status:** `types/conversation.ts` `OrderStatus`; metadata + badge in
  `components/inbox/order-status.tsx`; changed from the customer details panel
  (`Select` + quick badges) via `conversationService.setOrderStatus`; renders as
  a coloured badge next to the customer's name. Defaults seeded in
  `services/conversations.ts` (`DEFAULT_ORDER_STATUS`).
- **Full-screen chat:** thread header has a maximize/minimize button → a
  `fixed inset-0` chat layout (list rail + thread + details drawer); Esc exits,
  body scroll locked. Implemented in `inbox-view.tsx` and `conversation-view.tsx`.

---

## 9. Animation (marketing only)

`components/marketing/anim.tsx` exports `MotionRoot` (LazyMotion, lazy
`domAnimation`), `Reveal`, `Stagger`/`StaggerItem`, `Counter` (ref-based, no
re-renders), `Float`. Rules: transform/opacity only, respect reduced motion,
`<noscript>` fallback keeps content visible. Landing First Load JS ≈ 195 kB.
Do not introduce three.js/GSAP.

---

## 10. Known limitations / gotchas

- **In-memory state.** New knowledge sources live in the client module, so a
  **hard refresh** resets them and new-source detail pages 404 (client navigation
  works). Seeded sources: `src_website`, `src_facebook`, `src_warranty`,
  `src_database`. **Conversations are the exception** — `conversations` +
  `messages` persist to `localStorage` under `supportbrain.conversations.v1`, so
  widget/inbox conversations survive a refresh.
- **Facebook page name** is derived from the URL handle, so
  `facebook.com/examplebusiness` shows "Examplebusiness" (no reliable way to get
  "Example Business" from the badge string).
- **Admin** requires an `admin@…` email; the demo user is redirected away from
  `/admin`.
- **Environment traps:** see `AGENTS.md` §"Known traps" — `NODE_ENV=production`,
  `.next` deletion while a server runs, zombie `node` on port 3000,
  underscore-prefixed private folders.
- No tests exist; validation is typecheck + build + route smoke tests.

---

## 11. Sensible next steps (if continuing)

1. Persist created sources/messages to `localStorage` so hard refresh keeps them.
2. Split the crawler job state into a small store so multiple sources can process
   concurrently.
3. Add real API adapters behind the services (the boundary is already clean).
4. Optional polish: skeleton loaders per dashboard route, `generateMetadata` on
   detail pages, empty-state copy pass.
5. If adding 3D or heavy scroll work, prefer `motion` primitives over new deps.

---

## 12. Verification status at handoff

- `npm run typecheck` — **PASS**
- `npm run build` — **PASS** (20 routes)
- Smoke-tested: `/`, `/pricing`, `/login`, `/register`, `/forgot-password`,
  `/chat`, `/dashboard`, `/dashboard/inbox`, `/dashboard/agent`,
  `/dashboard/knowledge`, `/dashboard/knowledge/src_website`,
  `/dashboard/channels`, `/dashboard/analytics`, `/dashboard/team`,
  `/dashboard/billing`, `/dashboard/settings`, `/dashboard/inbox/conv_1001`,
  `/admin`, `/admin/organizations`, `/admin/organizations/org_northwind` — all 200.
