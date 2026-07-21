"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-body-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-9 w-full rounded-lg border bg-card px-3 text-body-sm text-text-primary placeholder:text-text-tertiary transition-all duration-150",
            "focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring",
            error
              ? "border-danger/60 focus:border-danger/60 focus:ring-danger/20"
              : "border-border hover:border-border-hover",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-caption text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="text-caption text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
