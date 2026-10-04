import type { ID } from "./common";

export type ChannelType =
  | "website"
  | "facebook"
  | "whatsapp"
  | "voice"
  | "email"
  | "instagram";

export type ChannelStatus = "connected" | "disconnected" | "available" | "error";

export interface ChannelConnection {
  id: ID;
  organizationId: ID;
  type: ChannelType;
  name: string;
  description: string;
  status: ChannelStatus;
  conversations: number;
  resolutionRate: number;
  connectedAt?: string;
  handle?: string;
  configurable: boolean;
  /** Team members allocated to handle this channel. */
  assignedUserIds?: ID[];
}

export interface WidgetConfig {
  position: "bottom-right" | "bottom-left";
  primaryColor: string;
  theme: "light" | "dark" | "auto";
  agentName: string;
  greeting: string;
  welcomeMessage: string;
  showBranding: boolean;
  collectEmail: boolean;
}
