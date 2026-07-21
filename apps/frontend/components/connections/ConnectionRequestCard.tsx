"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { AcceptRejectButtons } from "./AcceptRejectButtons";
import type { Connection } from "@/types";

interface ConnectionRequestCardProps {
  request: Connection;
  type: "received" | "sent";
}

export function ConnectionRequestCard({ request, type }: ConnectionRequestCardProps) {
  const userData = type === "received" ? request.sender : request.receiver;

  return (
    <Card className="flex items-center justify-between p-3 transition-all duration-150 hover:border-border-hover">
      <Link
        href={`/profile/${userData?.id}`}
        className="flex items-center gap-3"
      >
        <Avatar src={userData?.profilePicture} alt={userData?.name || "User"} size="md" />
        <div>
          <p className="text-body-sm font-medium text-text-primary hover:text-accent transition-colors">
            {userData?.name || "Unknown"}
          </p>
          <p className="text-caption text-text-tertiary">@{userData?.username}</p>
        </div>
      </Link>

      {type === "received" && (
        <AcceptRejectButtons connectionId={request.connectionId} />
      )}
    </Card>
  );
}
