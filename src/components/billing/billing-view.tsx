"use client";

import * as React from "react";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { billingService } from "@/services/billing";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import type { BillingState, Plan } from "@/types/billing";

export function BillingView() {
  const [state, setState] = React.useState<BillingState | null>(null);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([billingService.getState(), billingService.getPlans()]).then(
      ([loadedState, loadedPlans]) => {
        if (!mounted) return;
        setState(loadedState);
        setPlans(loadedPlans);
        setLoading(false);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !state) {
    return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  }

  const interval = state.interval;

  const setInterval = (next: BillingState["interval"]) => {
    setState({ ...state, interval: next });
  };

  const choosePlan = async (plan: Plan) => {
    setBusy(true);
    const updated = await billingService.changePlan(plan.id, interval);
    setState(updated);
    setBusy(false);
    toast.success(`Switched to ${plan.name}`, {
      description: `${interval === "yearly" ? "Annual" : "Monthly"} billing · ${plan.name}`,
    });
  };

  const cancel = async () => {
    setBusy(true);
    const updated = await billingService.cancelPlan();
    setState(updated);
    setBusy(false);
    toast.success("Plan cancelled", { description: "You are now on the Starter plan." });
  };

  const currentPlan = plans.find((plan) => plan.id === state.plan);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your plan, usage and invoices.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current plan
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xl font-semibold capitalize">{state.plan}</p>
                <Badge variant="success">
                  <Check className="size-3" />
                  Active
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentPlan?.tagline}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums">
                ${interval === "yearly" ? currentPlan?.priceYearly : currentPlan?.priceMonthly}
              </p>
              <p className="text-xs text-muted-foreground">
                per {interval === "yearly" ? "year" : "month"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">
              Renews {formatDate(state.renewsAt)}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Select value={interval} onValueChange={(value) => setInterval(value as BillingState["interval"])}>
                <SelectTrigger className="h-8 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={cancel} disabled={busy}>
                Cancel plan
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Payment method
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="text-sm font-medium">
                {state.paymentMethod.brand} ending {state.paymentMethod.last4}
              </p>
              <p className="text-xs text-muted-foreground">
                Expires {state.paymentMethod.expMonth}/{state.paymentMethod.expYear}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            Update payment method
          </Button>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold">Usage this cycle</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {state.usage.map((meter) => {
            const percent = Math.min((meter.used / meter.limit) * 100, 100);
            return (
              <div key={meter.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{meter.label}</span>
                  <span className="font-medium tabular-nums">
                    {formatNumber(meter.used)}
                    <span className="text-muted-foreground">
                      {" "}
                      / {formatNumber(meter.limit)}
                    </span>
                  </span>
                </div>
                <Progress value={percent} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{meter.unit}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Change plan</p>
          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInterval(option)}
                aria-pressed={interval === option}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                  interval === option
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option}
                {option === "yearly" && (
                  <span className="ml-1 text-success">−17%</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === state.plan;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col p-5",
                  plan.highlighted && "border-primary/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{plan.name}</p>
                  {isCurrent && <Badge variant="default">Current</Badge>}
                  {!isCurrent && plan.highlighted && (
                    <Badge variant="accent">
                      <Sparkles className="size-3" />
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  ${interval === "yearly" ? plan.priceYearly : plan.priceMonthly}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / {interval === "yearly" ? "yr" : "mo"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(plan.conversationLimit)} conversations ·{" "}
                  {plan.knowledgeSourceLimit} sources
                </p>
                <Button
                  variant={isCurrent ? "outline" : plan.highlighted ? "default" : "outline"}
                  size="sm"
                  className="mt-4"
                  disabled={isCurrent || busy}
                  onClick={() => choosePlan(plan)}
                >
                  {busy ? <Spinner /> : null}
                  {isCurrent ? "Current plan" : plan.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold">Billing history</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-xs">{invoice.number}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="text-muted-foreground">{invoice.plan}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  ${formatNumber(invoice.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
