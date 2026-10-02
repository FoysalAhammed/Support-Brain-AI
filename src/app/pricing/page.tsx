import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingSection } from "@/components/marketing/pricing-section";
import { MotionRoot, Reveal } from "@/components/marketing/anim";
import { billingService } from "@/services/billing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flexible plans for every stage — from your first AI agent to omnichannel enterprise support.",
};

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Starter plan begins with a free trial and you only pay when you decide to continue.",
  },
  {
    question: "What counts as a knowledge source?",
    answer:
      "A website, a Facebook Page, a PDF or a document collection each count as one source.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. Upgrade or downgrade at any time — usage is prorated automatically in the demo billing screen.",
  },
  {
    question: "Is human handoff included?",
    answer:
      "Human handoff and the shared inbox are included from the Growth plan upwards.",
  },
  {
    question: "Do unused conversations roll over?",
    answer:
      "Conversation allowances reset each billing cycle. If you consistently exceed your plan we will recommend the next tier.",
  },
];

export default async function PricingPage() {
  const plans = await billingService.getPlans();

  return (
    <MotionRoot>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />

        <main className="flex-1">
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
            <div
              className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-10 text-center sm:px-6">
              <Reveal className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Pricing built for support teams
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Every plan includes the full knowledge ingestion pipeline, RAG
                  engine and AI agent. Scale conversations, channels and seats as
                  you grow.
                </p>
              </Reveal>
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
            <PricingSection plans={plans} />
          </section>

          <section className="border-t border-border bg-muted/30">
            <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
              <Reveal>
                <h2 className="text-xl font-semibold tracking-tight">
                  Frequently asked questions
                </h2>
              </Reveal>
              <div className="mt-5 space-y-3">
                {faqs.map((faq) => (
                  <Reveal key={faq.question}>
                    <Card className="p-5">
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{faq.answer}</p>
                    </Card>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-10 text-center">
                <Button asChild size="lg">
                  <Link href="/register">
                    Start building your AI agent
                    <ArrowRight />
                  </Link>
                </Button>
              </Reveal>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </MotionRoot>
  );
}
