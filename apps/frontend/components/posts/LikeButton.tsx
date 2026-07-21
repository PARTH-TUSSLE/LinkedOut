"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { likePost, unlikePost } from "@/store/thunks/postsThunks";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: number;
  likedByUser: boolean;
  likes: number;
}

export function LikeButton({ postId, likedByUser: initialLiked, likes: initialLikes }: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const [optimisticLiked, setOptimisticLiked] = useState(initialLiked);
  const [optimisticCount, setOptimisticCount] = useState(initialLikes);

  const handleLike = async () => {
    const wasLiked = optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      if (wasLiked) {
        await dispatch(unlikePost(postId)).unwrap();
      } else {
        await dispatch(likePost(postId)).unwrap();
      }
    } catch {
      setOptimisticLiked(wasLiked);
      setOptimisticCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={cn(
        "transition-colors",
        optimisticLiked
          ? "text-danger hover:text-danger/80"
          : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      <Heart size={15} className={cn(optimisticLiked && "fill-current")} />
      {optimisticCount}
    </Button>
  );
}
