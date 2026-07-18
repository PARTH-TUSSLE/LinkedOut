"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { likePost, unlikePost } from "@/store/thunks/postsThunks";
import { updatePostLikes } from "@/store/slices/postsSlice";
import { addToast } from "@/store/slices/uiSlice";
import type { Post } from "@/types";

interface LikeButtonProps {
  post: Post;
}

export function LikeButton({ post }: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const isLiked = post.likedByUser || false;

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        await dispatch(unlikePost(post.postId)).unwrap();
        dispatch(
          updatePostLikes({
            postId: post.postId,
            likes: post.likes - 1,
            likedByUser: false,
          })
        );
      } else {
        await dispatch(likePost(post.postId)).unwrap();
        dispatch(
          updatePostLikes({
            postId: post.postId,
            likes: post.likes + 1,
            likedByUser: true,
          })
        );
      }
    } catch {
      dispatch(
        addToast({ message: "Failed to update like", type: "error" })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      loading={isLoading}
      className={isLiked ? "text-primary" : ""}
    >
      <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
      {post.likes > 0 ? post.likes : "Like"}
    </Button>
  );
}
