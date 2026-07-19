"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AcceptRejectButtons } from "./AcceptRejectButtons";
import { Clock, XCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { cancelConnectionRequest } from "@/store/thunks/connectionsThunks";
import { addToast } from "@/store/slices/uiSlice";
import type { Connection } from "@/types";

interface ConnectionRequestCardProps {
  request: Connection;
  type: "sent" | "received";
}

export function ConnectionRequestCard({
  request,
  type,
}: ConnectionRequestCardProps) {
  const dispatch = useAppDispatch();
  const [cancelling, setCancelling] = useState(false);
  const person = type === "sent" ? request.receiver : request.sender;

  if (!person) return null;

  const handleCancel = useCallback(async () => {
    setCancelling(true);
    try {
      await dispatch(cancelConnectionRequest(request.connectionId)).unwrap();
      dispatch(addToast({ message: "Request cancelled", type: "info" }));
    } catch {
      dispatch(addToast({ message: "Failed to cancel request", type: "error" }));
    } finally {
      setCancelling(false);
    }
  }, [dispatch, request.connectionId]);

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
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock size={14} />
              Pending
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              loading={cancelling}
              className="text-danger border-danger/30 hover:bg-danger/10"
            >
              <XCircle size={14} />
              Cancel
            </Button>
          </div>
        ) : (
          <AcceptRejectButtons connectionId={request.connectionId} />
        )}
      </div>
    </Card>
  );
}
