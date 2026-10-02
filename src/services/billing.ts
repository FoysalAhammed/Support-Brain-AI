import { mockBillingState, mockPlans } from "@/data/mock-billing";
import { sleep } from "@/lib/utils";
import type { BillingState, Plan } from "@/types/billing";
import type { PlanTier } from "@/types/organization";

let state: BillingState = { ...mockBillingState };

export const billingService = {
  async getPlans(): Promise<Plan[]> {
    await sleep(30);
    return mockPlans;
  },

  async getState(): Promise<BillingState> {
    await sleep(40);
    return state;
  },

  async changePlan(plan: PlanTier, interval: BillingState["interval"]): Promise<BillingState> {
    await sleep(600);
    state = { ...state, plan, interval };
    return state;
  },

  async cancelPlan(): Promise<BillingState> {
    await sleep(500);
    state = { ...state, plan: "starter" };
    return state;
  },
};

export type BillingService = typeof billingService;
