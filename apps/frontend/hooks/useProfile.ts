"use client";

import { useAppSelector } from "@/store/hooks";

export function useProfile() {
  const { profile, isLoading, isUpdating } = useAppSelector(
    (state) => state.profile
  );
  return { profile, isLoading, isUpdating };
}
