import { mockTeamMembers } from "@/data/mock-users";
import { sleep } from "@/lib/utils";
import type { User, UserRole } from "@/types/user";

let members: User[] = [...mockTeamMembers];

const roleTitles: Record<UserRole, string> = {
  owner: "Business Owner",
  admin: "Admin",
  moderator: "Moderator",
  agent: "Support Agent",
  viewer: "Viewer",
};

export const teamService = {
  async list(): Promise<User[]> {
    await sleep(40);
    return members;
  },

  async invite(email: string, role: UserRole): Promise<User> {
    await sleep(500);
    const name = email
      .split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const member: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: name || "Invited member",
      email,
      role,
      status: "invited",
      organizationId: "org_northwind",
      title: roleTitles[role] ?? "Support Agent",
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      channelIds: [],
    };
    members = [...members, member];
    return member;
  },

  async updateRole(id: string, role: UserRole): Promise<User | null> {
    await sleep(260);
    members = members.map((member) =>
      member.id === id ? { ...member, role, title: roleTitles[role] } : member,
    );
    return members.find((member) => member.id === id) ?? null;
  },

  async updateChannels(id: string, channelIds: string[]): Promise<User | null> {
    await sleep(240);
    members = members.map((member) =>
      member.id === id ? { ...member, channelIds } : member,
    );
    return members.find((member) => member.id === id) ?? null;
  },

  async setStatus(id: string, status: User["status"]): Promise<User | null> {
    await sleep(260);
    members = members.map((member) => (member.id === id ? { ...member, status } : member));
    return members.find((member) => member.id === id) ?? null;
  },

  async remove(id: string): Promise<void> {
    await sleep(300);
    members = members.filter((member) => member.id !== id);
  },
};

export type TeamService = typeof teamService;
