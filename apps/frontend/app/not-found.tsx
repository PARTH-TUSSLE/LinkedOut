import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="text-display font-bold text-text-primary">404</h1>
        <p className="mt-3 text-body text-text-secondary">Page not found</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}
