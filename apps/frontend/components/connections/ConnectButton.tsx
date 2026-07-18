"use client";

import { useCallback, useMemo } from "react";
import { UserPlus, UserCheck, Clock, XCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  fetchSentRequests,
  fetchReceivedRequests,
  fetchConnections,
} from "@/store/thunks/connectionsThunks";
import {
  setSentRequests,
  setReceivedRequests,
  setConnections,
} from "@/store/slices/connectionsSlice";
import { addToast } from "@/store/slices/uiSlice";

interface ConnectButtonProps {
  userId: number;
  onSuccess?: () => void;
}

export function ConnectButton({ userId, onSuccess }: ConnectButtonProps) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { sentRequests, receivedRequests, connections } = useAppSelector(
    (state) => state.connections
  );

  if (!currentUser || currentUser.id === userId) return null;

  const sentReq = useMemo(
    () =>
      sentRequests.find(
        (r) => r.senderId === currentUser.id && r.receiverId === userId
      ),
    [sentRequests, currentUser.id, userId]
  );

  const receivedReq = useMemo(
    () =>
      receivedRequests.find(
        (r) => r.senderId === userId && r.receiverId === currentUser.id
      ),
    [receivedRequests, userId, currentUser.id]
  );

  const isConnected = useMemo(
    () => connections.some((c) => c.user.id === userId),
    [connections, userId]
  );

  const status = useMemo(() => {
    if (isConnected) return "connected";
    if (sentReq) {
      if (sentReq.status === "rejected") return "rejected";
      return "sent";
    }
    if (receivedReq) return "received";
    return "idle";
  }, [isConnected, sentReq, receivedReq]);

  const handleConnect = useCallback(async () => {
    try {
      await dispatch(sendConnectionRequest(userId)).unwrap();
      const sent = await dispatch(fetchSentRequests()).unwrap();
      dispatch(setSentRequests(sent));
      dispatch(
        addToast({ message: "Connection request sent!", type: "success" })
      );
      onSuccess?.();
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to send request",
          type: "error",
        })
      );
    }
  }, [dispatch, userId, onSuccess]);

  const handleAccept = useCallback(async () => {
    if (!receivedReq) return;
    try {
      await dispatch(
        acceptConnectionRequest(receivedReq.connectionId)
      ).unwrap();
      const [received, sent, conns] = await Promise.all([
        dispatch(fetchReceivedRequests()).unwrap(),
        dispatch(fetchSentRequests()).unwrap(),
        dispatch(fetchConnections()).unwrap(),
      ]);
      dispatch(setReceivedRequests(received));
      dispatch(setSentRequests(sent));
      dispatch(setConnections(conns));
      dispatch(
        addToast({ message: "Connection accepted!", type: "success" })
      );
      onSuccess?.();
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to accept",
          type: "error",
        })
      );
    }
  }, [dispatch, receivedReq, onSuccess]);

  const handleReject = useCallback(async () => {
    if (!receivedReq) return;
    try {
      await dispatch(
        rejectConnectionRequest(receivedReq.connectionId)
      ).unwrap();
      const [received, conns] = await Promise.all([
        dispatch(fetchReceivedRequests()).unwrap(),
        dispatch(fetchConnections()).unwrap(),
      ]);
      dispatch(setReceivedRequests(received));
      dispatch(setConnections(conns));
      dispatch(
        addToast({ message: "Connection request declined", type: "info" })
      );
      onSuccess?.();
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to decline",
          type: "error",
        })
      );
    }
  }, [dispatch, receivedReq, onSuccess]);

  if (status === "connected") {
    return (
      <Button variant="outline" size="sm" disabled>
        <UserCheck size={16} />
        Connected
      </Button>
    );
  }

  if (status === "sent") {
    return (
      <Button variant="outline" size="sm" disabled>
        <Clock size={16} />
        Pending
      </Button>
    );
  }

  if (status === "rejected") {
    return (
      <Button variant="outline" size="sm" disabled>
        <XCircle size={16} />
        Rejected
      </Button>
    );
  }

  if (status === "received") {
    return (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={handleAccept}>
          <Check size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReject}>
          <X size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleConnect}>
      <UserPlus size={16} />
      Connect
    </Button>
  );
}
