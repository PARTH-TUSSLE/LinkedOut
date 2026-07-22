"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyProfile } from "@/store/thunks/profileThunks";
import { setProfile, setLoading } from "@/store/slices/profileSlice";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ProfileEditPage() {
  const dispatch = useAppDispatch();
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

  if (!profile) {
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
      className="mx-auto max-w-2xl p-4 sm:p-6"
    >
      <div className="mb-8">
        <h1 className="text-h3 text-text-primary">Edit Profile</h1>
        <p className="mt-1 text-body-sm text-text-secondary">Update your professional information</p>
      </div>
      <ProfileEditForm profile={profile} />
    </motion.div>
  );
}
