import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-h3 text-text-primary">Create your account</h1>
          <p className="mt-1.5 text-body-sm text-text-secondary">
            Join LinkedOut today
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <SignUpForm />
        </div>
        <p className="mt-6 text-center text-body-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
