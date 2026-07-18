import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Connect with professionals
          <span className="block text-primary">without exaggeration</span>
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          LinkedOut is a professional networking platform built for meaningful
          connections. Showcase your experience, share your insights, and grow
          your network.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            Join now
          </Link>
          <Link
            href="/signin"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-8 text-base font-medium text-text-primary transition-all hover:bg-bg active:scale-[0.98]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
