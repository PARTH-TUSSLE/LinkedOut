"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/thunks/profileThunks";
import { setProfile, setLoading } from "@/store/slices/profileSlice";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileEducation } from "@/components/profile/ProfileEducation";
import { ProfileWorkHistory } from "@/components/profile/ProfileWorkHistory";
import { ConnectButton } from "@/components/connections/ConnectButton";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const userId = Number(params.userId);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!userId) return;
    dispatch(setLoading(true));
    dispatch(fetchUserProfile(userId))
      .unwrap()
      .then((result) => {
        dispatch(setProfile({ ...result.profile, user: result.user }));
      })
      .catch(() => {})
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <ErrorState message="User not found" />
      </div>
    );
  }

  const isOwn = currentUser?.id === profile.userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6"
    >
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ProfileHeader user={{ id: profile.userId, ...profile.user! }} profile={profile} />
          {!isOwn && <ConnectButton userId={profile.userId} />}
        </div>
      </Card>
      <ProfileBio bio={profile.bio} />
      <ProfileEducation education={profile.education} />
      <ProfileWorkHistory workHistory={profile.workHistory} />
    </motion.div>
  );
}
