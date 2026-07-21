"use client";

import { useState, useRef } from "react";
import { Image, Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPost } from "@/store/thunks/postsThunks";
import { addPost } from "@/store/slices/postsSlice";

export function CreatePostForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && !file) return;
    setIsSubmitting(true);

    try {
      const result = await dispatch(
        createPost({ body: content, media: file ?? undefined })
      ).unwrap();
      dispatch(addPost(result));
      setContent("");
      setFile(null);
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
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar src={user?.profilePicture} alt={user?.name || "You"} size="md" />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share something with your network..."
            rows={2}
            className="w-full resize-none bg-transparent text-body-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />

          {file && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-card-hover px-3 py-1.5">
              <span className="flex-1 truncate text-body-sm text-text-secondary">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-body-sm text-text-tertiary hover:text-text-secondary hover:bg-card-hover transition-colors"
            >
              <Image size={15} />
              Media
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!content.trim() && !file}
            >
              <Send size={14} />
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
