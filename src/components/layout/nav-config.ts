import {
  BarChart3,
  Bot,
  Building2,
  CreditCard,
  Inbox,
  LayoutDashboard,
  BookOpen,
  Radio,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/lib/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  permission?: Permission;
}

export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Inbox", href: "/dashboard/inbox", icon: Inbox, permission: "inbox:handle" },
  { label: "AI Agent", href: "/dashboard/agent", icon: Bot, permission: "knowledge:manage" },
  {
    label: "Knowledge Base",
    href: "/dashboard/knowledge",
    icon: BookOpen,
    permission: "knowledge:manage",
  },
  { label: "Channels", href: "/dashboard/channels", icon: Radio, permission: "channels:manage" },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    permission: "analytics:view",
  },
  { label: "Team", href: "/dashboard/team", icon: Users, permission: "team:allocate" },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard, permission: "billing:manage" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "Platform Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Organizations", href: "/admin/organizations", icon: Building2 },
  {
    label: "Platform Settings",
    href: "/admin/settings",
    icon: SlidersHorizontal,
    permission: "platform:manage",
  },
];

export function isNavActive(item: NavItem, pathname: string) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
