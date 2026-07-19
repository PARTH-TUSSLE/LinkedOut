"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReceivedRequests } from "@/store/thunks/connectionsThunks";
import { Avatar } from "@/components/ui/Avatar";
import { AcceptRejectButtons } from "@/components/connections/AcceptRejectButtons";

export function NotificationDropdown() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { receivedRequests } = useAppSelector((state) => state.connections);
  const unreadCount = receivedRequests.length;

  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unreadCount === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {receivedRequests.map((req) => (
                  <div
                    key={req.connectionId}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg/50"
                  >
                    <Avatar
                      src={null}
                      alt={req.sender?.name || ""}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/profile/${req.sender?.id}`}
                        className="text-sm font-medium text-text-primary hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {req.sender?.name}
                      </Link>
                      <p className="text-xs text-text-muted">
                        Sent you a connection request
                      </p>
                    </div>
                    <AcceptRejectButtons connectionId={req.connectionId} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <Link
              href="/my-network"
              className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              onClick={() => setIsOpen(false)}
            >
              View all requests
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
