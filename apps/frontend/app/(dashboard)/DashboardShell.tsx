"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/store/thunks/authThunks";
import { setCredentials } from "@/store/slices/authSlice";
import { STORAGE_KEYS } from "@/config/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Spinner } from "@/components/ui/Spinner";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.replace("/signin");
      return;
    }

    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        dispatch(setCredentials({ user: JSON.parse(storedUser), token }));
      } catch {}
    }

    dispatch(checkAuth()).catch(() => {
      router.replace("/signin");
    });
  }, [dispatch, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-0">
        <Navbar />
        <main className="flex-1 overflow-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
