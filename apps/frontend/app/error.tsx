"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-text-secondary">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
