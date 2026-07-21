"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border-danger bg-danger-subtle text-danger">
        <AlertCircle size={20} />
      </div>
      <h3 className="text-body-sm font-medium text-text-primary">Error</h3>
      <p className="mt-1 text-body-sm text-text-secondary">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
