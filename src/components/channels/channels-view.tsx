"use client";

import * as React from "react";
import {
  Check,
  Facebook,
  Globe,
  Headphones,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Settings2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { channelService } from "@/services/channels";
import { formatNumber } from "@/lib/utils";
import type { ChannelConnection, ChannelType, WidgetConfig } from "@/types/channel";

const channelIcons: Record<ChannelType, React.ElementType> = {
  website: Globe,
  facebook: Facebook,
  whatsapp: Phone,
  voice: Headphones,
  email: Mail,
  instagram: Instagram,
};

export function ChannelsView() {
  const [channels, setChannels] = React.useState<ChannelConnection[]>([]);
  const [widget, setWidget] = React.useState<WidgetConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [connecting, setConnecting] = React.useState<string | null>(null);
  const [connectTarget, setConnectTarget] = React.useState<ChannelConnection | null>(null);
  const [handle, setHandle] = React.useState("");
  const [widgetOpen, setWidgetOpen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([channelService.list(), channelService.getWidgetConfig()]).then(
      ([loadedChannels, loadedWidget]) => {
        if (!mounted) return;
        setChannels(loadedChannels);
        setWidget(loadedWidget);
        setLoading(false);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const updateChannel = (updated: ChannelConnection | null) => {
    if (!updated) return;
    setChannels((current) =>
      current.map((channel) => (channel.id === updated.id ? updated : channel)),
    );
  };

  const connect = async () => {
    if (!connectTarget) return;
    setConnecting(connectTarget.id);
    const updated = await channelService.connect(connectTarget.id, handle || undefined);
    setConnecting(null);
    updateChannel(updated);
    setConnectTarget(null);
    setHandle("");
    toast.success(`${connectTarget.name} connected`);
  };

  const disconnect = async (channel: ChannelConnection) => {
    setConnecting(channel.id);
    const updated = await channelService.disconnect(channel.id);
    setConnecting(null);
    updateChannel(updated);
    toast.success(`${channel.name} disconnected`);
  };

  const saveWidget = async (patch: Partial<WidgetConfig>) => {
    const updated = await channelService.updateWidgetConfig(patch);
    setWidget(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Channels</h1>
          <p className="text-sm text-muted-foreground">
            Connect every place your customers talk to you.
          </p>
        </div>
        <Button variant="outline" onClick={() => setWidgetOpen(true)}>
          <Settings2 />
          Configure widget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-44 animate-pulse" />
            ))
          : channels.map((channel) => {
              const Icon = channelIcons[channel.type];
              const connected = channel.status === "connected";
              return (
                <Card key={channel.id} className="flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{channel.name}</p>
                      {channel.handle && (
                        <p className="truncate text-xs text-muted-foreground">
                          {channel.handle}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={channel.status} />
                  </div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">
                    {channel.description}
                  </p>

                  {connected && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatNumber(channel.conversations)} conversations
                        </span>
                        <span className="tabular-nums">{channel.resolutionRate}% AI</span>
                      </div>
                      <Progress value={channel.resolutionRate} className="h-1.5" />
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    {connected ? (
                      <>
                        <Badge variant="success">
                          <Check className="size-3" />
                          Connected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto"
                          disabled={connecting === channel.id}
                          onClick={() => disconnect(channel)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="ml-auto"
                        disabled={connecting === channel.id}
                        onClick={() => {
                          setConnectTarget(channel);
                          setHandle("");
                        }}
                      >
                        {connecting === channel.id ? <Spinner /> : null}
                        {channel.status === "available" ? "Enable" : "Connect"}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
      </div>

      <Dialog open={Boolean(connectTarget)} onOpenChange={(open) => !open && setConnectTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {connectTarget?.name}</DialogTitle>
            <DialogDescription>
              This is a frontend demonstration. In production this step opens the
              provider&apos;s official OAuth flow — no credentials are stored in the
              browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="channel-handle">
              {connectTarget?.type === "email" ? "Support email" : "Account / handle"}
            </Label>
            <Input
              id="channel-handle"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder={
                connectTarget?.type === "facebook"
                  ? "facebook.com/yourbusiness"
                  : connectTarget?.type === "whatsapp"
                    ? "+1 555 000 1234"
                    : connectTarget?.type === "email"
                      ? "support@yourcompany.com"
                      : "your-account"
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectTarget(null)}>
              Cancel
            </Button>
            <Button onClick={connect} disabled={connecting === connectTarget?.id}>
              {connecting === connectTarget?.id ? <Spinner /> : null}
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WidgetConfigDialog
        open={widgetOpen}
        onOpenChange={setWidgetOpen}
        widget={widget}
        onSave={saveWidget}
      />
    </div>
  );
}

function WidgetConfigDialog({
  open,
  onOpenChange,
  widget,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget: WidgetConfig | null;
  onSave: (patch: Partial<WidgetConfig>) => Promise<void>;
}) {
  if (!widget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Website chat widget</DialogTitle>
          <DialogDescription>
            Customise the embedded widget and see a live preview.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Agent name</Label>
              <Input
                value={widget.agentName}
                onChange={(event) => onSave({ agentName: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Greeting</Label>
              <Input
                value={widget.greeting}
                onChange={(event) => onSave({ greeting: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Welcome message</Label>
              <Textarea
                value={widget.welcomeMessage}
                onChange={(event) => onSave({ welcomeMessage: event.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={widget.position}
                  onValueChange={(value) =>
                    onSave({ position: value as WidgetConfig["position"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom right</SelectItem>
                    <SelectItem value="bottom-left">Bottom left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={widget.theme}
                  onValueChange={(value) => onSave({ theme: value as WidgetConfig["theme"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Primary colour</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={widget.primaryColor}
                  onChange={(event) => onSave({ primaryColor: event.target.value })}
                  className="h-9 w-14 cursor-pointer rounded-lg border border-border bg-card"
                  aria-label="Primary colour"
                />
                <Input
                  value={widget.primaryColor}
                  onChange={(event) => onSave({ primaryColor: event.target.value })}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Show branding</Label>
              <Switch
                checked={widget.showBranding}
                onCheckedChange={(checked) => onSave({ showBranding: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Collect email before chat</Label>
              <Switch
                checked={widget.collectEmail}
                onCheckedChange={(checked) => onSave({ collectEmail: checked })}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live preview
            </p>
            <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div
                className="flex items-center gap-2 px-4 py-3 text-white"
                style={{ backgroundColor: widget.primaryColor }}
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="size-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{widget.agentName}</p>
                  <p className="text-[0.65rem] opacity-80">Online now</p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-xs">
                  {widget.greeting}
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-xs">
                  {widget.welcomeMessage}
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
                  <MessageSquare className="size-3.5" />
                  Type your message…
                </div>
                {widget.showBranding && (
                  <p className="pt-1 text-center text-[0.6rem] text-muted-foreground">
                    Powered by SupportBrain AI
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
