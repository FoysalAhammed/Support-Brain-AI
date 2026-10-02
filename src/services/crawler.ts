import {
  buildChunks,
  buildFacebookSections,
  buildWebsitePages,
  pageContent,
} from "@/data/mock-crawl-results";
import { mockExtractedSections } from "@/data/mock-knowledge";
import { formatNumber, sleep, titleCase } from "@/lib/utils";
import type {
  KnowledgeSource,
  KnowledgeSourceType,
  RagAnswer,
  RagRetrievedChunk,
} from "@/types/knowledge";
import type {
  ChunkPreview,
  CrawlJob,
  CrawlStage,
  CrawlStageState,
  DiscoveredPage,
  EmbeddingStatus,
  SourceDetection,
} from "@/types/crawler";

export const CRAWL_STAGES: {
  stage: CrawlStage;
  label: string;
  description: string;
  durationMs: number;
}[] = [
  {
    stage: "DETECTING",
    label: "Source Detection",
    description: "Validating the URL and identifying the source type",
    durationMs: 1100,
  },
  {
    stage: "CRAWLING",
    label: "Crawling / Fetching",
    description: "Discovering and downloading pages",
    durationMs: 2400,
  },
  {
    stage: "EXTRACTING",
    label: "Content Extraction",
    description: "Pulling readable text and structure",
    durationMs: 2200,
  },
  {
    stage: "CLEANING",
    label: "Content Cleaning",
    description: "Removing navigation, ads and boilerplate",
    durationMs: 1900,
  },
  {
    stage: "CHUNKING",
    label: "Text Chunking",
    description: "Splitting content into retrievable chunks",
    durationMs: 2000,
  },
  {
    stage: "EMBEDDING",
    label: "Embedding Generation",
    description: "Turning chunks into vector embeddings",
    durationMs: 2400,
  },
  {
    stage: "INDEXING",
    label: "Vector Indexing",
    description: "Writing vectors to the knowledge index",
    durationMs: 1600,
  },
  {
    stage: "READY",
    label: "Knowledge Ready",
    description: "The AI agent can now use this knowledge",
    durationMs: 600,
  },
];

export const CRAWL_STAGE_ORDER = CRAWL_STAGES.map((s) => s.stage);

const jobs = new Map<string, CrawlJob>();

const DEMO_SPEED = 0.4;
const TICKS_PER_STAGE = 8;

function snapshot(job: CrawlJob): CrawlJob {
  return JSON.parse(JSON.stringify(job)) as CrawlJob;
}

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1_000_003;
  }
  return hash;
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const crawlerService = {
  validateUrl(input: string): { valid: boolean; message: string } {
    const candidate = normalizeUrl(input);
    if (!candidate) {
      return { valid: false, message: "Enter a website or Facebook Page URL." };
    }
    let url: URL;
    try {
      url = new URL(candidate);
    } catch {
      return {
        valid: false,
        message: "Invalid URL. Please enter a valid website or Facebook Page URL.",
      };
    }
    if (!/^https?:$/.test(url.protocol)) {
      return { valid: false, message: "Only http and https URLs are supported." };
    }
    if (!url.hostname.includes(".")) {
      return { valid: false, message: "That does not look like a real domain." };
    }
    if (/\s/.test(url.hostname)) {
      return { valid: false, message: "Domains cannot contain spaces." };
    }
    return { valid: true, message: "URL validated" };
  },

  detectSource(input: string): SourceDetection {
    const candidate = normalizeUrl(input);
    const validation = this.validateUrl(input);

    if (!validation.valid) {
      return {
        type: "invalid",
        url: candidate,
        domain: "",
        name: "",
        valid: false,
        message: validation.message,
        estimatedPages: 0,
        estimatedChunks: 0,
      };
    }

    const url = new URL(candidate);
    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
    const isFacebook = /(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(hostname);

    if (isFacebook) {
      const segment = url.pathname.split("/").filter(Boolean)[0] ?? "";
      const handle = segment
        .replace(/[-_.]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => titleCase(word))
        .join(" ");
      const name = handle || "Facebook Page";
      const seed = hashSeed(hostname + url.pathname);
      const blocks = 380 + (seed % 140);
      return {
        type: "facebook",
        url: candidate,
        domain: "facebook.com",
        name,
        valid: true,
        message: "Facebook Page detected",
        estimatedPages: 8,
        estimatedChunks: Math.round(blocks * 4.47),
      };
    }

    const seed = hashSeed(hostname);
    const blocks = 1240 + (seed % 420);
    return {
      type: "website",
      url: candidate,
      domain: hostname,
      name: hostname,
      valid: true,
      message: "Website detected",
      estimatedPages: 28,
      estimatedChunks: Math.round(blocks * 4.21),
    };
  },

  buildStages(): CrawlStageState[] {
    return CRAWL_STAGES.map((meta) => ({
      stage: meta.stage,
      label: meta.label,
      description: meta.description,
      status: "pending",
      progress: 0,
    }));
  },

  createJob(detection: SourceDetection): CrawlJob {
    const pages =
      detection.type === "facebook" ? buildFacebookSections() : buildWebsitePages();
    const chunks = buildChunks(detection.estimatedChunks, detection.name);
    const job: CrawlJob = {
      id: `job_${Date.now().toString(36)}`,
      url: detection.url,
      type: detection.type === "invalid" ? "website" : detection.type,
      sourceName: detection.name,
      domain: detection.domain,
      status: "running",
      progress: 0,
      stages: this.buildStages(),
      discoveredPages: pages,
      chunks,
      embedding: {
        total: detection.estimatedChunks,
        embedded: 0,
        dimensions: 1536,
        indexName: `${(detection.domain || "source").replace(/\W+/g, "-")}-prod`,
        indexStatus: "empty",
        vectorsPerSecond: 0,
      },
      pagesTotal: pages.length,
      pagesCrawled: 0,
      contentBlocks: 0,
      startedAt: new Date().toISOString(),
    };
    jobs.set(job.id, job);
    return job;
  },

  async startCrawl(url: string): Promise<CrawlJob> {
    const detection = this.detectSource(url);
    if (!detection.valid) {
      throw new Error(detection.message);
    }
    const job = this.createJob(detection);
    return job;
  },

  getCrawlStatus(id: string): CrawlJob | undefined {
    return jobs.get(id);
  },

  getDiscoveredContent(id: string): DiscoveredPage[] {
    return jobs.get(id)?.discoveredPages ?? [];
  },

  getChunks(id: string): ChunkPreview[] {
    return jobs.get(id)?.chunks ?? [];
  },

  getEmbeddingStatus(id: string): EmbeddingStatus | undefined {
    return jobs.get(id)?.embedding;
  },

  blocksTarget(job: CrawlJob): number {
    const raw = job.discoveredPages.reduce((sum, page) => sum + page.blocks, 0);
    return Math.max(raw, Math.round(job.embedding.total / 4.2));
  },

  applyStageProgress(job: CrawlJob, stage: CrawlStage, ratio: number) {
    const target = this.blocksTarget(job);
    switch (stage) {
      case "CRAWLING": {
        const count = Math.round(job.pagesTotal * ratio);
        job.pagesCrawled = count;
        job.discoveredPages = job.discoveredPages.map((page, index) =>
          index < count ? { ...page, status: "fetched" } : page,
        );
        break;
      }
      case "EXTRACTING": {
        const count = Math.round(job.pagesTotal * ratio);
        job.discoveredPages = job.discoveredPages.map((page, index) =>
          index < count ? { ...page, status: "extracted" } : page,
        );
        job.contentBlocks = Math.round(target * 1.12 * ratio);
        break;
      }
      case "CLEANING": {
        job.contentBlocks = Math.round(target * (1.12 - 0.12 * ratio));
        break;
      }
      case "EMBEDDING": {
        const stageSeconds = (CRAWL_STAGES[5].durationMs * DEMO_SPEED) / 1000;
        job.embedding = {
          ...job.embedding,
          embedded: Math.round(job.embedding.total * ratio),
          indexStatus: "building",
          vectorsPerSecond: Math.max(1, Math.round(job.embedding.total / stageSeconds)),
        };
        break;
      }
      case "INDEXING": {
        job.embedding = { ...job.embedding, indexStatus: "building" };
        break;
      }
      case "READY": {
        job.embedding = {
          ...job.embedding,
          embedded: job.embedding.total,
          indexStatus: "ready",
        };
        break;
      }
      default:
        break;
    }
  },

  stageDetail(stage: CrawlStage, job: CrawlJob): string {
    switch (stage) {
      case "DETECTING":
        return `${job.type === "facebook" ? "Facebook Page" : "Website"} · ${job.domain}`;
      case "CRAWLING":
        return `${job.pagesTotal} / ${job.pagesTotal} pages fetched`;
      case "EXTRACTING":
        return `${formatNumber(job.contentBlocks)} content blocks`;
      case "CLEANING":
        return `${formatNumber(job.contentBlocks)} blocks kept after cleanup`;
      case "CHUNKING":
        return `${formatNumber(job.embedding.total)} chunks created`;
      case "EMBEDDING":
        return `${formatNumber(job.embedding.total)} embeddings · ${job.embedding.dimensions}d`;
      case "INDEXING":
        return `Index ${job.embedding.indexName}`;
      case "READY":
        return `${formatNumber(job.embedding.total)} vectors searchable`;
      default:
        return "";
    }
  },

  async runCrawl(
    url: string,
    onUpdate: (job: CrawlJob) => void,
    isCancelled?: () => boolean,
  ): Promise<CrawlJob> {
    const detection = this.detectSource(url);
    if (!detection.valid) throw new Error(detection.message);
    const job = this.createJob(detection);
    const emit = () => onUpdate(snapshot(job));
    emit();

    for (let index = 0; index < CRAWL_STAGES.length; index += 1) {
      const meta = CRAWL_STAGES[index];
      job.stages[index] = { ...job.stages[index], status: "processing" };
      job.status = "running";
      job.progress = Math.round((index / CRAWL_STAGES.length) * 100);
      emit();

      const stageMs = meta.durationMs * DEMO_SPEED;
      for (let tick = 1; tick <= TICKS_PER_STAGE; tick += 1) {
        await sleep(stageMs / TICKS_PER_STAGE);
        if (isCancelled?.()) throw new Error("Knowledge collection cancelled");
        const ratio = tick / TICKS_PER_STAGE;
        job.stages[index] = {
          ...job.stages[index],
          progress: Math.round(ratio * 100),
        };
        this.applyStageProgress(job, meta.stage, ratio);
        job.progress = Math.round(((index + ratio) / CRAWL_STAGES.length) * 100);
        emit();
      }

      job.stages[index] = {
        ...job.stages[index],
        status: "completed",
        progress: 100,
        detail: this.stageDetail(meta.stage, job),
      };
      emit();
    }

    job.status = "completed";
    job.progress = 100;
    job.completedAt = new Date().toISOString();
    emit();
    return snapshot(job);
  },

  contentSections(job: CrawlJob, sourceId?: string) {
    const sid = sourceId ?? job.id;
    const curated = mockExtractedSections.filter((section) => section.sourceId === sid);
    if (curated.length) return curated;
    return job.discoveredPages.map((page, index) => {
      const text =
        pageContent[page.title] ??
        job.chunks.find((chunk) => chunk.pageTitle === page.title)?.text ??
        `${page.title} content extracted from ${job.sourceName}.`;
      const clean = text.replace(/^[^:]{0,60}:\s*/, "");
      return {
        id: `sec_${sid}_${page.id}`,
        sourceId: sid,
        pageTitle: page.title,
        heading: page.title,
        text: clean,
        words: clean.split(/\s+/).filter(Boolean).length,
      };
    });
  },

  askKnowledge(job: CrawlJob, question: string, sourceId?: string): RagAnswer {
    const sid = sourceId ?? job.id;
    const normalized = question.trim().toLowerCase();
    const pages = job.discoveredPages;

    const topics: { keys: string[]; answer: string; labels: string[] }[] = [
      {
        keys: ["service", "offer", "provide", "what can you", "help with", "do you do"],
        answer: `${job.sourceName} provides free styling consultations, assembly assistance for large items, extended warranty plans, a trade programme for partners and a subscription service for recurring essentials. Tell me what you need and I can point you to the right service.`,
        labels: ["Services", "About", "About Us", "FAQ"],
      },
      {
        keys: ["price", "pricing", "cost", "how much", "plan", "membership", "subscription", "discount"],
        answer: `Membership is optional. ${job.sourceName} lists a paid plan at $9 per month or $89 per year with free two-day shipping and a 90-day return window, while standard accounts stay free. Current promotions are announced to members first.`,
        labels: ["Pricing", "Membership", "FAQ"],
      },
      {
        keys: ["ship", "shipping", "delivery", "deliver", "arrive", "how long"],
        answer: `${job.sourceName} ships standard orders in 2-4 business days within the US and 5-9 business days internationally. Orders placed before 2pm local time leave the same business day, and express options arrive in 1-2 business days.`,
        labels: ["Shipping & Delivery", "FAQ", "Track Order"],
      },
      {
        keys: ["return", "refund", "money back", "exchange", "send back"],
        answer: `Unused items can be returned within 60 days of delivery for a full refund to the original payment method, with a 90-day window for members. Refunds are issued within 5 business days of the item reaching the warehouse.`,
        labels: ["Refund Policy", "Returns Portal", "FAQ"],
      },
      {
        keys: ["contact", "support", "phone", "email", "hours", "reach", "human", "agent"],
        answer: `You can reach the team seven days a week between 8am and 8pm Pacific Time by chat, email or phone. If you would like, I can connect you with a human agent right now.`,
        labels: ["Contact", "FAQ", "About"],
      },
      {
        keys: ["about", "company", "who are you", "based", "founded", "who is"],
        answer: `${job.sourceName} is a home and lifestyle business founded in 2014 in Portland, Oregon, now serving over 380,000 customers across more than 40 countries with an in-house design studio.`,
        labels: ["About Us", "About", "Home", "Business Information"],
      },
    ];

    const match = topics
      .map((topic) => ({
        topic,
        score: topic.keys.reduce(
          (sum, key) => sum + (normalized.includes(key) ? key.length : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)[0];

    const matched = match && match.score > 0 ? match.topic : null;

    const snippetFor = (page: DiscoveredPage) => {
      const text =
        pageContent[page.title] ??
        job.chunks.find((chunk) => chunk.pageTitle === page.title)?.text ??
        `${page.title} content extracted from ${job.sourceName}.`;
      const clean = text.replace(/^[^:]{0,60}:\s*/, "");
      return clean.length > 180 ? `${clean.slice(0, 178)}…` : clean;
    };

    const labels = matched?.labels ?? pages.slice(0, 3).map((page) => page.title);
    const retrieved = labels
      .map((label, index) => {
        const page = pages.find(
          (item) => item.title.toLowerCase() === label.toLowerCase(),
        );
        if (!page) return null;
        const chunk: RagRetrievedChunk = {
          id: `ret_${sid}_${index}`,
          sourceId: sid,
          label: page.title,
          kind: "page",
          score: Math.max(0.62, 0.96 - index * 0.09),
          snippet: snippetFor(page),
        };
        return chunk;
      })
      .filter((chunk): chunk is RagRetrievedChunk => chunk !== null);

    const confidence = matched ? Math.max(78, 96 - retrieved.length * 3) : 42;

    return {
      id: `rag_${Date.now().toString(36)}`,
      question,
      answer:
        matched?.answer ??
        `I could not find that in the knowledge collected from ${job.sourceName}. I don't want to guess, so I'd recommend connecting with a member of the team who can help directly.`,
      confidence,
      latencyMs: 1180 + (question.length % 40) * 12,
      usedKnowledge: Boolean(matched),
      needsHandoff: !matched || confidence < 70,
      retrieved,
      stages: [
        {
          label: "Question embedded",
          detail: `${job.embedding.dimensions}-dimension query vector created`,
        },
        {
          label: "Similarity search",
          detail: `Cosine similarity over ${formatNumber(job.embedding.total)} indexed chunks`,
        },
        {
          label: "Relevant chunks retrieved",
          detail: `${retrieved.length} passages above threshold`,
        },
        {
          label: "Context assembled",
          detail: "Ranked context window built within the token budget",
        },
        {
          label: "Answer generated",
          detail: "Grounded response composed from retrieved context",
        },
      ],
    };
  },

  buildJobFromSource(source: KnowledgeSource): CrawlJob {
    const pages =
      source.type === "facebook" ? buildFacebookSections() : buildWebsitePages();
    const chunks = buildChunks(source.chunks || 100, source.name);
    const completedAll = source.status === "ready";
    const processingIndex = completedAll ? CRAWL_STAGES.length : 5;
    return {
      id: `job_${source.id}`,
      url: source.url ?? `upload://${source.name}`,
      type: source.type,
      sourceName: source.name,
      domain: source.domain ?? "document",
      status: completedAll ? "completed" : "running",
      progress: completedAll ? 100 : Math.round((processingIndex / CRAWL_STAGES.length) * 100),
      stages: CRAWL_STAGES.map((meta, index) => ({
        stage: meta.stage,
        label: meta.label,
        description: meta.description,
        status:
          index < processingIndex
            ? "completed"
            : index === processingIndex
              ? "processing"
              : "pending",
        progress: index < processingIndex ? 100 : index === processingIndex ? 58 : 0,
        detail:
          meta.stage === "CRAWLING" && source.pages
            ? `${source.pages} / ${source.pages} pages`
            : undefined,
      })),
      discoveredPages: pages.map((page) => ({
        ...page,
        status: completedAll ? "extracted" : "fetched",
      })),
      chunks: chunks.map((chunk) => ({ ...chunk, tokens: chunk.tokens })),
      embedding: {
        total: source.chunks,
        embedded: source.embeddings,
        dimensions: 1536,
        indexName: `${(source.domain ?? "document").replace(/\W+/g, "-")}-prod`,
        indexStatus: completedAll ? "ready" : "building",
        vectorsPerSecond: 420,
      },
      pagesTotal: pages.length,
      pagesCrawled: completedAll ? pages.length : Math.ceil(pages.length * 0.6),
      contentBlocks: source.contentBlocks,
      startedAt: source.createdAt,
      completedAt: completedAll ? (source.lastSyncedAt ?? source.createdAt) : undefined,
    };
  },

  async getSourceDetails(id: string): Promise<{
    job: CrawlJob;
    sections: typeof mockExtractedSections;
  } | null> {
    const { knowledgeService } = await import("@/services/knowledge");
    const source = await knowledgeService.getSource(id);
    if (!source) return null;
    return {
      job: this.buildJobFromSource(source),
      sections: mockExtractedSections.filter((section) => section.sourceId === id),
    };
  },
};

export type CrawlerService = typeof crawlerService;
