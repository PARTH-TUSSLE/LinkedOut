"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Send, UserCheck } from "lucide-react";
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
import { Spinner } from "@/components/ui/Spinner";
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

  const tabs: { id: Tab; label: string; icon: any; count: number }[] = [
    { id: "received", label: "Received", icon: Inbox, count: receivedRequests.length },
    { id: "sent", label: "Sent", icon: Send, count: sentRequests.length },
    { id: "connections", label: "Connections", icon: UserCheck, count: connections.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl p-4 sm:p-6"
    >
      <div className="mb-6">
        <h1 className="text-h3 text-text-primary">My Network</h1>
        <p className="text-body-sm text-text-secondary">Manage your connections</p>
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border bg-card-hover p-0.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-body-sm font-medium transition-all duration-150",
              tab === t.id
                ? "bg-card text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <t.icon size={14} />
            {t.label}
            <span className="text-caption">({t.count})</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : tab === "connections" ? (
        connections.length === 0 ? (
          <EmptyState
            icon={<UserCheck size={20} />}
            title="No connections yet"
            description="Connect with other users to grow your network."
          />
        ) : (
          <div className="space-y-2">
            {connections.map((conn) => (
              <Card
                key={conn.connectionId}
                className="flex items-center justify-between p-3 transition-all duration-150 hover:border-border-hover"
              >
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
                    <p className="text-body-sm font-medium text-text-primary hover:text-accent transition-colors">
                      {conn.user.name}
                    </p>
                    <p className="text-caption text-text-tertiary">
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
              icon={<Inbox size={20} />}
              title="No received requests"
              description="You haven't received any connection requests yet."
            />
          ) : tab === "sent" && sentRequests.length === 0 ? (
            <EmptyState
              icon={<Send size={20} />}
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
    </motion.div>
  );
}
