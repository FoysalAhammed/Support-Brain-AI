import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Check,
  Database,
  Facebook,
  FileText,
  Globe,
  Headphones,
  Layers,
  Lock,
  MessagesSquare,
  Phone,
  Plug,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ProductTour } from "@/components/marketing/product-tour";
import { Counter, Float, MotionRoot, Reveal, Stagger, StaggerItem } from "@/components/marketing/anim";
import { billingService } from "@/services/billing";
import { cn } from "@/lib/utils";

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20", className)}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {description && (
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
          )}
        </Reveal>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}

function HeroPreview() {
  const bars = [44, 66, 52, 80, 62, 90, 74];
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/50" />
          <span className="size-2.5 rounded-full bg-warning/50" />
          <span className="size-2.5 rounded-full bg-success/50" />
          <span className="ml-3 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            app.supportbrain.ai/dashboard
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr]">
          <div className="hidden w-36 shrink-0 space-y-1 border-r border-border p-3 sm:block">
            {["Overview", "Inbox", "AI Agent", "Knowledge", "Analytics"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs",
                  index === 3
                    ? "bg-primary-soft font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Conversations", value: "12,482" },
                { label: "AI resolved", value: "87.4%" },
                { label: "Avg. response", value: "1.8s" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-border p-2.5">
                  <p className="text-[0.65rem] text-muted-foreground">{kpi.label}</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-end gap-1.5" style={{ height: 88 }}>
                {bars.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { tone: "success", text: "Knowledge ready · northwind.com · 5,604 chunks" },
                { tone: "accent", text: "RAG answer · 95% confidence · 3 sources" },
              ].map((row) => (
                <div
                  key={row.text}
                  className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-[0.7rem] text-muted-foreground"
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      row.tone === "success" ? "bg-success" : "bg-accent",
                    )}
                  />
                  {row.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -left-4 top-24 hidden lg:block">
        <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
          <p className="flex items-center gap-1.5 text-[0.7rem] font-medium">
            <Sparkles className="size-3 text-accent" />
            Grounded in your knowledge
          </p>
        </div>
      </div>
    </div>
  );
}

const logos = ["Northwind", "Lumen", "Trailhead", "Vertex", "GreenCart", "Aurora"];

const steps = [
  { icon: Plug, title: "Connect a source", body: "Website, Facebook Page, PDF or documents." },
  { icon: Workflow, title: "Collect & process", body: "Crawl, clean, chunk and embed automatically." },
  { icon: Database, title: "Index knowledge", body: "Vectors written to a searchable index." },
  { icon: Brain, title: "Answer with RAG", body: "Grounded answers, with human handoff." },
];

const features = [
  {
    icon: Bot,
    title: "AI Customer Support",
    body: "Resolve routine questions instantly with an agent grounded in your own business knowledge — 24/7, in every channel.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    body: "Connect a website, Facebook Page, PDF or document and turn it into structured, searchable AI knowledge.",
  },
  {
    icon: Brain,
    title: "Retrieval-Augmented Generation",
    body: "Every answer is grounded in retrieved knowledge passages, so responses stay accurate and never invented.",
  },
  {
    icon: MessagesSquare,
    title: "Omnichannel Inbox",
    body: "Website chat, Messenger, WhatsApp and voice land in one shared inbox with full conversation history.",
  },
  {
    icon: Headphones,
    title: "Human Handoff",
    body: "When confidence drops or a customer asks, the conversation transfers to a human with full context attached.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    body: "Track resolution rate, response time, channel usage and the knowledge sources driving your answers.",
  },
];

const knowledgeSources = [
  { icon: Globe, label: "Website", detail: "Crawl pages & policies" },
  { icon: Facebook, label: "Facebook", detail: "Public Page content" },
  { icon: FileText, label: "PDF", detail: "Manuals & documents" },
  { icon: Database, label: "Documents", detail: "Any text knowledge" },
];

const channels = [
  { icon: Globe, label: "Website Chat", status: "Connected" },
  { icon: MessagesSquare, label: "Facebook Messenger", status: "Available" },
  { icon: Phone, label: "WhatsApp", status: "Available" },
  { icon: Headphones, label: "Voice", status: "Available" },
];

const ragSteps = [
  { icon: Search, label: "Customer Question" },
  { icon: Layers, label: "Knowledge Retrieval" },
  { icon: BookOpen, label: "Relevant Context" },
  { icon: Sparkles, label: "AI Response" },
];

const layers = [
  { icon: BarChart3, name: "Presentation Layer", body: "Dashboard, inbox, agent studio and customer chat." },
  { icon: Workflow, name: "Application Layer", body: "Knowledge ingestion, RAG orchestration and channels." },
  { icon: Brain, name: "AI Layer", body: "Embeddings, vector search and language model routing." },
  { icon: Database, name: "Data Layer", body: "Multi-tenant storage, vector index and conversation history." },
];

const testimonials = [
  {
    quote:
      "We connected our website and Facebook Page on a Monday and our AI was resolving shipping and returns questions by the afternoon. Deflection went up, not down.",
    name: "Alex Morgan",
    role: "Head of Customer Experience",
    company: "Northwind Commerce",
  },
  {
    quote:
      "The handoff is the part that sold us. The AI answers the easy 85% and brings a person in with the whole conversation already in front of them.",
    name: "Maya Fitzgerald",
    role: "Support Director",
    company: "Lumen Fintech",
  },
  {
    quote:
      "Seeing the pipeline — crawling, chunking, embeddings, indexing — made it obvious why the answers were accurate instead of guesses.",
    name: "Noah Bennett",
    role: "Operations Lead",
    company: "Trailhead Travel",
  },
];

const faqs = [
  {
    question: "How does SupportBrain learn my business?",
    answer:
      "You connect a source — a website, a Facebook Page, a PDF or documents. SupportBrain crawls or reads it, cleans the content, splits it into chunks, generates embeddings and writes them to a vector index. From then on the AI answers from that knowledge.",
  },
  {
    question: "Are answers really grounded, or does it guess?",
    answer:
      "Every answer is generated from retrieved knowledge passages using retrieval-augmented generation. If nothing relevant is found, the agent escalates to a human instead of inventing an answer.",
  },
  {
    question: "What happens when the AI is unsure?",
    answer:
      "When confidence falls below your threshold — 70% by default — the conversation is escalated to your team with the full thread, the customer's details and the sources already attached.",
  },
  {
    question: "Which channels are supported?",
    answer:
      "Website chat, Facebook Messenger, WhatsApp, voice and email all route into one shared inbox with consistent answers.",
  },
  {
    question: "Do I need developers to get started?",
    answer:
      "No. The whole flow — connecting knowledge, configuring the agent and testing it — is done in the dashboard. The API is there when you want to build on top of it.",
  },
];

export default async function HomePage() {
  const plans = (await billingService.getPlans()).filter((plan) => plan.id !== "enterprise");

  return (
    <MotionRoot>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
            <div
              className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
              <Reveal className="space-y-6">
                <Badge variant="accent">
                  <Sparkles className="size-3" />
                  RAG-enabled multi-agent platform
                </Badge>
                <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                  AI Customer Support That{" "}
                  <span className="text-gradient">Knows Your Business.</span>
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  Connect your website, Facebook Page and documents to create an
                  AI-powered support agent that answers accurately across every
                  channel — and hands off to your team when it matters.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Start Building Your AI Agent
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login">View Demo</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  {["No credit card", "Live in minutes", "Human handoff included"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check className="size-3.5 text-success" />
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <Float>
                  <HeroPreview />
                </Float>
              </Reveal>
            </div>
          </section>

          {/* Trust strip */}
          <div className="border-y border-border bg-muted/30">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 sm:px-6">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trusted by support teams at
              </span>
              {logos.map((logo) => (
                <span key={logo} className="text-sm font-semibold text-muted-foreground/70">
                  {logo}
                </span>
              ))}
            </div>
          </div>

          {/* Product tour */}
          <Section
            id="product"
            eyebrow="See it in action"
            title="The entire system, in one walkthrough"
            description="Follow a real example — Northwind Commerce connects its website, then the AI agent answers customers, escalates when needed, and reports back."
          >
            <Reveal>
              <ProductTour />
            </Reveal>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <StaggerItem key={step.title}>
                    <Card className="h-full p-5">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">
                          {String(steps.indexOf(step) + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>

          {/* Metrics band */}
          <section className="border-y border-border bg-primary-soft/30">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4">
              {[
                { value: 12482, label: "Conversations resolved", suffix: "" },
                { value: 87.4, label: "AI resolution rate", suffix: "%", decimals: 1 },
                { value: 1.8, label: "Average response time", suffix: "s", decimals: 1 },
                { value: 40, label: "Countries supported", suffix: "+" },
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    <Counter
                      to={metric.value}
                      suffix={metric.suffix}
                      decimals={metric.decimals ?? 0}
                    />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <Section
            id="features"
            eyebrow="Platform"
            title="Everything you need to support customers with AI"
            description="One platform for knowledge ingestion, retrieval, agent configuration, conversations and analytics."
          >
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <Card className="h-full p-6">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{feature.body}</p>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>

          {/* Knowledge */}
          <Section
            id="how-it-works"
            eyebrow="Knowledge Base"
            title="Turn your content into AI knowledge"
            description="Point SupportBrain at a source and it crawls, cleans, chunks, embeds and indexes everything automatically."
            className="border-t border-border bg-muted/30"
          >
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <Stagger className="grid gap-3 sm:grid-cols-2">
                {knowledgeSources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <StaggerItem key={source.label}>
                      <Card className="flex h-full items-center gap-3 p-4">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                          <Icon className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium">{source.label}</p>
                          <p className="text-xs text-muted-foreground">{source.detail}</p>
                        </div>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.1}>
                <Card className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ingestion pipeline
                  </p>
                  <ol className="mt-4 space-y-2.5 text-sm">
                    {[
                      "Source detection & validation",
                      "Crawling / fetching",
                      "Content extraction",
                      "Content cleaning",
                      "Text chunking",
                      "Embedding generation",
                      "Vector indexing",
                      "Knowledge ready",
                    ].map((step, index) => (
                      <li key={step} className="flex items-center gap-3">
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-[0.7rem] font-semibold text-primary">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Card>
              </Reveal>
            </div>
          </Section>

          {/* RAG */}
          <Section
            eyebrow="Retrieval-Augmented Generation"
            title="Answers grounded in real business knowledge"
            description="SupportBrain retrieves the most relevant passages before generating a response, so your AI never guesses."
          >
            <Stagger className="grid gap-3 sm:grid-cols-4">
              {ragSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <StaggerItem key={step.label} className="relative">
                    <Card className="flex h-full flex-col items-center gap-3 p-5 text-center">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="size-5" />
                      </span>
                      <p className="text-sm font-medium">{step.label}</p>
                      <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                    </Card>
                    {index < ragSteps.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground/50 sm:block" />
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>

          {/* Channels */}
          <Section
            id="channels"
            eyebrow="Omnichannel"
            title="Meet customers on every channel"
            description="One AI agent, one shared inbox, consistent answers across every place your customers talk to you."
            className="border-t border-border bg-muted/30"
          >
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <StaggerItem key={channel.label}>
                    <Card className="h-full p-5">
                      <div className="flex items-center justify-between">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                          <Icon className="size-5" />
                        </span>
                        <span className="text-xs font-medium text-success">
                          {channel.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-medium">{channel.label}</p>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>

          {/* Handoff + analytics */}
          <Section
            eyebrow="Human-in-the-loop"
            title="AI handles the routine. Your team handles the rest."
            description="Low-confidence answers and sensitive requests are escalated to a human automatically, with the full conversation and sources attached."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-warning-soft text-warning">
                      <ShieldCheck className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Confidence threshold</p>
                      <p className="text-xs text-muted-foreground">Handoff below 70%</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                    <p className="flex items-center gap-2 text-warning">
                      <Zap className="size-3.5" />
                      AI confidence low
                    </p>
                    <p className="text-muted-foreground">
                      This conversation needs human assistance.
                    </p>
                    <Button size="sm" className="mt-1">
                      <Users />
                      Take over conversation
                    </Button>
                  </div>
                </Card>
              </Reveal>

              <Reveal delay={0.1}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <TrendingUp className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Live analytics</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "Resolution rate", value: "87.4%" },
                      { label: "Avg. response", value: "1.8s" },
                      { label: "Handoff rate", value: "12.6%" },
                      { label: "Satisfaction", value: "4.7 / 5" },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-lg border border-border p-3">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="mt-0.5 text-lg font-semibold tabular-nums">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          </Section>

          {/* Architecture */}
          <Section
            eyebrow="Architecture"
            title="A four-layer platform"
            description="The dashboard you use is the presentation layer. Behind it, mock service layers simulate the application, AI and data layers — and can be swapped for a real backend."
            className="border-t border-border bg-muted/30"
          >
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <StaggerItem key={layer.name}>
                    <Card className="h-full p-5">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="size-4" />
                      </span>
                      <p className="mt-3 text-sm font-semibold">{layer.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{layer.body}</p>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Section>

          {/* Testimonials */}
          <Section eyebrow="Customers" title="Teams see results fast">
            <Stagger className="grid gap-4 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <StaggerItem key={testimonial.name}>
                  <Card className="flex h-full flex-col p-6">
                    <Quote className="size-5 text-primary" />
                    <p className="mt-3 flex-1 text-sm text-muted-foreground">
                      {testimonial.quote}
                    </p>
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

          {/* Pricing */}
          <Section
            id="pricing"
            eyebrow="Pricing"
            title="Simple pricing that scales with you"
            description="Start free, upgrade when you grow. Every plan includes the knowledge ingestion pipeline and RAG engine."
            className="border-t border-border bg-muted/30"
          >
            <Reveal>
              <PricingCards plans={plans} className="lg:grid-cols-3" />
            </Reveal>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/pricing">
                  Compare all plans
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Section>

          {/* FAQ */}
          <Section eyebrow="FAQ" title="Questions, answered">
            <div className="mx-auto max-w-3xl space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-border bg-card p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-3 text-sm font-medium marker:content-none">
                    {faq.question}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Section>

          {/* Final CTA */}
          <section className="border-t border-border">
            <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
              <Reveal>
                <Card className="relative overflow-hidden border-primary/30 bg-primary p-10 text-primary-foreground">
                  <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden />
                  <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Build your AI support agent today
                      </h2>
                      <p className="max-w-xl text-sm text-primary-foreground/80">
                        Connect your knowledge, configure your agent and start
                        resolving conversations in minutes.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild size="lg" variant="secondary">
                        <Link href="/register">Get started free</Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      >
                        <Link href="/login">View demo</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="relative mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-foreground/70">
                    <span className="flex items-center gap-1.5">
                      <Lock className="size-3.5" />
                      No card required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="size-3.5" />
                      Deploys on Vercel
                    </span>
                  </div>
                </Card>
              </Reveal>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </MotionRoot>
  );
}
