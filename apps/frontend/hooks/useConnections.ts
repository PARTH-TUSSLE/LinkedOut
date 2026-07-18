"use client";

import { useAppSelector } from "@/store/hooks";

export function useConnections() {
  const { allUsers, sentRequests, receivedRequests, connections, isLoading } =
    useAppSelector((state) => state.connections);
  return { allUsers, sentRequests, receivedRequests, connections, isLoading };
}
