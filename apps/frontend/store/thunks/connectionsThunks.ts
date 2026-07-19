import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import type { Connection, ConnectedUser, Profile } from "@/types";

export const fetchAllUsers = createAsyncThunk(
  "connections/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getAllUsers?limit=50");
      return (response.data.profiles || []) as Profile[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch users"
      );
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "connections/sendRequest",
  async (receiverId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/send_request_connection", {
        receiverId,
      });
      return { receiverId, connection: response.data.connection as Connection };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to send request"
      );
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  "connections/fetchSent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/my_sent_reqs");
      return (response.data.reqs || []) as Connection[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch sent requests"
      );
    }
  }
);

export const fetchReceivedRequests = createAsyncThunk(
  "connections/fetchReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/my_received_reqs");
      return (response.data.reqs || []) as Connection[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch received requests"
      );
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "connections/accept",
  async (connectionId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/connection_Req_Status", {
        connectionId,
        actionType: "accept",
      });
      return {
        connectionId,
        connection: response.data.connection as Connection,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to accept request"
      );
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  "connections/reject",
  async (connectionId: number, { rejectWithValue }) => {
    try {
      await api.post("/user/connection_Req_Status", {
        connectionId,
        actionType: "reject",
      });
      return connectionId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to reject request"
      );
    }
  }
);

export const cancelConnectionRequest = createAsyncThunk(
  "connections/cancel",
  async (connectionId: number, { rejectWithValue }) => {
    try {
      await api.post("/user/cancel_request", { connectionId });
      return connectionId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to cancel request"
      );
    }
  }
);

export const disconnectConnection = createAsyncThunk(
  "connections/disconnect",
  async (connectionId: number, { rejectWithValue }) => {
    try {
      await api.post("/user/disconnect", { connectionId });
      return connectionId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to disconnect"
      );
    }
  }
);

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/connections?limit=50");
      return (response.data.connections || []) as ConnectedUser[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch connections"
      );
    }
  }
);
