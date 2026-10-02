import type { ID } from "./common";

export type PlanTier = "starter" | "growth" | "business" | "enterprise";

export type OrganizationStatus = "active" | "trialing" | "suspended";

export interface Organization {
  id: ID;
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  country?: string;
  plan: PlanTier;
  status: OrganizationStatus;
  ownerId: ID;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  activeUserCount: number;
  conversationCount: number;
  aiMessageCount: number;
  knowledgeSourceCount: number;
  mrr: number;
  healthScore: number;
  createdAt: string;
}
