import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Connection, ConnectedUser, Profile } from "@/types";
import {
  fetchReceivedRequests,
  fetchSentRequests,
  fetchConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  disconnectConnection,
} from "@/store/thunks/connectionsThunks";

export interface ConnectionsState {
  allUsers: Profile[];
  sentRequests: Connection[];
  receivedRequests: Connection[];
  connections: ConnectedUser[];
  isLoading: boolean;
  actionLoading: Record<number, string>;
  tempIdCounter: number;
}

const initialState: ConnectionsState = {
  allUsers: [],
  sentRequests: [],
  receivedRequests: [],
  connections: [],
  isLoading: false,
  actionLoading: {},
  tempIdCounter: 0,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setAllUsers(state, action: PayloadAction<Profile[]>) {
      state.allUsers = action.payload;
    },
    setSentRequests(state, action: PayloadAction<Connection[]>) {
      state.sentRequests = action.payload;
    },
    setReceivedRequests(state, action: PayloadAction<Connection[]>) {
      state.receivedRequests = action.payload;
    },
    setConnections(state, action: PayloadAction<ConnectedUser[]>) {
      state.connections = action.payload;
    },
    removeSentRequest(state, action: PayloadAction<number>) {
      state.sentRequests = state.sentRequests.filter(
        (r) => r.connectionId !== action.payload
      );
    },
    removeReceivedRequest(state, action: PayloadAction<number>) {
      state.receivedRequests = state.receivedRequests.filter(
        (r) => r.connectionId !== action.payload
      );
    },
    setConnectionsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    optimisticAddSentRequest: {
      prepare(payload: { receiverId: number; name: string; username: string }) {
        return { payload };
      },
      reducer(state, action: PayloadAction<{ receiverId: number; name: string; username: string }>) {
        state.tempIdCounter -= 1;
        const temp: Connection = {
          connectionId: state.tempIdCounter,
          senderId: 0,
          receiverId: action.payload.receiverId,
          status: "pending",
          createdAt: new Date().toISOString(),
          receiver: {
            id: action.payload.receiverId,
            name: action.payload.name,
            username: action.payload.username,
          },
        };
        state.sentRequests.push(temp);
      },
    },
    optimisticRemoveSentRequest(state, action: PayloadAction<number>) {
      state.sentRequests = state.sentRequests.filter(
        (r) => r.connectionId !== action.payload
      );
    },
    optimisticRemoveReceivedRequest(state, action: PayloadAction<number>) {
      state.receivedRequests = state.receivedRequests.filter(
        (r) => r.connectionId !== action.payload
      );
    },
    optimisticAddConnection(state, action: PayloadAction<ConnectedUser>) {
      if (!state.connections.some((c) => c.connectionId === action.payload.connectionId)) {
        state.connections.push(action.payload);
      }
    },
    optimisticRemoveConnection(state, action: PayloadAction<number>) {
      state.connections = state.connections.filter(
        (c) => c.connectionId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.receivedRequests = action.payload;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(sendConnectionRequest.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = "sending";
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const { receiverId, connection } = action.payload;
        delete state.actionLoading[receiverId];
        // Replace optimistic entry (negative connectionId) with real one
        const idx = state.sentRequests.findIndex(
          (r) => r.connectionId < 0 && r.receiverId === receiverId
        );
        if (idx !== -1) {
          state.sentRequests[idx] = connection;
        } else {
          state.sentRequests.push(connection);
        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        const receiverId = action.meta.arg;
        delete state.actionLoading[receiverId];
        // Remove optimistic entries (negative connectionIds) for this receiver
        state.sentRequests = state.sentRequests.filter(
          (r) => !(r.connectionId < 0 && r.receiverId === receiverId)
        );
      })
      .addCase(acceptConnectionRequest.pending, (state, action) => {
        const req = state.receivedRequests.find(
          (r) => r.connectionId === action.meta.arg
        );
        if (req) state.actionLoading[req.senderId] = "accepting";
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const { connectionId, connection } = action.payload;
        state.receivedRequests = state.receivedRequests.filter(
          (r) => r.connectionId !== connectionId
        );
        delete state.actionLoading[connection.senderId];
        if (!state.connections.some((c) => c.connectionId === connection.connectionId)) {
          state.connections.push({
            connectionId: connection.connectionId,
            connectedAt: connection.createdAt,
            user: {
              id: connection.sender!.id,
              name: connection.sender!.name,
              username: connection.sender!.username,
              email: "",
              profilePicture: connection.sender!.profilePicture || "",
            },
          });
        }
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        const req = state.receivedRequests.find(
          (r) => r.connectionId === connectionId
        );
        if (req) delete state.actionLoading[req.senderId];
      })
      .addCase(rejectConnectionRequest.pending, (state, action) => {
        const req = state.receivedRequests.find(
          (r) => r.connectionId === action.meta.arg
        );
        if (req) state.actionLoading[req.senderId] = "rejecting";
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        const connectionId = action.payload;
        const req = state.receivedRequests.find(
          (r) => r.connectionId === connectionId
        );
        state.receivedRequests = state.receivedRequests.filter(
          (r) => r.connectionId !== connectionId
        );
        if (req) delete state.actionLoading[req.senderId];
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        const req = state.receivedRequests.find(
          (r) => r.connectionId === connectionId
        );
        if (req) delete state.actionLoading[req.senderId];
      })
      .addCase(cancelConnectionRequest.pending, (state, action) => {
        const req = state.sentRequests.find(
          (r) => r.connectionId === action.meta.arg
        );
        if (req) state.actionLoading[req.receiverId] = "cancelling";
      })
      .addCase(cancelConnectionRequest.fulfilled, (state, action) => {
        const connectionId = action.payload;
        const req = state.sentRequests.find(
          (r) => r.connectionId === connectionId
        );
        state.sentRequests = state.sentRequests.filter(
          (r) => r.connectionId !== connectionId
        );
        if (req) delete state.actionLoading[req.receiverId];
      })
      .addCase(cancelConnectionRequest.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        const req = state.sentRequests.find(
          (r) => r.connectionId === connectionId
        );
        if (req) delete state.actionLoading[req.receiverId];
      })
      .addCase(disconnectConnection.pending, (state, action) => {
        const conn = state.connections.find(
          (c) => c.connectionId === action.meta.arg
        );
        if (conn) state.actionLoading[conn.user.id] = "disconnecting";
      })
      .addCase(disconnectConnection.fulfilled, (state, action) => {
        const connectionId = action.payload;
        const conn = state.connections.find(
          (c) => c.connectionId === connectionId
        );
        state.connections = state.connections.filter(
          (c) => c.connectionId !== connectionId
        );
        if (conn) delete state.actionLoading[conn.user.id];
      })
      .addCase(disconnectConnection.rejected, (state, action) => {
        const connectionId = action.meta.arg;
        const conn = state.connections.find(
          (c) => c.connectionId === connectionId
        );
        if (conn) delete state.actionLoading[conn.user.id];
      });
  },
});

export const {
  setAllUsers,
  setSentRequests,
  setReceivedRequests,
  setConnections,
  removeSentRequest,
  removeReceivedRequest,
  setConnectionsLoading,
  optimisticAddSentRequest,
  optimisticRemoveSentRequest,
  optimisticRemoveReceivedRequest,
  optimisticAddConnection,
  optimisticRemoveConnection,
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
