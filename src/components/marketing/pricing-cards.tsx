import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import type { Plan } from "@/types/billing";

export function PricingCards({
  plans,
  interval = "monthly",
  className,
}: {
  plans: Plan[];
  interval?: "monthly" | "yearly";
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {plans.map((plan) => {
        const price = interval === "yearly" ? plan.priceYearly : plan.priceMonthly;
        return (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col p-6 transition-shadow",
              plan.highlighted && "border-primary/40 shadow-lg shadow-primary/10",
            )}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-6">
                <Sparkles className="size-3" />
                Most popular
              </Badge>
            )}
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="text-xs text-muted-foreground">{plan.tagline}</p>
            </div>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                ${formatNumber(price)}
              </span>
              <span className="pb-1 text-xs text-muted-foreground">
                / {interval === "yearly" ? "year" : "month"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {interval === "yearly"
                ? `Save $${formatNumber(plan.priceMonthly * 12 - plan.priceYearly)} vs monthly`
                : "billed monthly · cancel anytime"}
            </p>

            <Button
              asChild
              variant={plan.highlighted ? "default" : "outline"}
              className="mt-5 w-full"
            >
              <Link href="/register">{plan.cta}</Link>
            </Button>

            <div className="mt-6 space-y-3 border-t border-border pt-5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conversations / mo</span>
                <span className="font-medium tabular-nums">
                  {formatNumber(plan.conversationLimit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Knowledge sources</span>
                <span className="font-medium tabular-nums">
                  {plan.knowledgeSourceLimit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Team members</span>
                <span className="font-medium tabular-nums">{plan.teamLimit}</span>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-start gap-2 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      feature.included ? "text-success" : "text-muted-foreground/40",
                    )}
                  />
                  <span
                    className={cn(
                      !feature.included && "text-muted-foreground/60 line-through",
                    )}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
