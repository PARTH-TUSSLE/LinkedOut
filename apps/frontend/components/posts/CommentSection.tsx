"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchComments,
  addComment as addCommentThunk,
} from "@/store/thunks/postsThunks";
import { setComments, addComment } from "@/store/slices/postsSlice";
import { addToast } from "@/store/slices/uiSlice";
import type { Comment } from "@/types";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const comments = useAppSelector(
    (state) => state.posts.comments[postId]
  );
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!comments) {
      setIsLoading(true);
      dispatch(fetchComments(postId))
        .unwrap()
        .then((result) => {
          dispatch(
            setComments({ postId, comments: result.comments })
          );
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, postId, comments]);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setIsSending(true);
    try {
      const result = await dispatch(
        addCommentThunk({ postId, commentBody: body.trim() })
      ).unwrap();
      dispatch(addComment({ postId, comment: result.comment }));
      setBody("");
    } catch {
      dispatch(addToast({ message: "Failed to add comment", type: "error" }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-border px-4 py-3">
      <div className="mb-3 flex items-start gap-2">
        <Avatar src={user?.profilePicture} alt="" size="sm" />
        <div className="flex flex-1 items-center gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            className="h-9 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!body.trim() || isSending}
            className="rounded-lg p-1.5 text-primary transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No comments"
          description="Be the first to comment"
        />
      )}
    </div>
  );
}
