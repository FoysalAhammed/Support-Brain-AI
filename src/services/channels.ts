import { defaultWidgetConfig, mockChannels } from "@/data/mock-channels";
import { sleep } from "@/lib/utils";
import type { ChannelConnection, WidgetConfig } from "@/types/channel";

let channels: ChannelConnection[] = [...mockChannels];
let widgetConfig: WidgetConfig = { ...defaultWidgetConfig };

export const channelService = {
  async list(): Promise<ChannelConnection[]> {
    await sleep(40);
    return channels;
  },

  async get(id: string): Promise<ChannelConnection | null> {
    await sleep(20);
    return channels.find((channel) => channel.id === id) ?? null;
  },

  async connect(id: string, handle?: string): Promise<ChannelConnection | null> {
    await sleep(500);
    channels = channels.map((channel) =>
      channel.id === id
        ? {
            ...channel,
            status: "connected",
            handle: handle ?? channel.handle ?? "Connected",
            connectedAt: new Date().toISOString(),
            conversations: channel.conversations || 0,
          }
        : channel,
    );
    return channels.find((channel) => channel.id === id) ?? null;
  },

  async disconnect(id: string): Promise<ChannelConnection | null> {
    await sleep(300);
    channels = channels.map((channel) =>
      channel.id === id
        ? { ...channel, status: "disconnected", conversations: 0, resolutionRate: 0 }
        : channel,
    );
    return channels.find((channel) => channel.id === id) ?? null;
  },

  async getWidgetConfig(): Promise<WidgetConfig> {
    await sleep(20);
    return widgetConfig;
  },

  async updateWidgetConfig(patch: Partial<WidgetConfig>): Promise<WidgetConfig> {
    await sleep(200);
    widgetConfig = { ...widgetConfig, ...patch };
    return widgetConfig;
  },
};

export type ChannelService = typeof channelService;
