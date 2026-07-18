"use client";

import { useState, useRef } from "react";
import { Image, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPost } from "@/store/thunks/postsThunks";
import { addPost, setCreating } from "@/store/slices/postsSlice";
import { addToast } from "@/store/slices/uiSlice";

export function CreatePostForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isCreating } = useAppSelector((state) => state.posts);
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!body.trim()) {
      dispatch(addToast({ message: "Post cannot be empty", type: "error" }));
      return;
    }

    dispatch(setCreating(true));
    try {
      const result = await dispatch(
        createPost({ body: body.trim(), media: media || undefined })
      ).unwrap();
      dispatch(addPost(result));
      setBody("");
      setMedia(null);
      setPreview(null);
      dispatch(addToast({ message: "Post created", type: "success" }));
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to create post",
          type: "error",
        })
      );
    } finally {
      dispatch(setCreating(false));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar
          src={user?.profilePicture}
          alt={user?.name || ""}
          size="md"
        />
        <div className="flex-1">
          <textarea
            placeholder="What do you want to share?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border-0 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />

          {preview && (
            <div className="relative mt-2 inline-block">
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover"
              />
              <button
                onClick={() => {
                  setMedia(null);
                  setPreview(null);
                }}
                className="absolute -right-2 -top-2 rounded-full bg-surface p-0.5 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg"
            >
              <Image size={18} />
              Media
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button size="sm" onClick={handleSubmit} loading={isCreating}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
