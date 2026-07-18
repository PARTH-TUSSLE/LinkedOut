"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyProfile } from "@/store/thunks/profileThunks";
import { setProfile } from "@/store/slices/profileSlice";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ProfileEditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchMyProfile())
        .unwrap()
        .then((result) => dispatch(setProfile(result.profile)))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <ErrorState message="Could not load profile" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/profile")}
        >
          <ArrowLeft size={16} />
          Back to profile
        </Button>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Edit profile
        </h1>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <ProfileEditForm
          profile={profile}
          onSuccess={() => router.push("/profile")}
        />
      </div>
    </div>
  );
}
