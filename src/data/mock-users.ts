import type { User } from "@/types/user";
import { agoDays, agoHours } from "./time";

export const DEMO_EMAIL = "demo@supportbrain.ai";
export const DEMO_PASSWORD = "demo123";
export const ADMIN_EMAIL = "admin@supportbrain.ai";
export const ADMIN_PASSWORD = "admin123";
export const DEMO_ORG_ID = "org_northwind";
export const DEVELOPER_EMAIL = "developer@supportbrain.ai";
export const DEVELOPER_PASSWORD = "developer123";
export const MODERATOR_EMAIL = "moderator@supportbrain.ai";
export const MODERATOR_PASSWORD = "moderator123";

export const demoUser: User = {
  id: "usr_alex",
  name: "Alex Morgan",
  email: DEMO_EMAIL,
  role: "owner",
  status: "active",
  organizationId: DEMO_ORG_ID,
  title: "Head of Customer Experience",
  lastActiveAt: agoHours(0.1),
  createdAt: agoDays(412),
};

export const adminUser: User = {
  id: "usr_root",
  name: "Priya Raman",
  email: "admin@supportbrain.ai",
  role: "admin",
  status: "active",
  organizationId: "org_platform",
  title: "Platform Administrator",
  platformRole: "admin",
  lastActiveAt: agoHours(1),
  createdAt: agoDays(640),
};

export const developerUser: User = {
  id: "usr_dev",
  name: "Md Foysal Ahammed",
  email: DEVELOPER_EMAIL,
  role: "admin",
  status: "active",
  organizationId: "org_platform",
  title: "Platform Developer & Owner",
  platformRole: "developer",
  lastActiveAt: agoHours(0.2),
  createdAt: agoDays(720),
};

export const moderatorUser: User = {
  id: "usr_maya",
  name: "Maya Rahman",
  email: MODERATOR_EMAIL,
  role: "moderator",
  status: "active",
  organizationId: DEMO_ORG_ID,
  title: "Community Moderator",
  channelIds: ["chn_website", "chn_instagram"],
  lastActiveAt: agoHours(1),
  createdAt: agoDays(96),
};

export const mockUsers: User[] = [
  demoUser,
  moderatorUser,
  {
    id: "usr_sofia",
    name: "Sofia Almeida",
    email: "sofia@northwind.com",
    role: "admin",
    status: "active",
    organizationId: DEMO_ORG_ID,
    title: "Support Manager",
    channelIds: ["chn_website", "chn_email"],
    lastActiveAt: agoHours(2),
    createdAt: agoDays(300),
  },
  {
    id: "usr_liam",
    name: "Liam Carter",
    email: "liam@northwind.com",
    role: "agent",
    status: "active",
    organizationId: DEMO_ORG_ID,
    title: "Senior Support Agent",
    channelIds: ["chn_facebook"],
    lastActiveAt: agoHours(5),
    createdAt: agoDays(212),
  },
  {
    id: "usr_nina",
    name: "Nina Kowalski",
    email: "nina@northwind.com",
    role: "agent",
    status: "active",
    organizationId: DEMO_ORG_ID,
    title: "Support Agent",
    channelIds: ["chn_whatsapp", "chn_website"],
    lastActiveAt: agoHours(20),
    createdAt: agoDays(140),
  },
  {
    id: "usr_omar",
    name: "Omar Haddad",
    email: "omar@northwind.com",
    role: "agent",
    status: "invited",
    organizationId: DEMO_ORG_ID,
    title: "Support Agent",
    channelIds: ["chn_facebook"],
    lastActiveAt: agoDays(3),
    createdAt: agoDays(4),
  },
  {
    id: "usr_grace",
    name: "Grace Lin",
    email: "grace@northwind.com",
    role: "viewer",
    status: "deactivated",
    organizationId: DEMO_ORG_ID,
    title: "Analyst",
    lastActiveAt: agoDays(45),
    createdAt: agoDays(260),
  },
];

export const mockTeamMembers = mockUsers.filter(
  (user) => user.organizationId === DEMO_ORG_ID,
);

export function findUser(id: string) {
  return mockUsers.find((user) => user.id === id);
}
