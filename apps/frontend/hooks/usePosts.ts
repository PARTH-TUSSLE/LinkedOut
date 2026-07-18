"use client";

import { useAppSelector } from "@/store/hooks";

export function usePosts() {
  const { posts, isLoading, isCreating, pagination, comments } =
    useAppSelector((state) => state.posts);
  return { posts, isLoading, isCreating, pagination, comments };
}
