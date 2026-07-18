"use client";

import { useState } from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { formatDate, getFileUrl } from "@/lib/utils";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePost } from "@/store/thunks/postsThunks";
import { removePost } from "@/store/slices/postsSlice";
import { addToast } from "@/store/slices/uiSlice";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === post.creatorId;

  const mediaUrl = post.media ? getFileUrl(post.media) ?? "" : "";
  const isImage = ["jpeg", "png", "gif", "webp", "jpg"].includes(post.fileType);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deletePost(post.postId)).unwrap();
      dispatch(removePost(post.postId));
      dispatch(addToast({ message: "Post deleted", type: "success" }));
    } catch {
      dispatch(addToast({ message: "Failed to delete post", type: "error" }));
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card className="p-0">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar
              src={post.creator?.profilePicture}
              alt={post.creator?.name || "User"}
              size="md"
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {post.creator?.name || "Unknown"}
              </p>
              <p className="text-xs text-text-muted">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="rounded p-1 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-text-primary">
          {post.body}
        </p>

        {mediaUrl && isImage && (
          <div className="relative mt-3 overflow-hidden rounded-lg">
            <Image
              src={mediaUrl}
              alt="Post media"
              width={600}
              height={400}
              className="w-full object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-2">
        <LikeButton post={post} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className={showComments ? "text-primary" : ""}
        >
          <MessageCircle size={16} />
          {post.commentCount != null && post.commentCount > 0
            ? `${post.commentCount} Comment${post.commentCount !== 1 ? "s" : ""}`
            : "Comments"}
        </Button>
      </div>

      {showComments && <CommentSection postId={post.postId} />}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </Card>
  );
}
