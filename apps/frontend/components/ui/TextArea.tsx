"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-card px-3 py-2 text-body-sm text-text-primary placeholder:text-text-tertiary transition-all duration-150 resize-none",
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
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
