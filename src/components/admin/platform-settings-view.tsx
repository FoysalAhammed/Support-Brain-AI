"use client";

import * as React from "react";
import { Cpu, Rocket, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/components/providers/auth-provider";
import {
  platformService,
  type FeatureFlag,
  type PlanLimit,
  type PlatformModel,
} from "@/services/platform";
import { formatNumber } from "@/lib/utils";

export function PlatformSettingsView() {
  const { user } = useAuth();
  const [models, setModels] = React.useState<PlatformModel[]>([]);
  const [features, setFeatures] = React.useState<FeatureFlag[]>([]);
  const [limits, setLimits] = React.useState<PlanLimit[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      platformService.getModels(),
      platformService.getFeatures(),
      platformService.getPlanLimits(),
    ]).then(([loadedModels, loadedFeatures, loadedLimits]) => {
      if (!mounted) return;
      setModels(loadedModels);
      setFeatures(loadedFeatures);
      setLimits(loadedLimits);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleModel = async (model: PlatformModel, enabled: boolean) => {
    const updated = await platformService.setModelEnabled(model.id, enabled);
    if (updated) {
      setModels((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`${updated.name} ${enabled ? "enabled" : "disabled"} platform-wide`);
    }
  };

  const toggleFeature = async (feature: FeatureFlag, enabled: boolean) => {
    const updated = await platformService.setFeatureEnabled(feature.id, enabled);
    if (updated) {
      setFeatures((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(`${updated.label} ${enabled ? "enabled" : "disabled"}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings"
        description="Developer controls for the entire SupportBrain AI platform — models, feature flags and plan limits across every tenant."
      />

      <Card className="flex flex-col gap-3 border-primary/30 bg-primary-soft/40 p-5 sm:flex-row sm:items-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Full platform control</p>
          <p className="text-sm text-muted-foreground">
            Signed in as {user?.name ?? "Developer"} — every organization, subscription,
            feature and AI model is managed from here.
          </p>
        </div>
        <Badge variant="accent">
          <Rocket className="size-3" />
          {user?.platformRole === "developer" ? "Developer owner" : "Platform admin"}
        </Badge>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-primary" />
            <p className="text-sm font-semibold">AI model allowlist</p>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Choose which models organizations can select for their AI agent.
          </p>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))
              : models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.provider}</p>
                    </div>
                    <Switch
                      checked={model.enabled}
                      onCheckedChange={(checked) => toggleModel(model, checked)}
                      aria-label={`Toggle ${model.name}`}
                    />
                  </div>
                ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <p className="text-sm font-semibold">Feature flags</p>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Roll capabilities out to every organization on the platform.
          </p>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))
              : features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => toggleFeature(feature, checked)}
                      aria-label={`Toggle ${feature.label}`}
                    />
                  </div>
                ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold">Plan limits</p>
          <p className="text-xs text-muted-foreground">
            Usage caps applied to each subscription tier.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Conversations / mo</TableHead>
              <TableHead className="text-right">Knowledge sources</TableHead>
              <TableHead className="text-right">Seats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <div className="h-8 animate-pulse rounded bg-muted" />
                    </TableCell>
                  </TableRow>
                ))
              : limits.map((limit) => (
                  <TableRow key={limit.id}>
                    <TableCell className="font-medium">{limit.plan}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(limit.conversations)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(limit.sources)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(limit.seats)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
