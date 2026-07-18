"use client";

import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  return { user, isAuthenticated, isLoading };
}
