"use client";

import * as React from "react";
import { Copy, Eye, KeyRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { formatDate } from "@/lib/utils";

const apiKeys = [
  { id: "key_live", label: "Production key", value: "sb_live_9f3a••••••••••••4c2e", created: "2026-06-02" },
  { id: "key_test", label: "Test key", value: "sb_test_1b8d••••••••••••9a71", created: "2026-06-02" },
];

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function SettingsView() {
  const { user, organization } = useAuth();
  const [notifications, setNotifications] = React.useState<NotificationPref[]>([
    { id: "handoff", label: "Human handoff alerts", description: "When a conversation is escalated to your team.", enabled: true },
    { id: "digest", label: "Weekly digest", description: "A summary of conversations and knowledge changes.", enabled: true },
    { id: "sync", label: "Source sync results", description: "When a knowledge source finishes syncing.", enabled: false },
    { id: "usage", label: "Usage limits", description: "When you approach your conversation limit.", enabled: true },
  ]);
  const [twoFactor, setTwoFactor] = React.useState(false);

  const save = () => toast.success("Settings saved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, organization and security.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-5">
            <p className="text-sm font-semibold">Profile</p>
            <p className="text-xs text-muted-foreground">
              Your personal account details.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue={user?.name ?? ""} />
              <Field label="Email" defaultValue={user?.email ?? ""} type="email" />
              <Field label="Job title" defaultValue={user?.title ?? ""} />
              <Field label="Language" defaultValue="English (US)" />
            </div>
            <div className="mt-5">
              <Button onClick={save}>Save profile</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card className="p-5">
            <p className="text-sm font-semibold">Organization</p>
            <p className="text-xs text-muted-foreground">
              This information appears on your workspace and invoices.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Organization name" defaultValue={organization.name} />
              <Field label="Industry" defaultValue={organization.industry ?? ""} />
              <Field label="Country" defaultValue={organization.country ?? ""} />
              <Field label="Workspace slug" defaultValue={organization.slug} />
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Plan</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {organization.plan} plan
                </p>
              </div>
              <Badge variant="default" className="capitalize">
                {organization.plan}
              </Badge>
            </div>
            <div className="mt-5">
              <Button onClick={save}>Save organization</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="p-5">
            <p className="text-sm font-semibold">AI defaults</p>
            <p className="text-xs text-muted-foreground">
              Default behaviour applied to new agents.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Default model" defaultValue="SupportBrain Pro" />
              <Field label="Default language" defaultValue="English (US)" />
              <Field label="Chunk size (tokens)" defaultValue="512" />
              <Field label="Retrieval top-K" defaultValue="5" />
            </div>
            <Separator className="my-5" />
            <Toggle
              label="Always ground answers in knowledge"
              description="Refuse to answer when no relevant knowledge is found."
              defaultChecked
            />
            <div className="mt-3">
              <Toggle
                label="Automatic human handoff"
                description="Escalate low-confidence conversations automatically."
                defaultChecked
              />
            </div>
            <div className="mt-5">
              <Button onClick={save}>Save AI settings</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card className="p-5">
            <p className="text-sm font-semibold">API keys</p>
            <p className="text-xs text-muted-foreground">
              Use these to call the SupportBrain API. Keys are masked in the browser —
              real secrets are never exposed frontend-side.
            </p>
            <ul className="mt-4 space-y-3">
              {apiKeys.map((key) => (
                <li
                  key={key.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <KeyRound className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{key.label}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {key.value}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDate(key.created)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Reveal key"
                      onClick={() => toast.info("In production this reveals the key once.")}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Copy key"
                      onClick={() => toast.success("Key copied to clipboard")}
                    >
                      <Copy />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Rotate key"
                      onClick={() => toast.success("Key rotated")}
                    >
                      <RefreshCw />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-5">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Choose what you want to be notified about.
            </p>
            <div className="mt-4 space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications((current) =>
                        current.map((entry) =>
                          entry.id === item.id ? { ...entry, enabled: checked } : entry,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm font-semibold">Password</p>
              <div className="mt-4 space-y-4">
                <Field label="Current password" type="password" defaultValue="" />
                <Field label="New password" type="password" defaultValue="" />
                <Field label="Confirm password" type="password" defaultValue="" />
              </div>
              <div className="mt-5">
                <Button onClick={save}>Update password</Button>
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-semibold">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
              <div className="mt-4">
                <Toggle
                  label="Require 2FA"
                  description="Ask for a one-time code at sign in."
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                />
              </div>
              <Separator className="my-5" />
              <p className="text-sm font-semibold">Active sessions</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Chrome · Windows</span>
                  <Badge variant="success">Current</Badge>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Mobile · iOS</span>
                  <span className="text-xs">3 days ago</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  const id = React.useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultChecked,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
