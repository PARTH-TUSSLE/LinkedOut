import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        hover && "transition-all duration-150 hover:border-border-hover hover:bg-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
