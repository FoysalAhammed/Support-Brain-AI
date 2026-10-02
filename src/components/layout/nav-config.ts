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
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { label: "AI Agent", href: "/dashboard/agent", icon: Bot },
  { label: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Channels", href: "/dashboard/channels", icon: Radio },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "Platform Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Organizations", href: "/admin/organizations", icon: Building2 },
];

export function isNavActive(item: NavItem, pathname: string) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
