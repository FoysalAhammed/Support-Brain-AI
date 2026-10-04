"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  Facebook,
  Globe,
  Headphones,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { buildEmbedSnippet } from "@/components/widget/embed-snippet";
import { useAuth } from "@/components/providers/auth-provider";
import { channelService } from "@/services/channels";
import { teamService } from "@/services/team";
import { formatNumber, initials } from "@/lib/utils";
import type { ChannelConnection, ChannelType, WidgetConfig } from "@/types/channel";
import type { User } from "@/types/user";

const channelIcons: Record<ChannelType, React.ElementType> = {
  website: Globe,
  facebook: Facebook,
  whatsapp: Phone,
  voice: Headphones,
  email: Mail,
  instagram: Instagram,
};

export function ChannelsView() {
  const { can } = useAuth();
  const canAllocate = can("team:allocate");
  const [channels, setChannels] = React.useState<ChannelConnection[]>([]);
  const [widget, setWidget] = React.useState<WidgetConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [connecting, setConnecting] = React.useState<string | null>(null);
  const [connectTarget, setConnectTarget] = React.useState<ChannelConnection | null>(null);
  const [handle, setHandle] = React.useState("");
  const [widgetOpen, setWidgetOpen] = React.useState(false);
  const [widgetTab, setWidgetTab] = React.useState<"design" | "embed">("design");
  const [members, setMembers] = React.useState<User[]>([]);
  const [assignTarget, setAssignTarget] = React.useState<ChannelConnection | null>(null);
  const [assignIds, setAssignIds] = React.useState<string[]>([]);
  const [savingAssign, setSavingAssign] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      channelService.list(),
      channelService.getWidgetConfig(),
      teamService.list(),
    ]).then(([loadedChannels, loadedWidget, loadedMembers]) => {
      if (!mounted) return;
      setChannels(loadedChannels);
      setWidget(loadedWidget);
      setMembers(loadedMembers);
      setLoading(false);
    });
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

  const assignedMembers = (channel: ChannelConnection) =>
    members.filter((member) => (channel.assignedUserIds ?? []).includes(member.id));

  const openAssign = (channel: ChannelConnection) => {
    setAssignTarget(channel);
    setAssignIds(channel.assignedUserIds ?? []);
  };

  const saveAssign = async () => {
    if (!assignTarget) return;
    setSavingAssign(true);
    const updated = await channelService.assignUsers(assignTarget.id, assignIds);
    updateChannel(updated);
    await Promise.all(
      members.map((member) => {
        const next = new Set(member.channelIds ?? []);
        if (assignIds.includes(member.id)) next.add(assignTarget.id);
        else next.delete(assignTarget.id);
        return teamService.updateChannels(member.id, Array.from(next));
      }),
    );
    const fresh = await teamService.list();
    setMembers(fresh);
    setSavingAssign(false);
    setAssignTarget(null);
    toast.success("Channel team updated");
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
        <Button
          variant="outline"
          onClick={() => {
            setWidgetTab("design");
            setWidgetOpen(true);
          }}
        >
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

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Assigned</span>
                    <div className="flex items-center -space-x-1.5">
                      {assignedMembers(channel).slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="size-6 ring-2 ring-card">
                          <AvatarFallback className="text-[0.6rem]">
                            {initials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {assignedMembers(channel).length === 0 && (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      disabled={!canAllocate}
                      onClick={() => openAssign(channel)}
                    >
                      <Users />
                      Team
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    {connected ? (
                      <>
                        <Badge variant="success">
                          <Check className="size-3" />
                          Connected
                        </Badge>
                        {channel.type === "website" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setWidgetTab("embed");
                              setWidgetOpen(true);
                            }}
                          >
                            <Code2 />
                            Embed
                          </Button>
                        )}
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
        tab={widgetTab}
        onTabChange={setWidgetTab}
      />

      <Dialog open={Boolean(assignTarget)} onOpenChange={(open) => !open && setAssignTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Channel team</DialogTitle>
            <DialogDescription>
              Allocate moderators and agents who handle {assignTarget?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {members.map((member) => (
              <label
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
              >
                <Checkbox
                  checked={assignIds.includes(member.id)}
                  onCheckedChange={(checked) =>
                    setAssignIds((current) =>
                      checked === true
                        ? [...new Set([...current, member.id])]
                        : current.filter((id) => id !== member.id),
                    )
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{member.name}</span>
                  <span className="block truncate text-xs capitalize text-muted-foreground">
                    {member.title ?? member.role}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTarget(null)}>
              Cancel
            </Button>
            <Button onClick={saveAssign} disabled={savingAssign}>
              {savingAssign ? <Spinner /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WidgetConfigDialog({
  open,
  onOpenChange,
  widget,
  onSave,
  tab,
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget: WidgetConfig | null;
  onSave: (patch: Partial<WidgetConfig>) => Promise<void>;
  tab: "design" | "embed";
  onTabChange: (tab: "design" | "embed") => void;
}) {
  const [copied, setCopied] = React.useState(false);
  if (!widget) return null;
  const snippet = buildEmbedSnippet(widget);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Embed code copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the code manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Website chat widget</DialogTitle>
          <DialogDescription>
            Customise the embedded widget, preview it live, and copy the install snippet.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(value) => onTabChange(value as "design" | "embed")}>
          <TabsList>
            <TabsTrigger value="design">
              <Settings2 />
              Design
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code2 />
              Embed code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design">
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
          </TabsContent>

          <TabsContent value="embed">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste this snippet just before the closing{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  &lt;/body&gt;
                </code>{" "}
                tag on every page where the widget should appear. It loads automatically and
                routes every chat into your SupportBrain inbox.
              </p>

              <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Code2 className="size-3.5" />
                    index.html
                  </span>
                  <Button size="sm" variant="outline" onClick={copy}>
                    {copied ? <Check /> : <Copy />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto scrollbar-thin p-4 text-xs leading-relaxed">
                  <code className="font-mono">{snippet}</code>
                </pre>
              </div>

              <div className="grid gap-3 text-xs sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-muted-foreground">Position</p>
                  <p className="mt-0.5 font-medium capitalize">
                    {widget.position.replace("-", " ")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-muted-foreground">Theme</p>
                  <p className="mt-0.5 font-medium capitalize">{widget.theme}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-muted-foreground">Brand colour</p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                    <span
                      className="size-3 rounded-full border border-border"
                      style={{ backgroundColor: widget.primaryColor }}
                    />
                    {widget.primaryColor}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-primary-soft/50 p-3">
                <p className="text-xs text-muted-foreground">
                  See the widget running on a customer&apos;s website.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo/store" target="_blank">
                    <ExternalLink />
                    Open live demo
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
