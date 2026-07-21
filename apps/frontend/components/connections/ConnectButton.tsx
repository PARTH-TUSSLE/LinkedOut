"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import {
  sendConnectionRequest,
  cancelConnectionRequest,
  disconnectConnection,
} from "@/store/thunks/connectionsThunks";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ConnectButtonProps {
  userId: number;
  size?: "sm" | "md";
}

export function ConnectButton({ userId, size = "sm" }: ConnectButtonProps) {
  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const statusInfo = useConnectionStatus(userId);

  const handleSend = async () => {
    setLoading(true);
    try {
      await dispatch(sendConnectionRequest(userId)).unwrap();
    } catch {
      // handled by thunk
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!statusInfo.connectionId) return;
    setLoading(true);
    try {
      await dispatch(cancelConnectionRequest(statusInfo.connectionId)).unwrap();
    } catch {
      // handled by thunk
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setShowConfirm(false);
    const connId = statusInfo.connectionId;
    if (!connId) return;
    setLoading(true);
    try {
      await dispatch(disconnectConnection(connId)).unwrap();
    } catch {
      // handled by thunk
    } finally {
      setLoading(false);
    }
  };

  if (statusInfo.status === "connected") {
    return (
      <>
        <Button variant="secondary" size={size} onClick={() => setShowConfirm(true)}>
          <UserCheck size={14} />
          Connected
        </Button>
        <ConfirmDialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDisconnect}
          title="Remove connection"
          description="Are you sure you want to remove this connection?"
          confirmLabel="Remove"
        />
      </>
    );
  }

  if (statusInfo.status === "pending_sent") {
    return (
      <Button variant="secondary" size={size} onClick={handleCancel} loading={loading}>
        <Clock size={14} />
        Requested
      </Button>
    );
  }

  if (statusInfo.status === "pending_received") {
    return <Button variant="secondary" size={size}><UserCheck size={14} />Respond</Button>;
  }

  return (
    <Button variant="secondary" size={size} onClick={handleSend} loading={loading}>
      <UserPlus size={14} />
      Connect
    </Button>
  );
}
