import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

const variants = {
  default: "bg-card-hover text-text-secondary border border-border",
  accent: "bg-accent-subtle text-accent border border-border-accent",
  success: "bg-success-subtle text-success border border-success/15",
  warning: "bg-warning-subtle text-warning border border-warning/15",
  danger: "bg-danger-subtle text-danger border border-border-danger",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-caption font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
