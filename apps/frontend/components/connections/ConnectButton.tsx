"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { sendConnectionRequest } from "@/store/thunks/connectionsThunks";
import { addToast } from "@/store/slices/uiSlice";

interface ConnectButtonProps {
  userId: number;
  onSuccess?: () => void;
}

export function ConnectButton({ userId, onSuccess }: ConnectButtonProps) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleConnect = async () => {
    setStatus("loading");
    try {
      await dispatch(sendConnectionRequest(userId)).unwrap();
      setStatus("sent");
      dispatch(
        addToast({ message: "Connection request sent!", type: "success" })
      );
      onSuccess?.();
    } catch (err: any) {
      setStatus("idle");
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to send request",
          type: "error",
        })
      );
    }
  };

  if (status === "sent") {
    return (
      <Button variant="outline" size="sm" disabled>
        <Clock size={16} />
        Pending
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleConnect}
      loading={status === "loading"}
    >
      <UserPlus size={16} />
      Connect
    </Button>
  );
}
