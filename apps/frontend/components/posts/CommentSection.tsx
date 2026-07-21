"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addComment } from "@/store/thunks/postsThunks";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await dispatch(addComment({ postId, commentBody: content })).unwrap();
      setContent("");
    } catch {
      // handled by thunk
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Avatar src={user?.profilePicture} alt={user?.name || "You"} size="sm" />
        <div className="flex flex-1 items-center gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="flex-1 h-8 rounded-lg border border-border bg-card-hover px-3 text-body-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent/40 focus:ring-2 focus:ring-ring transition-all"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSubmit}
            disabled={!content.trim()}
            loading={isSubmitting}
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
