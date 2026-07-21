"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-2">
      <Link href={`/profile/${comment.creator?.id}`}>
        <Avatar
          src={comment.creator?.profilePicture}
          alt={comment.creator?.name || "User"}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0 rounded-lg bg-card-hover px-3 py-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${comment.creator?.id}`}
            className="text-body-sm font-medium text-text-primary hover:text-accent transition-colors"
          >
            {comment.creator?.name || "Unknown"}
          </Link>
          <span className="text-caption text-text-tertiary">now</span>
        </div>
        <p className="text-body-sm text-text-secondary mt-0.5">{comment.body}</p>
      </div>
    </div>
  );
}
