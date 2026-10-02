import { demoOrganization, mockOrganizations } from "@/data/mock-organizations";
import { sleep } from "@/lib/utils";
import type { Organization } from "@/types/organization";

export const organizationService = {
  async list(): Promise<Organization[]> {
    await sleep(40);
    return mockOrganizations;
  },

  async get(id: string): Promise<Organization | null> {
    await sleep(30);
    return mockOrganizations.find((organization) => organization.id === id) ?? null;
  },

  async current(): Promise<Organization> {
    await sleep(20);
    return demoOrganization;
  },

  async getStats() {
    await sleep(30);
    const total = mockOrganizations.length;
    return {
      total,
      active: mockOrganizations.filter((o) => o.status === "active").length,
      trialing: mockOrganizations.filter((o) => o.status === "trialing").length,
      suspended: mockOrganizations.filter((o) => o.status === "suspended").length,
      mrr: mockOrganizations.reduce((sum, o) => sum + o.mrr, 0),
      conversations: mockOrganizations.reduce((sum, o) => sum + o.conversationCount, 0),
      users: mockOrganizations.reduce((sum, o) => sum + o.activeUserCount, 0),
    };
  },
};

export type OrganizationService = typeof organizationService;
