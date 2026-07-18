"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyProfile } from "@/store/thunks/profileThunks";
import { setProfile, setLoading } from "@/store/slices/profileSlice";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileEducation } from "@/components/profile/ProfileEducation";
import { ProfileWorkHistory } from "@/components/profile/ProfileWorkHistory";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";
import { ResumeDownloadButton } from "@/components/profile/ResumeDownloadButton";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";

export default function MyProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(fetchMyProfile())
      .unwrap()
      .then((result) => {
        dispatch(setProfile(result.profile));
      })
      .catch(() => {})
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="p-4">
        <ErrorState message="Could not load profile" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="relative rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ProfilePictureUpload user={user} />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold text-text-primary">{user.name}</h1>
            <p className="text-sm text-text-secondary">@{user.username}</p>
            {profile.occupationStatus && (
              <p className="mt-1 text-sm font-medium text-text-primary">
                {profile.occupationStatus}
              </p>
            )}
            {profile.location && (
              <p className="text-sm text-text-muted">{profile.location}</p>
            )}
          </div>
          <div className="flex gap-2">
            <ResumeDownloadButton userId={user.id} />
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">
                <Pencil size={16} />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ProfileBio bio={profile.bio} />
      <ProfileEducation education={profile.education} />
      <ProfileWorkHistory workHistory={profile.workHistory} />
    </div>
  );
}
