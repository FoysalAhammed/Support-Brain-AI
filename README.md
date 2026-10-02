# SupportBrain AI

**RAG-enabled multi-agent SaaS platform for intelligent omnichannel customer support** — a frontend-only, mock-backed demonstration deployable to Vercel as-is.

Connect a website or Facebook Page → SupportBrain crawls it, cleans and chunks the content, generates embeddings, indexes it, and lets an AI agent answer customers from that knowledge — with human handoff and analytics.

> 📄 Full project context & handoff: [`docs/PROJECT_CONTEXT.md`](./docs/PROJECT_CONTEXT.md)
> 🤖 Rules & traps for coding agents: [`AGENTS.md`](./AGENTS.md)
> 📝 Original specification: [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md)

---

## Quick start

```bash
npm install --include=dev   # see note below
npm run dev                 # http://localhost:3000
```

> **Note:** this environment sets `NODE_ENV=production`, which makes a plain
> `npm install` skip devDependencies (Tailwind would be missing). Use
> `npm install --include=dev`.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Support console | `demo@supportbrain.ai` | `demo123` |
| Platform admin (`/admin`) | `admin@supportbrain.ai` | `admin123` |

---

## Commands

```bash
npm run dev        # dev server
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm start          # serve the production build
```

---

## The demonstration flow

```
Knowledge Base → Add Knowledge → Website / Facebook URL
   → Source detection → Crawling → Extraction → Cleaning
   → Chunking → Embeddings → Vector indexing → Knowledge Ready
   → RAG Test → AI Agent → Inbox → Human handoff → Analytics
```

Try it: sign in → **Knowledge Base** → **Add Knowledge** → enter
`https://example.com` (or `https://facebook.com/examplebusiness`) → watch the
pipeline → **Knowledge Ready** → **Test knowledge**.

---

## Key routes

```
/                         marketing landing
/pricing                  plans + comparison
/login /register /forgot-password
/chat                     customer-facing AI chat
/dashboard                overview KPIs & charts
/dashboard/inbox          support inbox (full-screen chat, handoff, order status)
/dashboard/agent          agent config + playground
/dashboard/knowledge      knowledge base + ingestion
/dashboard/knowledge/[sourceId]
/dashboard/channels /analytics /team /billing /settings
/admin /admin/organizations /admin/organizations/[id]
```

---

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn-style UI · lucide-react · sonner · `motion` (marketing animations).

There is **no backend** — every page reads from `src/services/*`, which return
deterministic mock data with small delays. Swapping in a real API later is a
service-level change only.
