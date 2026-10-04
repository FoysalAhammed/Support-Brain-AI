import type { ChannelConnection, WidgetConfig } from "@/types/channel";
import { agoDays } from "./time";

const ORG = "org_northwind";

export const mockChannels: ChannelConnection[] = [
  {
    id: "chn_website",
    organizationId: ORG,
    type: "website",
    name: "Website Chat",
    description: "Embed the SupportBrain widget on any page with a single script tag.",
    status: "connected",
    conversations: 8120,
    resolutionRate: 91,
    connectedAt: agoDays(38),
    handle: "northwind.com",
    configurable: true,
    assignedUserIds: ["usr_maya", "usr_nina"],
  },
  {
    id: "chn_facebook",
    organizationId: ORG,
    type: "facebook",
    name: "Facebook Messenger",
    description: "Answer messages from your Facebook Page with AI-powered replies.",
    status: "disconnected",
    conversations: 0,
    resolutionRate: 0,
    configurable: true,
    assignedUserIds: ["usr_liam", "usr_omar"],
  },
  {
    id: "chn_whatsapp",
    organizationId: ORG,
    type: "whatsapp",
    name: "WhatsApp Business",
    description: "Handle WhatsApp conversations with the same knowledge and inbox.",
    status: "disconnected",
    conversations: 0,
    resolutionRate: 0,
    configurable: true,
  },
  {
    id: "chn_voice",
    organizationId: ORG,
    type: "voice",
    name: "Voice",
    description: "Transcribe inbound calls and let the AI agent answer common questions.",
    status: "available",
    conversations: 412,
    resolutionRate: 64,
    configurable: true,
  },
  {
    id: "chn_instagram",
    organizationId: ORG,
    type: "instagram",
    name: "Instagram Direct",
    description: "Connect Instagram DMs to your unified support inbox.",
    status: "disconnected",
    conversations: 0,
    resolutionRate: 0,
    configurable: true,
  },
  {
    id: "chn_email",
    organizationId: ORG,
    type: "email",
    name: "Email",
    description: "Route support@ emails into the shared inbox automatically.",
    status: "connected",
    conversations: 3950,
    resolutionRate: 78,
    connectedAt: agoDays(120),
    handle: "support@northwind.com",
    configurable: true,
    assignedUserIds: ["usr_sofia"],
  },
];

export const defaultWidgetConfig: WidgetConfig = {
  position: "bottom-right",
  primaryColor: "#4f46e5",
  theme: "light",
  agentName: "Northwind Assistant",
  greeting: "Hi there! How can we help you today?",
  welcomeMessage:
    "I can help with orders, shipping, returns, warranties and our membership programme.",
  showBranding: true,
  collectEmail: false,
};

export function findChannel(id: string) {
  return mockChannels.find((channel) => channel.id === id);
}
