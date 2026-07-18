"use client";

import { useEffect, useState } from "react";
import { Inbox, Send, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSentRequests,
  fetchReceivedRequests,
} from "@/store/thunks/connectionsThunks";
import {
  setSentRequests,
  setReceivedRequests,
  setConnectionsLoading,
} from "@/store/slices/connectionsSlice";
import { ConnectionRequestCard } from "@/components/connections/ConnectionRequestCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

type Tab = "received" | "sent";

export default function MyNetworkPage() {
  const dispatch = useAppDispatch();
  const { sentRequests, receivedRequests, isLoading } = useAppSelector(
    (state) => state.connections
  );
  const [tab, setTab] = useState<Tab>("received");

  const loadRequests = () => {
    dispatch(setConnectionsLoading(true));
    Promise.all([
      dispatch(fetchReceivedRequests()).unwrap(),
      dispatch(fetchSentRequests()).unwrap(),
    ])
      .then(([received, sent]) => {
        dispatch(setReceivedRequests(received));
        dispatch(setSentRequests(sent));
      })
      .catch(() => {})
      .finally(() => dispatch(setConnectionsLoading(false)));
  };

  useEffect(() => {
    loadRequests();
  }, [dispatch]);

  const currentRequests =
    tab === "received" ? receivedRequests : sentRequests;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">My Network</h1>
        <p className="text-sm text-text-secondary">
          Manage your connection requests
        </p>
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-lg bg-bg p-1">
        <button
          onClick={() => setTab("received")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "received"
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Inbox size={16} />
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setTab("sent")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "sent"
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Send size={16} />
          Sent ({sentRequests.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : currentRequests.length === 0 ? (
        <EmptyState
          icon={tab === "received" ? Inbox : Send}
          title={
            tab === "received"
              ? "No received requests"
              : "No sent requests"
          }
          description={
            tab === "received"
              ? "You haven't received any connection requests yet."
              : "You haven't sent any connection requests yet."
          }
        />
      ) : (
        <div className="space-y-2">
          {currentRequests.map((req) => (
            <ConnectionRequestCard
              key={req.connectionId}
              request={req}
              type={tab}
            />
          ))}
        </div>
      )}
    </div>
  );
}
