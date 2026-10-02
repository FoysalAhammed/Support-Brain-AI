import type { User } from "@/types/user";
import { agoDays, agoHours } from "./time";

export const DEMO_EMAIL = "demo@supportbrain.ai";
export const DEMO_PASSWORD = "demo123";
export const DEMO_ORG_ID = "org_northwind";

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
  lastActiveAt: agoHours(1),
  createdAt: agoDays(640),
};

export const mockUsers: User[] = [
  demoUser,
  {
    id: "usr_sofia",
    name: "Sofia Almeida",
    email: "sofia@northwind.com",
    role: "admin",
    status: "active",
    organizationId: DEMO_ORG_ID,
    title: "Support Manager",
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
