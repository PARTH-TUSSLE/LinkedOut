"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-border-danger bg-danger-subtle">
          <AlertTriangle size={24} className="text-danger" />
        </div>
        <h1 className="text-h3 text-text-primary">Something went wrong</h1>
        <p className="mt-1.5 text-body-sm text-text-secondary">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
