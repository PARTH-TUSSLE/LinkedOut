"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
}
