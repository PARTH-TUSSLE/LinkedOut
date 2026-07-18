"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/store/thunks/authThunks";
import { setCredentials } from "@/store/slices/authSlice";
import { Spinner } from "@/components/ui/Spinner";
import { STORAGE_KEYS } from "@/config/constants";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      router.replace("/signin");
      return;
    }

    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        dispatch(
          setCredentials({
            user: JSON.parse(storedUser),
            token,
          })
        );
      } catch {}
    }

    dispatch(checkAuth())
      .unwrap()
      .then((result) => {
        dispatch(setCredentials(result));
      })
      .catch(() => {
        router.replace("/signin");
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [dispatch, router]);

  if (isChecking && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size={24} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
