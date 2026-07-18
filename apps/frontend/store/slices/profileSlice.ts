import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "@/types";

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUpdating(state, action: PayloadAction<boolean>) {
      state.isUpdating = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
    },
  },
});

export const { setProfile, setLoading, setUpdating, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
