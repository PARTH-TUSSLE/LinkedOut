import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
}

export function Card({ children, className, hover = false, elevated = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        hover && "hover:border-border-hover hover:bg-card-hover hover:shadow-md",
        elevated && "shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
