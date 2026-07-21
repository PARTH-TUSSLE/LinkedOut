import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 18, className }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-border border-t-accent", className)}
      style={{ width: size, height: size }}
    />
  );
}
