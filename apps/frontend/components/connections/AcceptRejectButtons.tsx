"use client";

import { useCallback } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "@/store/thunks/connectionsThunks";
import {
  optimisticRemoveReceivedRequest,
} from "@/store/slices/connectionsSlice";
import { addToast } from "@/store/slices/uiSlice";

interface AcceptRejectButtonsProps {
  connectionId: number;
}

export function AcceptRejectButtons({
  connectionId,
}: AcceptRejectButtonsProps) {
  const dispatch = useAppDispatch();

  const senderId = useAppSelector(
    (state) =>
      state.connections.receivedRequests.find(
        (r) => r.connectionId === connectionId
      )?.senderId
  );

  const actionLoading = useAppSelector(
    (state) => (senderId ? (state.connections.actionLoading[senderId] ?? null) : null)
  );

  const handleAccept = useCallback(async () => {
    dispatch(optimisticRemoveReceivedRequest(connectionId));
    try {
      await dispatch(acceptConnectionRequest(connectionId)).unwrap();
      dispatch(addToast({ message: "Request accepted", type: "success" }));
    } catch {
      dispatch(addToast({ message: "Failed to accept request", type: "error" }));
    }
  }, [dispatch, connectionId]);

  const handleReject = useCallback(async () => {
    dispatch(optimisticRemoveReceivedRequest(connectionId));
    try {
      await dispatch(rejectConnectionRequest(connectionId)).unwrap();
      dispatch(addToast({ message: "Request declined", type: "info" }));
    } catch {
      dispatch(addToast({ message: "Failed to decline request", type: "error" }));
    }
  }, [dispatch, connectionId]);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAccept}
        loading={actionLoading === "accepting"}
        disabled={actionLoading !== null}
        className="text-secondary hover:text-secondary-hover"
      >
        <Check size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReject}
        loading={actionLoading === "rejecting"}
        disabled={actionLoading !== null}
        className="text-danger hover:text-danger-hover"
      >
        <X size={16} />
      </Button>
    </div>
  );
}
