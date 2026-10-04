import type { UserRole } from "@/types/user";

export type Permission =
  | "knowledge:manage"
  | "channels:manage"
  | "inbox:handle"
  | "team:manage"
  | "team:allocate"
  | "billing:manage"
  | "analytics:view"
  | "platform:manage";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "knowledge:manage",
    "channels:manage",
    "inbox:handle",
    "team:manage",
    "team:allocate",
    "billing:manage",
    "analytics:view",
  ],
  admin: [
    "knowledge:manage",
    "channels:manage",
    "inbox:handle",
    "team:manage",
    "team:allocate",
    "billing:manage",
    "analytics:view",
    "platform:manage",
  ],
  moderator: [
    "knowledge:manage",
    "inbox:handle",
    "team:allocate",
    "analytics:view",
  ],
  agent: ["inbox:handle", "analytics:view"],
  viewer: ["analytics:view"],
};

export function hasPermission(
  role: UserRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const roleLabel: Record<UserRole, string> = {
  owner: "Business Owner",
  admin: "Admin",
  moderator: "Moderator",
  agent: "Support Agent",
  viewer: "Viewer",
};
