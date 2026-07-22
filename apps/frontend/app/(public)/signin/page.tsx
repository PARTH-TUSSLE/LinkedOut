import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-h3 text-text-primary">Welcome back</h1>
          <p className="mt-1.5 text-body-sm text-text-secondary">
            Sign in to your account
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          <SignInForm />
        </div>
        <p className="mt-6 text-center text-body-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
