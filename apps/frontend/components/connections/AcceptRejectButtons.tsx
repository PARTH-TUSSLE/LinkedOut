"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "@/store/thunks/connectionsThunks";

interface AcceptRejectButtonsProps {
  connectionId: number;
}

export function AcceptRejectButtons({ connectionId }: AcceptRejectButtonsProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading("accept");
    try {
      await dispatch(acceptConnectionRequest(connectionId)).unwrap();
    } catch {
      // handled by thunk
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    setLoading("reject");
    try {
      await dispatch(rejectConnectionRequest(connectionId)).unwrap();
    } catch {
      // handled by thunk
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-1.5">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAccept}
        loading={loading === "accept"}
      >
        <Check size={14} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReject}
        loading={loading === "reject"}
        className="text-text-tertiary hover:text-danger"
      >
        <X size={14} />
      </Button>
    </div>
  );
}
