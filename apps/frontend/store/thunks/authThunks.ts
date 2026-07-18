import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import { STORAGE_KEYS } from "@/config/constants";
import type { User } from "@/types";
import type { RootState } from "@/store";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    data: { username?: string; email?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/signin", data);
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user: user as User, token: token as string };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Sign in failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/signup", data);
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user: user as User, token: token as string };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Sign up failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return rejectWithValue("No token");

      const response = await api.get("/verify-token");
      const user = response.data.user as User;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user, token };
    } catch (error: any) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return rejectWithValue("Token invalid");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
);
