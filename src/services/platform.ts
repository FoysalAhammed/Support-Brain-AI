import { sleep } from "@/lib/utils";

export interface PlatformModel {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
}

export interface FeatureFlag {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface PlanLimit {
  id: string;
  plan: string;
  conversations: number;
  sources: number;
  seats: number;
}

let models: PlatformModel[] = [
  { id: "mdl_gpt", name: "GPT", provider: "OpenAI", enabled: true },
  { id: "mdl_claude", name: "Claude", provider: "Anthropic", enabled: true },
  { id: "mdl_grok", name: "Grok", provider: "xAI", enabled: false },
];

let features: FeatureFlag[] = [
  {
    id: "ft_website_chat",
    label: "Website chat widget",
    description: "Let organizations embed the chat widget on their own site.",
    enabled: true,
  },
  {
    id: "ft_facebook",
    label: "Facebook Messenger",
    description: "Allow organizations to connect Facebook Pages.",
    enabled: true,
  },
  {
    id: "ft_whatsapp",
    label: "WhatsApp Business",
    description: "Allow organizations to connect WhatsApp Business numbers.",
    enabled: false,
  },
  {
    id: "ft_voice",
    label: "Voice AI",
    description: "Speech-to-text and text-to-speech customer support.",
    enabled: false,
  },
  {
    id: "ft_database",
    label: "Database knowledge sources",
    description: "Let organizations train RAG on a read-only database.",
    enabled: true,
  },
  {
    id: "ft_image",
    label: "Image understanding",
    description: "Let customers send screenshots and product photos.",
    enabled: false,
  },
];

let planLimits: PlanLimit[] = [
  { id: "plan_starter", plan: "Starter", conversations: 1000, sources: 2, seats: 3 },
  { id: "plan_growth", plan: "Growth", conversations: 10000, sources: 10, seats: 10 },
  { id: "plan_business", plan: "Business", conversations: 50000, sources: 50, seats: 50 },
  { id: "plan_enterprise", plan: "Enterprise", conversations: 1000000, sources: 500, seats: 500 },
];

export const platformService = {
  async getModels(): Promise<PlatformModel[]> {
    await sleep(30);
    return models;
  },

  async setModelEnabled(id: string, enabled: boolean): Promise<PlatformModel | null> {
    await sleep(180);
    models = models.map((model) => (model.id === id ? { ...model, enabled } : model));
    return models.find((model) => model.id === id) ?? null;
  },

  async getFeatures(): Promise<FeatureFlag[]> {
    await sleep(30);
    return features;
  },

  async setFeatureEnabled(id: string, enabled: boolean): Promise<FeatureFlag | null> {
    await sleep(180);
    features = features.map((feature) =>
      feature.id === id ? { ...feature, enabled } : feature,
    );
    return features.find((feature) => feature.id === id) ?? null;
  },

  async getPlanLimits(): Promise<PlanLimit[]> {
    await sleep(30);
    return planLimits;
  },
};

export type PlatformService = typeof platformService;
