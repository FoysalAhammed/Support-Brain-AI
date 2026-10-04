import type { ID } from "./common";

export type UserRole = "owner" | "admin" | "moderator" | "agent" | "viewer";

export type PlatformRole = "developer" | "admin";

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
  /** Channels this member is responsible for (moderator/agent allocation). */
  channelIds?: ID[];
  /** Set only for platform (org_platform) accounts. */
  platformRole?: PlatformRole;
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
