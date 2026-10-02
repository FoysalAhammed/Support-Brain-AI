import type { ID } from "./common";

export type UserRole = "owner" | "admin" | "agent" | "viewer";

export type MemberStatus = "active" | "invited" | "deactivated";

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: MemberStatus;
  organizationId: ID;
  title?: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  organizationId: ID;
  issuedAt: number;
}

export interface TeamInvite {
  email: string;
  role: UserRole;
}
