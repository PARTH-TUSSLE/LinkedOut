import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import type { Connection, ConnectedUser, Profile } from "@/types";

export const fetchAllUsers = createAsyncThunk(
  "connections/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getAllUsers?limit=50");
      const profiles = response.data.profiles || [];
      return profiles as Profile[];
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
      return { receiverId, msg: response.data.msg };
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
      const reqs = response.data.reqs || [];
      return reqs as Connection[];
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
      const reqs = response.data.reqs || [];
      return reqs as Connection[];
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
      await api.post("/user/connection_Req_Status", {
        connectionId,
        actionType: "accept",
      });
      return connectionId;
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
