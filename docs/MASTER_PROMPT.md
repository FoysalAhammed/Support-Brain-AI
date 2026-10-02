# Master Prompt (original specification)

> Archived verbatim from the project brief. This is the source of truth for what
> the app is meant to be. Implementation status lives in
> [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

---

# SupportBrain AI — Complete Frontend SaaS Application

## MASTER IMPLEMENTATION PROMPT FOR DEEPSEEK FLASH V4

You are building the **complete frontend application** for my university project:

**SupportBrain AI — A RAG-Enabled Multi-Agent SaaS Platform for Intelligent Omnichannel Customer Support**

I will deploy this frontend directly to **Vercel** as a working university project demonstration.

This is **NOT a UI/UX design task** and **NOT a static prototype**.

Build a complete, polished, interactive **frontend SaaS application** that feels like a real production SaaS platform.

The backend will be developed later, so all backend-dependent functionality must currently use a clean mock/service architecture that can easily be replaced with real APIs.

---

# 1. PRIMARY OBJECTIVE

Create a professional AI customer-support SaaS platform where a business owner can:

1. Register/login.
2. Create/manage their organization.
3. Add their business knowledge.
4. Enter a **Website URL** or **Facebook Page URL**.
5. Start a knowledge extraction/crawling process.
6. See the crawling/extraction pipeline visually.
7. See discovered pages/content.
8. See content cleaning and processing.
9. See text being split into chunks.
10. See embeddings/indexing progress.
11. See the source become **Knowledge Ready**.
12. Configure an AI agent.
13. Test the AI agent using the imported knowledge.
14. Manage customer conversations.
15. Perform human handoff.
16. View analytics.
17. Manage channels, team, billing and settings.

The application should visually demonstrate how the actual SupportBrain AI system works.

---

# 2. IMPORTANT — KNOWLEDGE INGESTION IS A CORE FEATURE

Do NOT treat URL ingestion as a minor feature.

It is one of the most important parts of the application.

The main demonstration should clearly show:

```text
Business Owner
      ↓
Add Website / Facebook URL
      ↓
Detect Source
      ↓
Start Knowledge Collection
      ↓
Crawling / Fetching
      ↓
Content Extraction
      ↓
Content Cleaning
      ↓
Text Chunking
      ↓
Generate Embeddings
      ↓
Index Knowledge
      ↓
Knowledge Ready
      ↓
AI Agent Uses Knowledge
      ↓
Customer Question
      ↓
RAG Retrieval
      ↓
AI Answer
```

The frontend must make this workflow visually understandable to a university evaluator.

---

# 3. TECHNOLOGY STACK

Use:

* Next.js
* React
* TypeScript
* Next.js App Router
* Tailwind CSS
* shadcn/ui
* Lucide React
* Recharts or another lightweight chart library only where necessary

Prefer the current stable Next.js architecture available in the environment.

Use Server Components by default.

Use Client Components only where interaction/state is required.

Do NOT introduce unnecessary libraries.

The application must be optimized for:

* Fast page transitions
* Fast state changes
* Low bundle size
* Low unnecessary rendering
* Good Vercel performance
* Clean architecture
* Easy future backend integration

---

# 4. FRONTEND-ONLY ARCHITECTURE

The backend does not exist yet.

Therefore:

### DO

Create:

```text
src/
├── app/
├── components/
├── data/
├── services/
├── lib/
├── types/
└── hooks/
```

Use mock services such as:

```text
services/
├── auth.ts
├── crawler.ts
├── knowledge.ts
├── conversations.ts
├── agents.ts
├── analytics.ts
├── channels.ts
├── organizations.ts
├── team.ts
└── billing.ts
```

The UI should communicate with these services instead of hardcoding data directly inside components.

Later these functions can be replaced with real API calls.

Example:

```ts
await crawlerService.startCrawl(url)
```

Currently this returns simulated/mock data.

Later it can become:

```ts
await fetch("/api/crawl", ...)
```

Do NOT build fake backend servers.

Do NOT require a database.

Do NOT require external API keys.

Do NOT require secret environment variables.

The frontend must work independently after:

```bash
npm install
npm run dev
```

and:

```bash
npm run build
```

---

# 5. DESIGN DIRECTION

The product must look like a modern premium SaaS application.

Visual direction:

* Professional
* Clean
* Modern
* AI-focused
* Enterprise SaaS quality
* Minimal but visually impressive
* Strong information hierarchy
* Excellent spacing
* Professional typography
* High-quality dashboard components

Primary visual language:

* Deep indigo / blue
* Electric blue / cyan AI accent
* Emerald for success
* Amber for processing/warnings
* Red for errors
* Slate/neutral backgrounds

Support:

* Light mode
* Dark mode

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Huge rounded cards everywhere
* Excessive animation
* Cartoon-like AI visuals
* Cheap-looking dashboard templates
* Overly colorful interfaces

Use color primarily for:

* Status
* Actions
* AI indicators
* Important metrics
* Navigation states

---

# 6. RESPONSIVE REQUIREMENT

The application must work properly on:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop screens

Do not simply shrink the desktop layout.

Create responsive layouts intentionally.

Examples:

Desktop:

```text
Sidebar | Main Content
```

Mobile:

```text
Top Header
      ↓
Content
      ↓
Mobile Navigation / Drawer
```

Inbox:

Desktop:

```text
Conversation List | Conversation | Details
```

Mobile:

```text
Conversation List
      ↓
Conversation
      ↓
Details Drawer
```

All tables, charts, forms and dialogs must remain usable on smaller screens.

---

# 7. APPLICATION ROUTES

Create these routes:

```text
/
 /pricing
 /login
 /register
 /forgot-password

 /dashboard
 /dashboard/inbox
 /dashboard/inbox/[conversationId]

 /dashboard/agent

 /dashboard/knowledge
 /dashboard/knowledge/[sourceId]

 /dashboard/channels
 /dashboard/analytics
 /dashboard/team
 /dashboard/billing
 /dashboard/settings

 /admin
 /admin/organizations
 /admin/organizations/[id]

 /chat
```

Every important route must be directly accessible.

---

# 8. LANDING PAGE

Create a premium SaaS marketing website.

Hero headline:

**AI Customer Support That Knows Your Business.**

Supporting message explaining that businesses can connect their website, Facebook knowledge and documents to create an AI-powered support agent.

Hero CTA:

```text
Start Building Your AI Agent
View Demo
```

Show a polished product/dashboard preview.

Include sections for:

### AI Customer Support

Explain AI-powered automated customer support.

### Knowledge Base

Show:

```text
Website
Facebook
PDF
Documents
```

being converted into AI knowledge.

### RAG

Explain:

```text
Customer Question
        ↓
Knowledge Retrieval
        ↓
Relevant Context
        ↓
AI Response
```

### Omnichannel

Show:

* Website Chat
* Facebook Messenger
* WhatsApp
* Voice

### Human Handoff

Show AI conversation transferring to a human support agent.

### Analytics

Show conversation and AI performance analytics.

### Pricing

Include realistic SaaS pricing cards.

### Final CTA

Strong call to action.

---

# 9. AUTHENTICATION DEMO

Create frontend-only authentication.

Pages:

```text
/login
/register
/forgot-password
```

Provide a clear demo login option.

Use localStorage/mock authentication.

Example:

```text
Demo Account

Email:
demo@supportbrain.ai

Password:
demo123
```

After login:

```text
/login
   ↓
/dashboard
```

Implement frontend route protection.

Do not build real authentication yet.

---

# 10. MAIN DASHBOARD

Create a reusable dashboard shell.

Desktop:

```text
┌──────────────────────────────────────────────┐
│ Sidebar                  │ Top Header       │
│                          ├──────────────────┤
│ Overview                 │                  │
│ Inbox                    │ Main Content     │
│ AI Agent                 │                  │
│ Knowledge Base           │                  │
│ Channels                 │                  │
│ Analytics                │                  │
│ Team                     │                  │
│ Billing                  │                  │
│ Settings                 │                  │
└──────────────────────────────────────────────┘
```

Sidebar should contain:

* Overview
* Inbox
* AI Agent
* Knowledge Base
* Channels
* Analytics
* Team
* Billing
* Settings

Include:

* Organization switcher
* User profile
* Theme toggle
* Notifications
* Help

Mobile should use a drawer.

---

# 11. DASHBOARD OVERVIEW

Create KPI cards:

```text
Total Conversations
AI Resolution Rate
Average Response Time
Human Handoff Rate
```

Example values:

```text
12,482
87.4%
1.8 sec
12.6%
```

Include:

* Conversation trend chart
* AI resolution chart
* Channel distribution
* Knowledge health
* Recent conversations
* Recent knowledge sources

Make it look like a real SaaS analytics dashboard.

---

# 12. ⭐ KNOWLEDGE BASE — MOST IMPORTANT SECTION

Create:

```text
/dashboard/knowledge
```

This page should be one of the strongest parts of the demo.

Header:

```text
Knowledge Base

Connect your business knowledge to your AI agent.
```

Primary button:

```text
+ Add Knowledge
```

When clicked, open a beautiful modal/dialog:

```text
Add Knowledge

Choose your source

[ Website URL ]
[ Facebook Page ]
[ Upload Document ]
```

---

# 13. WEBSITE URL INPUT

Create a professional URL ingestion interface.

Example:

```text
Add Website

Website URL

https://example.com

[ Start Crawling ]
```

Include:

* URL validation
* Source detection
* Domain preview
* Website icon
* Estimated pages
* Crawl options

Example:

```text
Website detected

example.com
Website

Ready to crawl
```

Button:

```text
Start Knowledge Collection
```

---

# 14. FACEBOOK PAGE URL INPUT

Create a separate Facebook source option.

Example:

```text
Add Facebook Page

Facebook Page URL

https://facebook.com/examplebusiness

[ Connect & Fetch Knowledge ]
```

After entering the URL:

```text
Facebook Page Detected

Example Business
Facebook Page

Source:
Facebook

Status:
Ready to fetch
```

Show an appropriate informational message explaining that the platform will collect publicly available page information for the knowledge base.

For the frontend demo, simulate the collection process.

The architecture must make it possible to connect a real Facebook API/backend later.

Do NOT place Facebook credentials or access tokens in the frontend.

---

# 15. ⭐ SOURCE DETECTION

After URL submission, automatically detect:

```text
Website
Facebook
Invalid URL
```

Example:

```text
URL:
https://facebook.com/example

✓ Facebook Page detected
✓ Source type: Facebook
✓ URL validated

[Start Fetching]
```

For:

```text
https://example.com
```

show:

```text
✓ Website detected
✓ Domain: example.com
✓ Source type: Website
```

---

# 16. ⭐ CRAWLING / FETCHING EXPERIENCE

After clicking:

```text
Start Crawling
```

DO NOT instantly mark the source as complete.

Create a realistic interactive processing experience.

Show a progress panel:

```text
Knowledge Collection

example.com

● Detecting source
✓ Source detected

● Crawling website
   14 / 28 pages

○ Extracting content
○ Cleaning content
○ Creating chunks
○ Generating embeddings
○ Indexing knowledge
```

Progress bar:

```text
████████████░░░░░░░ 64%
```

For Facebook:

```text
Fetching Facebook Page

✓ Page detected
✓ Page information collected
● Collecting public content
● Processing text
○ Creating chunks
○ Generating embeddings
○ Indexing knowledge
```

Use simulated delays so the evaluator can actually see each stage.

---

# 17. CRAWLER PIPELINE

Create a reusable crawler pipeline component.

Stages:

```text
1. Source Detection
2. Crawling / Fetching
3. Content Extraction
4. Content Cleaning
5. Text Chunking
6. Embedding Generation
7. Vector Indexing
8. Knowledge Ready
```

Each stage should have:

* Pending
* Processing
* Completed
* Failed

Example:

```text
✓ Source Detection
✓ Crawling
✓ Content Extraction
✓ Content Cleaning
✓ Chunking
✓ Embeddings
● Vector Indexing
○ Knowledge Ready
```

Use animations only where helpful.

---

# 18. DISCOVERED CONTENT PREVIEW

During/after crawling, show discovered content.

Example:

```text
Discovered Pages

✓ Home
✓ About Us
✓ Services
✓ Pricing
✓ Contact
✓ FAQ
✓ Refund Policy
✓ Terms
```

Show:

```text
28 Pages
1,482 Content Blocks
6,240 Chunks
```

For Facebook:

```text
Page Information
About
Services
Contact Information
Public Posts
FAQ-like Content
Business Information
```

Use realistic mock content.

---

# 19. CONTENT EXTRACTION PREVIEW

Create a panel:

```text
Extracted Content

Business Name
About the company...
Services
Pricing
Contact information
Frequently asked questions...
```

Allow the user to click a discovered page/source and inspect extracted mock content.

---

# 20. CHUNKING VISUALIZATION

Show how extracted content becomes chunks.

Example:

```text
Original Content
       ↓
Content Cleaning
       ↓
Text Chunking

Chunk #001
"SupportBrain provides..."

Chunk #002
"Our pricing plans..."

Chunk #003
"Customers can contact..."
```

Show:

```text
6,240 chunks created
```

This is important because it visually explains the RAG architecture.

---

# 21. EMBEDDING / INDEXING VISUALIZATION

Create an attractive technical status section:

```text
Knowledge Processing

Text Chunks
6,240

Embeddings
6,240 / 6,240

Vector Index
Ready

Knowledge Status
✓ Ready
```

Use an appropriate visualization such as progress bars or status cards.

Do not pretend to perform actual AI embedding calculations in the browser.

Use mock processing.

---

# 22. KNOWLEDGE READY STATE

After processing finishes:

Show a strong success state:

```text
✓ Knowledge Base Ready

example.com

28 pages processed
6,240 chunks created
6,240 embeddings indexed

Your AI agent can now use this knowledge.
```

Button:

```text
Configure AI Agent
```

Also:

```text
Test Knowledge
View Source
```

---

# 23. KNOWLEDGE SOURCE LIST

Show a table/card list:

```text
Source
Type
Status
Pages
Chunks
Last Synced
Actions
```

Example:

```text
example.com
Website
Ready
28
6,240
2 minutes ago

Example Business
Facebook
Ready
—
1,840
5 minutes ago
```

Status options:

* Processing
* Ready
* Failed
* Syncing

Actions:

* View
* Sync
* Test
* Delete

---

# 24. SOURCE DETAILS PAGE

Route:

```text
/dashboard/knowledge/[sourceId]
```

Show:

* Source information
* URL
* Type
* Status
* Last sync
* Pages/content
* Chunks
* Embedding status

Tabs:

```text
Overview
Content
Pages
Chunks
RAG Test
Activity
```

---

# 25. RAG TEST PLAYGROUND

This should visually demonstrate how the knowledge will be used.

Create:

```text
Test Your Knowledge

Ask a question about your business.

[ What services do you provide? ]

[ Ask AI ]
```

Mock response:

```text
According to the connected business knowledge,
the company provides...
```

Also show:

```text
Retrieved Sources

✓ Services
✓ Pricing
✓ FAQ
```

And:

```text
Retrieval Process

Question
   ↓
Similarity Search
   ↓
Relevant Chunks
   ↓
Context
   ↓
AI Response
```

This is a very important demonstration feature.

---

# 26. AI AGENT PAGE

Route:

```text
/dashboard/agent
```

Show:

```text
AI Agent
● Active
```

Configuration sections:

### Identity

* Agent name
* Avatar
* Greeting

### Instructions

Textarea for system instructions.

### Behavior

* Tone
* Response length
* Language
* Confidence threshold

### Knowledge

Connected knowledge sources.

Example:

```text
✓ example.com
✓ Example Business Facebook
```

### Model

Use mock model selection.

Example:

```text
GPT
Claude
Grok
```

No real API calls.

---

# 27. AI AGENT PLAYGROUND

Create an interactive test chat.

Example:

```text
AI Agent Playground

You:
What are your services?

AI:
Based on your connected knowledge,
we provide...
```

Show:

```text
Knowledge Used
3 sources

Confidence
92%
```

This should feel like an actual AI product.

---

# 28. INBOX

Route:

```text
/dashboard/inbox
```

Create a professional support inbox.

Desktop:

```text
Conversation List | Conversation | Customer Details
```

Conversation list should contain:

* Customer name
* Avatar
* Last message
* Timestamp
* Unread count
* Channel
* AI/Human status

Filters:

```text
All
AI
Human
Unread
Resolved
```

Search conversations.

---

# 29. CONVERSATION PAGE

Route:

```text
/dashboard/inbox/[conversationId]
```

Show:

* Customer information
* Messages
* AI responses
* Human messages
* Source indicators
* Timestamps

Composer:

```text
Type your message...
```

Buttons:

* Send
* Attachment
* Voice

Actions:

```text
Take Over
Assign
Resolve
Reopen
```

Human handoff must be visually obvious.

---

# 30. HUMAN HANDOFF

Create a realistic flow:

```text
AI Confidence Low

This conversation requires human assistance.

[Take Over Conversation]
```

When clicked:

```text
✓ Human agent joined the conversation
```

Then change composer/status from AI to Human.

---

# 31. CHANNELS

Route:

```text
/dashboard/channels
```

Show:

### Website Chat

```text
Connected
```

### Facebook Messenger

```text
Not Connected
```

### WhatsApp

```text
Not Connected
```

### Voice

```text
Available
```

Create mock connection dialogs.

Website widget should have configuration:

* Position
* Greeting
* Theme
* Agent name
* Welcome message

Show live widget preview.

---

# 32. CUSTOMER CHAT DEMO

Route:

```text
/chat
```

Create a beautiful customer-facing AI chat interface.

Customer can:

* Send messages
* Upload image
* Use voice UI
* Ask questions
* Request human support

Show source/knowledge indicator:

```text
Answered using Business Knowledge
```

Human handoff:

```text
Talk to a human
```

This page should look like the actual customer-facing product.

---

# 33. ANALYTICS

Route:

```text
/dashboard/analytics
```

Metrics:

```text
Total Conversations
AI Resolution Rate
Human Handoff
Average Response Time
Customer Satisfaction
```

Charts:

* Conversations over time
* AI vs human resolution
* Channel usage
* Response time
* Knowledge usage

Date filter:

```text
Today
7 Days
30 Days
90 Days
```

Use mock data.

---

# 34. TEAM

Route:

```text
/dashboard/team
```

Roles:

```text
Business Owner
Support Agent
```

Features:

* Invite member
* Edit role
* Deactivate
* Remove

Use local mock state.

---

# 35. BILLING

Route:

```text
/dashboard/billing
```

Plans:

```text
Starter
Growth
Business
```

Show:

* Current plan
* Usage
* Conversations
* Knowledge sources
* Team members
* Billing history

Actions can be simulated.

Do not integrate real payments yet.

---

# 36. SETTINGS

Create:

```text
/dashboard/settings
```

Sections:

```text
Profile
Organization
AI Settings
API Keys
Notifications
Security
```

API keys should be mock/masked.

Never expose real secrets.

---

# 37. SUPER ADMIN

Create:

```text
/admin
/admin/organizations
/admin/organizations/[id]
```

Dashboard metrics:

```text
Organizations
Active Users
Subscriptions
Total Conversations
AI Usage
System Health
```

Organization table:

```text
Organization
Owner
Plan
Users
Conversations
Status
Created
```

Organization detail page should show:

* Organization information
* Usage
* Knowledge sources
* AI usage
* Users
* Subscription
* Activity

---

# 38. MOCK DATA ARCHITECTURE

Create separate mock data:

```text
src/data/
├── mock-organizations.ts
├── mock-users.ts
├── mock-conversations.ts
├── mock-messages.ts
├── mock-knowledge.ts
├── mock-crawl-results.ts
├── mock-analytics.ts
├── mock-channels.ts
└── mock-billing.ts
```

Create types:

```text
src/types/
├── organization.ts
├── user.ts
├── conversation.ts
├── knowledge.ts
├── crawler.ts
├── agent.ts
├── analytics.ts
└── billing.ts
```

---

# 39. CRAWLER SERVICE ARCHITECTURE

Create:

```text
src/services/crawler.ts
```

Example conceptual functions:

```ts
detectSource(url)
validateUrl(url)
startCrawl(url)
getCrawlStatus(id)
getDiscoveredContent(id)
getChunks(id)
getEmbeddingStatus(id)
getSourceDetails(id)
```

For frontend demonstration these functions should simulate processing.

The simulation should progress through:

```text
DETECTING
CRAWLING
EXTRACTING
CLEANING
CHUNKING
EMBEDDING
INDEXING
READY
```

Use deterministic mock results rather than random behavior.

The same interface must be easy to replace with real backend APIs later.

---

# 40. SIMULATED CRAWL EXPERIENCE

When user enters a URL and starts processing:

Use realistic but short delays.

Example:

```text
0–1 sec
Detecting source

1–3 sec
Crawling / fetching

3–5 sec
Extracting content

5–7 sec
Cleaning content

7–9 sec
Creating chunks

9–11 sec
Generating embeddings

11–13 sec
Indexing

13 sec
Ready
```

Do not make the demo unnecessarily slow.

Allow the evaluator to clearly see the workflow.

Provide a way to skip/complete the simulation if appropriate.

---

# 41. ERROR STATES

Implement realistic errors.

Example invalid URL:

```text
Invalid URL
Please enter a valid website or Facebook Page URL.
```

Mock crawler failure:

```text
Unable to process this source.

[Retry]
```

Do not leave broken blank screens.

---

# 42. LOADING STATES

Use:

* Skeletons
* Progress bars
* Spinners
* Suspense
* Loading screens

Every major async-looking operation should have a good loading state.

---

# 43. PERFORMANCE REQUIREMENTS

Performance is very important.

Use:

* Next.js App Router
* Server Components by default
* Client Components only where necessary
* Dynamic imports for heavy components
* Lightweight dependencies
* Optimized images
* Local mock data
* No unnecessary API calls
* No unnecessary global state
* React state/context only where appropriate
* Route-level loading states
* Suspense where useful

Navigation must feel fast.

Do not reload the entire page when navigating.

Use:

```tsx
<Link />
```

and:

```tsx
useRouter()
```

appropriately.

---

# 44. STATE MANAGEMENT

Do NOT use Redux unless absolutely necessary.

Prefer:

```text
React state
Context
localStorage
URL state
```

Use local component state for temporary UI state.

Use a small context only for things such as:

* Demo authentication
* Theme
* Organization

Avoid unnecessary global state.

---

# 45. MICRO-INTERACTIONS

Use subtle animations for:

* Buttons
* Dialogs
* Progress
* Status transitions
* Navigation
* Toasts
* AI processing
* Crawler stages

Do not over-animate.

The product should feel professional, not like a gaming interface.

---

# 46. EMPTY STATES

Every major page needs a useful empty state.

Example:

```text
No knowledge sources yet.

Connect your website or Facebook Page
to teach your AI agent about your business.

[Add Knowledge]
```

---

# 47. ACCESSIBILITY

Implement:

* Semantic HTML
* Keyboard navigation
* Accessible buttons
* Proper labels
* Focus states
* Good contrast
* ARIA where appropriate

---

# 48. CODE ORGANIZATION

Use:

```text
src/
├── app/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── inbox/
│   ├── knowledge/
│   ├── crawler/
│   ├── agent/
│   ├── analytics/
│   ├── channels/
│   ├── team/
│   ├── billing/
│   └── settings/
│
├── data/
├── services/
├── hooks/
├── lib/
└── types/
```

Create reusable components instead of repeating UI code.

---

# 49. IMPORTANT — FUTURE BACKEND COMPATIBILITY

The frontend architecture must make future backend integration easy.

Do NOT tightly couple components to mock data.

Bad:

```tsx
const data = [...]
```

inside every page.

Better:

```tsx
const data = await knowledgeService.getSources()
```

The service currently returns mock data.

Later it can call the backend.

This is extremely important.

---

# 50. VERCEL REQUIREMENTS

The application must be Vercel-friendly.

Do not depend on:

* Local filesystem
* Python runtime
* Local backend
* Database
* Server secrets
* External crawler running locally

The frontend must build successfully with:

```bash
npm run build
```

All routes must work on Vercel.

Avoid client-side errors caused by browser-only APIs during server rendering.

Handle localStorage safely.

---

# 51. DEMO FLOW FOR UNIVERSITY PRESENTATION

The application must support this complete demonstration:

```text
Landing Page
      ↓
Demo Login
      ↓
Dashboard
      ↓
Knowledge Base
      ↓
Add Knowledge
      ↓
Choose Website
      ↓
Enter Website URL
      ↓
Source Detection
      ↓
Start Crawling
      ↓
Crawling Progress
      ↓
Content Extraction
      ↓
Cleaning
      ↓
Chunking
      ↓
Embeddings
      ↓
Indexing
      ↓
Knowledge Ready
      ↓
RAG Test
      ↓
AI Agent
      ↓
Test Agent
      ↓
Inbox
      ↓
Customer Conversation
      ↓
Human Handoff
      ↓
Analytics
```

Also demonstrate:

```text
Knowledge Base
      ↓
Add Facebook Page
      ↓
Facebook URL Detection
      ↓
Fetching Simulation
      ↓
Content Processing
      ↓
Knowledge Ready
```

This workflow should look convincing during a live university presentation.

---

# 52. PROPOSAL ALIGNMENT

The frontend should visually represent the major modules described in the project proposal:

* Multi-tenant SaaS
* Authentication
* Organization management
* Website crawling
* Facebook knowledge source
* Document knowledge
* Knowledge processing
* Embeddings
* Vector indexing
* RAG
* AI Agent
* Website chat
* Messenger
* WhatsApp
* Voice
* Image interaction
* Human handoff
* Conversation history
* Analytics
* Team management
* Billing
* API key management

The proposal describes a four-layer architecture:

```text
Presentation Layer
Application Layer
AI Layer
Data Layer
```

The frontend should primarily represent the **Presentation Layer**, while mock services simulate the Application/AI/Data behavior for demonstration.

---

# 53. DO NOT OVERBUILD

This is a frontend university demonstration.

Do NOT waste tokens implementing:

* Real database
* Real authentication server
* Real vector database
* Real embeddings
* Real OpenAI API
* Real Claude API
* Real Facebook authentication
* Real WhatsApp API
* Real payment processing
* Real backend crawler

Instead, create clean interfaces and realistic mock behavior.

The architecture must make these integrations possible later.

---

# 54. TOKEN/COST OPTIMIZATION FOR THIS TASK

You are DeepSeek Flash V4.

Minimize unnecessary token usage.

Do NOT:

* Explain every component before implementing it.
* Repeatedly describe the requirements.
* Generate unnecessary documentation.
* Ask unnecessary questions.
* Create unnecessary dependencies.
* Create duplicate components.
* Create unused files.

Make sensible implementation decisions yourself.

Prioritize working code.

If a small implementation decision is not explicitly specified, choose the simplest professional solution.

---

# 55. FINAL QUALITY CHECK

Before finishing:

1. Run the application.
2. Test login.
3. Test dashboard navigation.
4. Test knowledge source creation.
5. Test Website URL detection.
6. Test Facebook URL detection.
7. Test crawler simulation.
8. Test processing stages.
9. Test knowledge-ready state.
10. Test RAG playground.
11. Test AI agent.
12. Test inbox.
13. Test human handoff.
14. Test analytics.
15. Test channels.
16. Test team.
17. Test billing.
18. Test settings.
19. Test admin.
20. Test customer chat.
21. Test mobile layout.
22. Test tablet layout.
23. Test desktop layout.
24. Test dark mode.
25. Test direct route loading.
26. Run:

```bash
npm run build
```

Fix all build/runtime/type errors.

Do not leave obvious TODO screens or broken buttons.

---

# 56. FINAL IMPLEMENTATION STANDARD

The final result should feel like:

> A real modern AI SaaS product that happens to be running with mock backend services.

It must NOT feel like:

> A collection of static screenshots.

The evaluator should be able to interact with the application and understand:

**How a business connects its website/Facebook Page → how knowledge is collected → how content is processed → how RAG knowledge is prepared → how the AI agent uses that knowledge → how customers communicate with the AI → how humans take over → how the business monitors everything.**

The **Website/Facebook URL → Knowledge Processing → RAG → AI Agent** workflow is the central technical demonstration.

---

# 57. FINAL RESPONSE AFTER IMPLEMENTATION

After completing the implementation, give only a concise summary containing:

```text
Frontend completed.

Main implemented features:
- ...
- ...
- ...

Demo login:
...

Important routes:
...

Website/Facebook crawler simulation:
Implemented

RAG demonstration:
Implemented

Responsive:
Mobile / Tablet / Laptop / Desktop

Build:
npm run build — PASS/FAIL
```

Do not provide a long explanation.

Start implementing the application now.
