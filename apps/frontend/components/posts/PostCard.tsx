"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useAppSelector } from "@/store/hooks";
import { formatDate, getFileUrl } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const isOwn = user?.id === post.creatorId;
  const mediaUrl = getFileUrl(post.media);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${post.creator?.id}`}>
              <Avatar src={post.creator?.profilePicture} alt={post.creator?.name || "User"} size="md" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.creator?.id}`}
                  className="text-body-sm font-medium text-text-primary hover:text-accent transition-colors"
                >
                  {post.creator?.name || "Unknown"}
                </Link>
                {post.fileType && (
                  <Badge variant="accent" className="text-[10px] px-1.5 py-0">{post.fileType}</Badge>
                )}
              </div>
              <p className="text-caption text-text-tertiary">@{post.creator?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-caption text-text-tertiary whitespace-nowrap">
              {formatDate(post.createdAt)}
            </span>
            {isOwn && onDelete && (
              <DropdownMenu
                trigger={
                  <button className="rounded-lg p-1 text-text-tertiary hover:text-text-primary hover:bg-card-hover transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                }
                items={[
                  {
                    label: "Delete post",
                    icon: <Trash2 size={14} />,
                    onClick: () => onDelete(post.postId),
                    danger: true,
                  },
                ]}
                align="end"
              />
            )}
          </div>
        </div>

        <p className="mt-3 text-body-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>

        {mediaUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card-hover">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
          <LikeButton postId={post.postId} likedByUser={post.likedByUser ?? false} likes={post.likes} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-text-tertiary hover:text-text-secondary"
          >
            <MessageCircle size={15} />
            {post.commentCount ?? 0}
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 border-t border-border pt-4">
            <CommentSection postId={post.postId} />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
