"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/config/axios";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 32,
};

export function Avatar({ src, alt = "", size = "md", className }: AvatarProps) {
  const imageUrl = getFileUrl(src || null);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg",
        sizeMap[size],
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <User className="text-text-muted" size={iconSizeMap[size]} />
      )}
    </div>
  );
}
