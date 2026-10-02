import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { analyticsService } from "@/services/analytics";
import { formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Organizations" };

export default async function AdminOrganizationsPage() {
  const organizations = await analyticsService.listOrganizations();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description={`${organizations.length} tenants on the platform.`}
      />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Conversations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>
                  <Link
                    href={`/admin/organizations/${organization.id}`}
                    className="flex items-center gap-3"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Building2 className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium hover:text-primary">
                        {organization.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {organization.industry}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{organization.ownerName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {organization.ownerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="capitalize">
                    {organization.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {organization.activeUserCount}/{organization.memberCount}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(organization.conversationCount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={organization.status} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {formatDate(organization.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
