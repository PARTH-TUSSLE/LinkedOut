"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyProfile } from "@/store/thunks/profileThunks";
import { setProfile, setLoading } from "@/store/slices/profileSlice";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileEducation } from "@/components/profile/ProfileEducation";
import { ProfileWorkHistory } from "@/components/profile/ProfileWorkHistory";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";

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
        <Spinner />
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
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6"
    >
      <Card className="p-5 sm:p-6 shadow-md">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ProfilePictureUpload user={user} />
          <ProfileHeader user={user} profile={profile} isOwn />
        </div>
      </Card>
      <ProfileBio bio={profile.bio} />
      <ProfileEducation education={profile.education} />
      <ProfileWorkHistory workHistory={profile.workHistory} />
    </motion.div>
  );
}
