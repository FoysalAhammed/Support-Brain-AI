"use client";

import * as React from "react";
import { MoreHorizontal, Radio, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/components/providers/auth-provider";
import { channelService } from "@/services/channels";
import { teamService } from "@/services/team";
import { initials, relativeTime } from "@/lib/utils";
import type { ChannelConnection } from "@/types/channel";
import type { User, UserRole } from "@/types/user";

const roles: UserRole[] = ["admin", "moderator", "agent", "viewer"];

export function TeamView() {
  const { can } = useAuth();
  const canManage = can("team:manage");
  const canAllocate = can("team:allocate");

  const [members, setMembers] = React.useState<User[]>([]);
  const [channels, setChannels] = React.useState<ChannelConnection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("agent");
  const [busy, setBusy] = React.useState(false);
  const [assignTarget, setAssignTarget] = React.useState<User | null>(null);
  const [assignIds, setAssignIds] = React.useState<string[]>([]);
  const [savingAssign, setSavingAssign] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([teamService.list(), channelService.list()]).then(
      ([membersResult, channelsResult]) => {
        if (!mounted) return;
        setMembers(membersResult);
        setChannels(channelsResult);
        setLoading(false);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const invite = async () => {
    if (!inviteEmail.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setBusy(true);
    const member = await teamService.invite(inviteEmail, inviteRole);
    setMembers((current) => [...current, member]);
    setBusy(false);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("agent");
    toast.success("Invitation sent", { description: `${member.email} was invited.` });
  };

  const changeRole = async (member: User, role: UserRole) => {
    const updated = await teamService.updateRole(member.id, role);
    if (updated) {
      setMembers((current) =>
        current.map((item) => (item.id === member.id ? updated : item)),
      );
    }
  };

  const toggleStatus = async (member: User) => {
    const next = member.status === "active" ? "deactivated" : "active";
    const updated = await teamService.setStatus(member.id, next);
    if (updated) {
      setMembers((current) =>
        current.map((item) => (item.id === member.id ? updated : item)),
      );
    }
  };

  const remove = async (member: User) => {
    await teamService.remove(member.id);
    setMembers((current) => current.filter((item) => item.id !== member.id));
    toast.success(`${member.name} removed`);
  };

  const openAllocation = (member: User) => {
    setAssignTarget(member);
    setAssignIds(member.channelIds ?? []);
  };

  const toggleAssignment = (channelId: string, checked: boolean) => {
    setAssignIds((current) =>
      checked ? [...new Set([...current, channelId])] : current.filter((id) => id !== channelId),
    );
  };

  const saveAssignments = async () => {
    if (!assignTarget) return;
    setSavingAssign(true);
    const updated = await teamService.updateChannels(assignTarget.id, assignIds);
    await Promise.all(
      channels.map((channel) => {
        const next = new Set(channel.assignedUserIds ?? []);
        if (assignIds.includes(channel.id)) next.add(assignTarget.id);
        else next.delete(assignTarget.id);
        return channelService.assignUsers(channel.id, Array.from(next));
      }),
    );
    setSavingAssign(false);
    if (updated) {
      setMembers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    }
    setAssignTarget(null);
    toast.success("Channel allocation updated", {
      description: `${assignIds.length} channel${assignIds.length === 1 ? "" : "s"} assigned.`,
    });
  };

  const channelName = (id: string) => channels.find((channel) => channel.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Team</h1>
          <p className="text-sm text-muted-foreground">
            Manage who can access your workspace, what they can do, and which channels
            they moderate.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} disabled={!canManage}>
          <UserPlus />
          Invite member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden lg:table-cell">Channels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <div className="h-10 animate-pulse rounded bg-muted" />
                    </TableCell>
                  </TableRow>
                ))
              : members.map((member) => {
                  const assigned = member.channelIds ?? [];
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
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
                      <TableCell>
                        {member.role === "owner" ? (
                          <Badge variant="default">Owner</Badge>
                        ) : (
                          <Select
                            value={member.role}
                            disabled={!canManage}
                            onValueChange={(value) => changeRole(member, value as UserRole)}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role} className="capitalize">
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <button
                          type="button"
                          onClick={() => openAllocation(member)}
                          disabled={!canAllocate}
                          className="flex flex-wrap items-center gap-1 text-left disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Allocate channels for ${member.name}`}
                        >
                          {assigned.length === 0 ? (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          ) : (
                            assigned.slice(0, 2).map((id) => (
                              <Badge key={id} variant="neutral">
                                {channelName(id)}
                              </Badge>
                            ))
                          )}
                          {assigned.length > 2 && (
                            <Badge variant="neutral">+{assigned.length - 2}</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={member.status} />
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {relativeTime(member.lastActiveAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Member actions">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={!canAllocate}
                              onSelect={() => openAllocation(member)}
                            >
                              <Radio /> Allocate channels
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!canManage}
                              onSelect={() => toggleStatus(member)}
                            >
                              {member.status === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              destructive
                              disabled={!canManage || member.role === "owner"}
                              onSelect={() => remove(member)}
                            >
                              Remove member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>
              They will receive an email invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={invite} disabled={busy}>
              {busy ? <Spinner /> : null}
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(assignTarget)}
        onOpenChange={(open) => !open && setAssignTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate channels</DialogTitle>
            <DialogDescription>
              Choose which channels {assignTarget?.name} is responsible for moderating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {channels.map((channel) => (
              <label
                key={channel.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
              >
                <Checkbox
                  checked={assignIds.includes(channel.id)}
                  onCheckedChange={(checked) =>
                    toggleAssignment(channel.id, checked === true)
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{channel.name}</span>
                  <span className="block truncate text-xs capitalize text-muted-foreground">
                    {channel.status === "connected" ? "Connected" : "Not connected"}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTarget(null)}>
              Cancel
            </Button>
            <Button onClick={saveAssignments} disabled={savingAssign}>
              {savingAssign ? <Spinner /> : null}
              Save allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
