import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import type { ConnectionStatus, StatusInfo } from "@/types";
import { ConnectionStatus as CS } from "@/types";

const selectConnectionsSlice = (state: RootState) => state.connections;
const selectAuthSlice = (state: RootState) => state.auth;

export const selectConnectionMap = createSelector(
  [selectConnectionsSlice],
  (connectionsState) => {
    const map = new Map<number, StatusInfo>();

    for (const conn of connectionsState.connections) {
      map.set(conn.user.id, {
        status: CS.CONNECTED,
        connectionId: conn.connectionId,
        direction: null,
        createdAt: conn.connectedAt,
      });
    }

    for (const req of connectionsState.sentRequests) {
      if (req.status === "pending") {
        map.set(req.receiverId, {
          status: CS.PENDING_SENT,
          connectionId: req.connectionId,
          direction: "sent",
          createdAt: req.createdAt,
        });
      }
    }

    for (const req of connectionsState.receivedRequests) {
      if (!map.has(req.senderId)) {
        map.set(req.senderId, {
          status: CS.PENDING_RECEIVED,
          connectionId: req.connectionId,
          direction: "received",
          createdAt: req.createdAt,
        });
      }
    }

    return map;
  }
);

export const selectAuthUserId = createSelector(
  [selectAuthSlice],
  (auth) => auth.user?.id ?? null
);

export const makeSelectConnectionStatus = () =>
  createSelector(
    [selectConnectionMap, selectAuthUserId, (_state: RootState, targetUserId: number) => targetUserId],
    (connectionMap, currentUserId, targetUserId) => {
      if (!currentUserId || currentUserId === targetUserId || !targetUserId) {
        return { status: CS.IDLE as ConnectionStatus, connectionId: null, direction: null, createdAt: null };
      }
      return connectionMap.get(targetUserId) ?? { status: CS.IDLE as ConnectionStatus, connectionId: null, direction: null, createdAt: null };
    }
  );
