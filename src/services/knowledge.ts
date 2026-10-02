import {
  mockExtractedSections,
  mockKnowledgeActivity,
  mockKnowledgeSources,
} from "@/data/mock-knowledge";
import { sleep } from "@/lib/utils";
import type {
  ExtractedSection,
  KnowledgeActivity,
  KnowledgeSource,
  KnowledgeSourceType,
  RagAnswer,
  RagRetrievedChunk,
} from "@/types/knowledge";

let sources: KnowledgeSource[] = [...mockKnowledgeSources];

interface CorpusEntry {
  topics: string[];
  answer: string;
  chunks: { sourceId: string; label: string; kind: RagRetrievedChunk["kind"]; score: number }[];
  confidence: number;
}

const corpus: CorpusEntry[] = [
  {
    topics: ["ship", "shipping", "delivery", "deliver", "arrive", "how long", "lead time"],
    answer:
      "Standard delivery takes 2-4 business days within the United States and 5-9 business days for international orders. Orders placed before 2pm local time ship the same business day, and orders over $75 qualify for free carbon-neutral shipping. Express options deliver in 1-2 business days.",
    chunks: [
      { sourceId: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.95 },
      { sourceId: "src_website", label: "FAQ", kind: "faq", score: 0.84 },
      { sourceId: "src_website", label: "Track Order", kind: "page", score: 0.71 },
    ],
    confidence: 94,
  },
  {
    topics: ["return", "refund", "money back", "send back", "exchange"],
    answer:
      "You can return unused items within 60 days of delivery for a full refund to your original payment method. Northwind Plus members get a 90-day window. Refunds are issued within 5 business days of the item arriving at our warehouse, and made-to-order items are final sale.",
    chunks: [
      { sourceId: "src_website", label: "Refund Policy", kind: "page", score: 0.96 },
      { sourceId: "src_website", label: "Returns Portal", kind: "page", score: 0.82 },
      { sourceId: "src_warranty", label: "Warranty & Returns Policy", kind: "document", score: 0.7 },
    ],
    confidence: 95,
  },
  {
    topics: ["warranty", "guarantee", "defect", "broken", "damaged", "fault"],
    answer:
      "Every Northwind product carries a 5-year craftsmanship guarantee covering structural defects and manufacturing faults. It does not cover normal wear, misuse or accidental damage. Claims can be filed from your account or by contacting support with your order number, and any damage on arrival should be reported within 48 hours with photos.",
    chunks: [
      { sourceId: "src_website", label: "Warranty", kind: "page", score: 0.93 },
      { sourceId: "src_warranty", label: "Warranty & Returns Policy", kind: "document", score: 0.88 },
    ],
    confidence: 92,
  },
  {
    topics: ["price", "pricing", "cost", "membership", "plus", "plan", "subscription", "discount"],
    answer:
      "Membership is optional. Northwind Plus costs $9 per month or $89 per year and includes free two-day shipping, early access to seasonal collections, a 90-day extended return window and 10% off the trade programme. Standard accounts are always free, and current promotions such as AUTUMN15 give 15% off a first order over $50.",
    chunks: [
      { sourceId: "src_website", label: "Pricing", kind: "page", score: 0.94 },
      { sourceId: "src_website", label: "Membership", kind: "page", score: 0.9 },
      { sourceId: "src_facebook", label: "Recent Announcements", kind: "post", score: 0.78 },
    ],
    confidence: 93,
  },
  {
    topics: ["cancel", "cancellation", "change order", "wrong size"],
    answer:
      "Orders can be cancelled free of charge before dispatch. Because orders placed before 2pm local time ship the same business day, a cancellation may not always be possible — in that case you can still return the item within 60 days using our returns portal.",
    chunks: [
      { sourceId: "src_website", label: "Refund Policy", kind: "page", score: 0.86 },
      { sourceId: "src_website", label: "FAQ", kind: "faq", score: 0.8 },
    ],
    confidence: 88,
  },
  {
    topics: ["international", "customs", "duties", "abroad", "countries", "overseas"],
    answer:
      "We ship to more than 40 countries. For supported international destinations we ship with duties prepaid and handle all customs documentation on your behalf, so there are no surprise fees on delivery. International orders typically arrive in 5-9 business days.",
    chunks: [
      { sourceId: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.92 },
      { sourceId: "src_website", label: "Terms of Service", kind: "page", score: 0.72 },
    ],
    confidence: 90,
  },
  {
    topics: ["assembly", "assemble", "install", "installation", "build it"],
    answer:
      "Assembly assistance is available for large furniture items and can be booked during checkout or any time from your account. Saturday slots are offered in most metro areas, and the Assembly Guide covers self-assembly for smaller products.",
    chunks: [
      { sourceId: "src_website", label: "Assembly Guide", kind: "page", score: 0.91 },
      { sourceId: "src_website", label: "Services", kind: "page", score: 0.87 },
    ],
    confidence: 91,
  },
  {
    topics: ["contact", "support", "phone", "email", "hours", "reach", "human", "agent"],
    answer:
      "You can reach our team seven days a week between 8am and 8pm Pacific Time by chat, email at support@northwind.com, or phone. If you would like, I can connect you with a human agent right now.",
    chunks: [
      { sourceId: "src_website", label: "Contact", kind: "page", score: 0.93 },
      { sourceId: "src_facebook", label: "Contact Information", kind: "post", score: 0.76 },
    ],
    confidence: 92,
  },
  {
    topics: ["track", "tracking", "order status", "where is my order", "parcel", "shipment"],
    answer:
      "You can track your parcel in real time using the tracking link in your dispatch confirmation email, or from Track Order in your account. If tracking has not updated for more than 48 hours, I can flag the shipment for a priority trace with the carrier.",
    chunks: [
      { sourceId: "src_website", label: "Track Order", kind: "page", score: 0.9 },
      { sourceId: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.83 },
    ],
    confidence: 89,
  },
  {
    topics: ["wholesale", "trade", "bulk", "b2b", "reseller", "volume"],
    answer:
      "Our trade programme offers dedicated pricing, priority production slots, co-branded packaging and a personal account manager. Tier one starts at 50 units per SKU per quarter and tier two at 250 units. A trade specialist can prepare a tailored rate card for your volumes.",
    chunks: [
      { sourceId: "src_website", label: "Wholesale", kind: "page", score: 0.91 },
      { sourceId: "src_website", label: "Services", kind: "page", score: 0.7 },
    ],
    confidence: 79,
  },
  {
    topics: ["about", "company", "who are you", "where are you based", "founded"],
    answer:
      "Northwind Commerce designs and ships premium home and lifestyle essentials to more than 40 countries. Founded in 2014 in Portland, Oregon, we now serve over 380,000 customers with an in-house design studio and 42 regional fulfilment partners.",
    chunks: [
      { sourceId: "src_website", label: "About Us", kind: "page", score: 0.93 },
      { sourceId: "src_facebook", label: "Page Information", kind: "post", score: 0.74 },
    ],
    confidence: 93,
  },
];

function buildRetrieved(entry: CorpusEntry): RagRetrievedChunk[] {
  return entry.chunks.map((chunk, index) => {
    const section =
      mockExtractedSections.find((s) => s.sourceId === chunk.sourceId) ??
      mockExtractedSections[0];
    return {
      id: `ret_${index}_${chunk.label.replace(/\W+/g, "_")}`,
      sourceId: chunk.sourceId,
      label: chunk.label,
      kind: chunk.kind,
      score: chunk.score,
      snippet: section.text.slice(0, 168) + "…",
    };
  });
}

export const knowledgeService = {
  async listSources(organizationId?: string): Promise<KnowledgeSource[]> {
    await sleep(60);
    return organizationId
      ? sources.filter((source) => source.organizationId === organizationId)
      : sources;
  },

  async getSource(id: string): Promise<KnowledgeSource | null> {
    await sleep(40);
    return sources.find((source) => source.id === id) ?? null;
  },

  async getSections(sourceId: string): Promise<ExtractedSection[]> {
    await sleep(40);
    return mockExtractedSections.filter((section) => section.sourceId === sourceId);
  },

  async getActivity(sourceId: string): Promise<KnowledgeActivity[]> {
    await sleep(40);
    return mockKnowledgeActivity.filter((activity) => activity.sourceId === sourceId);
  },

  async getStats() {
    await sleep(30);
    return {
      sources: sources.length,
      pages: sources.reduce((sum, s) => sum + s.pages, 0),
      chunks: sources.reduce((sum, s) => sum + s.chunks, 0),
      embeddings: sources.reduce((sum, s) => sum + s.embeddings, 0),
      ready: sources.filter((s) => s.status === "ready").length,
    };
  },

  async createSource(input: {
    name: string;
    type: KnowledgeSourceType;
    url?: string;
    domain?: string;
    pages: number;
    contentBlocks: number;
    chunks: number;
    organizationId?: string;
  }): Promise<KnowledgeSource> {
    const source: KnowledgeSource = {
      id: `src_${Date.now().toString(36)}`,
      organizationId: input.organizationId ?? "org_northwind",
      name: input.name,
      type: input.type,
      url: input.url,
      domain: input.domain,
      status: "ready",
      pages: input.pages,
      contentBlocks: input.contentBlocks,
      chunks: input.chunks,
      embeddings: input.chunks,
      sizeKb: Math.round(input.chunks * 2.9),
      coverage: 100,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      agentIds: [],
    };
    sources = [source, ...sources];
    return source;
  },

  async deleteSource(id: string): Promise<void> {
    await sleep(200);
    sources = sources.filter((source) => source.id !== id);
  },

  async syncSource(id: string): Promise<KnowledgeSource | null> {
    await sleep(400);
    sources = sources.map((source) =>
      source.id === id
        ? { ...source, status: "ready", lastSyncedAt: new Date().toISOString() }
        : source,
    );
    return sources.find((source) => source.id === id) ?? null;
  },

  async ask(question: string, sourceIds?: string[]): Promise<RagAnswer> {
    await sleep(1200);
    const normalized = question.toLowerCase();
    const scored = corpus
      .map((entry) => ({
        entry,
        score: entry.topics.reduce(
          (sum, topic) => sum + (normalized.includes(topic) ? topic.length : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    const active = (sourceIds ?? sources.filter((s) => s.status === "ready").map((s) => s.id));

    if (!best || best.score === 0) {
      return {
        id: `rag_${Date.now().toString(36)}`,
        question,
        answer:
          "I could not find that in the connected business knowledge. I don't want to guess, so I'd recommend connecting with a member of our team who can help you directly.",
        confidence: 41,
        latencyMs: 1420,
        usedKnowledge: false,
        needsHandoff: true,
        retrieved: [],
        stages: this.retrievalStages(0),
      };
    }

    const retrieved = buildRetrieved(best.entry).filter((chunk) =>
      active.includes(chunk.sourceId),
    );

    const confidence = retrieved.length
      ? best.entry.confidence
      : Math.max(38, best.entry.confidence - 35);

    return {
      id: `rag_${Date.now().toString(36)}`,
      question,
      answer: best.entry.answer,
      confidence,
      latencyMs: 1180 + (question.length % 40) * 12,
      usedKnowledge: retrieved.length > 0,
      needsHandoff: confidence < 70,
      retrieved,
      stages: this.retrievalStages(retrieved.length),
    };
  },

  retrievalStages(chunkCount: number) {
    return [
      { label: "Question embedded", detail: "1536-dimension query vector created" },
      { label: "Similarity search", detail: "Cosine similarity over 6,240 indexed chunks" },
      { label: "Relevant chunks retrieved", detail: `${chunkCount} passages above threshold` },
      { label: "Context assembled", detail: "Ranked context window built within token budget" },
      { label: "Answer generated", detail: "Grounded response composed from retrieved context" },
    ];
  },
};

export type KnowledgeService = typeof knowledgeService;
