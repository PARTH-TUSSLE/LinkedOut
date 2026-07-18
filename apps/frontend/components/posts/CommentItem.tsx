"use client";

import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteComment } from "@/store/thunks/postsThunks";
import { removeComment } from "@/store/slices/postsSlice";
import { addToast } from "@/store/slices/uiSlice";
import type { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
  postId: number;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isOwner = user?.id === comment.creatorId;

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteComment({ postId, commentId: comment.commentId })
      ).unwrap();
      dispatch(removeComment({ postId, commentId: comment.commentId }));
    } catch {
      dispatch(addToast({ message: "Failed to delete comment", type: "error" }));
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Avatar
        src={comment.creator?.profilePicture}
        alt={comment.creator?.name || "User"}
        size="sm"
      />
      <div className="flex-1">
        <div className="rounded-lg bg-bg p-2">
          <p className="text-xs font-medium text-text-primary">
            {comment.creator?.name || "Unknown"}
          </p>
          <p className="text-xs text-text-secondary">{comment.body}</p>
        </div>
      </div>
      {isOwner && (
        <button
          onClick={handleDelete}
          className="mt-1 rounded p-0.5 text-text-muted transition-colors hover:text-danger"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}
