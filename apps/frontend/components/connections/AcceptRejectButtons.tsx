"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "@/store/thunks/connectionsThunks";
import { removeReceivedRequest } from "@/store/slices/connectionsSlice";
import { addToast } from "@/store/slices/uiSlice";

interface AcceptRejectButtonsProps {
  connectionId: number;
}

export function AcceptRejectButtons({
  connectionId,
}: AcceptRejectButtonsProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "accept" | "reject") => {
    setLoading(action);
    try {
      if (action === "accept") {
        await dispatch(acceptConnectionRequest(connectionId)).unwrap();
        dispatch(addToast({ message: "Request accepted", type: "success" }));
      } else {
        await dispatch(rejectConnectionRequest(connectionId)).unwrap();
        dispatch(addToast({ message: "Request rejected", type: "info" }));
      }
      dispatch(removeReceivedRequest(connectionId));
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : `Failed to ${action}`,
          type: "error",
        })
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction("accept")}
        loading={loading === "accept"}
        className="text-secondary hover:text-secondary-hover"
      >
        <Check size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction("reject")}
        loading={loading === "reject"}
        className="text-danger hover:text-danger-hover"
      >
        <X size={16} />
      </Button>
    </div>
  );
}
