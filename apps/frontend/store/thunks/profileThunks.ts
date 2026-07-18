import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import type { Profile, User } from "@/types";

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/get_user_and_profile");
      return {
        user: response.data.user as User,
        profile: response.data.profile as Profile,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch profile"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/profile/${userId}`);
      return {
        user: response.data.user as User,
        profile: response.data.profile as Profile,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch user profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (
    data: {
      bio?: string;
      occupationStatus?: string;
      location?: string;
      education: Array<{
        school: string;
        degree: string;
        fieldOfStudy: string;
        startYear?: number | null;
        endYear?: number | null;
      }>;
      workHistory: Array<{
        company: string;
        location?: string;
        position: string;
        years: string;
        startDate?: string | null;
        endDate?: string | null;
        description?: string;
      }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        bio: data.bio,
        occupationStatus: data.occupationStatus,
        location: data.location,
        education: data.education.map((e) => ({
          school: e.school || "",
          degree: e.degree || "",
          fieldOfStudy: e.fieldOfStudy || "",
          startDate: e.startYear ? new Date(e.startYear, 0, 1).toISOString() : null,
          endDate: e.endYear ? new Date(e.endYear, 0, 1).toISOString() : null,
        })),
        workHistory: data.workHistory.map((w) => ({
          company: w.company || "",
          location: w.location || "",
          position: w.position || "",
          years: w.years || "",
          startDate: w.startDate ? new Date(w.startDate).toISOString() : null,
          endDate: w.endDate ? new Date(w.endDate).toISOString() : null,
          description: w.description || "",
        })),
      };
      const response = await api.post("/update_user_profile", body);
      return response.data.updatedProfile as Profile;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update profile"
      );
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "profile/updateUser",
  async (
    data: { username?: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/update_user", data);
      return response.data.updatedUser as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update user info"
      );
    }
  }
);

export const removeProfilePicture = createAsyncThunk(
  "profile/removePicture",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/remove_profile_picture");
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to remove picture"
      );
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadPicture",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      const response = await api.post("/update_profile_picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to upload picture"
      );
    }
  }
);
