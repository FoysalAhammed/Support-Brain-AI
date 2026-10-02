import type { ID } from "./common";
import type { PlanTier } from "./organization";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  highlighted?: boolean;
  conversationLimit: number;
  knowledgeSourceLimit: number;
  teamLimit: number;
  features: PlanFeature[];
  cta: string;
}

export interface UsageMeter {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export interface Invoice {
  id: ID;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed" | "refunded";
  plan: string;
}

export interface BillingState {
  plan: PlanTier;
  interval: "monthly" | "yearly";
  renewsAt: string;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  usage: UsageMeter[];
  invoices: Invoice[];
}
