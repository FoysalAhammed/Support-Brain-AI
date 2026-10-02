import type { Message } from "@/types/conversation";
import { ago, agoHours } from "./time";

const thread = (id: string, messages: Omit<Message, "conversationId">[]): Message[] =>
  messages.map((message) => ({ ...message, conversationId: id }));

export const mockMessages: Record<string, Message[]> = {
  conv_1001: thread("conv_1001", [
    {
      id: "msg_1001_1",
      role: "customer",
      content:
        "Hi, my order NW-48210 was marked as dispatched six days ago but the tracking link has not updated once. Can you check what is going on?",
      createdAt: agoHours(1),
    },
    {
      id: "msg_1001_2",
      role: "ai",
      content:
        "I'm sorry your parcel is taking longer than expected. Orders dispatched from our Portland fulfilment centre normally arrive within 2-4 business days in the US. Let me look at the tracking record for NW-48210 and check for a carrier delay.",
      createdAt: agoHours(0.95),
      confidence: 93,
      latencyMs: 1640,
      sources: [
        { id: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.94 },
        { id: "src_website", label: "Track Order", kind: "page", score: 0.81 },
      ],
    },
    {
      id: "msg_1001_3",
      role: "ai",
      content:
        "Your parcel is currently held at the regional sorting hub in Dallas. Carriers occasionally scan parcels late, and these usually deliver within one additional business day. I have flagged the shipment for a priority trace. Would you like me to notify you the moment the tracking updates?",
      createdAt: agoHours(0.9),
      confidence: 88,
      latencyMs: 1420,
      sources: [
        { id: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.9 },
      ],
    },
    {
      id: "msg_1001_4",
      role: "customer",
      content:
        "It has been 6 days since dispatch and tracking has not moved. If it does not arrive by tomorrow I would rather have a refund.",
      createdAt: ago(3),
    },
  ]),
  conv_1002: thread("conv_1002", [
    {
      id: "msg_1002_1",
      role: "customer",
      content: "Hi! I am trying to use the AUTUMN15 code on a $120 order but it says it is invalid.",
      createdAt: agoHours(2.4),
    },
    {
      id: "msg_1002_2",
      role: "ai",
      content:
        "Thanks for reaching out! The AUTUMN15 code gives 15% off your first order and applies to orders over $50, so your basket qualifies. It is valid once per account and cannot be combined with membership pricing. If you have used it before, that is likely why it shows as invalid.",
      createdAt: agoHours(2.35),
      confidence: 92,
      latencyMs: 1310,
      sources: [
        { id: "src_facebook", label: "Recent Announcements", kind: "post", score: 0.93 },
        { id: "src_website", label: "Pricing", kind: "page", score: 0.76 },
      ],
    },
    {
      id: "msg_1002_3",
      role: "customer",
      content: "That worked, thank you so much!",
      createdAt: ago(11),
    },
  ]),
  conv_1003: thread("conv_1003", [
    {
      id: "msg_1003_1",
      role: "customer",
      content:
        "Hello, we would like to place our Q4 restock order. Can you send the updated trade price list and confirm tier-two volumes?",
      createdAt: agoHours(6.4),
    },
    {
      id: "msg_1003_2",
      role: "ai",
      content:
        "Thanks for your continued partnership. Trade programme members receive dedicated pricing and a personal account manager. I can share the standard trade tiers, but the updated Q4 sheet is prepared by your account manager Sofía. I'm bringing her into this conversation now.",
      createdAt: agoHours(6.35),
      confidence: 61,
      latencyMs: 1980,
      sources: [
        { id: "src_website", label: "Wholesale", kind: "page", score: 0.72 },
      ],
    },
    {
      id: "msg_1003_3",
      role: "system",
      content: "AI confidence fell below the 70% threshold. Escalated to a human agent.",
      createdAt: agoHours(6.3),
    },
    {
      id: "msg_1003_4",
      role: "agent",
      content:
        "Hi Ravi, Sofía here. I'm preparing the Q4 trade sheet now and will attach it here within the hour. Tier two begins at 250 units per SKU for the quarter.",
      createdAt: agoHours(6),
      authorName: "Sofia Almeida",
    },
    {
      id: "msg_1003_5",
      role: "customer",
      content: "Perfect. Also, do the tier-two prices include the co-branded packaging?",
      createdAt: agoHours(2),
    },
    {
      id: "msg_1003_6",
      role: "customer",
      content: "Can you send the updated trade price list for Q4?",
      createdAt: ago(26),
    },
  ]),
  conv_1004: thread("conv_1004", [
    {
      id: "msg_1004_1",
      role: "customer",
      content: "Will I have to pay customs duties on a delivery to Germany?",
      createdAt: agoHours(3.2),
    },
    {
      id: "msg_1004_2",
      role: "ai",
      content:
        "For supported international destinations we ship with duties prepaid and handle all customs documentation on your behalf, so there is nothing extra to pay on delivery. Your order to Germany will be delivered with no surprise fees.",
      createdAt: agoHours(3.15),
      confidence: 93,
      latencyMs: 1180,
      sources: [
        { id: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.95 },
        { id: "src_website", label: "Terms of Service", kind: "page", score: 0.68 },
      ],
    },
    {
      id: "msg_1004_3",
      role: "customer",
      content: "Great, that answers my question. Thank you!",
      createdAt: ago(58),
    },
  ]),
  conv_1005: thread("conv_1005", [
    {
      id: "msg_1005_1",
      role: "customer",
      content: "My Northwind Plus membership renews next week. Does it still include the extended return window?",
      createdAt: agoHours(5.4),
    },
    {
      id: "msg_1005_2",
      role: "ai",
      content:
        "Yes. Northwind Plus includes a 90-day return window instead of the standard 60 days, along with free two-day shipping and early access to seasonal collections. The price remains $9 per month or $89 per year.",
      createdAt: agoHours(5.35),
      confidence: 96,
      latencyMs: 1050,
      sources: [
        { id: "src_website", label: "Membership", kind: "page", score: 0.96 },
        { id: "src_website", label: "Refund Policy", kind: "page", score: 0.85 },
      ],
    },
    {
      id: "msg_1005_3",
      role: "customer",
      content: "And can I switch to the annual plan mid-cycle?",
      createdAt: agoHours(5.1),
    },
    {
      id: "msg_1005_4",
      role: "ai",
      content:
        "You can switch at any time from Settings → Membership. We prorate the remaining value of your monthly plan and apply it to the annual price, so you only pay the difference.",
      createdAt: agoHours(5.05),
      confidence: 90,
      latencyMs: 1260,
      sources: [
        { id: "src_website", label: "Membership", kind: "page", score: 0.89 },
      ],
    },
    {
      id: "msg_1005_5",
      role: "customer",
      content: "Great, I'll keep my Plus membership then.",
      createdAt: agoHours(4),
    },
  ]),
  conv_1006: thread("conv_1006", [
    {
      id: "msg_1006_1",
      role: "customer",
      content: "My side table arrived with a deep scratch across the top surface. I am quite disappointed.",
      createdAt: agoHours(2.2),
    },
    {
      id: "msg_1006_2",
      role: "ai",
      content:
        "I'm really sorry to hear that your side table arrived damaged. That is not the experience we want for you. If an order arrives damaged we ask customers to contact support within 48 hours with photos so we can arrange a replacement immediately.",
      createdAt: agoHours(2.15),
      confidence: 46,
      latencyMs: 2240,
      sources: [
        { id: "src_website", label: "Refund Policy", kind: "page", score: 0.71 },
      ],
    },
    {
      id: "msg_1006_3",
      role: "system",
      content: "AI confidence fell below the 70% threshold. Flagged for human review.",
      createdAt: agoHours(2.1),
    },
    {
      id: "msg_1006_4",
      role: "customer",
      content: "I have attached photos of the damage.",
      createdAt: ago(7),
      attachments: [
        { id: "att_1", name: "damage-front.jpg", kind: "image" },
        { id: "att_2", name: "damage-closeup.jpg", kind: "image" },
      ],
    },
  ]),
  conv_1007: thread("conv_1007", [
    {
      id: "msg_1007_1",
      role: "customer",
      content: "We are a design studio and order regularly. What volume qualifies for tier-two trade pricing?",
      createdAt: agoHours(20),
    },
    {
      id: "msg_1007_2",
      role: "ai",
      content:
        "Trade programme members receive dedicated pricing and priority production slots. I can confirm the general programme benefits, but exact tier thresholds are managed by a trade specialist who can quote your specific volumes.",
      createdAt: agoHours(19.9),
      confidence: 66,
      latencyMs: 1740,
      sources: [
        { id: "src_website", label: "Wholesale", kind: "page", score: 0.78 },
      ],
    },
    {
      id: "msg_1007_3",
      role: "system",
      content: "Escalated to a human agent by AI confidence policy.",
      createdAt: agoHours(19.8),
    },
    {
      id: "msg_1007_4",
      role: "agent",
      content:
        "Hi James, Liam from the trade team. Tier two begins at 250 units per SKU per quarter and includes co-branded packaging. I'll email a full rate card today.",
      createdAt: agoHours(12),
      authorName: "Liam Carter",
    },
    {
      id: "msg_1007_5",
      role: "customer",
      content: "What volume qualifies for tier two pricing?",
      createdAt: agoHours(8),
    },
  ]),
  conv_1008: thread("conv_1008", [
    {
      id: "msg_1008_1",
      role: "customer",
      content: "How long does delivery to Dubai usually take?",
      createdAt: agoHours(26),
    },
    {
      id: "msg_1008_2",
      role: "ai",
      content:
        "International orders typically arrive in 5-9 business days, and we ship to more than 40 countries with all customs documentation handled on your behalf. Orders placed before 2pm local time ship the same business day.",
      createdAt: agoHours(25.9),
      confidence: 89,
      latencyMs: 1210,
      sources: [
        { id: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.93 },
      ],
    },
    {
      id: "msg_1008_3",
      role: "customer",
      content: "International orders typically arrive in 5-9 business days.",
      createdAt: agoHours(9),
    },
  ]),
  conv_1009: thread("conv_1009", [
    {
      id: "msg_1009_1",
      role: "customer",
      content: "Do you offer assembly for the large shelving units?",
      createdAt: agoDaysAgo(1),
    },
    {
      id: "msg_1009_2",
      role: "ai",
      content:
        "Yes. Assembly assistance is available for large furniture items and can be booked during checkout or any time from your account. We currently offer Saturday slots in most metro areas.",
      createdAt: agoDaysAgo(1),
      confidence: 94,
      latencyMs: 1090,
      sources: [
        { id: "src_website", label: "Assembly Guide", kind: "page", score: 0.94 },
        { id: "src_website", label: "Services", kind: "page", score: 0.88 },
      ],
    },
    {
      id: "msg_1009_3",
      role: "customer",
      content: "Perfect, I booked the assembly slot for Saturday.",
      createdAt: agoHours(14),
    },
  ]),
  conv_1010: thread("conv_1010", [
    {
      id: "msg_1010_1",
      role: "system",
      content: "Inbound voice call transcribed by SupportBrain Voice.",
      createdAt: agoHours(22),
    },
    {
      id: "msg_1010_2",
      role: "customer",
      content:
        "Transcription: I bought the Cedar lounge chair eight months ago and the front frame joint has come loose.",
      createdAt: agoHours(22),
    },
    {
      id: "msg_1010_3",
      role: "ai",
      content:
        "Every Northwind product carries a 5-year craftsmanship guarantee covering structural defects, so your chair is still within warranty. I can start a claim, though I'd like a specialist to review the photos first.",
      createdAt: agoHours(21.9),
      confidence: 58,
      latencyMs: 2380,
      sources: [
        { id: "src_website", label: "Warranty", kind: "page", score: 0.9 },
      ],
    },
    {
      id: "msg_1010_4",
      role: "system",
      content: "Escalated to a human agent for warranty review.",
      createdAt: agoHours(21.8),
    },
    {
      id: "msg_1010_5",
      role: "agent",
      content:
        "Hi Yuki, Nina here. Please send two photos of the joint and your order number and I'll file the claim today. Replacements ship within 3 business days.",
      createdAt: agoHours(19),
      authorName: "Nina Kowalski",
    },
  ]),
  conv_1011: thread("conv_1011", [
    {
      id: "msg_1011_1",
      role: "customer",
      content: "Do you ship to Alaska?",
      createdAt: agoHours(6),
    },
    {
      id: "msg_1011_2",
      role: "ai",
      content:
        "Yes, we ship to all 50 states including Alaska, and orders over $75 qualify for free carbon-neutral shipping. Alaska deliveries typically arrive within 4-6 business days.",
      createdAt: agoHours(5.95),
      confidence: 87,
      latencyMs: 1130,
      sources: [
        { id: "src_website", label: "Shipping & Delivery", kind: "page", score: 0.86 },
        { id: "src_website", label: "FAQ", kind: "faq", score: 0.79 },
      ],
    },
  ]),
  conv_1012: thread("conv_1012", [
    {
      id: "msg_1012_1",
      role: "customer",
      content: "I need to cancel my order, I selected the wrong size.",
      createdAt: agoHours(1.3),
    },
    {
      id: "msg_1012_2",
      role: "ai",
      content:
        "I can help with that. Orders can be cancelled before dispatch, and orders placed before 2pm local time ship the same business day. Let me check whether yours has left the fulfilment centre.",
      createdAt: agoHours(1.25),
      confidence: 52,
      latencyMs: 2050,
      sources: [
        { id: "src_website", label: "Refund Policy", kind: "page", score: 0.69 },
      ],
    },
    {
      id: "msg_1012_3",
      role: "customer",
      content: "Please cancel it, I ordered the wrong size.",
      createdAt: ago(38),
    },
  ]),
};

function agoDaysAgo(days: number) {
  return ago(days * 24 * 60);
}

export function getMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] ?? [];
}
