import Link from "next/link";
import { ArrowRight, Package, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionRoot, Reveal, Stagger, StaggerItem } from "@/components/marketing/anim";
import { ChatWidget } from "@/components/widget/chat-widget";
import { defaultWidgetConfig } from "@/data/mock-channels";
import { storeDepartments, storeFeatures, storeProducts } from "@/data/mock-storefront";
import { formatNumber } from "@/lib/utils";

const featureIcons = [Package, RotateCcw, ShieldCheck];

/**
 * A miniature "customer website" used purely to demonstrate the embeddable
 * widget in a realistic context. The floating bubble bottom-right is the exact
 * component a business would get from the embed script.
 */
export function Storefront() {
  return (
    <MotionRoot>
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
            <span className="text-lg font-semibold tracking-tight">
              Northwind<span className="text-primary">.</span>store
            </span>
            <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
              {storeDepartments.map((department) => (
                <span key={department} className="transition-colors hover:text-foreground">
                  {department}
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <Badge variant="accent">Live widget demo</Badge>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/channels">Get this widget</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6">
          <Reveal className="max-w-2xl">
            <Badge variant="success">Autumn collection 2026</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Design-led essentials for the modern home.
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              This is a demo storefront. The chat bubble in the corner is the SupportBrain
              widget a business embeds with a single script tag — try it, then open the
              dashboard inbox to see the conversation arrive.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg">
                Shop the collection
                <ArrowRight />
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/inbox">See it in the inbox</Link>
              </Button>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {storeProducts.map((product) => (
              <StaggerItem key={product.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
                  <div className="relative flex h-40 items-center justify-center bg-muted/50">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Package className="size-7" />
                    </div>
                    {product.tag && (
                      <Badge
                        variant={product.tag === "New" ? "accent" : "default"}
                        className="absolute left-3 top-3"
                      >
                        {product.tag}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-semibold">{product.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3.5 fill-warning text-warning" />
                      <span className="tabular-nums">{product.rating}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-base font-semibold tabular-nums">
                        ${formatNumber(product.price)}
                      </span>
                      <Button size="sm" variant="subtle">
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="mt-16 grid gap-5 sm:grid-cols-3">
            {storeFeatures.map((feature, index) => {
              const Icon = featureIcons[index] ?? ShieldCheck;
              return (
                <StaggerItem key={feature.id}>
                  <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </main>

        <footer className="border-t border-border bg-card">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>© 2026 Northwind Store — demo business site.</span>
            <Link href="/" className="transition-colors hover:text-foreground">
              Built with SupportBrain AI
            </Link>
          </div>
        </footer>

        <ChatWidget config={defaultWidgetConfig} sessionKey="storefront-demo" />
      </div>
    </MotionRoot>
  );
}
