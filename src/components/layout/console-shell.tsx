"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronsUpDown,
  LogOut,
  Menu,
  MessagesSquare,
  Moon,
  Search,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { adminNav, dashboardNav, isNavActive, type NavItem } from "./nav-config";
import { roleLabel } from "@/lib/permissions";
import { cn, initials } from "@/lib/utils";

const segmentLabels: Record<string, string> = {
  dashboard: "Overview",
  inbox: "Inbox",
  agent: "AI Agent",
  knowledge: "Knowledge Base",
  channels: "Channels",
  analytics: "Analytics",
  team: "Team",
  billing: "Billing",
  settings: "Settings",
  admin: "Platform Admin",
  organizations: "Organizations",
  chat: "Customer Chat",
};

function segmentLabel(segment: string) {
  if (segmentLabels[segment]) return segmentLabels[segment];
  if (segment.includes("_") || segment.length > 18) return "Details";
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function SidebarLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(item, pathname);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary-soft text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function OrgSwitcher() {
  const { organization, organizations, switchOrganization } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-muted">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary">
            {initials(organization.name).slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{organization.name}</span>
            <span className="block truncate text-xs capitalize text-muted-foreground">
              {organization.plan} plan
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[15rem]">
        <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => switchOrganization(org.id)}
            className="justify-between"
          >
            <span className="truncate">{org.name}</span>
            {org.id === organization.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent({
  variant,
  onNavigate,
}: {
  variant: "dashboard" | "admin";
  onNavigate?: () => void;
}) {
  const { isAdmin, can } = useAuth();
  const items = (variant === "admin" ? adminNav : dashboardNav).filter(
    (item) => !item.permission || can(item.permission),
  );

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <Link href="/" onClick={onNavigate} className="px-1 py-1">
        <Logo subtitle={variant === "admin" ? "Platform Admin" : "Support Console"} />
      </Link>
      <OrgSwitcher />
      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="space-y-0.5 border-t border-border pt-2">
        <SidebarLink
          item={{ label: "Customer Chat", href: "/chat", icon: MessagesSquare }}
          onNavigate={onNavigate}
        />
        {isAdmin && variant === "dashboard" && (
          <SidebarLink
            item={{ label: "Admin Console", href: "/admin", icon: ShieldCheck }}
            onNavigate={onNavigate}
          />
        )}
        {variant === "admin" && (
          <SidebarLink
            item={{ label: "Back to App", href: "/dashboard", icon: ChevronsUpDown }}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}

function Topbar({ variant }: { variant: "dashboard" | "admin" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isDeveloper, role, logout } = useAuth();
  const { resolvedTheme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: segmentLabel(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
    last: index === segments.length - 1,
  }));

  const notifications = [
    { id: 1, title: "Handoff required", body: "Order damage — confidence 41%", time: "3m" },
    { id: 2, title: "Source synced", body: "northwind.com finished re-indexing", time: "2h" },
    { id: 3, title: "New team invite", body: "Omar Haddad was invited", time: "3d" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-xl sm:px-5">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-4" />
      </Button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent variant={variant} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            {!crumb.last ? (
              <>
                <Link
                  href={crumb.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
                <span className="text-muted-foreground/50">/</span>
              </>
            ) : (
              <span className="truncate font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <form
        className="relative ml-auto hidden w-full max-w-xs lg:block"
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim()) router.push(`/dashboard/inbox?q=${encodeURIComponent(query.trim())}`);
        }}
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations…"
          className="pl-8"
          aria-label="Search conversations"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 lg:ml-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => (
              <DropdownMenuItem key={item.id} className="items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">{item.body}</span>
                </span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle theme"
          onClick={toggle}
        >
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-85" aria-label="Account menu">
              <Avatar className="size-8">
                <AvatarFallback>{initials(user?.name ?? "Guest")}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-2.5 p-2">
              <Avatar className="size-9">
                <AvatarFallback>{initials(user?.name ?? "Guest")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                {role && (
                  <Badge variant={isDeveloper ? "accent" : "neutral"} className="mt-1">
                    {isDeveloper ? "Platform Developer" : roleLabel[role]}
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/dashboard/settings")}>
              Profile & settings
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem onSelect={() => router.push("/admin")}>
                <ShieldCheck /> Admin console
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={logout}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function ShellLoading() {
  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-3 lg:block">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-3 h-11 w-full" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-border px-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="ml-auto h-8 w-56" />
        </div>
        <div className="space-y-4 p-6">
          <Skeleton className="h-9 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ConsoleShell({
  variant,
  children,
}: {
  variant: "dashboard" | "admin";
  children: React.ReactNode;
}) {
  const { ready, session, isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (variant === "admin" && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [ready, session, isAdmin, variant, router]);

  if (!ready || !session || (variant === "admin" && !isAdmin)) {
    return <ShellLoading />;
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="sticky top-0 h-dvh">
          <SidebarContent variant={variant} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar variant={variant} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
