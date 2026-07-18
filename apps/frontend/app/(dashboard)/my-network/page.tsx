"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox, Send, UserCheck, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSentRequests,
  fetchReceivedRequests,
  fetchConnections,
} from "@/store/thunks/connectionsThunks";
import {
  setSentRequests,
  setReceivedRequests,
  setConnections,
  setConnectionsLoading,
} from "@/store/slices/connectionsSlice";
import { ConnectionRequestCard } from "@/components/connections/ConnectionRequestCard";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type Tab = "received" | "sent" | "connections";

export default function MyNetworkPage() {
  const dispatch = useAppDispatch();
  const { sentRequests, receivedRequests, connections, isLoading } =
    useAppSelector((state) => state.connections);
  const [tab, setTab] = useState<Tab>("received");

  const loadRequests = () => {
    dispatch(setConnectionsLoading(true));
    Promise.all([
      dispatch(fetchReceivedRequests()).unwrap(),
      dispatch(fetchSentRequests()).unwrap(),
      dispatch(fetchConnections()).unwrap(),
    ])
      .then(([received, sent, conns]) => {
        dispatch(setReceivedRequests(received));
        dispatch(setSentRequests(sent));
        dispatch(setConnections(conns));
      })
      .catch(() => {})
      .finally(() => dispatch(setConnectionsLoading(false)));
  };

  useEffect(() => {
    loadRequests();
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">My Network</h1>
        <p className="text-sm text-text-secondary">
          Manage your connections
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
        <button
          onClick={() => setTab("connections")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "connections"
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <UserCheck size={16} />
          Connections ({connections.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : tab === "connections" ? (
        connections.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No connections yet"
            description="Connect with other users to grow your network."
          />
        ) : (
          <div className="space-y-2">
            {connections.map((conn) => (
              <Card key={conn.connectionId} className="flex items-center justify-between p-3">
                <Link
                  href={`/profile/${conn.user.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar
                    src={conn.user.profilePicture}
                    alt={conn.user.name}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary hover:text-primary">
                      {conn.user.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      @{conn.user.username}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )
      ) : (
        <>
          {tab === "received" && receivedRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No received requests"
              description="You haven't received any connection requests yet."
            />
          ) : tab === "sent" && sentRequests.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No sent requests"
              description="You haven't sent any connection requests yet."
            />
          ) : (
            <div className="space-y-2">
              {(tab === "received" ? receivedRequests : sentRequests).map(
                (req) => (
                  <ConnectionRequestCard
                    key={req.connectionId}
                    request={req}
                    type={tab}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
