"use client";

import { useCallback } from "react";
import { UserPlus, UserCheck, Clock, Check, X, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  disconnectConnection,
  fetchReceivedRequests,
  fetchConnections,
} from "@/store/thunks/connectionsThunks";
import {
  optimisticAddSentRequest,
  optimisticRemoveReceivedRequest,
  optimisticRemoveConnection,
} from "@/store/slices/connectionsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { ConnectionStatus as CS } from "@/types";

interface ConnectButtonProps {
  userId: number;
  onSuccess?: () => void;
}

export function ConnectButton({ userId, onSuccess }: ConnectButtonProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { status, connectionId, actionLoading } = useConnectionStatus(userId);

  if (!user || user.id === userId) return null;

  const isLoading = actionLoading !== null;

  const handleConnect = useCallback(async () => {
    dispatch(optimisticAddSentRequest({ receiverId: userId, name: "", username: "" }));
    try {
      await dispatch(sendConnectionRequest(userId)).unwrap();
      dispatch(addToast({ message: "Connection request sent!", type: "success" }));
      onSuccess?.();
    } catch {
      // Refs remain optimistic — extraReducers.sentRequest.rejected will clean up
      onSuccess?.();
    }
  }, [dispatch, userId, onSuccess]);

  const handleAccept = useCallback(async () => {
    if (!connectionId) return;
    dispatch(optimisticRemoveReceivedRequest(connectionId));
    try {
      await dispatch(acceptConnectionRequest(connectionId)).unwrap();
      dispatch(addToast({ message: "Connection accepted!", type: "success" }));
      onSuccess?.();
    } catch (err: any) {
      const received = await dispatch(fetchReceivedRequests()).unwrap();
      onSuccess?.();
    }
  }, [dispatch, connectionId, onSuccess]);

  const handleReject = useCallback(async () => {
    if (!connectionId) return;
    dispatch(optimisticRemoveReceivedRequest(connectionId));
    try {
      await dispatch(rejectConnectionRequest(connectionId)).unwrap();
      dispatch(addToast({ message: "Request declined", type: "info" }));
      onSuccess?.();
    } catch (err: any) {
      const received = await dispatch(fetchReceivedRequests()).unwrap();
      onSuccess?.();
    }
  }, [dispatch, connectionId, onSuccess]);

  const handleCancel = useCallback(async () => {
    if (!connectionId) return;
    try {
      await dispatch(cancelConnectionRequest(connectionId)).unwrap();
      dispatch(addToast({ message: "Request cancelled", type: "info" }));
      onSuccess?.();
    } catch (err: any) {
      dispatch(addToast({ message: "Failed to cancel", type: "error" }));
    }
  }, [dispatch, connectionId, onSuccess]);

  const handleDisconnect = useCallback(async () => {
    if (!connectionId) return;
    dispatch(optimisticRemoveConnection(connectionId));
    try {
      await dispatch(disconnectConnection(connectionId)).unwrap();
      dispatch(addToast({ message: "Disconnected", type: "info" }));
      onSuccess?.();
    } catch (err: any) {
      const conns = await dispatch(fetchConnections()).unwrap();
      onSuccess?.();
    }
  }, [dispatch, connectionId, onSuccess]);

  if (status === CS.CONNECTED) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="cursor-default">
          <UserCheck size={16} />
          Connected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          loading={actionLoading === "disconnecting"}
          className="text-danger border-danger/30 hover:bg-danger/10"
        >
          <LogOut size={14} />
          Disconnect
        </Button>
      </div>
    );
  }

  if (status === CS.PENDING_SENT) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="cursor-default">
          <Clock size={16} />
          Pending
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          loading={actionLoading === "cancelling"}
          className="text-danger border-danger/30 hover:bg-danger/10"
        >
          <XCircle size={14} />
          Cancel
        </Button>
      </div>
    );
  }

  if (status === CS.PENDING_RECEIVED) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAccept}
          loading={actionLoading === "accepting"}
          className="text-secondary hover:text-secondary-hover"
        >
          <Check size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReject}
          loading={actionLoading === "rejecting"}
          className="text-danger hover:text-danger-hover"
        >
          <X size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleConnect}
      loading={isLoading}
    >
      <UserPlus size={16} />
      Connect
    </Button>
  );
}
