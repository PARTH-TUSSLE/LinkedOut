"use client";

import { PostCard } from "./PostCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { deletePost } from "@/store/thunks/postsThunks";
import { removePost } from "@/store/slices/postsSlice";
import type { Post } from "@/types";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onRetry?: () => void;
}

export function PostList({ posts, isLoading, onRetry }: PostListProps) {
  const dispatch = useAppDispatch();

  const handleDelete = async (postId: number) => {
    try {
      await dispatch(deletePost(postId)).unwrap();
      dispatch(removePost(postId));
    } catch {
      // handled
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={20} />}
        title="No posts yet"
        description="Be the first to share something with your network."
      />
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
}
