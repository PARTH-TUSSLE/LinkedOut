"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAppDispatch } from "@/store/hooks";
import {
  uploadProfilePicture,
  removeProfilePicture,
} from "@/store/thunks/profileThunks";
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
  const [removing, setRemoving] = useState(false);

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

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const updatedUser = await dispatch(removeProfilePicture()).unwrap();
      dispatch(setUser(updatedUser));
      dispatch(addToast({ message: "Profile picture removed", type: "success" }));
    } catch (err: any) {
      dispatch(
        addToast({ message: err || "Failed to remove picture", type: "error" })
      );
    } finally {
      setRemoving(false);
    }
  };

  const hasPicture =
    user.profilePicture &&
    user.profilePicture !== "default.jpeg" &&
    user.profilePicture !== "";

  return (
    <div className="relative inline-block">
      <Avatar
        src={user.profilePicture}
        alt={user.name}
        size="lg"
        className="ring-4 ring-white"
      />
      <div className="absolute -bottom-1 -right-1 flex gap-0.5">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>
        {hasPicture && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-danger text-white shadow-sm transition-colors hover:bg-danger/80 disabled:opacity-50"
          >
            {removing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <X size={14} />
            )}
          </button>
        )}
      </div>
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
