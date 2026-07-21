"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { uploadProfilePicture } from "@/store/thunks/profileThunks";
import { setUser } from "@/store/slices/authSlice";
import { getFileUrl } from "@/lib/utils";

interface ProfilePictureUploadProps {
  user: {
    id: number;
    name: string;
    profilePicture?: string | null;
  };
}

export function ProfilePictureUpload({ user }: ProfilePictureUploadProps) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const url = getFileUrl(user.profilePicture);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await dispatch(uploadProfilePicture(file)).unwrap();
      dispatch(setUser(result));
    } catch {
      // handled by thunk
    }
  };

  return (
    <div className="relative shrink-0">
      <div className="h-20 w-20 overflow-hidden rounded-full bg-card-hover ring-2 ring-border">
        {url ? (
          <Image
            src={url}
            alt={user.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-h3 font-medium text-text-tertiary">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-text-tertiary shadow-sm transition-all hover:bg-card-hover hover:text-text-secondary"
      >
        <Camera size={12} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
