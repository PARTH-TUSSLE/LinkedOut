"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const variantStyles = {
  primary:
    "bg-accent text-accent-text shadow-xs hover:bg-accent-hover active:scale-[0.97]",
  secondary:
    "bg-card text-text-primary border border-border hover:bg-card-hover hover:border-border-hover active:scale-[0.97]",
  outline:
    "border border-border text-text-secondary hover:border-border-hover hover:text-text-primary hover:bg-card-hover active:scale-[0.97]",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-card-hover active:scale-[0.97]",
  danger:
    "bg-danger-subtle text-danger border border-border-danger hover:bg-danger/10 active:scale-[0.97]",
};

const sizeStyles = {
  sm: "h-8 px-3 text-caption gap-1.5",
  md: "h-9 px-4 text-body-sm gap-2",
  lg: "h-10 px-5 text-body-sm gap-2",
  xl: "h-12 px-7 text-body gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-40",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
