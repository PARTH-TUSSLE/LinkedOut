"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { AcceptRejectButtons } from "./AcceptRejectButtons";
import { Clock } from "lucide-react";
import type { Connection } from "@/types";

interface ConnectionRequestCardProps {
  request: Connection;
  type: "sent" | "received";
}

export function ConnectionRequestCard({
  request,
  type,
}: ConnectionRequestCardProps) {
  const person = type === "sent" ? request.receiver : request.sender;

  if (!person) return null;

  return (
    <Card className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Avatar src={null} alt={person.name} size="md" />
        <div>
          <Link
            href={`/profile/${person.id}`}
            className="text-sm font-medium text-text-primary hover:text-primary"
          >
            {person.name}
          </Link>
          <p className="text-xs text-text-muted">@{person.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {type === "sent" ? (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock size={14} />
            Pending
          </span>
        ) : (
          <AcceptRejectButtons connectionId={request.connectionId} />
        )}
      </div>
    </Card>
  );
}
