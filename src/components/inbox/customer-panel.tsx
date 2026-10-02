"use client";

import { Building2, Mail, MapPin, Phone, Star, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { channelMeta } from "./conversation-thread";
import { ORDER_STATUSES, OrderStatusBadge, orderStatusMeta } from "./order-status";
import { formatNumber, initials, relativeTime } from "@/lib/utils";
import type { Conversation, OrderStatus } from "@/types/conversation";

export function CustomerPanel({
  conversation,
  onUpdateOrderStatus,
}: {
  conversation: Conversation;
  onUpdateOrderStatus?: (status: OrderStatus) => void;
}) {
  const { customer } = conversation;
  const Channel = channelMeta[customer.channel].icon;
  const orderStatus = conversation.orderStatus ?? "processing";

  return (
    <div className="h-full space-y-4 overflow-y-auto scrollbar-thin p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar className="size-14">
          <AvatarFallback className="text-base">
            {initials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{customer.name}</p>
            <OrderStatusBadge status={orderStatus} />
          </div>
          <p className="text-xs text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {customer.tags.map((tag) => (
            <Badge key={tag} variant="neutral">
              <Tag className="size-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Order status
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Select
            value={orderStatus}
            onValueChange={(value) => onUpdateOrderStatus?.(value as OrderStatus)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {orderStatusMeta[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Updates the status badge shown next to the customer&apos;s name.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onUpdateOrderStatus?.(status)}
              aria-pressed={status === orderStatus}
              className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <OrderStatusBadge
                status={status}
                className={
                  status === orderStatus
                    ? "ring-2 ring-ring ring-offset-1 ring-offset-card"
                    : "opacity-70"
                }
              />
            </button>
          ))}
        </div>
      </Card>

      <Separator />

      <div className="space-y-3 text-sm">
        <Row icon={<User />} label="Customer since" value={relativeTime(customer.firstSeenAt)} />
        <Row
          icon={<Channel />}
          label="Primary channel"
          value={channelMeta[customer.channel].label}
        />
        <Row icon={<Mail />} label="Email" value={customer.email} />
        {customer.location && (
          <Row icon={<MapPin />} label="Location" value={customer.location} />
        )}
        {customer.company && (
          <Row icon={<Building2 />} label="Company" value={customer.company} />
        )}
        {customer.phone && <Row icon={<Phone />} label="Phone" value={customer.phone} />}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <p className="text-lg font-semibold tabular-nums">
            {customer.totalConversations}
          </p>
          <p className="text-[0.7rem] text-muted-foreground">Conversations</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="inline-flex items-center gap-1 text-lg font-semibold tabular-nums">
            <Star className="size-4 text-warning" />
            {customer.lifetimeValue ? formatNumber(customer.lifetimeValue) : "0"}
          </p>
          <p className="text-[0.7rem] text-muted-foreground">Lifetime value</p>
        </Card>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Conversation
        </p>
        <dl className="mt-2 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium capitalize">{conversation.status}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Priority</dt>
            <dd className="font-medium capitalize">{conversation.priority}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Sentiment</dt>
            <dd className="font-medium capitalize">{conversation.sentiment}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">AI confidence</dt>
            <dd className="font-medium tabular-nums">{conversation.confidence}%</dd>
          </div>
          {conversation.assignedTo && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Assigned to</dt>
              <dd className="font-medium">{conversation.assignedTo}</dd>
            </div>
          )}
        </dl>
      </div>

      {customer.notes && (
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{customer.notes}</p>
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.7rem] text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}
