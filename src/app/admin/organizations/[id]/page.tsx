import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
  MessagesSquare,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { organizationService } from "@/services/organizations";
import { knowledgeService } from "@/services/knowledge";
import { mockUsers } from "@/data/mock-users";
import { formatDate, formatNumber, initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organization = await organizationService.get(id);
  if (!organization) notFound();

  const members = mockUsers.filter((user) => user.organizationId === id);
  const sources =
    id === "org_northwind" ? await knowledgeService.listSources(id) : [];

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/organizations">
          <ArrowLeft />
          Back to organizations
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Building2 className="size-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {organization.name}
              </h1>
              <StatusBadge status={organization.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {organization.industry} · {organization.country} · {organization.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="capitalize">
            {organization.plan} plan
          </Badge>
          <Button variant="outline" size="sm">
            Impersonate
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Users />} label="Active users" value={`${organization.activeUserCount}/${organization.memberCount}`} />
        <Metric icon={<MessagesSquare />} label="Conversations" value={formatNumber(organization.conversationCount)} />
        <Metric icon={<MessagesSquare />} label="AI messages" value={formatNumber(organization.aiMessageCount)} />
        <Metric icon={<CreditCard />} label="MRR" value={`$${formatNumber(organization.mrr)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-semibold">Organization information</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Row label="Owner" value={organization.ownerName} />
            <Row label="Owner email" value={organization.ownerEmail} />
            <Row label="Country" value={organization.country ?? "—"} />
            <Row label="Created" value={formatDate(organization.createdAt)} />
            <Row label="Knowledge sources" value={formatNumber(organization.knowledgeSourceCount)} />
            <Row label="Health score" value={`${organization.healthScore}/100`} />
          </dl>
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Account health</span>
              <span className="tabular-nums">{organization.healthScore}%</span>
            </div>
            <Progress value={organization.healthScore} className="h-1.5" />
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold">Subscription</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{organization.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={organization.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">MRR</span>
              <span className="font-medium tabular-nums">
                ${formatNumber(organization.mrr)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-medium tabular-nums">
                {organization.activeUserCount} active
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Users className="size-4 text-primary" />
          <p className="text-sm font-semibold">Users</p>
        </div>
        {members.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            No user records in the demo data for this organization.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{member.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(member.lastActiveAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <FileText className="size-4 text-primary" />
          <p className="text-sm font-semibold">Knowledge sources</p>
        </div>
        {sources.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            {organization.knowledgeSourceCount} sources connected (demo data is only
            available for Northwind Commerce).
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{source.name}</p>
                  <p className="truncate text-xs capitalize text-muted-foreground">
                    {source.type} · {formatNumber(source.chunks)} chunks
                  </p>
                </div>
                <StatusBadge status={source.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
