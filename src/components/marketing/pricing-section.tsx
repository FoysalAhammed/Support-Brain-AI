"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatNumber } from "@/lib/utils";
import type { Plan } from "@/types/billing";
import { PricingCards } from "./pricing-cards";
import { Reveal } from "./anim";

export function PricingSection({ plans }: { plans: Plan[] }) {
  const [interval, setInterval] = React.useState<"monthly" | "yearly">("monthly");

  const featureRows = Array.from(
    new Set(plans.flatMap((plan) => plan.features.map((feature) => feature.label))),
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInterval(option)}
              aria-pressed={interval === option}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                interval === option
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
              {option === "yearly" && (
                <span className="ml-1.5 text-xs text-success">−17%</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          All plans include the knowledge ingestion pipeline and RAG engine.
        </p>
      </div>

      <Reveal>
        <PricingCards plans={plans} interval={interval} />
      </Reveal>

      <Reveal>
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold">Compare plans</p>
            <p className="text-xs text-muted-foreground">
              Everything included at each tier.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[12rem]">Feature</TableHead>
                {plans.map((plan) => (
                  <TableHead key={plan.id} className="text-center">
                    {plan.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Conversations / month</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} className="text-center tabular-nums">
                    {formatNumber(plan.conversationLimit)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Knowledge sources</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} className="text-center tabular-nums">
                    {plan.knowledgeSourceLimit}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Team members</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} className="text-center tabular-nums">
                    {plan.teamLimit}
                  </TableCell>
                ))}
              </TableRow>
              {featureRows.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {plans.map((plan) => {
                    const included = plan.features.find(
                      (entry) => entry.label === feature,
                    )?.included;
                    return (
                      <TableCell key={plan.id} className="text-center">
                        {included ? (
                          <Check className="mx-auto size-4 text-success" />
                        ) : (
                          <Minus className="mx-auto size-4 text-muted-foreground/40" />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Reveal>

      <Reveal className="text-center">
        <Button asChild size="lg">
          <Link href="/register">
            Start building your AI agent
            <ArrowRight />
          </Link>
        </Button>
      </Reveal>
    </div>
  );
}
