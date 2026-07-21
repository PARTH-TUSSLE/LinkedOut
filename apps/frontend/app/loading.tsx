import { Spinner } from "@/components/ui/Spinner";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={22} />
        <p className="text-body-sm text-text-tertiary">Loading...</p>
      </div>
    </div>
  );
}
