"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch } from "@/store/hooks";
import { uploadProfilePicture } from "@/store/thunks/profileThunks";
import { setUser } from "@/store/slices/authSlice";
import { addToast } from "@/store/slices/uiSlice";
import type { User } from "@/types";

interface ProfilePictureUploadProps {
  user: User;
}

export function ProfilePictureUpload({ user }: ProfilePictureUploadProps) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      dispatch(addToast({ message: "Please select an image file", type: "error" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(addToast({ message: "File too large. Max 5MB", type: "error" }));
      return;
    }

    setUploading(true);
    try {
      const updatedUser = await dispatch(uploadProfilePicture(file)).unwrap();
      dispatch(setUser(updatedUser));
      dispatch(addToast({ message: "Profile picture updated", type: "success" }));
    } catch (err: any) {
      dispatch(
        addToast({ message: err || "Failed to upload picture", type: "error" })
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar
        src={user.profilePicture}
        alt={user.name}
        size="lg"
        className="ring-4 ring-white"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
