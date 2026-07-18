"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { STORAGE_KEYS } from "@/config/constants";
import { Spinner } from "@/components/ui/Spinner";

export function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token || isAuthenticated) {
      router.replace("/dashboard");
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size={24} />
      </div>
    );
  }

  return <>{children}</>;
}
