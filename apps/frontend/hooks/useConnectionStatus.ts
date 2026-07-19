"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { makeSelectConnectionStatus } from "@/store/selectors/connectionSelectors";
import { ConnectionStatus as CS } from "@/types";
import type { ConnectionStatus, StatusInfo } from "@/types";

export function useConnectionStatus(targetUserId: number): StatusInfo & { actionLoading: string | null } {
  const selector = useMemo(() => makeSelectConnectionStatus(), []);
  const statusInfo = useAppSelector((state) => selector(state, targetUserId));
  const actionLoading = useAppSelector((state) => state.connections.actionLoading[targetUserId] ?? null);

  return useMemo(
    () => ({ ...statusInfo, actionLoading }),
    [statusInfo, actionLoading]
  );
}
