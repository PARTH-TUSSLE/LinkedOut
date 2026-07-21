import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-7 w-7 text-caption",
  md: "h-9 w-9 text-body-sm",
  lg: "h-12 w-12 text-body",
  xl: "h-16 w-16 text-h4",
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const url = getFileUrl(src);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-card-hover ring-1 ring-border",
        sizes[size],
        className
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-text-secondary">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
