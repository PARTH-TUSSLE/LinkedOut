import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Connection, ConnectedUser, Profile } from "@/types";

export interface ConnectionsState {
  allUsers: Profile[];
  sentRequests: Connection[];
  receivedRequests: Connection[];
  connections: ConnectedUser[];
  isLoading: boolean;
}

const initialState: ConnectionsState = {
  allUsers: [],
  sentRequests: [],
  receivedRequests: [],
  connections: [],
  isLoading: false,
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
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
